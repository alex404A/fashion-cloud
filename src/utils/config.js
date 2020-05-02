const logger = require('./logger')

class MongoConfig {
  constructor() {
    this.username = ''
    this.password = ''
    this.host = ''
    this.port = ''
    this.db = ''
    this.authdb = ''
  }
}

class CacheConfig {
  constructor() {
    this.ttl = 10 * 60 * 1000 // 10 min ttl
    this.scale = 2
  }
}

let APPLICATION_NODE_PORT
let ENV = 'development'
const mongoConfig = new MongoConfig()
const cacheConfig = new CacheConfig()

if (!process.env.APPLICATION_NODE_PORT) {
  logger.error(`no port configured`)
  process.exit(1)
} else {
  APPLICATION_NODE_PORT = process.env.APPLICATION_NODE_PORT
}

if (!process.env.ENV) {
  logger.error(`no env configured`)
  process.exit(1)
} else {
  ENV = process.env.ENV
}

if (!process.env.MONGODB_USERNAME) {
  logger.error(`no mongodb username configured`)
  process.exit(1)
} else {
  mongoConfig.username = process.env.MONGODB_USERNAME
}

if (!process.env.MONGODB_PASSWORD) {
  logger.error(`no mongodb password configured`)
  process.exit(1)
} else {
  mongoConfig.password = process.env.MONGODB_PASSWORD
}

if (process.env.MONGODB_HOST) {
  mongoConfig.host = process.env.MONGODB_HOST
}

if (process.env.MONGODB_PORT) {
  mongoConfig.port = process.env.MONGODB_PORT
}

if (process.env.MONGODB_DB) {
  mongoConfig.db = process.env.MONGODB_DB
}

if (process.env.MONGODB_AUTHDB) {
  mongoConfig.authdb = process.env.MONGODB_AUTHDB
}

if (process.env.CACHE_TTL) {
  cacheConfig.ttl = parseInt(process.env.CACHE_TTL)
  if (Number.isNaN(cacheConfig.ttl)) {
    logger.error(`cache ttl ${process.env.CACHE_TTL} is not valid number`)
    process.exit(1)
  }
}

if (process.env.CACHE_SCALE) {
  cacheConfig.scale = parseInt(process.env.CACHE_SCALE)
  if (Number.isNaN(cacheConfig.scale)) {
    logger.error(`cache scale ${process.env.CACHE_SCALE} is not valid number`)
    process.exit(1)
  }
}

module.exports = {
  APPLICATION_NODE_PORT,
  ENV,
  mongoConfig,
  cacheConfig
}