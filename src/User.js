const { URL } = require('url')
const crypto = require('crypto')
const fetch = require('node-fetch')
const Util = require('./Util')

const BASE_API = 'https://api.twitter.com/1.1/'

class User {
  constructor(appKey, appSecret, opts = {}) {
    this.appKey = appKey
    this.appSecret = appSecret
    this.userToken = opts.userToken || null
    this.userSecret = opts.userSecret || null
  }

  get(endpoint, opts) {
    return this.request(endpoint, opts)
  }

  post(endpoint, opts) {
    return this.request(endpoint, { ...opts, method: 'POST' })
  }

  delete(endpoint, opts) {
    return this.request(endpoint, { ...opts, method: 'DELETE' })
  }

  //Internal request method
  async request(endpoint, opts = {}) {
    const { url, href } = this.buildURL(endpoint, opts.params, true)

    opts.headers = {
      ...opts.headers,
      Authorization: this.getAuth(opts.method || 'GET', href, opts.params),
      'User-Agent': 'twitter.js',
      Accept: '*/*',
      Connection: 'close'
    }

    return fetch(url, opts).then(res => res.json())
  }

  buildURL(url, params = {}, dotJSON) {
    if (dotJSON) url += '.json'

    url = new URL(url, BASE_API)
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value)
    }

    return { url: url.toString(), href: url.href }
  }

  getAuth(method, url, params = {}) {
    const oauthBase = {
      oauth_consumer_key: this.appKey,
      oauth_nonce: Util.randomString(32),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_token: this.userToken,
      oauth_version: '1.0'
    }

    Object.assign(params, oauthBase)

    const encodedParams = Util.encodeAndJoin(Util.sortByKeys(params))
    const base = Util.encodeAndJoin([method, url, encodedParams])
    const key = Util.encodeAndJoin([this.appSecret, this.userSecret])

    const signature = crypto
      .createHmac('sha1', key)
      .update(base)
      .digest('base64')

    const res = Util.encodeAndJoin(oauthBase, ', ').concat(
      `, oauth_signature="${encodeURIComponent(signature)}"`
    )

    return `OAuth ${res}`
  }
}

module.exports = User
