// src/components/ui/code-editor/code-editor.ts
import { BaseComponent } from '../../core/base-component';
import { appStore } from '../../core/store';
import { FileItem } from '../../core/store';

export class CodeEditor extends BaseComponent {
  private _container: HTMLDivElement;
  private _tabBar: HTMLDivElement;
  private _textarea: HTMLTextAreaElement;
  private _selectedFile: string | null = null;

  constructor() {
    super();
    this.initShadowDom(new URL('./code-editor.css', import.meta.url).toString());

    // Editor container
    this._container = this.createElement('div', { class: 'code-editor' });

    // Tab bar for open files
    this._tabBar = this.createElement('div', { class: 'tab-bar' });

    // Textarea for editing content
    this._textarea = this.createElement('textarea', {
      placeholder: 'Select a file to edit...',
      'aria-label': 'Code editor',
      id: 'code-textarea',
    });

    // Build DOM
    this._container.appendChild(this._tabBar);
    this._container.appendChild(this._textarea);
    this._shadow.appendChild(this._container);

    // Handle file content updates
    this._textarea.addEventListener('input', () => {
      if (this._selectedFile) {
        appStore.dispatch({
          type: 'UPDATE_FILE_CONTENT',
          payload: {
            path: this._selectedFile,
            content: this._textarea.value,
          },
        });
      }
    });

    // Handle save (Ctrl+S / Cmd+S)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (this._selectedFile) {
          appStore.dispatch({
            type: 'SAVE_FILE',
            payload: { path: this._selectedFile },
          });
        }
      }
    });

    this.subscribeToStore();
  }

  private subscribeToStore(): void {
    appStore.subscribe((state) => {
      this._selectedFile = state.selectedFile;
      this._textarea.value = this.getFileContent(state.files, this._selectedFile) || '';
      this._textarea.disabled = !this._selectedFile;
      this.renderTabs(state.openFiles);
    });
  }

  private getFileContent(files: FileItem[], path: string | null): string {
    if (!path) return '';
    for (const item of files) {
      if (item.path === path && !item.isFolder) return item.content || '';
      if (item.isFolder && item.children) {
        const result = this.getFileContent(item.children, path);
        if (result) return result;
      }
    }
    return '';
  }

  private renderTabs(openFiles: string[]): void {
    this._tabBar.innerHTML = '';

    for (const filePath of openFiles) {
      const isActive = filePath === this._selectedFile;

      const tab = this.createElement('div', {
        class: `tab ${isActive ? 'active' : ''}`,
      });
      tab.textContent = filePath.split('/').pop() || filePath;

      const closeBtn = this.createElement('span', { class: 'close-tab' });
      closeBtn.textContent = '×';
      // closeBtn.innerHTML = '<i data-feather="x"></i>';

      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        const remainingTabs = openFiles.filter((f) => f !== filePath);
        const newSelected = this._selectedFile === filePath
          ? remainingTabs[remainingTabs.length - 1] || null
          : this._selectedFile;

        appStore.dispatch({ type: 'SET_SELECTED_FILE', payload: newSelected });
        appStore.dispatch({ type: 'SET_OPEN_FILES', payload: remainingTabs });
      });

      tab.addEventListener('click', () => {
        appStore.dispatch({ type: 'SET_SELECTED_FILE', payload: filePath });
      });

      tab.appendChild(closeBtn);
      this._tabBar.appendChild(tab);
    }
  }
}

customElements.define('code-editor', CodeEditor);
