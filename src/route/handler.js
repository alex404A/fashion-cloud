const logger = require('../utils/logger')
const dao = require('../dao/mongodbImpl')

async function getKeyHandler(key) {
  const cache = await dao.getKey(key)
  return cache.value
}

module.exports = {
  getKeyHandler
}