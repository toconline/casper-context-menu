/*
  - Copyright (c) 2018 Cloudware S.A. All rights reserved.
  -
  - This file is part of casper-context-menu.
  -
  - casper-context-menu is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as published by
  - the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - casper-context-menu  is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with casper-context-menu.  If not, see <http://www.gnu.org/licenses/>.
  -
 */

import './casper-menu-item.js';
import './casper-menu-separator.js';
import '@polymer/paper-listbox/paper-listbox.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { CasperOverlayBehavior } from '@toconline/casper-overlay-behavior/casper-overlay-behavior.js';

class CasperContextMenu extends mixinBehaviors(CasperOverlayBehavior, PolymerElement) {
  static get template () {
    return html`
      <style>
        :host {
          overflow: hidden;
          background: var(--primary-background-color, white);
          border-radius: var(--radius-primary, 6px);
          box-shadow: rgba(0, 0, 0, 0.24) -2px 5px 12px 0px,
                      rgba(0, 0, 0, 0.12) 0px 0px 12px 0px;

        }

        paper-listbox {
          border-radius: var(--radius-primary, 6px);
          padding: 0px;
        }

      </style>
      <paper-listbox>
        <slot></slot>
      </paper-listbox>
  `;
  }

  static get is () {
    return 'casper-context-menu';
  }

  /**
   * Install click listener to implememt auto close
   */
  ready () {
    super.ready();
    this.addEventListener('click', (e) => this._onTap(e));

    this.addEventListener('mouseenter', () => {
      this.style.transition = '';
      this.style.opacity = 1;
      clearTimeout(this.__animationTimeout);
      clearTimeout(this.__animationDelayTimeout);
    });

    const animationDuration = 500;
    this.addEventListener('mouseleave', () => {
      // Delay the beginning of the animation.
      this.__animationDelayTimeout = setTimeout(() => {
        this.style.transition = `opacity ${animationDuration}ms linear`;
        this.style.opacity = 0;

        this.__animationTimeout = setTimeout(() => {
          this.close();
          this.style.opacity = 1;
        }, animationDuration);
      }, animationDuration);
    });
  }

  /**
   * Autohide the menu when it's clicked
   *
   * @param {Object} event the click event
   */
  _onTap (event) {
    setTimeout((e) => this.close(), 0); // Use timeout to call close() outside of original event callstack
  }
}

customElements.define(CasperContextMenu.is, CasperContextMenu);
