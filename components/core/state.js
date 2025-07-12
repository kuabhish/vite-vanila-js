// components/core/state.js
export const state = {
  inputValue: "",
  lastClicked: "",
};

export class StateManager extends EventTarget {
  setState(newState) {
    Object.assign(state, newState);
    this.dispatchEvent(new CustomEvent("statechange", { detail: state }));
  }

  getState() {
    return { ...state };
  }
}

export const stateManager = new StateManager();
