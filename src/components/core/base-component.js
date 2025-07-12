// src/components/core/base-component.js
export class BaseComponent extends HTMLElement {
  constructor(options = {}) {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this._options = options;
  }

  // Initialize shadow DOM with optional stylesheet
  initShadowDom(stylesheetUrl) {
    if (stylesheetUrl) {
      const styleLink = document.createElement("link");
      styleLink.setAttribute("rel", "stylesheet");
      styleLink.setAttribute("href", stylesheetUrl);
      this._shadow.appendChild(styleLink);
    }
  }

  // Utility to create elements with attributes
  createElement(tag, attributes = {}, content = "") {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else if (value) {
        element.setAttribute(key, value);
      }
    });
    element.textContent = content;
    return element;
  }
}
