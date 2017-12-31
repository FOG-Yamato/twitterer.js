const crypto = require('crypto')
const fetch = require('node-fetch')
const Util = require('./Util')
const TweetStream = require('./TweetStream')

const BASE_API = 'https://api.twitter.com/1.1/'
const STREAM_API = 'https://stream.twitter.com/1.1/'

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
    const api = opts.api === 'stream' ? STREAM_API : BASE_API
    const { url, rawURL } = Util.buildURL(endpoint, api, opts.params, true)

    opts.headers = {
      ...opts.headers,
      Authorization: this.getAuth(opts.method || 'GET', rawURL, opts.params),
      'User-Agent': 'twitter.js',
      Accept: '*/*',
      Connection: 'close'
    }

    return fetch(url, opts).then(
      res => (opts.parse === 'stream' ? res.body : res[opts.parse || 'json']())
    )
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

    params = { ...params, ...oauthBase }
    const encodedParams = Util.encodeAndJoin(Util.sortByKeys(params))
    const base = Util.encodeAndJoin([method, url, encodedParams])
    const key = Util.encodeAndJoin([this.appSecret, this.userSecret])

    const oauth_signature = crypto
      .createHmac('sha1', key)
      .update(base)
      .digest('base64')

    const result = Util.encodeAndJoin({ ...oauthBase, oauth_signature }, ', ')

    return `OAuth ${result}`
  }

  async fetchStream(endpoint, opts) {
    const stream = await this.post(endpoint, {
      ...opts,
      parse: 'stream',
      api: 'stream'
    })
    return new TweetStream(stream)
  }
}

module.exports = User
