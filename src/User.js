const { Oauth } = require('oauth')
const baseURL = 'https://api.twitter.com/1.1/'

class User extends Oauth {
  constructor(appKey, appSecret, opts) {
    super(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      appKey,
      appSecret,
      '1.0A',
      null,
      'HMAC-SHA1'
    )

    this.appKey = appKey
    this.appSecret = appSecret
    this.userToken = opts.userToken || null
    this.userSecret = opts.userSecret || null
  }

  get(endpoint, opts) {
    return new Promise((resolve, reject) => {
      const { userToken, userSecret } =
        opts.userToken && opts.userSecret ? opts : this

      let url = `${baseURL}${endpoint}.json`
      if (opts.params) {
        const params = Object.entries(opts.params).map(pair => {
          return pair.map(text => encodeURIComponent(text)).join('=')
        })

        url += `?${params}`
      }

      super.get(url, userToken, userSecret, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }
}

module.exports = User
