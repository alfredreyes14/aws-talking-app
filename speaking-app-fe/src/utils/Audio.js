class AudioHelper {
  constructor (url) {
    this.url = url
    this.audio = new Audio()
  }

  play () {
    const audio = this.audio
    audio.src = this.url
    audio.load()
    audio.play()
  }
}

export default AudioHelper
