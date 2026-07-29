import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["source"]

  async copy(event) {
    const button = event.currentTarget
    const original = button.textContent

    button.textContent = (await this.write()) ? "Copied!" : "Press Ctrl+C"
    setTimeout(() => { button.textContent = original }, 1500)
  }

  async write() {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(this.sourceTarget.value)
        return true
      } catch {
        // Permission denied — try the legacy path below.
      }
    }

    this.sourceTarget.select()
    try {
      return document.execCommand("copy")
    } catch {
      return false
    }
  }
}
