// src/pagesabout.js
import { BasePage } from "../core/base-page.js";
import { CoolText } from "../common/text/text.js";

export class AboutPage extends BasePage {
  constructor() {
    super();

    const header = this.createHeader("About");

    const description = new CoolText({
      text: "About Page",
      textColor: "var(--mdc-theme-on-surface)",
      textFontSize: "1rem",
      ariaLabel: "About page description",
    });

    // Subscribe to state changes
    this.subscribeToStore(description);

    this.container.append(header, description);
  }
}

customElements.define("about-page", AboutPage);
