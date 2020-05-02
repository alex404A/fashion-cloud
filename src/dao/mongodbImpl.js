const mongoose = require('./connect')
const logger = require('../utils/logger')
const Cache = require('../model/Cache')
const Schema = mongoose.Schema

const CacheSchema = new Schema({
  id: String,
  key: String,
  value: String,
  createTime: Date,
  updateTime: Date
}, {
  collection: 'cache'
})

async function mongoQuery (query) {
  return new Promise((resolve, reject) => {
    query.exec((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

/**
 * 
 * @param {string} key 
 * @return {Cache|null} 
 */
async function getKey(key) {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  let query = CacheModel.findOne({
    key: {
      $eq: key
    }
  })
  try {
    const cache = await mongoQuery(query)
    if (cache) {
      return new Cache(cache)
    } else {
      return null
    }
  } catch (err) {
    logger.error(err)
    return null
  }
}

/**
 * 
 * @param {Cache} item 
 * @return {Number} affected number 
 */
async function saveItem(item) {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  const cache = new CacheModel(item)
  await cache.save()
  return 1
}

/**
 * 
 * @param {Cache} cache
 * @return {Number} affected number 
 */
async function updateOrCreateItem(cache) {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  try {
    const res = await CacheModel.updateOne({
      key: {
        $eq: cache.key
      }
    }, {
      $set: {
        value: cache.value,
        createTime: new Date(),
        updateTime: new Date()
      }
    })
    return res.nModified
  } catch (err) {
    logger.warn(`cache item ${cache.key} has been removed`)
    return await saveItem(cache)
  }
}

/**
 * 
 * @param {string} key 
 * @return {Number} affected number
 */
async function updateUpdateTime(key) {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  const res = await CacheModel.updateOne({
    key: {
      $eq: key
    }
  }, {
    $set: {
      updateTime: new Date()
    }
  })
  return res.nModified
}

module.exports = {
  getKey,
  saveItem,
  updateOrCreateItem,
  updateUpdateTime
}