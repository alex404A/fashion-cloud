const logger = require('../utils/logger')
const dao = require('../dao/mongodbImpl')
const Cache = require('../model/Cache')
const cacheUtil = require('../utils/cacheUtil')
const ParameterIllegalError = require('../exception/ParameterIllegalError')

/**
 * 
 * 1. once miss or expired
 *   check if remaing tokens are enough, remove the oldest one if no token available
 *   1.1 miss -> build dummy data and save
 *   1.2 expired -> regenerate the cache, then update or create, in case data is removed during this period by mongodb
 * 2. once hit
 *   2.1 update updateTime
 * @param {string} key
 * @return {string} value
 */
async function getKey(key) {
  let item = await dao.getKey(key)
  if (item === null || item.isExpired()) {
    logger.info(`cache ${key} miss`)
    await cacheUtil.consumeToken()
    if (item === null) {
      item = Cache.buildDummyCache(key)
      dao.saveItem(item)
    } else {
      item = Cache.buildDummyCache(key)
      dao.updateOrCreateItem(item)
    }
  } else {
    logger.info(`cache ${key} hit`)
    dao.updateUpdateTime(key)
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
  // await dao.updateUpdateTimeForAll()
  const cacheList = await dao.getAllKey()
  return cacheList.filter(cache => !cache.isExpired())
}

/**
 * @return {Number} affected number
 */
async function removeAllKey() {
  const result = await dao.removeAllKey()
  cacheUtil.releaseAllTokens()
  return result
}

/**
 * @oaram {string} key
 * @return {Number} affected number
 */
async function removeKey(key) {
  const result = await dao.removeKey(key)
  cacheUtil.releaseToken()
  return result
}

module.exports = {
  getKey,
  updateKey,
  getAllKey,
  removeAllKey,
  removeKey
}