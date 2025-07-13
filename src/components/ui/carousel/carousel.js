// src/components/ui/carousel/carousel.js
import { BaseComponent } from "../../core/base-component.js";
import { BaseEvent } from "../../core/event-system.js";
import { CoolImage } from "../../base/image/image.js"; // Import CoolImage
import { CoolButton } from "../../base/button/button.js"; // Import CoolButton

export class CoolCarousel extends BaseComponent {
  constructor(options = {}) {
    super(options);
    this._items = options.items || []; // Array of { src, alt, caption }
    this._currentIndex = 0;
    this._onChange = new BaseEvent();

    this.initShadowDom(new URL("./carousel.css", import.meta.url).toString());

    this._container = this.createElement("div", { class: "mdc-carousel" });

    this._track = this.createElement("div", { class: "mdc-carousel__track" });
    this._container.appendChild(this._track);

    // Use CoolButton for previous and next buttons
    this._prevButton = new CoolButton({
      title: "Previous",
      type: "primary",
      ariaLabel: "Previous slide",
      supportIcons: true,
      icon: "◄",
      theme: "carousel", // Custom theme for carousel buttons
    });
    this._prevButton.classList.add("mdc-carousel__button--prev");
    this._prevButton.onDidClick.addListener(() => this.prev());

    this._nextButton = new CoolButton({
      title: "Next",
      type: "primary",
      ariaLabel: "Next slide",
      supportIcons: true,
      icon: "►",
      theme: "carousel",
    });
    this._nextButton.classList.add("mdc-carousel__button--next");
    this._nextButton.onDidClick.addListener(() => this.next());

    this._container.append(this._prevButton, this._track, this._nextButton);

    this._shadow.appendChild(this._container);
    this.render();
  }

  render() {
    this._track.innerHTML = "";
    if (this._items.length === 0) return;

    const item = this._items[this._currentIndex];
    const slide = this.createElement("div", { class: "mdc-carousel__slide" });

    // Use CoolImage instead of raw <img>
    const image = new CoolImage({
      src: item.src,
      alt: item.alt,
      caption: item.caption || "", // CoolImage handles caption rendering
      width: "100%",
      height: "auto",
      style: { objectFit: "cover" }, // Pass additional styles if needed
    });

    slide.appendChild(image);
    this._track.appendChild(slide);
    this._onChange.dispatch({ index: this._currentIndex });
  }

  prev() {
    this._currentIndex =
      (this._currentIndex - 1 + this._items.length) % this._items.length;
    this.render();
  }

  next() {
    this._currentIndex = (this._currentIndex + 1) % this._items.length;
    this.render();
  }

  get onChange() {
    return this._onChange;
  }

  /**
   * @param {never[]} value
   */
  set items(value) {
    this._items = value || [];
    this._currentIndex = 0;
    this.render();
  }
}

customElements.define("cool-carousel", CoolCarousel);
