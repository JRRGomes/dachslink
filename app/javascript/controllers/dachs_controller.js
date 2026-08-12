import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "dog", "input", "hint", "reset", "submit", "shortUrl", "heart", "eye"
  ]

  static SQUEEZE_MS = 700
  static REVEAL_MS = 90

  connect() {
    this.timers = []
    this.scheduleBlink()
  }

  disconnect() {
    this.timers.forEach(clearTimeout)
    this.timers = []
  }

  later(fn, ms) {
    this.timers.push(setTimeout(fn, Math.max(0, ms)))
  }

  scheduleBlink() {
    this.later(() => {
      if (this.hasEyeTarget && !this.dogTarget.classList.contains("is-squeezing")) {
        this.eyeTarget.classList.add("blink")
        this.later(() => this.eyeTarget.classList.remove("blink"), 200)
      }
      this.scheduleBlink()
    }, 2200 + Math.random() * 3800)
  }

  wag(seconds) {
    this.dogTarget.style.setProperty("--wag", `${seconds}s`)
  }

  alert() {
    this.dogTarget.classList.add("is-alert")
    this.wag(0.45)
  }

  relax() {
    this.dogTarget.classList.remove("is-alert")
    this.wag(0.75)
  }

  typing() {
    this.clearHint()
    this.wag(this.inputTarget.value.length > 6 ? 0.3 : 0.45)
  }

  squeeze() {
    this.squeezeStartedAt = performance.now()
    this.dogTarget.classList.add("is-squeezing")
    this.clearHint()
    this.inputTarget.blur()
  }

  settle(event) {
    const elapsed = performance.now() - this.squeezeStartedAt

    if (event.detail.success) {
      this.later(() => this.dogTarget.classList.add("is-short"),
                 this.constructor.REVEAL_MS - elapsed)
      this.later(() => this.celebrate(), this.constructor.SQUEEZE_MS - elapsed)
    } else {
      this.dogTarget.classList.remove("is-squeezing")
      this.hop()
      this.hintTarget.classList.add("error")
    }
  }

  hop() {
    this.dogTarget.classList.add("is-hopping")
    this.later(() => this.dogTarget.classList.remove("is-hopping"), 520)
  }

  celebrate() {
    this.dogTarget.classList.remove("is-squeezing")
    this.hop()
    this.wag(0.26)

    this.submitTarget.disabled = true

    this.hintTarget.textContent = "prontinho! clique na barriga pra copiar"
    this.hintTarget.classList.remove("error")
    this.resetTarget.hidden = false
  }

  async copy() {
    if (!this.dogTarget.classList.contains("is-short")) return
    if (!this.hasShortUrlTarget) return

    const url = this.shortUrlTarget.dataset.fullUrl

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const range = document.createRange()
      range.selectNode(this.shortUrlTarget)
      getSelection().removeAllRanges()
      getSelection().addRange(range)
      document.execCommand("copy")
      getSelection().removeAllRanges()
    }

    this.heartTarget.classList.add("pop")
    this.hintTarget.textContent = "copiado! 🐾"
    this.hintTarget.classList.remove("error")
    this.later(() => this.heartTarget.classList.remove("pop"), 950)
  }

  reset() {
    this.dogTarget.classList.remove("is-short")
    this.inputTarget.value = ""
    this.submitTarget.disabled = false
    this.resetTarget.hidden = true
    this.clearHint()
    this.wag(0.75)
    this.inputTarget.focus()
  }

  clearHint() {
    this.hintTarget.textContent = ""
    this.hintTarget.classList.remove("error")
  }
}
