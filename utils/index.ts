import { z } from 'zod'
import crypto from 'crypto'
import { Request, Response, NextFunction } from 'express'
import { Options } from 'express-rate-limit'
import { CorsOptions } from 'cors'
import { show_single_error_for_each_field, validation_message, algorithm, encryption_key, initialization_vector, jwt_expire_access_token, jwt_expire_refresh_token, rate_limit_windowMS, rate_limit_max_requests, cookie_enabled } from '../config'
import Error from './errorResponse'

export const processValidation = (parsedResult: z.SafeParseReturnType<Record<string, any>, Record<string, any>>, showSingleErrorForEachField = show_single_error_for_each_field) => {
    if (parsedResult.success) return
    
    const errors = parsedResult.error?.errors || []
    const errorsMap = new Map()
    
    for (const error of errors) {
        const field = error.path[0]
        const message = error.message
        if (showSingleErrorForEachField) {
            if (!errorsMap.has(field)) errorsMap.set(field, message)
            continue
        } 

        let messages: string[] = []
        if (errorsMap.has(field)) {
            messages = [...errorsMap.get(field)]
        }
        messages.push(message)
        errorsMap.set(field, messages)
    }

    const errorsObj = Object.fromEntries(errorsMap)
    
    throw new Error({ message: validation_message, data: errorsObj }, 422)
}

export const tokenCookie = (res: Response, token: { access_token: string, refresh_token: string }) => {
    const tokenOptions: Record<string, any> = {
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        tokenOptions.secure = true
    }
    
    const access_token_options = {
        expires: new Date(Date.now() + jwt_expire_access_token * 1000),
        ...tokenOptions
    }
    const refresh_token_options = {
        expires: new Date(Date.now() + jwt_expire_refresh_token * 1000),
        ...tokenOptions
    }

    res
    .cookie('access_token', token.access_token, access_token_options)
    .cookie('refresh_token', token.refresh_token, refresh_token_options)
}

export const expireTokenCookie = (res: Response) => {
    const tokenOptions: Record<string, any> = {
        expires: new Date(Date.now() - 10 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        tokenOptions.secure = true
    }

    res
    .cookie('access_token', 'none', tokenOptions)
    .cookie('refresh_token', 'none', tokenOptions)
}

export const encrypt = (text: string) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryption_key), Buffer.from(initialization_vector))
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}

export const decrypt = (text: string) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryption_key), Buffer.from(initialization_vector))
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

export const success = (res: Response, response?: { message?: string, data?: any }, statusCode: number = 200) => {
    let message = response?.message || 'Success'
    let data = response?.data || {}

    res.status(statusCode).json({
        success: true,
        message,
        data
    })
}

export const randomString = (length: number, encoding: BufferEncoding = 'hex') => {
    return crypto.randomBytes(length)
               .toString(encoding)
               .slice(0, length)
}

export const getTokenPayload = (token: string): Record<string, any> => {
    const base64Payload = token.split('.')[1]
    const payloadAsString = Buffer.from(base64Payload, 'base64').toString('utf8')
    const payload = JSON.parse(payloadAsString)
    return payload
}

export const dateObjFromSeconds = (exp_seconds: number) => {
    const milliseconds = exp_seconds * 1000
    const date = new Date(milliseconds)
    return date
}

export const makeBoolean = (param?: string) => param === 'true' ? true : false 

export const rateLimitOptions = {
    windowMs: rate_limit_windowMS, // 10 mins
    max: rate_limit_max_requests,
    handler: (req: Request, res: Response, next: NextFunction, options: Options) => {
      throw new Error({ message: options.message }, options.statusCode)
    }
}

export const corsOptions: CorsOptions = {
    origin: true,
    credentials: cookie_enabled
}