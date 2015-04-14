/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  name: 'CheckboxView',
  package: 'foam.ui.md',
  extendsModel: 'foam.ui.SimpleView',
  requires: ['foam.ui.md.HaloView'],

  properties: [
    {
      name: 'data',
      type: 'Boolean',
      view: 'foam.ui.BooleanView',
    },
    {
      model_: 'foam.core.types.StringEnumProperty',
      name: 'mode',
      defaultValue: 'read-write',
      choices: ['read-write', 'read-only', 'final']
    },
    {
      name: 'enabled',
      type: 'Boolean',
      view: 'foam.ui.BooleanView',
      defaultValue: true,
    },
    {
      name: 'label',
      type: 'String',
    },
    {
      name: 'className',
      defaultValue: 'checkbox-container'
    },
    {
      name: 'halo',
      factory: function() {
        return this.HaloView.create();
      }
    },
  ],
  templates: [
    function CSS() {/*
      .checkbox-container {
        display: flex;
        align-items: center;
        padding: 12px 10px;
      }

      .checkbox-label {
        flex-grow: 1;
      }

      .checkbox-data-outer {
        position: relative;
        width: 48px;
        height: 48px;
        cursor: pointer;
      }

      .noselect {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .checkbox-data-container {
        border-radius: 2px;
        border: solid 2px #5a5a5a;
        box-sizing: border-box;
        display: inline-block;
        height: 18px;
        pointer-events: none;
        position: absolute;
        left: 15px;
        top: 15px;
        transition: background-color 140ms, border-color 140ms;
        width: 18px;
        opacity: 0.3;
      }

      .checkbox-container.enabled .checkbox-data-container {
        opacity: 1.0;
      }

      .checkbox-container.checked .checkbox-data-container {
        background-color: #04A9F4;
        border-color: #04A9F4;
      }

      .checkbox-data {
        transform: rotate(45deg);
        width: 5px;
        height: 10px;
        border-style: solid;
        border-top: none;
        border-left: none;
        border-right-width: 2px;
        border-bottom-width: 2px;
        border-color: white;
        margin: auto;
        margin-top: -1px;
        -webkit-animation: checkmark-expand 140ms ease-out forwards;
      }



      .checkbox-label-ro {
        margin-left: 10px;
      }

      .checkbox-data-ro {
        color: #9e9e9e;
        font-size: 150%;
        visibility: hidden;
      }
      .checked .checkbox-data-ro {
        visibility: visible;
      }
    */},
    function toHTML() {/*
      <% if (this.mode === 'read-only') { %>
        <div id="%%id" <%= this.cssClassAttr() %>>
          <div class="checkbox-data-ro">&#x2713;</div>
          <div class="checkbox-label-ro"><%= this.label %></div>
        </div>
        <% this.setClass('checked', function() { return !!self.data; },
            this.id); %>
      <% } else { %>
        <div id="%%id" <%= this.cssClassAttr() %>>
          <span class="checkbox-label noselect"><%# this.label %></span>
          <div class="checkbox-data-outer noselect">
            <div class="checkbox-data-container">
              <div class="checkbox-data"></div>
            </div>
            <%= this.halo %>
          </div>
        </div>
        <%
          this.on('click', function() {
            if (self.enabled) {
              self.data = !self.data;
            }
          }, this.id);
          this.setClass('checked', function() { return !!self.data; }, this.id);
          this.setClass('enabled', function() { return !!self.enabled; },
              this.id);
        %>
      <% } %>
    */}
  ]
});
