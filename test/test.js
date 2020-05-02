const request = require('request-promise')

const { APPLICATION_NODE_PORT, cacheConfig } = require('../src/utils/config')
const cacheUtil = require('../src/utils/cacheUtil')
const init = require('../src/index')
const logger = require('../src/utils/logger')

async function test() {
  printCacheConfig()
  const server = await init()
  await removeAll()
  await cacheUtil._init()
  await getKey('1')
  await getAll()
  await getKey('2')
  await getAll()
  await getKey('3')
  await getAll()
  await updateKey('3', new Date().getTime() + '_' + 300)
  await getAll()
  await removeKey('3')
  await getAll()
  await sleep(cacheConfig.ttl)
  await getAll()
  server.close()
}

function printCacheConfig() {
  logger.info(`cache scale limit: ${cacheConfig.scale}`, 'test')
  logger.info(`cache ttl limit: ${cacheConfig.ttl / 1000}s`, 'test')
}

async function removeAll() {
  const options = {
    method: 'DELETE',
    url: `http://127.0.0.1:${APPLICATION_NODE_PORT}/api/key/all`,
    json: true
  }
  await request(options)
  logger.info('clear all cache in db', 'test')
}

async function removeKey(key) {
  const options = {
    method: 'DELETE',
    url: `http://127.0.0.1:${APPLICATION_NODE_PORT}/api/key`,
    body: {
      key
    },
    json: true
  }
  await request(options)
  logger.info(`remove cache key ${key}`, 'test')
}

async function updateKey(key, value) {
  const options = {
    method: 'POST',
    url: `http://127.0.0.1:${APPLICATION_NODE_PORT}/api/key`,
    body: {
      key,
      value
    },
    json: true
  }
  await request(options)
  logger.info(`update cache key ${key} with value ${value}`, 'test')
}

async function getAll() {
  const options = {
    method: 'GET',
    url: `http://127.0.0.1:${APPLICATION_NODE_PORT}/api/key/all`,
  }
  const res = JSON.parse(await request(options))
  const list = res.data.map(item => {
    return {
      key: item.key,
      value: item.value,
      updateTime: item.updateTime
    }
  })
  logger.info(`get all cache from db`, 'test')
  logger.info(list, 'test')
}

async function getKey(key) {
  const options = {
    method: 'GET',
    url: `http://127.0.0.1:${APPLICATION_NODE_PORT}/api/key?key=${key}`
  }
  const res = JSON.parse(await request(options))
  logger.info(`get key ${key}, value is ${res.data}`, 'test')
}

async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

test()