/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
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
  name: 'DetailView',
  package: 'foam.ui',

  traits: ['foam.patterns.ChildTreeTrait',
           'foam.ui.DestructiveDataViewTrait',
           'foam.ui.HTMLViewTrait',
           'foam.ui.ViewActionsTrait',
           'foam.ui.TemplateSupportTrait'],
  
  requires: [ 'Property', 'foam.ui.RelationshipsView' ],
  exports: [ 'propertyViewProperty' ],

  documentation:function() {/*
    When a default view based on $$DOC{ref:'Property'} values is desired, $$DOC{ref:'DetailView'}
    is the place to start. Either using $$DOC{ref:'DetailView'} directly, implementing
    a .toDetailHTML() $$DOC{ref:'Method'} in your model, or extending
    $$DOC{ref:'DetailView'} to add custom formatting.
    </p>
    <p>Set the $$DOC{ref:'.data'} $$DOC{ref:'Property'} to the $$DOC{ref:'Model'} instance
    you want to display. $$DOC{ref:'DetailView'} will extract the $$DOC{ref:'Model'}
    definition, create editors for the $$DOC{ref:'Property',usePlural:true}, and
    display the current values of your instance. Set $$DOC{ref:'.mode',usePlural:true}
    to indicate read-only if desired.
    </p>
    <p>$$DOC{ref:'Model',usePlural:true} may specify a .toDetailHTML() $$DOC{ref:'Method'} or
    $$DOC{ref:'Template'} to render their contents instead of
    $$DOC{ref:'DetailView.defaultToHTML'}.
    </p>
    <p>For each $$DOC{ref:'Property'} in the $$DOC{ref:'.data'} instance specified,
    a $$DOC{ref:'PropertyView'} is created that selects the appropriate $$DOC{ref:'View'}
    to construct.
  */},

  properties: [
    {
      name:  'model',
      type:  'Model',
    },
    {
      name: 'title',
      defaultValueFn: function() { return "Edit " + this.model.label; },
      documentation: function() {/*
        <p>The display title for the $$DOC{ref:'View'}.
        </p>
      */}
    },
    {
      model_: 'StringProperty',
      name: 'mode',
      defaultValue: 'read-write',
      documentation: function() {/*
        The editing mode. To disable editing set to 'read-only'.
      */}
    },
    {
      model_: 'BooleanProperty',
      name: 'showRelationships',
      defaultValue: false,
      documentation: function() {/*
        Set true to create sub-views to display $$DOC{ref:'Relationship',usePlural:true}
        for the $$DOC{ref:'.model'}.
      */}
    },
    {
      name: 'propertyViewProperty',
      type: 'Property',
      defaultValueFn: function() { return this.Property.DETAIL_VIEW; }
    }
  ],

  methods: {
    // Template Method
    onValueChange_: function() { /* Override with value update code. */ },

    onDataChange: function(old, nu) {
      this.model = nu.model_;
      this.SUPER(old,nu);
      this.onValueChange_();
    },
    
    shouldDestroy: function(old,nu) {
      if ( ! old || ! old.model_ || ! nu || ! nu.model_ ) return true;
      return old.model_ !== nu.model_;
    },

    titleHTML: function() {
      /* Title text HTML formatter */
      var title = this.title;

      return title ?
        '<tr><th colspan=2 class="heading">' + title + '</th></tr>' :
        '';
    },

    startForm: function() { /* HTML formatter */ return '<table>'; },
    endForm: function() { /* HTML formatter */ return '</table>'; },

    startColumns: function() { /* HTML formatter */ return '<tr><td colspan=2><table valign=top><tr><td valign=top><table>'; },
    nextColumn:   function() { /* HTML formatter */ return '</table></td><td valign=top><table valign=top>'; },
    endColumns:   function() { /* HTML formatter */ return '</table></td></tr></table></td></tr>'; },

    rowToHTML: function(prop, view) {
      /* HTML formatter for each $$DOC{ref:'Property'} row. */
      var str = "";

      if ( prop.detailViewPreRow ) str += prop.detailViewPreRow(this);

      str += '<tr class="detail-' + prop.name + '">';
      if ( DAOController.isInstance(view) ) {
        str += "<td colspan=2><div class=detailArrayLabel>" + prop.label + "</div>";
        str += view.toHTML();
        str += '</td>';
      } else {
        str += "<td class='label'>" + prop.label + "</td>";
        str += '<td>';
        str += view.toHTML();
        str += '</td>';
      }
      str += '</tr>';

      if ( prop.detailViewPostRow ) str += prop.detailViewPostRow(this);

      return str;
    },

    // If the Model supplies a toDetailHTML method, then use it instead.
    toHTML: function() {
      /* Overridden to create the complete HTML content for the $$DOC{ref:'View'}.</p>
         <p>$$DOC{ref:'Model',usePlural:true} may specify a .toDetailHTML() $$DOC{ref:'Method'} or
         $$DOC{ref:'Template'} to render their contents instead of the
          $$DOC{ref:'DetailView.defaultToHTML'} we supply here.
      */

      if ( ! this.model ) throw "DetailView: either 'data' or 'model' must be specified.";

      return (this.model.getPrototype().toDetailHTML || this.defaultToHTML).call(this);
    },

    defaultToHTML: function() {
      /* For $$DOC{ref:'Model',usePlural:true} that don't supply a .toDetailHTML()
        $$DOC{ref:'Method'} or $$DOC{ref:'Template'}, a default listing of
        $$DOC{ref:'Property'} editors is implemented here.
        */
      this.children = [];
      var model = this.model;
      var str  = "";

      str += '<div id="' + this.id + '" ' + this.cssClassAttr() + '" name="form">';
      str += this.startForm();
      str += this.titleHTML();

      for ( var i = 0 ; i < model.properties.length ; i++ ) {
        var prop = model.properties[i];

        if ( prop.hidden ) continue;

        var view = this.createView(prop);
        view.data$ = this.data$;
        str += this.rowToHTML(prop, view);
      }

      str += this.endForm();

      if ( this.showRelationships ) {
        var view = this.RelationshipsView.create({
          data: this.data
        });
        view.data$ = this.data$;
        str += view.toHTML();
        this.addChild(view);
      }

      str += '</div>';

      return str;
    }
  }
});


