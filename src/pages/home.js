import { BasePage } from "../components/core/base-page.js";
import { CoolButton } from "../components/base/button/button.js";
import { CoolText } from "../components/base/text/text.js";
import { CoolInput } from "../components/base/input/input.js";
import { CoolCarousel } from "../components/ui/carousel/carousel.js";
import { CoolImage } from "../components/base/image/image.js";
import { appStore } from "../components/core/store.js";

export class HomePage extends BasePage {
  constructor() {
    super();

    // Optional: customize the shared header section
    this.header.innerHTML = ""; // clear BasePage default
    this.header.appendChild(this.createHeader("🌱 Grow with My App"));

    // Carousel Section
    const carousel = new CoolCarousel({
      items: [
        {
          src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
          alt: "Welcome Slide",
          caption: "Welcome to Our App",
        },
        {
          src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
          alt: "Explore Slide",
          caption: "Explore Our Features",
        },
        {
          src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
          alt: "Join Slide",
          caption: "Join Our Community",
        },
      ],
    });

    const welcomeText = new CoolText({
      text: "Experience the future of interaction. Everything you need, right at your fingertips.",
      textColor: "var(--mdc-theme-on-surface)",
      textFontSize: "1.1rem",
      ariaLabel: "Welcome text",
    });

    // --- Feature Highlight Section ---
    const featureCard = this.createElement("div", {
      class: "mdc-card",
      style: {
        padding: "16px",
        borderRadius: "12px",
        textAlign: "center",
        background: "var(--mdc-theme-surface)",
        boxShadow: "var(--mdc-elevation-2)",
        marginTop: "24px",
      },
    });

    const featureImage = new CoolImage({
      src: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Feature Image",
      caption: "Explore our key feature",
      width: "100%",
      height: "200px",
    });

    const learnMoreBtn = new CoolButton({
      type: "primary",
      title: "Learn More",
      ariaLabel: "Learn More",
    });

    learnMoreBtn.onDidClick.addListener(() => {
      alert("🚀 Redirecting to feature details...");
    });

    featureCard.append(featureImage, learnMoreBtn);

    // --- Interactive Input Section ---
    const interactiveCard = this.createElement("div", {
      class: "mdc-card",
      style: {
        padding: "24px",
        borderRadius: "16px",
        marginTop: "32px",
        boxShadow: "var(--mdc-elevation-2)",
        background: "var(--mdc-theme-surface)",
      },
    });

    const interactionTitle = new CoolText({
      text: "Start interacting 👇",
      textColor: "var(--mdc-theme-on-surface)",
      textFontSize: "1rem",
    });

    const description = new CoolText({
      text: "Ready to get started? Send us your first message below.",
      textColor: "#666",
      textFontSize: "0.9rem",
      ariaLabel: "Input prompt",
    });

    const input = new CoolInput({
      type: "text",
      placeholder: "Enter your message...",
      ariaLabel: "Text input field",
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
      ariaLabel: "Reset form",
    });

    const themeButton = new CoolButton({
      type: "secondary",
      title: "Toggle Theme",
      icon: "🌓",
      ariaLabel: "Toggle theme",
    });

    // --- Events and Store Hooks ---
    input.onInput.addListener((e) => {
      appStore.dispatch({
        type: "SET_INPUT_VALUE",
        payload: e.detail.target.value,
      });
    });

    primaryButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "SET_LAST_CLICKED", payload: "Home Submit" });
      alert("✅ Message submitted!");
    });

    resetButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "RESET_STATE" });
    });

    themeButton.onDidClick.addListener(() => {
      appStore.dispatch({ type: "TOGGLE_THEME" });
      themeButton.icon = themeButton.icon === "🌞" ? "🌙" : "🌞";
    });

    // Subscribe input and text to state updates
    this.subscribeToStore(description, input);

    const interactiveContainer = this.createElement("div", {
      class: "mdc-card__content",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      },
    });

    interactiveContainer.append(
      interactionTitle,
      description,
      input,
      primaryButton,
      resetButton,
      themeButton
    );

    interactiveCard.appendChild(interactiveContainer);

    // --- Compose All into `main` instead of `container`
    this.main.classList.add("home-page-main");
    this.main.style.display = "flex";
    this.main.style.flexDirection = "column";
    this.main.style.gap = "32px";

    this.main.append(carousel, welcomeText, featureCard, interactiveCard);
  }
}

customElements.define("home-page", HomePage);
