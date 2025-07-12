// src/pages/home.js
import { BasePage } from "../core/base-page.js";
import { CoolButton } from "../common/button/button.js";
import { CoolText } from "../common/text/text.js";
import { CoolInput } from "../common/input/input.js";
import { appStore } from "../core/store.js";

export class HomePage extends BasePage {
  constructor() {
    super();

    const header = this.createHeader("Home");

    const description = new CoolText({
      text: "Interact on Home Page!",
      textColor: "var(--mdc-theme-on-surface)",
      textFontSize: "1rem",
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
    this.subscribeToStore(description, input);

    this.container.append(
      header,
      description,
      input,
      primaryButton,
      resetButton,
      themeButton
    );
  }
}

customElements.define("home-page", HomePage);
