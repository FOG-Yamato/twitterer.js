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
        if (/^\s+$/.test(data)) return // Skip heartbeats
        payload += data.toString()

        if (payload.endsWith('\r\n')) {
          this.emit('tweet', JSON.parse(payload))
          payload = ''
        }
      })
      .once('end', () => this.emit('end'))
  }

  end() {
    this.stream.removeAllListeners()
    this.emit('end')
  }
}

module.exports = TweetStream
