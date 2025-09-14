import '@material/web/focus/md-focus-ring.js';
import '@material/web/icon/icon.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
import './copy-code-button.js';
import './hct-slider.js';

import { LitElement, html, css } from 'lit';
import { live } from 'lit/directives/live.js';

import { ChangeColorEvent, ChangeDarkModeEvent } from '../utils/color-events.js';
import { hctFromHex, hexFromHct } from '../utils/material-color-helpers.js';
import { getCurrentMode, getCurrentSeedColor, getCurrentThemeString } from '../utils/theme.js';

class ThemeChanger extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static get properties() {
    return {
      selectedColorMode: {state: true},
      hexColor: {state: true},
      hue: {state: true},
      chroma: {state: true},
      tone: {state: true}
    };
  }

  constructor() {
    super();
    this.selectedColorMode = null;
    this.hexColor = '';
    this.hue = 0;
    this.chroma = 0;
    this.tone = 0;
  }

  render() {
    return html`
      <div id="head-wrapper">
        <h2> Theme Controls </h2>
        <copy-code-button
          button-title="Copy current theme to clipboard"
          label="Copy current theme"
          .getCopyText=${getCurrentThemeString}>
        </copy-code-button>
      </div>
      ${this.renderHexPicker()} ${this.renderHctPicker()}
      ${this.renderColorModePicker()}
    `;
  }

  renderHexPicker() {
    return html`<div>
      <label id="hex" for="color-input">
        <span class="label">Hex Source Color</span>
        <span class="input-wrapper">
          <div class="overflow">
            <input
              id="color-input"
              @input=${this.onHexPickerInput.bind(this)}
              type="color"
              .value=${live(this.hexColor)} />
          </div>
          <md-focus-ring for="color-input"></md-focus-ring>
        </span>
      </label>
    </div>`;
  }

  renderHctPicker() {
    return html`<div class="sliders">
      <hct-slider
        .value=${live(this.hue)}
        type="hue"
        label="Hue"
        max="360"
        @input=${this.onSliderInput.bind(this)}></hct-slider>
      <hct-slider
        .value=${live(this.chroma)}
        .color=${this.hexColor}
        type="chroma"
        label="Chroma"
        max="150"
        @input=${this.onSliderInput.bind(this)}></hct-slider>
      <hct-slider
        .value=${live(this.tone)}
        type="tone"
        label="Tone"
        max="100"
        @input=${this.onSliderInput.bind(this)}></hct-slider>
    </div>`;
  }

  renderColorModePicker() {
    return html`<md-outlined-segmented-button-set
      @segmented-button-set-selection=${this.onColorModeSelection.bind(this)}
      aria-label="Color mode">
      ${this.renderModeButton('dark', 'dark_mode')}
      ${this.renderModeButton('auto', 'brightness_medium')}
      ${this.renderModeButton('light', 'light_mode')}
    </md-outlined-segmented-button-set>`;
  }

  renderModeButton(mode, icon) {
    return html`<md-outlined-segmented-button
      data-value=${mode}
      title=${mode}
      aria-label="${mode} color scheme"
      .selected=${this.selectedColorMode === mode}>
      <md-icon slot="icon">${icon}</md-icon>
    </md-outlined-segmented-button>`;
  }

  onSliderInput() {
    const sliders = this.shadowRoot.querySelectorAll('hct-slider');
    sliders.forEach(slider => {
      this[slider.type] = slider.value;
    });

    this.hexColor = hexFromHct(this.hue, this.chroma, this.tone);
    this.dispatchEvent(new ChangeColorEvent(this.hexColor));
  }

  updateHctFromHex(hexColor) {
    const hct = hctFromHex(hexColor);
    this.hue = hct.hue;
    this.chroma = hct.chroma;
    this.tone = hct.tone;
  }

  onHexPickerInput() {
    const inputEl = this.shadowRoot.querySelector('input');
    this.hexColor = inputEl.value;
    this.updateHctFromHex(this.hexColor);
    this.dispatchEvent(new ChangeColorEvent(this.hexColor));
  }

  firstUpdated() {
    if (!this.selectedColorMode) {
      this.selectedColorMode = getCurrentMode();
    }

    if (!this.hexColor) {
      this.hexColor = getCurrentSeedColor();
    }

    this.updateHctFromHex(this.hexColor);
  }

  onColorModeSelection(e) {
    const button = e.detail.button;
    const value = button.dataset.value;
    this.selectedColorMode = value;
    this.dispatchEvent(new ChangeDarkModeEvent(value));
  }

  static styles = css`
    :host {
      --_copy-button-button-size: 40px;
      --_copy-button-icon-size: 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      margin: var(--webpage-spacing-m) var(--webpage-spacing-l);
    }

    :host > * {
      margin-block-end: var(--webpage-spacing-l);
    }

    :host > *:last-child {
      margin-block-end: 0;
    }

    #head-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    input {
      border: none;
      background: none;
    }

    .sliders,
    #hex {
      padding-inline: var(--webpage-spacing-m);
      border-radius: var(--webpage-shape-l);
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);
      --md-slider-inactive-track-color: var(--md-sys-color-on-surface-variant);
    }

    hct-slider {
      display: block;
      margin-block: 24px;
    }

    h2 {
      margin: 0;
      text-align: center;
      position: relative;
      height: var(--_copy-button-icon-size);
    }

    copy-code-button {
      --md-icon-button-icon-size: var(--_copy-button-icon-size);
      --md-icon-button-state-layer-width: var(--_copy-button-button-size);
      --md-icon-button-state-layer-height: var(--_copy-button-button-size);
      --_inline-block-inset: calc(
        -1 * (var(--_copy-button-button-size) - var(--_copy-button-icon-size)) /
          2
      );
      --webpage-copy-code-button-inset: var(--_inline-block-inset) 0 auto auto;
      position: static;
    }

    #hex {
      display: flex;
      padding: 12px;
      align-items: center;
    }

    #hex .label {
      flex-grow: 1;
    }

    #hex .input-wrapper {
      box-sizing: border-box;
      width: 48px;
      height: 48px;
      border: 1px solid var(--md-sys-color-on-secondary-container);
      position: relative;
    }

    #hex .input-wrapper,
    #hex md-focus-ring {
      border-radius: 50%;
    }

    .overflow {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #hex input {
      min-width: 200%;
      min-height: 200%;
    }

    @media (forced-colors: active) {
      #hex,
      .sliders {
        box-sizing: border-box;
        border: 1px solid CanvasText;
      }
    }
  `;
}

customElements.define('theme-changer', ThemeChanger);
