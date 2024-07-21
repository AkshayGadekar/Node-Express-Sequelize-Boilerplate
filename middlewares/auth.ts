import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import asyncHandler from './async'
import { decrypt, getTokenPayload } from '../utils'
import { jwt_secret } from '../config'
import Error from '../utils/errorResponse'
import User from '../models/User'
import Token from '../models/Token'

interface RequestWithUser extends Request { user: Record<string, any> } 

const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string = ''
    const authorization = req.headers.authorization
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1]
    } else if (req.cookies.access_token) {
        token = req.cookies.access_token
    }
    
    if (!token) throw new Error({ message: 'Please pass the bearer token.' }, 401)

    try {
        const decoded = jwt.verify(token, jwt_secret) as jwt.JwtPayload
        const tokenType = decoded.type
        if (tokenType !== 'access_token') return next(new Error({ message: 'Invalid token.' }, 401))

        const user_id = decrypt(decoded.data)
        const user = await User.findByPk(user_id, { attributes: ['name', 'email'] })
        if (!user) throw new Error({ message: 'Invalid token.' }, 401)
        
        const secret = decoded.secret
        const tokensCount = await Token.count({ where: { user_id, secret } })
        if (tokensCount !== 2) return next(new Error({ message: 'Token is no longer in use.' }, 401)); // table must've related access token too, so 2 count, result should be 0 or 2
        
        (req as RequestWithUser).user = user
        
        next()
    } catch (err) {
        const payload = getTokenPayload(token)
        const user_id = decrypt(payload.data)
        const secret = payload.secret
        if (user_id && secret) await Token.destroy({ where: { user_id, secret } })

        next(new Error({ message: 'Not authenticated to access this route.' }, 401))
    }

})

export default auth
