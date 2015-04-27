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
  package: 'foam.ui',
  name: 'PropertyView',
  extendsModel: 'foam.ui.AsyncViewLoader',

  documentation: function() {/*
    Apply this trait to a $$DOC{ref:'BaseView'} (such as $$DOC{ref:'HTMLView'}).</p>
    <p>Used by $$DOC{ref:'foam.ui.DetailView'} to generate a sub-$$DOC{ref:'foam.ui.View'} for one
    $$DOC{ref:'Property'}. The $$DOC{ref:'foam.ui.View'} chosen can be based off the
    $$DOC{ref:'Property.view',text:'Property.view'} value, the $$DOC{ref:'.innerView'} value, or
    $$DOC{ref:'.args'}.model_.
  */},

  properties: [
    {
      name: 'prop',
      type: 'Property',
      documentation: function() {/*
          The $$DOC{ref:'Property'} for which to generate a $$DOC{ref:'foam.ui.View'}.
      */},
      postSet: function(old, nu) {
        if ( old && this.bound_ ) this.unbindData(this.data);
        if ( nu && ! this.bound_ ) this.bindData(this.data);
      }
    },
    {
      name: 'data',
      documentation: function() {/*
          The $$DOC{ref:'.data'} for which to generate a $$DOC{ref:'foam.ui.View'}.
      */},
      postSet: function(old, nu) {
        if ( old && this.bound_ ) this.unbindData(old);
        if ( nu ) this.bindData(nu);
      }
    },
    {
      name: 'childData'
    }
    {
      name: 'innerView',
      help: 'Override for prop.view',
      documentation: function() {/*
        The optional name of the desired sub-$$DOC{ref:'foam.ui.View'}. If not specified,
        prop.$$DOC{ref:'Property.view'} is used.
      */},
      postSet: function(old,nu) {
        this.model = nu;
      }
    },
    {
      name: 'view',
      type: 'foam.ui.View',
      adapt: function(_, v) { return v && v.toView_ ? v.toView_() : v; },
      documentation: function() {/*
        The new sub-$$DOC{ref:'foam.ui.View'} generated for the given $$DOC{ref:'Property'}.
      */}
    },
    {
      name: 'args',
      documentation: function() {/*
        Optional arguments to be used for sub-$$DOC{ref:'foam.ui.View'} creation.
      */}
    },
    {
      name: 'bound_',
      model_: 'BooleanProperty',
      defaultValue: false
    }
  ],

  methods: {
    unbindData: function(oldData) {
      if ( ! this.bound_ || ! oldData || ! this.prop ) return;
      var pValue = oldData.propertyValue(this.prop.name);
      Events.unlink(pValue, this.childData$);
      this.bound_ = false;
    },

    bindData: function(data) {
      if ( this.bound_ || ! data || ! this.prop) return;
      var pValue = data.propertyValue(this.prop.name);
      Events.link(pValue, this.childData$);
      this.bound_ = true;
    },

    toString: function() { /* Name info. */ return 'PropertyView(' + this.prop.name + ', ' + this.view + ')'; },

    destroy: function( isParentDestroyed ) { /* Passthrough to $$DOC{ref:'.view'} */
      // always unbind, since if our parent was the top level destroy we need
      // to unhook if we were created as an addSelfDataChild
      this.unbindData(this.data);
      this.SUPER( isParentDestroyed );
    },

    construct: function() {
      // if not bound yet and we do have data set, bind it
      this.bindData(this.data);
      this.SUPER();
    },

    finishRender: function() {
      this.SUPER();
      this.view.prop = this.prop;
    },

    addDataChild: function(child) {
      Events.link(this.childData$, child.data$);
      this.addChild(child);
    }
  }

});
