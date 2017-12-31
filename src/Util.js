const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const { URL } = require('url')

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

  static buildURL(endpoint, base, params = {}, dotJSON) {
    if (dotJSON) endpoint += '.json'

    const url = new URL(endpoint, base)
    const rawURL = url.href

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value)
    }

    return { url: url.href, rawURL }
  }
}

module.exports = Util
