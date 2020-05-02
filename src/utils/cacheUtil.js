const { cacheConfig: config } = require('./config')
const dao = require('../dao/mongodbImpl')
const logger = require('./logger')

/**
 * CacheUtil is a tool to check whether cache amount limit is reached
 * tokens are initialized to deduction between configured cache amount and current active cache in db   
 * 1. when key search is missing, service has to get one token to create new cache
 *   1.1 if there is remaining token, then move forward 
 *   1.2 if there is no remaining token, then remove the oldest in db
 * 2. when one key is removed by client, then release one token 
 * 3. when all keys are removed by client, then release all tokens
 * 4. ttl function is implemented by mongodb, CacheUtil has to poll db to release tokens
 * 
 * This implementation is based on below considerations
 * 1. do not query db to check if there is remaining amount per client request
 * 2. tiny token deviation can be accepted, which is caused by time difference of CacheUtil db poll and mongodb ttl removing
 */
class CacheUtil {
  constructor() {
    this.tokens = config.scale
  }

  async init() {
    await this._init()
    setInterval(async () => {
      await this.init()
    }, Math.max(config.ttl / 4, 1000 * 60))
  }

  async _init() {
    const cacheList = await dao.getAllKey()
    const activeNum = cacheList.filter(cache => !cache.isExpired()).length
    this.tokens = Math.max(0, config.scale - activeNum)
    logger.info(`${this.tokens} tokens remaining`)
  }

  isTokenEnough() {
    return this.tokens > 0
  }

  releaseToken() {
    logger.info(`${this.tokens + 1} tokens remaining`)
    return this.tokens++
  }

  releaseAllTokens() {
    logger.info(`${config.scale} tokens remaining`)
    return this.tokens = config.scale
  }

  async consumeToken() {
    if (!cacheUtil.isTokenEnough()) {
      await dao.removeOldest()
      cacheUtil.releaseToken()
    }
    logger.info(`${this.tokens - 1} tokens remaining`)
    return this.tokens--
  }
}

const cacheUtil = new CacheUtil()

module.exports = cacheUtil