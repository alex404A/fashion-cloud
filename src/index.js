const express = require("express")
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const { APPLICATION_NODE_PORT, ENV } = require('./utils/config')
const service = require('./route/handler')
const ParameterIllegalError = require('./exception/ParameterIllegalError')
const InternalError = require('./exception/InternalError')
const RestfulError = require('./exception/RestfulError')
const { buildConnect } = require('./dao/connect')
const cacheUtil = require('./utils/cacheUtil')

const app = express()
app.use(bodyParser.json())
app.use(requestLogger)
app.use((err, req, res, next) => {
  errorHandler(err, res)
})

function promisify(handler) {
  return async function(...args) {
    const res = args[args.length - 2]
    try {
      await handler(...args)
    } catch (err) {
      errorHandler(err, res)
    }
  }
}

async function updateKey(req, res) {
  const { key, value } = req.body
  if (!key) {
    throw new ParameterIllegalError('key is invalid')
  }
  if (!value) {
    throw new ParameterIllegalError('value is invalid')
  }
  const result = await service.updateKey(key, value)
  sendRes(result, res)
}

async function getKey(req, res) {
  const key = req.query.key
  if (!!key) {
    const result = await service.getKey(key)
    sendRes(result, res)
  } else {
    throw new ParameterIllegalError('key is invalid')
  }
}

async function getAllKey(req, res) {
  const result = await service.getAllKey()
  sendRes(result, res)
}

async function deleteAllKey(req, res) {
  const result = await service.removeAllKey()
  sendRes(result, res)
}

async function deleteKey(req, res) {
  const { key } = req.body
  const result = await service.removeKey(key)
  sendRes(result, res)
}

app.get('/api/key', promisify(getKey))
app.get('/api/key/all', promisify(getAllKey))
app.post('/api/key', promisify(updateKey))
app.delete('/api/key/all', promisify(deleteAllKey))
app.delete('/api/key', promisify(deleteKey))

function sendRes(result, res) {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(wrapSuccessRes(result)))
}

function wrapSuccessRes(data, message = '') {
  return {
    data,
    message,
    status: 0,
  }
}

function wrapFailedRes(err) {
  return {
    errorCode: err.errorCode,
    message: err.message,
    status: 1
  }
}

function errorHandler(err, res) {
  if (res.headersSent) {
    return next(err)
  }
  logger.error(err.stack)
  let error
  if (err instanceof RestfulError) {
    error = err
  } else {
    error = new InternalError('internal error happens')
  }
  res.status(error.statusCode)
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(wrapFailedRes(error)))
}

function requestLogger(req, res, next) {
  logger.info(`${req.method}: ${req.url}`)
  next()
}

async function init() {
  await buildConnect()
  await cacheUtil.init()
  return app.listen(APPLICATION_NODE_PORT, () => {
    logger.info(`server started at http://localhost:${APPLICATION_NODE_PORT}`)
  })
}

if (ENV !== 'test') {
  init()
}

module.exports = init
