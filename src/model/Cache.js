const { cacheConfig: config } = require('../utils/config')

class Cache {
  constructor(obj) {
    this.key = obj.key
    this.value = obj.value
    this.createTime = obj.createTime
    this.updateTime = obj.updateTime
  }

  isExpired() {
    return this.updateTime.getTime() + config.ttl < new Date().getTime()
  }

  static buildDummyCache(key) {
    return new Cache({
      key,
      value: buildDummyData(),
      createTime: new Date(),
      updateTime: new Date()
    })
  }
}

function buildDummyData() {
  return `${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`
}

module.exports = Cache