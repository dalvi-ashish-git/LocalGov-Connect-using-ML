/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/slider/slider.js';
import {LitElement, html, css} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';
import {hctFromHex, hexFromHct} from '../utils/material-color-helpers.js';

const HUE_RANGE = [0, 360];
const CHROMA_RANGE = [0, 150];
const TONE_RANGE = [0, 100];

class HCTSlider extends LitElement {
  static get properties() {
    return {
      label: {type: String},
      value: {type: Number},
      color: {type: String},
      type: {type: String}
    };
  }

  constructor() {
    super();
    this.label = '';
    this.value = 0;
    this.color = '';
    this.type = 'hue';
  }

  render() {
    let range = HUE_RANGE;
    if (this.type === 'chroma') {
      range = CHROMA_RANGE;
    } else if (this.type === 'tone') {
      range = TONE_RANGE;
    }

    return html`
      <section>
        <span id="label" class="color-on-surface-text">${this.label}</span>
        <md-slider
          id="source"
          labeled
          aria-label=${this.label}
          .min=${range[0]}
          .max=${range[1]}
          .value=${this.value}
          @input=${this.onInput}></md-slider>
        <div
          id="gradient"
          class=${this.type}
          style=${styleMap({
            background: this.buildGradient(),
          })}></div>
      </section>
    `;
  }

  onInput(e) {
    const target = e.target;
    this.value = target.value;
    this.dispatchEvent(new Event('input'));
  }

  buildGradient() {
    const numStops = 100;
    let linearGradientString = 'linear-gradient(to right';

    if (this.type === 'hue') {
      for (let i = 0; i < numStops; i++) {
        const hue = (HUE_RANGE[1] / numStops) * i;
        const hex = hexFromHct(hue, 100, 50);
        linearGradientString += `, ${hex} ${i}%`;
      }
    } else if (this.type === 'chroma') {
      const hct = hctFromHex(this.color || '#000');
      const hue = hct.hue;
      for (let i = 0; i < numStops; i++) {
        const chroma = (CHROMA_RANGE[1] / numStops) * i;
        const hex = hexFromHct(hue, chroma, 50);
        linearGradientString += `, ${hex} ${i}%`;
      }
    } else if (this.type === 'tone') {
      for (let i = 0; i < numStops; i++) {
        const tone = (TONE_RANGE[1] / numStops) * i;
        const hex = hexFromHct(0, 0, tone);
        linearGradientString += `, ${hex} ${i}%`;
      }
    }

    linearGradientString += ')';
    return linearGradientString;
  }

  static get styles() {
    return css`
      section {
        display: flex;
        flex-direction: column;
      }

      #gradient {
        height: 24px;
        border-radius: 12px;
        border: 1px solid currentColor;
        box-sizing: border-box;
      }

      #gradient.chroma {
        will-change: background;
      }

      #label,
      #gradient {
        margin-inline: calc(var(--md-slider-handle-width, 20px) / 2);
      }
    `;
  }
}

customElements.define('hct-slider', HCTSlider);
