import { Request, Response, NextFunction } from 'express'
import { DatabaseError } from '../config/sequelize'

// next(param) falls here as it has one extra param before req, res, next and used after routing as app.use(errorHandler)
const errorHandler = (err: Record<string, any>, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500
    let message = err.response?.message || err.message || 'Error'
    let data = err.response?.data || {}
    
    const dbError = (err as DatabaseError).original?.message // sequlize different error interfaces almost have same keys 
    if (dbError) message = dbError
    
    res.status(statusCode).json({ success: false, message, data })
}

export default errorHandler
