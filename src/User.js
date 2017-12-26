const { OAuth } = require('oauth')
const { URL } = require('url')
const TWITTER_API = 'https://api.twitter.com/1.1/'

class User {
  constructor(appKey, appSecret, opts = {}) {
    this.session = new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      appKey,
      appSecret,
      '1.0',
      opts.callbackUrl || null,
      'HMAC-SHA1',
      null,
      {
        Accept: '*/*',
        Connection: 'close',
        'User-Agent': 'twitter.js'
      }
    )
    this.userToken = opts.userToken || null
    this.userSecret = opts.userSecret || null
  }

  get(endpoint, opts = {}) {
    return new Promise((resolve, reject) => {
      const url = this.buildURL(endpoint, opts.params, true)
      this.session.get(
        url,
        this.userToken,
        this.userSecret,
        (err, body, res) => {
          if (!err && res.statusCode == 200) {
            let limits = {
              'x-rate-limit-limit': res.headers['x-rate-limit-limit'],
              'x-rate-limit-remaining': res.headers['x-rate-limit-remaining'],
              'x-rate-limit-reset': res.headers['x-rate-limit-reset']
            }
            resolve({ body, limits })
          } else {
            reject({ err, res, body })
          }
        }
      )
    })
  }

  post(endpoint, opts = {}) {
    return new Promise((resolve, reject) => {
      const url = this.buildURL(endpoint, opts.params, true)
      this.session.post(
        url,
        this.userToken,
        this.userSecret,
        opts.body,
        'application/x-www-form-urlencoded',
        (err, body, res) => {
          if (!err && res.statusCode == 200) {
            let limits = {
              'x-rate-limit-limit': res.headers['x-rate-limit-limit'],
              'x-rate-limit-remaining': res.headers['x-rate-limit-remaining'],
              'x-rate-limit-reset': res.headers['x-rate-limit-reset']
            }
            resolve({ body, limits })
          } else {
            reject({ err, res, body })
          }
        }
      )
    })
  }

  buildURL(url, params, dotJSON) {
    if (dotJSON) url += '.json'

    url = new URL(url, TWITTER_API)

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value)
      }
    }

    return url.toString()
  }
}

module.exports = User
