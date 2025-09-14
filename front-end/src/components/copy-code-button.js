import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';

import {css, html, LitElement} from 'lit';

export class CopyCodeButton extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      successLabel: { type: String, attribute: 'success-label' },
      buttonTitle: { type: String, attribute: 'button-title' },
      showCheckmark: { type: Boolean }
    };
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      --_border-radius: calc(var(--webpage-code-block-border-radius) / 4);
    }

    md-icon-button {
      color: red;
      position: absolute;
      inset: var(
        --webpage-copy-code-button-inset,
        var(--_border-radius) var(--_border-radius) auto auto
      );
      --md-sys-color-on-surface-variant: var(--md-sys-color-on-surface);
      --md-sys-color-primary: var(--md-sys-color-on-surface);
    }
  `;

  constructor() {
    super();
    this.label = 'Copy code';
    this.successLabel = 'Copy successful';
    this.buttonTitle = 'Copy code';
    this.showCheckmark = false;
    this.timeoutId = undefined;
  }

  render() {
    return html`
      <slot></slot>
      <md-icon-button
        toggle
        @click=${this.onClick.bind(this)}
        @input=${this.onInput.bind(this)}
        title=${this.buttonTitle}
        .selected=${this.showCheckmark}
        aria-label=${this.label}
        aria-label-selected=${this.successLabel}>
        <md-icon>content_copy</md-icon>
        <md-icon slot="selected">check</md-icon>
      </md-icon-button>
    `;
  }

  firstUpdated() {
    this.copyButton = this.renderRoot.querySelector('md-icon-button');
    this.slottedEls = this.renderRoot.querySelectorAll('*');
  }

  async onClick() {
    await navigator.clipboard.writeText(this.getCopyText());
    this.onCopySuccess();
  }

  onInput() {
    this.showCheckmark = this.copyButton.selected;
  }

  getCopyText() {
    let text = '';
    for (const el of this.slottedEls) {
      text += el.textContent;
    }
    return text;
  }

  onCopySuccess() {
    this.showCheckmark = true;

    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      this.showCheckmark = false;
    }, 2000);
  }
}

customElements.define('copy-code-button', CopyCodeButton);
