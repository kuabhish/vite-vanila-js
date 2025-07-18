// src/components/ui/file-explorer/file-explorer.js
import { BaseComponent } from "../../core/base-component.js";
import { appStore } from "../../core/store.js";
import { BaseEvent } from "../../core/event-system.js";

export class FileExplorer extends BaseComponent {
  constructor() {
    super();
    this._onFileSelect = new BaseEvent();
    this.initShadowDom(
      new URL("./file-explorer.css", import.meta.url).toString()
    );
    this._container = this.createElement("div", { class: "file-explorer" });
    this._shadow.appendChild(this._container);
    this.subscribeToStore();
    this.render();
  }

  subscribeToStore() {
    appStore.subscribe((state) => {
      this._files = state.files;
      this._selectedFile = state.selectedFile;
      this.render();
    });
  }

  render() {
    this._container.innerHTML = "";
    this.renderFiles(this._files, this._container);
  }

  renderFiles(files, parentElement, parentPath = "") {
    files.forEach((item) => {
      const fileItem = this.createElement("div", {
        class: `file-item ${item.isFolder ? "file-item--folder" : ""} ${
          this._selectedFile === item.path ? "file-item--selected" : ""
        }`,
      });

      const icon = this.createElement(
        "span",
        { class: "file-item__icon" },
        item.isFolder ? (item.isOpen ? "📂" : "📁") : "📄"
      );

      const name = this.createElement(
        "span",
        { class: "file-item__name" },
        item.name
      );

      fileItem.append(icon, name);

      fileItem.addEventListener("click", (e) => {
        e.stopPropagation();
        if (item.isFolder) {
          this.toggleFolder(item);
        } else {
          appStore.dispatch({ type: "SET_SELECTED_FILE", payload: item.path });
          this._onFileSelect.dispatch(item);
        }
      });

      parentElement.appendChild(fileItem);

      if (item.isFolder && item.isOpen && item.children) {
        const childrenContainer = this.createElement("div", {
          class: "file-item__children",
        });
        this.renderFiles(item.children, childrenContainer, item.path);
        parentElement.appendChild(childrenContainer);
      }
    });
  }

  toggleFolder(item) {
    const updatedFiles = this._files.map((file) => {
      if (file.path === item.path) {
        return { ...file, isOpen: !file.isOpen };
      } else if (file.isFolder && file.children) {
        return {
          ...file,
          children: this.toggleFolderInChildren(file.children, item),
        };
      }
      return file;
    });
    appStore.dispatch({ type: "SET_FILES", payload: updatedFiles });
  }

  toggleFolderInChildren(children, target) {
    return children.map((child) => {
      if (child.path === target.path) {
        return { ...child, isOpen: !child.isOpen };
      } else if (child.isFolder && child.children) {
        return {
          ...child,
          children: this.toggleFolderInChildren(child.children, target),
        };
      }
      return child;
    });
  }

  get onFileSelect() {
    return this._onFileSelect;
  }
}

customElements.define("file-explorer", FileExplorer);
