# twitter.js

A light Twitter API wrapper that makes use of native promises.
Works for both the User and Application only workflows.

---

### Usage

**Application**:

```js
const { Application } = require('twitter.js')
const app = new Application({
  consumerKey: '-',
  consumerSecret: '-',
  accessToken: '-' // Optional
})
```

As Twitter does not expire access tokens, you can provide one at instance creation.
If you do so, the application won't have to go through the extra authentication step.
Likewise, if you provide the access token, there is no need to provide the first 2 keys.

After creation, you may use the helper methods `get`, `post` and `delete` to hit the endpoints
exposed by the [Twitter API](https://developer.twitter.com/en/docs/api-reference-index).

```js
app
  .get('search/tweets', { params: { q: 'stuff' } })
  .then(result => console.log(result))
```

**User**:

```js
const { User } = require('twitter.js')
const user = new User({
  consumerKey: '-',
  consumerSecret: '-',
  accessToken: '-',
  accessTokenSecret: '-'
})
```

In this case, all keys are required.

```js
user.get('account/settings').then(result => console.log(result))
```

---

### Making requests

We have used [Axios](https://github.com/axios/axios) as our HTTP client, so the [request API](https://github.com/axios/axios#request-config)
is directly inherited from it. You can specify any of the configuration fields offered by Axios, however, some of them, such as the `Authorization` header,
will be overwritten.

---

### Stream API

The User class offers access to the stream endpoints as follows:

```js
user.stream('statuses/filter', { params: { track: 'stuff' } }).then(stream => {
  stream.on('tweet', console.log)
})
```

This hasn't been tested much and is subject to changes.

---

### Contributing

This a very early build of this package, so issues/PRs are most welcome.
