const express = require("express")
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const { APPLICATION_NODE_PORT } = require('./utils/config')
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

app.get('/api/key', async (req, res) => {
  const key = req.query.key
  if (!!key) {
    const result = await service.getKey(key)
    sendRes(result, res)
  } else {
    throw new ParameterIllegalError('key is invalid')
  }
})

app.get('/api/key/all', async (req, res) => {
  const result = await service.getAllKey()
  sendRes(result, res)
})

app.post('/api/key', async (req, res) => {
  const { key, value } = req.body
  if (!key) {
    throw new ParameterIllegalError('key is invalid')
  }
  if (!value) {
    throw new ParameterIllegalError('value is invalid')
  }
  const result = await service.updateKey(key, value)
  sendRes(result, res)
})

app.delete('/api/key/all', async (req, res) => {
  const result = await service.removeAllKey()
  sendRes(result, res)
})

app.delete('/api/key', async (req, res) => {
  const { key } = req.body
  const result = await service.removeKey(key)
  sendRes(result, res)
})

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
  console.error('hehe')
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
  app.listen(APPLICATION_NODE_PORT, () => {
    logger.info(`server started at http://localhost:${APPLICATION_NODE_PORT}`)
  })
}

init()
