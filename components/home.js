// components/home.js
import { CoolButton } from "./button/button.js";
import { CoolText } from "./text/text.js";
import { CoolInput } from "./input/input.js";
import { loadStylesheet } from "./core/stylesheet.js";
import { appStore } from "./core/store.js";

export class HomePage extends HTMLElement {
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
    header.textContent = "Home Page";

    const description = new CoolText({
      text: "Interact on Home Page!",
      textColor: "#aaa",
      textFontSize: "18px",
      ariaLabel: "Home page description",
    });

    const input = new CoolInput({
      type: "text",
      placeholder: "Enter text on Home...",
      ariaLabel: "Text input",
    });

    const primaryButton = new CoolButton({
      supportIcons: true,
      type: "primary",
      title: "Primary Button",
      ariaLabel: "Primary action button",
      icon: "✅",
    });

    const resetButton = new CoolButton({
      type: "secondary",
      title: "Reset",
      ariaLabel: "Reset state",
    });

    const themeButton = new CoolButton({
      type: "secondary",
      title: "Toggle Theme",
      ariaLabel: "Toggle theme",
    });

    // Dispatch actions
    input.onInput.addListener((e) => {
      appStore.dispatch({
        type: "SET_INPUT_VALUE",
        payload: e.detail.target.value,
      });
    });

    primaryButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "SET_LAST_CLICKED", payload: "Home Primary" });
    });

    resetButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "RESET_STATE" });
    });

    themeButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "TOGGLE_THEME" });
    });

    // Subscribe to state changes
    appStore.subscribe((state) => {
      description.text = state.lastClicked
        ? `${state.lastClicked} clicked! Input: ${state.inputValue || "empty"}`
        : `Input value: ${state.inputValue || "empty"}`;
      input.value = state.inputValue;
      container.style.backgroundColor = state.theme === "dark" ? "#333" : "";
      description.textColor = state.theme === "dark" ? "#fff" : "#333";
    });

    container.append(
      header,
      description,
      input,
      primaryButton,
      resetButton,
      themeButton
    );
    shadow.appendChild(container);
  }
}

customElements.define("home-page", HomePage);
