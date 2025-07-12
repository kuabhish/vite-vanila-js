// src/input/input.js
import { BaseComponent } from "../../core/base-component.js";
import { BaseEvent } from "../../core/event-system.js";

export class CoolInput extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this._onInput = new BaseEvent();

    const {
      type = "text",
      placeholder = "",
      ariaLabel = "Text input",
    } = options;

    this.initShadowDom(new URL("./input.css", import.meta.url).toString());

    this._input = this.createElement("input", {
      type,
      placeholder,
      "aria-label": ariaLabel,
    });

    this._input.addEventListener("input", (event) => {
      this._onInput.dispatch(event);
    });

    this._shadow.appendChild(this._input);
  }

  get onInput() {
    return this._onInput;
  }

  get value() {
    return this._input.value;
  }

  set value(value) {
    this._input.value = value;
  }
}

customElements.define("cool-input", CoolInput);
