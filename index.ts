import express, { Express } from 'express'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileupload from 'express-fileupload'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import { sequelize } from './config/sequelize'
import errorHandler from './middlewares/error'
import AuthRoutes from './routes/auth'
import { api_prefix } from './config'
import { rateLimitOptions, corsOptions } from './utils'

const app: Express = express()

// Body parsers
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// File uploading
app.use(fileupload())

// Set security headers
app.use(helmet())

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit(rateLimitOptions)
app.use(limiter)

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use(`${api_prefix}/auth`, AuthRoutes)

// Error Middleware
app.use(errorHandler)

const port = process.env.NODE_SERVER_PORT || 3000
const server = app.listen(port, async () => {
  try {
    await sequelize.authenticate()
    console.log(`[server]: Server is running at http://localhost:${port}`)
  } catch (error) { 
    console.error('Unable to connect to the database:', error)
  }
})

// Handle unhandled promise rejections
process.on('unhandledRejection', async (err: Error, promise) => {
    console.log(`Error: ${err.message}`)
    // Close database connections, clear caches, etc.
    await sequelize.close()
    // Close server & exit process
    server.close(() => process.exit(1))
})
