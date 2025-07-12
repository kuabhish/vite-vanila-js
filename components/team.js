// components/team.js
import { CoolButton } from "./button/button.js";
import { CoolText } from "./text/text.js";
import { CoolInput } from "./input/input.js";
import { loadStylesheet } from "./core/stylesheet.js";
import { appStore } from "./core/store.js";

export class TeamPage extends HTMLElement {
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
    header.textContent = "Team Page";

    const description = new CoolText({
      text: "Interact on Team Page!",
      textColor: "#aaa",
      textFontSize: "18px",
      ariaLabel: "Team page description",
    });

    const input = new CoolInput({
      type: "text",
      placeholder: "Enter text on Team...",
      ariaLabel: "Text input",
    });

    const teamButton = new CoolButton({
      supportIcons: true,
      type: "primary",
      title: "Team Button",
      ariaLabel: "Team action button",
      icon: "🚀",
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

    teamButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "SET_LAST_CLICKED", payload: "Team Button" });
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

    container.append(header, description, input, teamButton, themeButton);
    shadow.appendChild(container);
  }
}

customElements.define("team-page", TeamPage);
