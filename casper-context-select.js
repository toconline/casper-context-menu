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

import '@toconline/casper-common-ui/casper-overlay.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class CasperContextSelect extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          /* display: flex; */
          display: inline-block;
        }

        :host([opened]) {
          background-color: green;
        }

        #trigger {
          color: black;
          /* background-color: yellow; */
        }

        #trigger:hover{
          cursor: pointer;
          /* background-color: yellow; */
          color: var(--primary-color);
        }

        :host #list_slot {
          /* width: 200px; */
          /* display: flex; */
        }

      </style>

      <div id="trigger">
        <slot name="trigger"></slot>
      </div>

      <casper-overlay id="list" scroll-action="lock" no-overlap="" vertical-align="[[vertical_align]]" horizontal-align="[[horizontal_align]]">
        <slot name="list"></slot>
      </casper-overlay>
    `;
  }

  static get is () {
    return 'casper-context-select';
  }

  static get properties () {
    return {
      vertical_align: {
        value: 'auto'
      },
      horizontal_align: {
        value: 'left'
      },
      closable: {
        value: 'true' // close
      },
      opening: {
        value: undefined
      }
    }
  }

  customclick(e){
    var level = Number(e.target.getAttribute("data-level"));
    var text = e.target.text;
    this.innerText = text;
    this.$.list.close();
  }

  _openList(){
    clearTimeout(this.opening);
    this.$.list.open()
  }

  _delayHide(e){
    this.opening = setTimeout(function(){
      this.$.list.close();
    }.bind(this), 300)
  }


  ready () {
    super.ready();

    this.$.trigger.addEventListener('click',     e => this._openList());
    this.$.trigger.addEventListener('mouseover', e => this._openList());
    this.$.trigger.addEventListener('mouseout',  e => this._delayHide());

    this.$.list.addEventListener('mouseover',   e => this._openList());
    this.$.list.addEventListener('mouseout',    e => this.$.list.close());

    if(this.closable != 'false'){
      this.$.list.addEventListener('click',     e => this._mustClose(e));
    }
  }

  _mustClose(e){
    this.$.list.close();
  }

  connectedCallback () {
    super.connectedCallback();
    // this.$.list_slot.style.width = '500px';
    // this.$.list.style.display = 'none';
  }
}

window.customElements.define(CasperContextSelect.is, CasperContextSelect);
