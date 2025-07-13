import { BaseComponent } from "./base-component.js";
import { loadStylesheet } from "./stylesheet.js";
import { appStore } from "./store.js";

export class BasePage extends BaseComponent {
  constructor() {
    super(); // Sets up this._shadow

    // Load shared stylesheet
    loadStylesheet(
      this._shadow,
      new URL("../../app.css", import.meta.url).toString()
    );

    // Root container with layout structure
    this.container = this.createElement("div", {
      id: "root",
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        minHeight: "100vh",
      },
    });

    // Header section
    this.header = this.createElement("header", {
      style: {
        width: "100%",
        padding: "16px",
        textAlign: "center",
        backgroundColor: "var(--mdc-theme-surface)",
        boxShadow: "var(--mdc-elevation-2)",
      },
    });
    const defaultTitle = this.createHeader("🌟 My App");
    this.header.appendChild(defaultTitle);

    // Main content section (each page will populate this)
    this.main = this.createElement("main", {
      style: {
        flex: "1",
        width: "100%",
        padding: "16px",
        boxSizing: "border-box",
      },
    });

    // Footer section
    this.footer = this.createElement("footer", {
      style: {
        width: "100%",
        padding: "16px",
        fontSize: "0.9rem",
        textAlign: "center",
        backgroundColor: "var(--mdc-theme-surface)",
        color: "var(--mdc-theme-on-surface)",
        borderTop: "1px solid #ccc",
      },
    });
    this.footer.innerHTML = `© ${new Date().getFullYear()} My App. All rights reserved.`;

    // Compose layout
    this.container.append(this.header, this.main, this.footer);
    this._shadow.appendChild(this.container);
  }

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
