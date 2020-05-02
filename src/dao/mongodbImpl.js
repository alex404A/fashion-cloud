const { mongoose } = require('./connect')
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

/**
 * 
 * @param {string} key 
 * @return {Cache|null} 
 */
async function getKey(key) {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  const cache = await CacheModel.findOne({
    key: {
      $eq: key
    }
  })
  // const cache = await mongoQuery(query)
  if (cache) {
    return new Cache(cache)
  } else {
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
  const res = await cache.save()
  return res.nModified
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

/**
 * 
 * @return {Number} affected number
 */
async function updateUpdateTimeForAll() {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  const res = await CacheModel.updateMany({
  }, {
    $set: {
      updateTime: new Date()
    }
  })
  return res.nModified
}

/**
 * 
 * @param {string} key 
 * @param {string} value 
 * @return {Number} affected number
 */
async function updateValue(key, value) {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  const res = await CacheModel.updateOne({
    key: {
      $eq: key
    }
  }, {
    $set: {
      value: value,
      updateTime: new Date()
    }
  })
  return res.nModified
}

/**
 * 
 * @return {Array<Cache>} cache list
 */
async function getAllKey() {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  const result = await CacheModel.find({})
  return result.map(item => new Cache(item))
}

/**
 * 
 * @return {Number} affected number
 */
async function removeAllKey() {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  const res = await CacheModel.deleteMany({})
  return res.deletedCount
}

/**
 * @param {string} key 
 * @return {Number} affected number
 */
async function removeKey(key) {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  const res = await CacheModel.deleteOne({
    key
  })
  return res.deletedCount
}

/**
 * @returns {string} removed key
 */
async function removeOldest() {
  const CacheModel = mongoose.model('Cache', CacheSchema)
  const oldest = await CacheModel.findOne({
  }).sort({updateTime: 1})
  await removeKey(oldest.key)
  return oldest.key
}

module.exports = {
  getKey,
  saveItem,
  updateOrCreateItem,
  updateUpdateTime,
  updateUpdateTimeForAll,
  updateValue,
  getAllKey,
  removeAllKey,
  removeKey,
  removeOldest
}