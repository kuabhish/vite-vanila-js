// src/components/core/base-page.js
import { BaseComponent } from "./base-component.js";
import { loadStylesheet } from "./stylesheet.js";
import { appStore } from "./store.js";

export class BasePage extends BaseComponent {
  constructor() {
    super(); // Calls BaseComponent constructor, which sets up this._shadow

    // Load shared stylesheet
    loadStylesheet(
      this._shadow,
      new URL("../../app.css", import.meta.url).toString()
    );

    // Create container
    this.container = this.createElement("div", {
      id: "root",
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px", // Material Design spacing
      },
    });

    this._shadow.appendChild(this.container);
  }

  // Utility to create Material Design-styled header
  createHeader(text) {
    const header = this.createElement(
      "h1",
      {
        class: "mdc-typography--headline5",
      },
      text
    );
    return header;
  }

  // Subscribe to store with common theme logic
  subscribeToStore(description, input = null) {
    appStore.subscribe((state) => {
      description.text = state.lastClicked
        ? `${state.lastClicked} clicked! Input: ${state.inputValue || "empty"}`
        : `Input value: ${state.inputValue || "empty"}`;
      if (input) input.value = state.inputValue;
      this.container.style.backgroundColor =
        state.theme === "dark"
          ? "var(--mdc-theme-surface, #121212)"
          : "var(--mdc-theme-background, #fff)";
      description.textColor =
        state.theme === "dark"
          ? "var(--mdc-theme-on-surface, #fff)"
          : "var(--mdc-theme-on-background, #000)";
    });
  }
}
