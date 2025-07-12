// components/about.js
import { CoolText } from "./text/text.js";
import { loadStylesheet } from "./core/stylesheet.js";
import { appStore } from "./core/store.js";

export class AboutPage extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    loadStylesheet(shadow, new URL("./app.css", import.meta.url).toString());

    const container = document.createElement("div");
    container.id = "root";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.gap = "10px";

    const header = document.createElement("h1");
    header.textContent = "About Page";

    const description = new CoolText({
      text: "About Page",
      textColor: "#aaa",
      textFontSize: "18px",
      ariaLabel: "About page description",
    });

    appStore.subscribe((state) => {
      description.text = state.lastClicked
        ? `${state.lastClicked} clicked! Input: ${state.inputValue || "empty"}`
        : `Input value: ${state.inputValue || "empty"}`;
      container.style.backgroundColor = state.theme === "dark" ? "#333" : "";
      description.textColor = state.theme === "dark" ? "#fff" : "#333";
    });

    container.append(header, description);
    shadow.appendChild(container);
  }
}

customElements.define("about-page", AboutPage);
