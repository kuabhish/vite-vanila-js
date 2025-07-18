// src/core/store.js
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

// src/components/core/store.js
function reducer(state, action) {
  switch (action.type) {
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: action.payload };
    case "SET_LAST_CLICKED":
      return { ...state, lastClicked: action.payload };
    case "RESET_STATE":
      return {
        inputValue: "",
        lastClicked: "",
        theme: state.theme,
        files: state.files,
      };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };
    case "SET_FILES":
      return { ...state, files: action.payload };
    case "SET_SELECTED_FILE":
      return { ...state, selectedFile: action.payload };
    case "UPDATE_FILE_CONTENT":
      return {
        ...state,
        files: updateFileContent(
          state.files,
          action.payload.path,
          action.payload.content
        ),
      };
    default:
      return state;
  }
}

// Helper function to update file content in the tree
function updateFileContent(files, path, content) {
  return files.map((item) => {
    if (item.path === path && !item.isFolder) {
      return { ...item, content };
    } else if (item.isFolder && item.children) {
      return {
        ...item,
        children: updateFileContent(item.children, path, content),
      };
    }
    return item;
  });
}

// Mock file system (replace with backend API if needed)
const initialFiles = [
  {
    name: "src",
    path: "/src",
    isFolder: true,
    isOpen: false,
    children: [
      {
        name: "index.js",
        path: "/src/index.js",
        isFolder: false,
        content: "// Hello, world!",
      },
      {
        name: "components",
        path: "/src/components",
        isFolder: true,
        isOpen: false,
        children: [
          {
            name: "app.js",
            path: "/src/components/app.js",
            isFolder: false,
            content: "// App component",
          },
        ],
      },
    ],
  },
  {
    name: "README.md",
    path: "/README.md",
    isFolder: false,
    content: "# My App",
  },
];

export const appStore = new Store(reducer, {
  inputValue: "",
  lastClicked: "",
  theme: "light",
  files: initialFiles, // Add file system to initial state
  selectedFile: null, // Track selected file
});

// export const appStore = new Store(reducer, {
//   inputValue: "",
//   lastClicked: "",
//   theme: "light",
// });
