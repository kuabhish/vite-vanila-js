// src/common/button/button.js
import { BaseComponent } from "../../core/base-component.js";
import { BaseEvent } from "../../core/event-system.js";

export class CoolButton extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this._onDidClick = new BaseEvent();

    const {
      title = "Button",
      type = "secondary",
      ariaLabel = title,
      supportIcons = false,
      theme = "",
      icon = "",
    } = options;

    this.initShadowDom(new URL("./button.css", import.meta.url).toString());

    this._button = this.createElement(
      "button",
      {
        class: `button button--${type} ${theme ? `button--${theme}` : ""}`,
        "aria-label": ariaLabel,
        title: title || "",
      },
      supportIcons && icon ? "" : title
    );

    if (supportIcons && icon) {
      const iconSpan = this.createElement("span", { class: "icon" }, icon);
      this._button.prepend(iconSpan);
    }

    this._button.addEventListener("click", (event) => {
      if (!this._button.disabled) {
        this._onDidClick.dispatch(event);
      }
    });

    this._shadow.appendChild(this._button);
  }

  get onDidClick() {
    return this._onDidClick;
  }

  get label() {
    return this._button.textContent || "";
  }

  set label(value) {
    this._button.textContent = value;
    if (this.getAttribute("aria-label") === this.getAttribute("title")) {
      this._button.setAttribute("aria-label", value);
    }
  }

  get icon() {
    const icon = this._shadow.querySelector(".icon");
    return icon ? icon.textContent : null;
  }

  set icon(value) {
    const icon = this._shadow.querySelector(".icon");
    if (value && icon) {
      icon.textContent = value;
    } else if (value) {
      const newIcon = this.createElement("span", { class: "icon" }, value);
      this._button.prepend(newIcon);
    } else if (icon) {
      icon.remove();
    }
  }

  get enabled() {
    return !this._button.disabled;
  }

  set enabled(value) {
    this._button.disabled = !value;
  }

  get checked() {
    return this._button.getAttribute("aria-checked") === "true";
  }

  set checked(value) {
    this._button.setAttribute("aria-checked", value.toString());
  }

  focus() {
    this._button.focus();
  }

  hasFocus() {
    return document.activeElement === this._button;
  }

  dispose() {
    this._button.remove();
    this._shadow.innerHTML = "";
  }
}

customElements.define("cool-button", CoolButton);
