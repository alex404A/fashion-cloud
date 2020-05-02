const logger = require('../utils/logger')
const dao = require('../dao/mongodbImpl')
const Cache = require('../model/Cache')
const { cacheConfig } = require('../utils/config')

/**
 * 
 * 1. once miss
 *   1.1 build dummy data and save
 * 2. once hit
 *   2.1 expired -> regenerate the cache, then update or create, in case data is removed during this period by mongodb
 *   2.2 not expired -> update updateTime
 * @param {string} key
 * @return {string} value
 */
async function getKeyHandler(key) {
  let item = await dao.getKey(key)
  if (item === null) {
    logger.info(`cache ${key} miss`)
    item = Cache.buildDummyCache(key)
    dao.saveItem(item)
  } else {
    logger.info(`cache ${key} hit`)
    logger.info(item.updateTime)
    if (item.isExpired()) {
      item = Cache.buildDummyCache(key)
      dao.updateOrCreateItem(item)
    } else {
      dao.updateUpdateTime(key)
    }  
  }
  return item.value
}

module.exports = {
  getKeyHandler
}