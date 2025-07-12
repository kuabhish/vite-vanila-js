// src/core/event-system.js
export class BaseEvent extends EventTarget {
  addListener(callback) {
    this.addEventListener("event", callback);
  }

  dispatch(data) {
    this.dispatchEvent(new CustomEvent("event", { detail: data }));
  }
}
