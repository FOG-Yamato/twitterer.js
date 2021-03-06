const crypto = require('crypto')
const Util = require('./Util')
const TweetStream = require('./TweetStream')

const baseAPI = Util.createAPI('https://api.twitter.com/1.1/')
const streamAPI = Util.createAPI('https://stream.twitter.com/1.1/')

class User {
  constructor({ consumerKey, consumerSecret, accessToken, accessTokenSecret }) {
    const allPresent = [
      consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret
    ].every(key => key)

    if (!allPresent) {
      throw new Error('All keys have to be provided.')
    }

    Object.assign(this, {
      consumerKey,
      consumerSecret,
      accessToken,
      accessTokenSecret
    })
  }

  get(url, opts) {
    return this.request(url, opts)
  }

  post(url, opts) {
    return this.request(url, { ...opts, method: 'POST' })
  }

  delete(url, opts) {
    return this.request(url, { ...opts, method: 'DELETE' })
  }

  //Internal request method
  async request(url, opts = {}) {
    const api = opts.api || baseAPI

    if (!url.endsWith('.json')) url += '.json'
    const rawURL = Util.rawURL(url, api.defaults.baseURL)
    const headers = {
      ...opts.headers,
      authorization: this.getAuth(opts.method || 'GET', rawURL, opts.params)
    }

    try {
      const { data } = await api.request({ ...opts, headers, url })
      return data
    } catch (err) {
      return Promise.reject(err.response.data.errors[0].message)
    }
  }

  getAuth(method, url, params = {}) {
    const oauthBase = {
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: Util.randomString(32),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_token: this.accessToken,
      oauth_version: '1.0'
    }

    params = { ...params, ...oauthBase }
    const encodedParams = Util.encodeAndJoin(Util.sortByKeys(params))
    const base = Util.encodeAndJoin([method, url, encodedParams])
    const key = Util.encodeAndJoin([
      this.consumerSecret,
      this.accessTokenSecret
    ])

    const oauth_signature = crypto
      .createHmac('sha1', key)
      .update(base)
      .digest('base64')

    const result = Util.encodeAndJoin({ ...oauthBase, oauth_signature }, ', ')

    return `OAuth ${result}`
  }

  async stream(endpoint, opts) {
    const res = await this.post(endpoint, {
      ...opts,
      responseType: 'stream',
      api: streamAPI
    })

    return new TweetStream(res)
  }
}

module.exports = User
