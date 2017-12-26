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

  get(endpoint, opts) {
    return this.request(endpoint, opts)
  }

  post(endpoint, opts) {
    return this.request(endpoint, { ...opts, method: 'post' })
  }

  request(endpoint, opts = {}) {
    const url = this.buildURL(endpoint, opts.params, true)
    const { userToken, userSecret } =
      opts.userToken && opts.userSecret ? opts : this

    const args = [url, userToken, userSecret]
    if (opts.method === 'post') {
      args.push(opts.body || '', 'application/x-www-form-urlencoded')
    }

    return new Promise((resolve, reject) => {
      this.session[opts.method || 'get'](...args, (err, body, res) => {
        if (err || res.statusCode !== 200) return reject({ err, res, body })
        let limits = {
          'x-rate-limit-limit': res.headers['x-rate-limit-limit'],
          'x-rate-limit-remaining': res.headers['x-rate-limit-remaining'],
          'x-rate-limit-reset': res.headers['x-rate-limit-reset']
        }
        return resolve({ body, limits })
      })
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
