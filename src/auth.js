const fetch = require('node-fetch')

async function app(key, secret) {
  const encoded = Buffer.from([key, secret].join(':')).toString('base64')

  const data = await fetch('https://api.twitter.com/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8.'
    }
  }).then(res => res.json())

  if (data.errors) return Promise.reject(data.errors[0])
  return Promise.resolve(data.access_token)
}

module.exports = { app }
