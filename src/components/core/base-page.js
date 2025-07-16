// src/components/core/base-page.js
import { BaseComponent } from "./base-component.js";
import { loadStylesheet } from "./stylesheet.js";
import { appStore } from "./store.js";
import { Header } from "../ui/header/header.js";
import { CoolFooter } from "../ui/footer/footer.js";

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

    this.headerComponent = new Header(this);
    this.header = this.headerComponent.header;
    this.nav = this.headerComponent.nav;

    // this.container.addEventListener("navigate", (e) => {
    //   console.log("debug listener .. ", e);
    // });

    // // Navigation section
    // this.nav = this.createElement("nav", {
    //   role: "navigation",
    //   "aria-label": "Main navigation",
    //   style: {
    //     width: "100%",
    //     padding: "16px",
    //     background: "var(--mdc-theme-surface)",
    //     boxShadow: "var(--mdc-elevation-2)",
    //     display: "flex",
    //     gap: "16px",
    //     justifyContent: "center",
    //   },
    // });

    // // Define navigation links
    // const navLinks = [
    //   { href: "/home", text: "Home" },
    //   { href: "/team", text: "Team" },
    //   { href: "/finance", text: "Finance" },
    // ];

    // navLinks.forEach((link) => {
    //   const navLink = this.createElement(
    //     "a",
    //     {
    //       href: link.href,
    //       "aria-current": "false",
    //       role: "link",
    //     },
    //     link.text
    //   );
    //   navLink.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     const page = link.href.replace(/^\//, "") || "home";
    //     console.log("Navigating to:", page); // Debug log
    //     this.dispatchEvent(
    //       new CustomEvent("navigate", {
    //         detail: { page },
    //         bubbles: true,
    //         composed: true, // Ensure event crosses Shadow DOM boundary
    //       })
    //     );
    //   });
    //   navLink.addEventListener("keydown", (e) => {
    //     if (e.key === "Enter" || e.key === " ") {
    //       e.preventDefault();
    //       navLink.click();
    //     }
    //   });
    //   this.nav.appendChild(navLink);
    // });

    // this.header = this.createElement("header");

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
    // this.footer = this.createElement("footer", {
    //   style: {
    //     width: "100%",
    //     padding: "16px",
    //     fontSize: "0.9rem",
    //     textAlign: "center",
    //     backgroundColor: "var(--mdc-theme-surface)",
    //     color: "var(--mdc-theme-on-surface)",
    //     borderTop: "1px solid #ccc",
    //   },
    // });
    // this.footer.innerHTML = `© ${new Date().getFullYear()} My App. All rights reserved.`;

    this.footerComponent = new CoolFooter();
    this.footer = this.footerComponent._footer;

    // Compose layout
    this.container.append(
      this.headerComponent.nav,
      this.header,
      this.main,
      this.footer
    );
    this._shadow.appendChild(this.container);
  }

  createHeader(text, _class = "") {
    return this.headerComponent.createHeader(text, _class);
    // const header = this.createElement(
    //   "h1",
    //   {
    //     class: "mdc-typography--headline5",
    //   },
    //   text
    // );
    // return header;
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
    this.nav.querySelectorAll("a").forEach((link) => {
      const href = link
        .getAttribute("href")
        .replace(basePath, "")
        .replace(/^\//, "");
      link.setAttribute("aria-current", href === path ? "page" : "false");
    });
  }
}

customElements.define("base-page", BasePage);
