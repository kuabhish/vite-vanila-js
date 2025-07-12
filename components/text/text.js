// components/text/text.js
import { BaseComponent } from "../core/base-component.js";

export class CoolText extends BaseComponent {
  static get observedAttributes() {
    return ["text", "text-color", "text-font-size", "aria-label"];
  }

  constructor(options = {}) {
    super(options);

    // Initialize properties
    this._text = options.text || this.getAttribute("text") || "Default text";
    this._textColor =
      options.textColor || this.getAttribute("text-color") || "";
    this._textFontSize =
      options.textFontSize || this.getAttribute("text-font-size") || "";
    this._ariaLabel =
      options.ariaLabel || this.getAttribute("aria-label") || "";

    // Load stylesheet
    this.initShadowDom(new URL("./text.css", import.meta.url).toString());

    // Create paragraph
    this._p = this.createElement(
      "p",
      {
        "aria-label": this._ariaLabel,
        style: {
          color: this._textColor,
          fontSize: this._textFontSize,
        },
      },
      this._text
    );

    this._shadow.appendChild(this._p);
  }

  get text() {
    return this._p.textContent;
  }

  set text(value) {
    this._p.textContent = value || "Default text";
    this.setAttribute("text", value);
  }

  get textColor() {
    return this._p.style.color || null;
  }

  set textColor(value) {
    this._p.style.color = value || "";
    if (value) this.setAttribute("text-color", value);
    else this.removeAttribute("text-color");
  }

  get textFontSize() {
    return this._p.style.fontSize || null;
  }

  set textFontSize(value) {
    this._p.style.fontSize = value || "";
    if (value) this.setAttribute("text-font-size", value);
    else this.removeAttribute("text-font-size");
  }

  get ariaLabel() {
    return this._p.getAttribute("aria-label") || null;
  }

  set ariaLabel(value) {
    if (value) {
      this._p.setAttribute("aria-label", value);
      this.setAttribute("aria-label", value);
    } else {
      this._p.removeAttribute("aria-label");
      this.removeAttribute("aria-label");
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "text":
        this._p.textContent = newValue || "Default text";
        break;
      case "text-color":
        this._p.style.color = newValue || "";
        break;
      case "text-font-size":
        this._p.style.fontSize = newValue || "";
        break;
      case "aria-label":
        if (newValue) {
          this._p.setAttribute("aria-label", newValue);
        } else {
          this._p.removeAttribute("aria-label");
        }
        break;
    }
  }
}

customElements.define("cool-text", CoolText);
