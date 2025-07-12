// components/carousel/carousel.js
import { BaseComponent } from "../../core/base-component.js";
import { BaseEvent } from "../../core/event-system.js";

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

    this._prevButton = this.createElement(
      "button",
      {
        class: "mdc-carousel__button mdc-carousel__button--prev",
        "aria-label": "Previous slide",
      },
      "◄"
    );
    this._nextButton = this.createElement(
      "button",
      {
        class: "mdc-carousel__button mdc-carousel__button--next",
        "aria-label": "Next slide",
      },
      "►"
    );

    this._prevButton.addEventListener("click", () => this.prev());
    this._nextButton.addEventListener("click", () => this.next());

    this._container.append(this._prevButton, this._track, this._nextButton);

    this._shadow.appendChild(this._container);
    this.render();
  }

  render() {
    this._track.innerHTML = "";
    if (this._items.length === 0) return;

    const item = this._items[this._currentIndex];
    const slide = this.createElement("div", { class: "mdc-carousel__slide" });

    const img = this.createElement("img", {
      src: item.src,
      alt: item.alt,
      style: { width: "100%", height: "auto", objectFit: "cover" },
    });

    if (item.caption) {
      const caption = this.createElement(
        "div",
        {
          class: "mdc-typography--caption mdc-carousel__caption",
        },
        item.caption
      );
      slide.append(img, caption);
    } else {
      slide.appendChild(img);
    }

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

  set items(value) {
    this._items = value || [];
    this._currentIndex = 0;
    this.render();
  }
}

customElements.define("cool-carousel", CoolCarousel);
