// components/app.js
import { loadStylesheet } from "./core/stylesheet.js";
import { HomePage } from "./home.js";
import { TeamPage } from "./team.js";
import { AboutPage } from "./about.js";

// Define routes
const routes = {
  home: { component: HomePage, title: "Home" },
  team: { component: TeamPage, title: "Team" },
  about: { component: AboutPage, title: "About" },
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

    this.setupNavigation();
    this.renderPage();

    window.addEventListener("popstate", () => this.renderPage());
  }

  setupNavigation() {
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = e.target.getAttribute("href");
        const page = href.startsWith("/") ? href.slice(1) : href || "home";
        this.navigateTo(page);
      });
    });

    this.updateActiveLink();
  }

  navigateTo(page) {
    const basePath = import.meta.env?.BASE_URL || "/"; // Vite base path or fallback
    history.pushState({}, "", `${basePath}${page || "home"}`);
    this.renderPage();
  }

  renderPage() {
    const basePath = import.meta.env?.BASE_URL || "/";
    const path =
      window.location.pathname.replace(basePath, "").slice(1) || "home";
    const route = routes[path] || routes["home"];

    this.container.innerHTML = "";
    const component = new route.component();
    this.container.appendChild(component);

    document.title = route.title || "My App";
    this.updateActiveLink();

    this.container.setAttribute("tabindex", "-1");
    this.container.focus();
  }

  updateActiveLink() {
    const basePath = import.meta.env?.BASE_URL || "/";
    const path =
      window.location.pathname.replace(basePath, "").slice(1) || "home";
    document.querySelectorAll("nav a").forEach((link) => {
      const href = link.getAttribute("href").replace(basePath, "").slice(1);
      link.setAttribute("aria-current", href === path ? "page" : "false");
    });
  }
}

customElements.define("app-root", App);
