const mongoose = require('mongoose')
const { mongoConfig: config } = require('../utils/config')
const logger = require('../utils/logger')

async function getConnect () {
  logger.info(config)
  const url = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.db}?authSource=${config.authdb}`
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    logger.info('init mongodb connection successfully')
  } catch (e) {
    logger.info('fail to init mongodb connection')
    logger.error(e)
    process.exit(1)
  }
}

getConnect()

module.exports = mongoose