class Cache {
  constructor(obj) {
    this.key = obj.key
    this.value = obj.value
    this.expire = obj.expire
  }
}

module.exports = Cache