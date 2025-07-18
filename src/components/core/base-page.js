// src/components/core/base-page.js
import { BaseComponent } from "./base-component.js";
import { loadStylesheet } from "./stylesheet.js";
import { appStore } from "./store.js";
import { Header } from "../ui/header/header.js";
import { CoolFooter } from "../ui/footer/footer.js";

export class BasePage extends BaseComponent {
  constructor({ show_header = true } = {}) {
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

    if (show_header) {
      this.headerComponent = new Header(this);
      this.header = this.headerComponent.header;
      this.nav = this.headerComponent.nav;
    }

    // Main content section (each page will populate this)
    this.main = this.createElement("main", {
      style: {
        width: "100%",
        padding: "16px",
        boxSizing: "border-box",
      },
    });

    this.footerComponent = new CoolFooter();
    this.footer = this.footerComponent._footer;

    // Compose layout
    if (show_header) {
      this.container.append(
        this.headerComponent.nav,
        this.header,
        this.main,
        this.footer
      );
    } else {
      this.container.append(this.main, this.footer);
    }

    this._shadow.appendChild(this.container);
  }

  createHeader(text, _class = "") {
    return this.headerComponent.createHeader(text, _class);
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

  updateActiveLink(currentPage) {
    const basePath = import.meta.env?.BASE_URL || "/";
    const path = currentPage.replace(basePath, "").replace(/^\//, "") || "home";
    console.log("Updating active link for:", path); // Debug log
    this.nav?.querySelectorAll("a").forEach((link) => {
      const href = link
        .getAttribute("href")
        .replace(basePath, "")
        .replace(/^\//, "");
      link.setAttribute("aria-current", href === path ? "page" : "false");
    });
  }
}

customElements.define("base-page", BasePage);
