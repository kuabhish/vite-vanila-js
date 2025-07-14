// src/components/ui/carousel/carousel.js

import { BaseComponent } from "../../core/base-component";

export class Header extends BaseComponent {
  constructor(parent) {
    super();

    this.parent = parent;

    // Navigation section
    this.nav = this.createElement("nav", {
      role: "navigation",
      "aria-label": "Main navigation",
      style: {
        width: "100%",
        padding: "16px",
        background: "var(--mdc-theme-surface)",
        boxShadow: "var(--mdc-elevation-2)",
        display: "flex",
        gap: "16px",
        justifyContent: "center",
      },
    });

    // Define navigation links
    const navLinks = [
      { href: "/home", text: "Home" },
      { href: "/team", text: "Team" },
      { href: "/finance", text: "Finance" },
    ];

    navLinks.forEach((link) => {
      const navLink = this.createElement(
        "a",
        {
          href: link.href,
          "aria-current": "false",
          role: "link",
        },
        link.text
      );
      navLink.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.href.replace(/^\//, "") || "home";
        console.log("Navigating to:", page); // Debug log
        let check = this.parent.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { page },
            bubbles: true,
            composed: true, // Ensure event crosses Shadow DOM boundary
          })
        );
        console.log("dispatchEvent:", check); // Debug log
      });
      navLink.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navLink.click();
        }
      });
      this.nav.appendChild(navLink);
    });

    this.header = this.createElement("header");
  }

  createHeader(text, _class = "") {
    return this.createElement(
      "h1",
      {
        class: "mdc-typography--headline5",
      },
      text
    );
  }
}

customElements.define("cool-header", Header);
