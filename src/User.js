const { URL } = require('url')
const crypto = require('crypto')
const fetch = require('node-fetch')

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

    const { url, rawUrl } = this.buildURL(endpoint, opts.params, true)

    opts.headers = { ...opts.headers, 
      Authorization: this.getAuth(opts.method || 'GET', rawUrl, opts.params), 
      'User-Agent': 'twitter.js',
      'Accept': '*/*',
      'Connection': 'close'
    }

    return fetch(url, opts).then(res => res.json())
  }

  buildURL(url, params, dotJSON) {
    if (dotJSON) url += '.json'

    url = new URL(url, BASE_API)
    let rawUrl = url.toString()

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value)
      }
    }

    url = url.toString()

    return { url, rawUrl }
  }

  getAuth(method, url, params) {
    let nonce = ''
    const chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
      'o','p','q','r','s','t','u','v','w','x','y','z','A','B',
      'C','D','E','F','G','H','I','J','K','L','M','N','O','P',
      'Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3',
      '4','5','6','7','8','9']
    for (let i = 0; i < 32; i++) nonce += chars[Math.floor(Math.random() * chars.length)]

    const oauthBase = {
      'oauth_consumer_key': this.appKey,
      'oauth_nonce': nonce,
      'oauth_signature_method': 'HMAC-SHA1',
      'oauth_timestamp': Math.floor(Date.now() / 1000),
      'oauth_token': this.userToken,
      'oauth_version': '1.0'
    }

    params = { ...params, ...oauthBase }

    const sortedObj = {}
    const sortedKeys = Object.keys(params).sort()

    for (const key of sortedKeys) sortedObj[key] = params[key]

    let encodedParams = Object.entries(sortedObj)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    let base = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(encodedParams)}`
    let key = `${encodeURIComponent(this.appSecret)}&${encodeURIComponent(this.userSecret)}`
    let res = Object.entries(oauthBase)
      .map(([key, value]) => `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`)
      .join(', ')
    res += `, oauth_signature="${encodeURIComponent(crypto.createHmac('sha1', key).update(base).digest('base64'))}"`

    return `OAuth ${res}`
  }
}

module.exports = User
