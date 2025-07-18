// src/components/ui/file-explorer/file-explorer.ts
import { BaseComponent } from '../../core/base-component';
import { appStore } from '../../core/store';
import { BaseEvent } from '../../core/event-system';
import { FileItem } from '../../core/store';

export class FileExplorer extends BaseComponent {
  private _onFileSelect: BaseEvent<FileItem>;
  private _container: HTMLDivElement;
  private _files: FileItem[] = [];
  private _selectedFile: string | null = null;

  constructor() {
    super();
    this._onFileSelect = new BaseEvent<FileItem>();
    this.initShadowDom(new URL('./file-explorer.css', import.meta.url).toString());
    this._container = this.createElement('div', { class: 'file-explorer' });
    this._shadow.appendChild(this._container);
    this.subscribeToStore();
    this.render();
  }

  private subscribeToStore(): void {
    appStore.subscribe((state) => {
      this._files = state.files;
      this._selectedFile = state.selectedFile;
      this.render();
    });
  }

  private render(): void {
    this._container.innerHTML = '';
    this.renderFiles(this._files, this._container);
  }

  private renderFiles(files: FileItem[], parentElement: HTMLElement, parentPath: string = ''): void {
    files.forEach((item) => {
      const fileItem = this.createElement('div', {
        class: `file-item ${item.isFolder ? 'file-item--folder' : ''} ${this._selectedFile === item.path ? 'file-item--selected' : ''
          }`,
      });

      const icon = this.createElement(
        'span',
        { class: 'file-item__icon' },
        item.isFolder ? (item.isOpen ? '📂' : '📁') : '📄'
      );

      const name = this.createElement('span', { class: 'file-item__name' }, item.name);

      fileItem.append(icon, name);

      fileItem.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        if (item.isFolder) {
          this.toggleFolder(item);
        } else {
          appStore.dispatch({ type: 'SET_SELECTED_FILE', payload: item.path });
          this._onFileSelect.dispatch(item);
        }
      });

      parentElement.appendChild(fileItem);

      if (item.isFolder && item.isOpen && item.children) {
        const childrenContainer = this.createElement('div', {
          class: 'file-item__children',
        });
        this.renderFiles(item.children, childrenContainer, item.path);
        parentElement.appendChild(childrenContainer);
      }
    });
  }

  private toggleFolder(item: FileItem): void {
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
    appStore.dispatch({ type: 'SET_FILES', payload: updatedFiles });
  }

  private toggleFolderInChildren(children: FileItem[], target: FileItem): FileItem[] {
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

  get onFileSelect(): BaseEvent<FileItem> {
    return this._onFileSelect;
  }
}

customElements.define('file-explorer', FileExplorer);