import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["source"]

  copy(event) {
    navigator.clipboard.writeText(this.sourceTarget.value)

    const button = event.currentTarget
    const original = button.textContent
    button.textContent = "Copied!"
    setTimeout(() => { button.textContent = original }, 1500)
  }
}
