// components/pages/team.js
import { BasePage } from "../core/base-page.js";
import { CoolButton } from "../common/button/button.js";
import { CoolText } from "../common/text/text.js";
import { CoolInput } from "../common/input/input.js";
import { appStore } from "../core/store.js";

export class TeamPage extends BasePage {
  constructor() {
    super();

    const header = this.createHeader("Team");

    const description = new CoolText({
      text: "Interact on Team Page!",
      textColor: "var(--mdc-theme-on-surface)",
      textFontSize: "1rem",
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
    this.subscribeToStore(description, input);

    this.container.append(header, description, input, teamButton, themeButton);
  }
}

customElements.define("team-page", TeamPage);
