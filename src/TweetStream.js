const { EventEmitter } = require('events')

class TweetStream extends EventEmitter {
  constructor(stream) {
    super()
    this.stream = stream
    this.listen()
  }

  listen() {
    let payload = []

    this.stream
      .on('data', data => {
        if (/^\s+$/.test(data)) return // Skip heartbeats
        payload.push(data.toString())

        if (data.toString().endsWith('\r\n')) {
          this.emit('tweet', JSON.parse(payload.join('')))
          payload = []
        }
      })
      .once('end', () => this.emit('end'))
  }
}

module.exports = TweetStream
