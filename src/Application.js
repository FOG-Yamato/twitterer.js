const fetch = require('node-fetch')

class Application {
  constructor(key, secret) {
    this.key = key
    this.secret = secret
    this.token = null
  }

  async auth() {
    const encoded = Buffer.from(`${this.key}:${this.secret}`).toString('base64')

    const data = await fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8.'
      }
    }).then(res => res.json())

    if (data.errors) return Promise.reject(data.errors[0])
    this.token = data.access_token
    return Promise.resolve(this)
  }
}

module.exports = Application
