const axios = require('axios')
const { URL } = require('url')
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

class Util {
  constructor() {
    throw new Error('This class my not be instantiated.')
  }

  static shuffleArray(array) {
    array = [...array] // Copy the array

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }

    return array
  }

  static randomString(length = 10) {
    return Util.shuffleArray(CHARS.split(''))
      .slice(0, length)
      .join('')
  }

  static sortByKeys(obj) {
    const result = {}

    Object.keys(obj)
      .sort()
      .forEach(key => (result[key] = obj[key]))

    return result
  }

  static encodeAndJoin(obj, separator = '&') {
    if (Array.isArray(obj)) {
      return obj.map(encodeURIComponent).join(separator)
    }

    return Object.entries(obj)
      .map(pair => pair.map(encodeURIComponent).join('='))
      .join(separator)
  }

  static rawURL(url, base) {
    return new URL(url.split('?')[0], base).toString()
  }

  static createAPI(baseURL, opts = {}) {
    const headers = { 'user-agent': 'twitter.js' }
    if (opts.token) headers.authorization = `Bearer ${opts.token}`

    return axios.create({ ...opts, baseURL, headers })
  }
}

module.exports = Util
