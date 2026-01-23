import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import config from './config/index.js'
import logger from './config/logger.js'
import routes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

// --- BIGINT SERIALIZATION FIX ---
BigInt.prototype.toJSON = function () {
  return this.toString()
}
// --------------------------------

const app = express()

// Trust proxy for rate limiting behind load balancers/proxies
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type']
}))

// Rate limiting - Increased for development
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 1000 requests per minute
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Compression
app.use(compression())

// Logging
if (config.app.env !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }))
}

// Routes
app.use('/api', routes)

// 404 handler
app.use(notFoundHandler)

// Error handler
app.use(errorHandler)

// Start server
const PORT = config.app.port

app.listen(PORT, () => {
  logger.info(`🚀 ${config.app.name} running on port ${PORT}`)
  logger.info(`📍 Environment: ${config.app.env}`)
  logger.info(`🔗 API URL: ${config.app.url}`)
})



export default app
