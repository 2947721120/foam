/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
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
  package: 'foam.ui.search',
  name: 'GroupBySearchView',
  extendsModel: 'foam.ui.View',

  label: 'GroupBy Search View',

  requires: [ 'foam.ui.ChoiceView' ],

  properties: [
    {
      name: 'view',
      type: 'view',
      factory: function() { return foam.ui.ChoiceView.create({size:this.size, cssClass: 'foamSearchChoiceView'}); }
    },
    {
      name:  'width',
      type:  'int',
      defaultValue: 47
    },
    {
      name:  'size',
      type:  'int',
      defaultValue: 17
    },
    {
      name:  'dao',
      label: 'DAO',
      type: 'DAO',
      required: true,
      postSet: function() {
        if ( this.view.id ) this.updateDAO();
      }
    },
    {
      name: 'property',
      type: 'Property'
    },
    {
      name: 'filter',
      type: 'Object',
      defaultValue: TRUE
    },
    {
      name: 'predicate',
      type: 'Object',
      defaultValue: TRUE
    },
    {
      name: 'label',
      type: 'String',
      defaultValueFn: function() { return this.property.label; }
    }
  ],

  methods: [
    function toHTML() {
      return '<div class="foamSearchView">' +
        '<div class="foamSearchViewLabel">' +
        this.label +
        '</div>' +
        this.view.toHTML() +
        '</div>';
    },
    function initHTML() {
      this.view.initHTML();

      //       Events.dynamic(function() { this.view.value; }, console.log.bind(console));
      Events.dynamic(function() { this.dao; }, this.updateDAO);
      this.propertyValue('filter').addListener(this.updateDAO);
      /*
        this.propertyValue('filter').addListener((function(a,b,oldValue,newValue) {
        this.updateDAO();
        }).bind(this));
      */
      this.view.data$.addListener(this.updateChoice);

      //       this.updateDAO();
      //       this.view.addListener(console.log.bind(console));
      //       this.view.value.addListener(console.log.bind(console));
    }
  ],

  listeners: [
    {
      name: 'updateDAO',

      code: function() {
        var self = this;

        this.dao.where(this.filter).select(GROUP_BY(this.property, COUNT()))(function(groups) {
          var options = [];
          for ( var key in groups.groups ) {
            var count = ('(' + groups.groups[key] + ')').intern();
            var subKey = key.substring(0, self.width-count.length-3);
            var cleanKey = subKey.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            options.push([key, cleanKey + (Array(self.width-subKey.length-count.length).join('&nbsp;')).intern() + count]);
          }
          options.sort();
          options.splice(0,0,['','-- CLEAR SELECTION --']);
          self.view.choices = options;
          // console.log(groups.groups, options);
        });
      }
    },
    {
      name: 'updateChoice',

      code: function(_, _, _, choice) {
        this.predicate = choice ? EQ(this.property, choice) : TRUE ;
      }
    }
  ]
});
