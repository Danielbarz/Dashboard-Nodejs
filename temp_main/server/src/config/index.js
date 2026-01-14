import dotenv from 'dotenv'

dotenv.config()

export default {
  app: {
    name: process.env.APP_NAME || 'Telkom Dashboard API',
    url: process.env.APP_URL || 'http://localhost:5000',
    port: parseInt(process.env.PORT) || 5000,
    env: process.env.NODE_ENV || 'development'
  },

  database: {
    url: process.env.DATABASE_URL
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : 'http://localhost:3000'
  },

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || null
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    path: process.env.UPLOAD_PATH || './uploads'
  },

  logging: {
    level: process.env.LOG_LEVEL || 'debug'
  }
}
