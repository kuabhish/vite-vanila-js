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

    // Handle navigation
    this.setupNavigation();
    this.renderPage();

    // Listen for popstate events (browser back/forward)
    window.addEventListener("popstate", () => this.renderPage());
  }

  setupNavigation() {
    // Handle nav link clicks
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = e.target.getAttribute("href");
        const page = href.startsWith("/") ? href.slice(1) : href || "home";
        this.navigateTo(page);
      });
    });

    // Update aria-current for accessibility
    this.updateActiveLink();
  }

  navigateTo(page) {
    history.pushState({}, "", `/${page || "home"}`);
    this.renderPage();
  }

  renderPage() {
    const path = window.location.pathname.slice(1) || "home";
    const route = routes[path] || routes["home"]; // Default to home for 404

    // Clear container
    this.container.innerHTML = "";

    // Create and append component
    const component = new route.component();
    this.container.appendChild(component);

    // Update document title
    document.title = route.title || "My App";

    // Update active link for accessibility
    this.updateActiveLink();

    // Focus management for accessibility
    this.container.setAttribute("tabindex", "-1");
    this.container.focus();
  }

  updateActiveLink() {
    const path = window.location.pathname.slice(1) || "home";
    document.querySelectorAll("nav a").forEach((link) => {
      const href = link.getAttribute("href").slice(1);
      link.setAttribute("aria-current", href === path ? "page" : "false");
    });
  }
}

customElements.define("app-root", App);
