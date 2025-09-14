import '@material/web/icon/icon.js';
import '@material/web/menu/menu.js';
import '@material/web/iconbutton/icon-button.js';

import './theme-changer.js';
import { LitElement, html, css } from 'lit';
import { live } from 'lit/directives/live.js';

class ThemeSettingsMenu extends LitElement {
  constructor() {
    super();
    this.menuOpen = false;
  }

  static get properties() {
    return {
      menuOpen: { type: Boolean }
    };
  }

  render() {
    return html`
      <lit-island
        on:interaction="pointerenter,focusin,pointerdown"
        import="/js/hydration-entrypoints/menu.js"
        id="menu-island">
        <md-icon-button
          id="theme-button"
          title="Page theme controls"
          aria-label="Page theme controls"
          aria-haspopup="dialog"
          aria-expanded="${this.menuOpen ? 'true' : 'false'}"
          @click="${this.onPaletteClick}">
          <md-icon>palette</md-icon>
        </md-icon-button>

        <md-menu
          anchor="theme-button"
          menu-corner="start-end"
          anchor-corner="end-end"
          default-focus="none"
          role="dialog"
          aria-label="Page color theme controls"
          .open="${live(this.menuOpen)}"
          @opened="${this.onMenuOpened}"
          @closed="${this.onMenuClosed}"
          @keydown="${this.onKeydown}">
          <theme-changer></theme-changer>
        </md-menu>
      </lit-island>
    `;
  }

  onPaletteClick() {
    this.menuOpen = true;
    this.makeContentInert(true);
  }

  onMenuClosed() {
    this.menuOpen = false;
    this.makeContentInert(false);
  }

  onMenuOpened() {
    const themeChanger = this.shadowRoot.querySelector('theme-changer');
    if (themeChanger) themeChanger.focus();
  }

  onKeydown(e) {
    if (!e.defaultPrevented && e.key === 'Escape') {
      e.preventDefault();
      this.menuOpen = false;
    }
  }

  makeContentInert(isInert) {
    const content = document.getElementById('page-content');
    if (content) {
      if (isInert) {
        content.setAttribute('inert', '');
      } else {
        content.removeAttribute('inert');
      }
    }
  }

  static get styles() {
    return css`
      #menu-island {
        position: relative;
      }
    `;
  }
}

customElements.define('theme-settings-menu', ThemeSettingsMenu);
