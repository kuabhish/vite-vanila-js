// src/app.js
import { loadStylesheet } from "./components/core/stylesheet.js";
import { HomePage } from "./pages/home.js";
import { TeamPage } from "./pages/team.js";

// Define routes
const routes = {
  home: { component: HomePage, title: "Home" },
  team: { component: TeamPage, title: "Team" },
};

class App extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });

    loadStylesheet(
      this._shadow,
      new URL("./app.css", import.meta.url).toString()
    );

    this.container = document.createElement("div");
    this.container.id = "app-container";
    this._shadow.appendChild(this.container);

    // Listen for navigate event from BasePage
    this.addEventListener("navigate", (e) => {
      console.log("debug listener .. ", e);
      const { page } = e.detail;
      this.navigateTo(page);
    });

    // Handle browser navigation (back/forward)
    window.addEventListener("popstate", () => this.renderPage());

    this.renderPage();
  }

  navigateTo(page) {
    const basePath = import.meta.env?.BASE_URL || "/";
    history.pushState({}, "", `${basePath}${page || "home"}`);
    this.renderPage();
  }

  renderPage() {
    const basePath = import.meta.env?.BASE_URL || "/";
    const path = window.location.pathname.replace(basePath, "") || "home";
    console.log(
      "Rendering page 11 :",
      window.location.pathname.replace(basePath, "")
    );
    const route = routes[path] || routes["home"];

    this.container.innerHTML = "";
    const component = new route.component();
    this.container.appendChild(component);
    console.log("Rendering page:", path, component?.updateActiveLink);

    // Update active link if component is a BasePage
    if (component?.updateActiveLink) {
      component.updateActiveLink(path);
    }

    document.title = route.title || "My App";

    this.container.setAttribute("tabindex", "-1");
    this.container.focus();
  }
}

customElements.define("app-root", App);
