// components/core/store.js
export class Store {
  constructor(reducer, initialState = {}) {
    this.state = { ...initialState };
    this.listeners = [];
    this.reducer = reducer;

    try {
      this.channel = new BroadcastChannel("app_state");
      this.channel.onmessage = (event) => {
        const { action } = event.data;
        if (this.isValidAction(action)) {
          this.state = this.reducer(this.state, action);
          this.notify();
        }
      };
    } catch (error) {
      console.error("Failed to initialize BroadcastChannel:", error);
    }

    try {
      const savedState = localStorage.getItem("app_state");
      if (savedState) {
        this.state = { ...this.state, ...JSON.parse(savedState) };
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
    }
  }

  isValidAction(action) {
    return (
      action && typeof action.type === "string" && action.type.trim() !== ""
    );
  }

  dispatch(action) {
    if (!this.isValidAction(action)) {
      console.warn("Invalid action:", action);
      return;
    }
    this.state = this.reducer(this.state, action);
    this.notify();
    try {
      this.channel.postMessage({ action });
      localStorage.setItem("app_state", JSON.stringify(this.state));
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }

  getState() {
    return { ...this.state };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: action.payload };
    case "SET_LAST_CLICKED":
      return { ...state, lastClicked: action.payload };
    case "RESET_STATE":
      return { inputValue: "", lastClicked: "", theme: state.theme };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    default:
      return state;
  }
}

export const appStore = new Store(reducer, {
  inputValue: "",
  lastClicked: "",
  theme: "light",
});
