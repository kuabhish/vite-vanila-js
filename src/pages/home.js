// src/pages/home.js
import { BasePage } from "../components/core/base-page.js";
import { CoolButton } from "../components/base/button/button.js";
import { CoolText } from "../components/base/text/text.js";
import { CoolInput } from "../components/base/input/input.js";
import { appStore } from "../components/core/store.js";
import { CoolCarousel } from "../components/ui/carousel/carousel.js";
import { CoolImage } from "../components/base/image/image.js";

export class HomePage extends BasePage {
  constructor() {
    super();

    // Hero Section: Carousel
    const carousel = new CoolCarousel({
      items: [
        {
          src: "/assets/images/welcome.jpg",
          alt: "Welcome Slide",
          caption: "Welcome to Our App",
        },
        {
          src: "/assets/images/explore.jpg",
          alt: "Explore Slide",
          caption: "Explore Our Features",
        },
        {
          src: "/assets/images/join.jpg",
          alt: "Join Slide",
          caption: "Join Our Community",
        },
      ],
    });

    // Welcome Section
    const header = this.createHeader("Welcome to My App");

    const welcomeText = new CoolText({
      text: "Discover a world of possibilities with our interactive application. Try it out below!",
      textColor: "var(--mdc-theme-on-surface)",
      textFontSize: "1rem",
      ariaLabel: "Welcome message",
    });

    // Interactive Section
    const interactiveCard = this.createElement("div", { class: "mdc-card" });

    const description = new CoolText({
      text: "Interact on Home Page!",
      textColor: "var(--mdc-theme-on-surface)",
      textFontSize: "0.875rem",
      ariaLabel: "Interaction status",
    });

    const input = new CoolInput({
      type: "text",
      placeholder: "Enter your message...",
      ariaLabel: "Text input",
    });

    const primaryButton = new CoolButton({
      supportIcons: true,
      type: "primary",
      title: "Submit",
      ariaLabel: "Submit action",
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

    // Feature Image
    const featureImage = new CoolImage({
      src: "/assets/images/feature.jpg",
      alt: "Feature Image",
      caption: "Explore our key feature",
      width: "100%",
      height: "200px",
    });

    // Dispatch actions
    input.onInput.addListener((e) => {
      appStore.dispatch({
        type: "SET_INPUT_VALUE",
        payload: e.detail.target.value,
      });
    });

    primaryButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "SET_LAST_CLICKED", payload: "Home Submit" });
    });

    resetButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "RESET_STATE" });
    });

    themeButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "TOGGLE_THEME" });
    });

    // Subscribe to state changes
    this.subscribeToStore(description, input);

    // Layout
    const interactiveContainer = this.createElement("div", {
      class: "mdc-card__content",
      style: { display: "flex", flexDirection: "column", gap: "16px" },
    });
    interactiveContainer.append(
      description,
      input,
      primaryButton,
      resetButton,
      themeButton
    );

    interactiveCard.appendChild(interactiveContainer);

    this.container.append(
      carousel,
      header,
      welcomeText,
      interactiveCard,
      featureImage
    );
  }
}

customElements.define("home-page", HomePage);
