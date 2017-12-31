const { EventEmitter } = require('events')

class TweetStream extends EventEmitter {
  constructor(stream) {
    super()
    this.stream = stream
    this.listen()
  }

  listen() {
    let payload = ''

    this.stream
      .on('data', data => {
        payload += data.toString()

        if (/^\s+$/.test(data)) return // Skip heartbeats

        if (payload.endsWith('\r\n')) {
          this.emit('tweet', JSON.parse(payload))
          payload = ''
        }
      })
      .once('end', () => this.emit('end'))
  }
}

module.exports = TweetStream
