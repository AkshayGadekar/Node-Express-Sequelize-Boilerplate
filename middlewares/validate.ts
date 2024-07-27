import { Request, Response, NextFunction } from 'express'
import { z, ZodRawShape } from 'zod'
import { processValidation } from '../utils'

export const validate = (schema: z.ZodObject<ZodRawShape>) => (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    const result = schema.safeParse(body)
    processValidation(result)

    next()
}
