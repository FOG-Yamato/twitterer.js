const fetch = require('node-fetch')
const { buildURL } = require('./Util')

const BASE_API = 'https://api.twitter.com/1.1/'
const AUTH_ENDPOINT = 'https://api.twitter.com/oauth2/token'

class Application {
  constructor(key, secret) {
    this.key = key
    this.secret = secret
    this.token = null
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
  async request(endpoint, opts) {
    if (endpoint === AUTH_ENDPOINT) {
      const { url } = buildURL(endpoint)
      return fetch(url, opts).then(res => res.json())
    }

    if (!this.token) {
      try {
        await this.auth()
      } catch (err) {
        return Promise.reject(err)
      }
    }

    opts.headers = {
      ...opts.headers,
      Authorization: `Bearer ${this.token}`,
      'User-Agent': 'twitter.js'
    }

    const { url } = buildURL(endpoint, BASE_API, opts.params, true)
    return fetch(url, opts).then(
      res => (opts.parse === 'stream' ? res.body : res[opts.parse || 'json']())
    )
  }

  // OAuth 2.0 authentication method
  async auth() {
    const encoded = Buffer.from(`${this.key}:${this.secret}`).toString('base64')

    const data = await this.post(AUTH_ENDPOINT, {
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8.'
      }
    })

    if (data.errors) return Promise.reject(new Error(data.errors[0].message))
    this.token = data.access_token
    return Promise.resolve(this)
  }
}

module.exports = Application
