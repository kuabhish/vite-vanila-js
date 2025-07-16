// src/components/ui/footer/footer.js
import { BaseComponent } from "../../core/base-component.js";

export class CoolFooter extends BaseComponent {
  constructor() {
    super();
    this.initShadowDom(new URL("./footer.css", import.meta.url).toString());
    this._footer = this.createElement("footer", {
      style: { textAlign: "center", padding: "16px" },
    });
    this._footer.innerHTML = `© ${new Date().getFullYear()} My App. <a href="/contact">Contact Us</a>`;
    this._shadow.appendChild(this._footer);
  }
}
customElements.define("cool-footer", CoolFooter);
