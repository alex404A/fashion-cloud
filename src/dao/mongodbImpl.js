const mongoose = require('./connect')
const logger = require('../utils/logger')
const Cache = require('../model/Cache')
const Schema = mongoose.Schema

const cacheSchema = new Schema({
  id: String,
  key: String,
  value: String,
  expire: Number 
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

async function getKey(key) {
  const Cache = mongoose.model('Cache', cacheSchema)
  let query = Cache.find({
    key: {
      $eq: key
    }
  })
  try {
    const cacheList = await mongoQuery(query)
    if (cacheList.length === 1) {
      return new Cache(cacheList[0])
    } else {
      return null
    }
  } catch (err) {
    logger.error(err)
    return null
  }
}

module.exports = {
  getKey
}