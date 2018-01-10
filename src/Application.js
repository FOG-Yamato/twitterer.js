const axios = require('axios')

class Application {
  constructor(key, secret, token) {
    this.key = key
    this.secret = secret
    this.token = token
    this.api = token ? Application.generateAPI(token) : null
  }

  get(url, opts) {
    return this.request(url, opts)
  }

  post(url, opts) {
    return this.request(url, { ...opts, method: 'post' })
  }

  delete(url, opts) {
    return this.request(url, { ...opts, method: 'delete' })
  }

  //Internal request method
  async request(url, opts) {
    if (!this.api) {
      try {
        await this.auth()
      } catch (err) {
        return Promise.reject(err)
      }
    }

    if (!url.endsWith('.json')) url += '.json'
    return this.api.request({ ...opts, url })
  }

  // OAuth 2.0 authentication method
  async auth() {
    const encoded = Buffer.from(`${this.key}:${this.secret}`).toString('base64')

    try {
      const { data: { access_token } } = await axios.request({
        method: 'post',
        url: 'https://api.twitter.com/oauth2/token',
        data: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${encoded}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8.'
        }
      })

      this.token = access_token
      this.api = Application.generateAPI(access_token)
      return this
    } catch (err) {
      return Promise.reject(err.response.data.errors[0])
    }
  }

  static generateAPI(token) {
    return axios.create({
      baseURL: 'https://api.twitter.com/1.1/',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'twitter.js'
      }
    })
  }
}

module.exports = Application
