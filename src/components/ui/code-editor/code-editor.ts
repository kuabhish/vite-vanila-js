// src/components/ui/code-editor/code-editor.ts
import { BaseComponent } from '../../core/base-component';
import { appStore } from '../../core/store';
import { FileItem } from '../../core/store';

export class CodeEditor extends BaseComponent {
  private _container: HTMLDivElement;
  private _textarea: HTMLTextAreaElement;
  private _selectedFile: string | null = null;

  constructor() {
    super();
    this.initShadowDom(new URL('./code-editor.css', import.meta.url).toString());
    this._container = this.createElement('div', { class: 'code-editor' });
    this._textarea = this.createElement('textarea', {
      placeholder: 'Select a file to edit...',
      'aria-label': 'Code editor',
      id: 'textarea1',
    });

    this._container.classList.add('code-editor');

    this._container.appendChild(this._textarea);
    this._shadow.appendChild(this._container);
    this.subscribeToStore();

    this._textarea.addEventListener('input', () => {
      if (this._selectedFile) {
        appStore.dispatch({
          type: 'UPDATE_FILE_CONTENT',
          payload: { path: this._selectedFile, content: this._textarea.value },
        });
      }
    });
  }

  private subscribeToStore(): void {
    appStore.subscribe((state) => {
      this._selectedFile = state.selectedFile;
      this._textarea.value = this.getFileContent(state.files, state.selectedFile) || '';
      this._textarea.disabled = !this._selectedFile;
    });
  }

  private getFileContent(files: FileItem[], path: string | null): string {
    if (!path) return '';
    for (const item of files) {
      if (item.path === path && !item.isFolder) {
        return item.content || '';
      }
      if (item.isFolder && item.children) {
        const content = this.getFileContent(item.children, path);
        if (content) return content;
      }
    }
    return '';
  }
}

customElements.define('code-editor', CodeEditor);