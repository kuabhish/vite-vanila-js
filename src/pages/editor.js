// src/pages/editor.js
import { BasePage } from "../components/core/base-page.js";
import { FileExplorer } from "../components/ui/file-explorer/file-explorer.js";
import { CodeEditor } from "../components/ui/code-editor/code-editor.js";
import { CoolText } from "../components/base/text/text.js";

export class Editor extends BasePage {
  constructor() {
    super({ show_header: false }); // No header, as specified

    // Create split-pane layout
    const splitPane = this.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        minHeight: "calc(100vh - 64px)", // Adjusted for footer
        gap: "16px",
        marginBottom: "50px",
      },
    });

    // File Explorer (left)
    const fileExplorer = new FileExplorer();
    // fileExplorer.style.width = "250px"; // Match file-explorer.css width
    // fileExplorer.style.flexShrink = "0"; // Prevent shrinking

    // Code Editor (right)
    const codeEditor = new CodeEditor();
    codeEditor.style.flex = "1"; // Take remaining space

    // Append components to split-pane
    splitPane.append(fileExplorer, codeEditor);

    // Style the main container
    this.main.classList.add("editor-page-main");
    this.main.style.background = "var(--mdc-theme-background)";
    // this.main.style.padding = "0"; // Remove padding to maximize space
    this.main.style.width = "100%"; // Ensure main takes full width
    this.main.style.boxSizing = "border-box";

    // Append to main
    this.main.append(splitPane);
  }
}

customElements.define("editor-page", Editor);
