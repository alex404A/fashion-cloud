const logger = require('../utils/logger')
const dao = require('../dao/mongodbImpl')
const Cache = require('../model/Cache')
const { cacheConfig } = require('../utils/config')
const ParameterIllegalError = require('../exception/ParameterIllegalError')

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
async function getKey(key) {
  let item = await dao.getKey(key)
  if (item === null) {
    logger.info(`cache ${key} miss`)
    item = Cache.buildDummyCache(key)
    dao.saveItem(item)
  } else {
    logger.info(`cache ${key} hit`)
    if (item.isExpired()) {
      item = Cache.buildDummyCache(key)
      dao.updateOrCreateItem(item)
    } else {
      dao.updateUpdateTime(key)
    }  
  }
  return item.value
}

/**
 * 
 * @param {string} key 
 * @param {string} value
 * @return {Number} affected number
 */
async function updateKey(key, value) {
  const item = await dao.getKey(key)
  if (item === null || item.isExpired()) {
    throw new ParameterIllegalError(`cache ${key} not found`)
  }
  return await dao.updateValue(key, value)
}

/**
 * 
 * @return {Array<Cache>} cache list
 */
async function getAllKey() {
  await dao.updateUpdateTimeForAll()
  const cacheList = await dao.getAllKey()
  return cacheList.filter(cache => !cache.isExpired())
}

/**
 * @return {Number} affected number
 */
async function removeAllKey() {
  return await dao.removeAllKey()
}

/**
 * @oaram {string} key
 * @return {Number} affected number
 */
async function removeKey(key) {
  return await dao.removeKey(key)
}

module.exports = {
  getKey,
  updateKey,
  getAllKey,
  removeAllKey,
  removeKey
}