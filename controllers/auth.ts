import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { jwt_expire_access_token as expires_in, jwt_secret, cookie_enabled } from '../config'
import Error from './../utils/errorResponse'
import { decrypt, processValidation, success, tokenCookie, expireTokenCookie } from '../utils'
import User from './../models/User'
import Token from '../models/Token'
import asyncHandler from '../middlewares/async'

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const ValidationSchema = z.object({
        name: z.string({ required_error: 'name is required.' }).min(2, 'name must be of at least 2 characters.').max(50, 'name must be of maximum 50 characters.'),
        email: z.string({ required_error: 'email is required.' }).email({ message: 'email must be a valid email.' }),
        password: z.string({ required_error: 'password is required.' }).min(5, 'password must be of at least 5 characters.').max(40, 'password must be of maximum 40 characters.').regex(new RegExp("^(?=.*[1-9\W])(?=.*[a-zA-Z]).+$"), 'password must contain letters with at least one number or symbol.')
    })
    const body = req.body
    const result = ValidationSchema.safeParse(body)
    processValidation(result)

    // check if user exists
    const userExist = await User.count({ where: { email: body.email } })
    if (userExist) throw new Error({ message: 'User exists.' }, 422)

    const user = await User.create(body)
    const { access_token, refresh_token } = await user.generateTokens()

    if (cookie_enabled) tokenCookie(res, { access_token, refresh_token })
    
    return success(res, { data: { access_token, refresh_token, expires_in } })
})

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const ValidationSchema = z.object({
        email: z.string({ required_error: 'email is required.' }).email({ message: 'email must be a valid email.' }),
        password: z.string({ required_error: 'password is required.' }).min(5, 'password must be of at least 5 characters.').max(40, 'password must be of maximum 40 characters.')
    })
    const body = req.body
    const result = ValidationSchema.safeParse(body)
    processValidation(result)

    const user = await User.findOne({ where: { email: body.email } })
    if (!user) throw new Error({ message: 'Sorry, user does not exist.' }, 404)

    const passwordMatched = await user.matchPassword(body.password)
    if (!passwordMatched) throw new Error({ message: 'Invalid credentials' }, 422)

    const { access_token, refresh_token } = await user.generateTokens()

    if (cookie_enabled) tokenCookie(res, { access_token, refresh_token })
    
    return success(res, { data: { access_token, refresh_token, expires_in } })
})

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string = ''
    const authorization = req.headers.authorization
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1]
    } else if (req.cookies.access_token) {
        token = req.cookies.access_token
    }

    if (!token) throw new Error({ message: 'Please pass the bearer token.' }, 422)

    const decoded = jwt.verify(token, jwt_secret) as jwt.JwtPayload
    const tokenType = decoded.type
    if (tokenType !== 'access_token') throw new Error({ message: 'Invalid token.' }, 422)

    const user_id = decrypt(decoded.data)
    const secret = decoded.secret
    const deletedCount = await Token.destroy({ where: { user_id, secret } })
    //if (deletedCount !== 2) throw new Error({ message: 'Token is no longer in use.' }, 422) // table must've related refresh token too, so 2 count, result should be 0 or 2

    if (cookie_enabled) expireTokenCookie(res)

    return success(res)
})

export const generateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const ValidationSchema = z.object({
        refresh_token: z.string({ required_error: 'Refesh token is required.' })
    })
    const body = req.body
    const result = ValidationSchema.safeParse(body)
    processValidation(result)

    const token = body.refresh_token
    const decoded = jwt.verify(token, jwt_secret) as jwt.JwtPayload
    const tokenType = decoded.type
    if (tokenType !== 'refresh_token') throw new Error({ message: 'Invalid token.' }, 422)
    
    const user_id = decrypt(decoded.data)
    const user = await User.findByPk(user_id)
    if (!user) throw new Error({ message: 'Invalid token.' }, 422)
    
    const secret = decoded.secret
    const deletedCount = await Token.destroy({ where: { user_id, secret } })
    if (deletedCount !== 2) throw new Error({ message: 'Token is no longer in use.' }, 422) // table must've related access token too, so 2 count, result should be 0 or 2
    
    const { access_token, refresh_token } = await user.generateTokens()

    if (cookie_enabled) tokenCookie(res, { access_token, refresh_token })
    
    return success(res, { data: { access_token, refresh_token, expires_in } })
})

export const authUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return success(res, { data: req.user })
})
