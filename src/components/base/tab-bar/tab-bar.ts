// src/components/base/tab-bar/tab-bar.ts
import { BaseComponent } from '../../core/base-component';
import { CoolTab } from '../tab/tab';

interface TabBarOptions {
  tabs?: { path: string; label: string }[];
  selectedTab?: string; // Path of the selected tab
}

export class CoolTabBar extends BaseComponent {
  private _tabBar: HTMLDivElement;
  private _tabs: Map<string, CoolTab> = new Map();
  private _selectedTab: string | null = null;

  constructor(options: TabBarOptions = {}) {
    super(options);
    const { tabs = [], selectedTab = null } = options;

    this.initShadowDom(new URL('./tab-bar.css', import.meta.url).toString());

    this._tabBar = this.createElement('div', { class: 'tab-bar', role: 'tablist' });

    this._shadow.appendChild(this._tabBar);

    this.renderTabs(tabs, selectedTab);
  }

  private renderTabs(tabs: { path: string; label: string }[], selectedTab: string | null): void {
    const existingPaths = new Set(this._tabs.keys());
    const newPaths = new Set(tabs.map(t => t.path));

    // Remove tabs that are no longer present
    for (const path of existingPaths) {
      if (!newPaths.has(path)) {
        const tab = this._tabs.get(path);
        tab?.dispose();
        this._tabs.delete(path);
      }
    }

    // Add or update tabs
    for (const { path, label } of tabs) {
      let tab = this._tabs.get(path);
      if (!tab) {
        tab = new CoolTab({
          label,
          path,
          isActive: path === selectedTab,
          closable: true,
        });
        tab.onDidClick.addListener(() => {
          this._selectedTab = path;
          this.updateActiveTab();
          this.dispatchEvent(new CustomEvent('tab-selected', { detail: { path } }));
        });
        tab.onDidClose.addListener(() => {
          this.dispatchEvent(new CustomEvent('tab-closed', { detail: { path } }));
        });
        this._tabs.set(path, tab);
        this._tabBar.appendChild(tab);
      } else {
        tab.label = label;
        tab.active = path === selectedTab;
      }
    }

    this._selectedTab = selectedTab;
  }

  private updateActiveTab(): void {
    this._tabs.forEach((tab, path) => {
      tab.active = path === this._selectedTab;
    });
  }

  setTabs(tabs: { path: string; label: string }[], selectedTab: string | null): void {
    this.renderTabs(tabs, selectedTab);
  }

  dispose(): void {
    this._tabs.forEach(tab => tab.dispose());
    this._tabs.clear();
    this._tabBar.remove();
    this._shadow.innerHTML = '';
  }
}

customElements.define('cool-tab-bar', CoolTabBar);