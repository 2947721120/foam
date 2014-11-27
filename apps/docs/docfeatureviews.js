///**
// * @license
// * Copyright 2014 Google Inc. All Rights Reserved
// *
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// *
// *     http://www.apache.org/licenses/LICENSE-2.0
// *
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */



//CLASS({
//  name: 'DocFeaturesView',
//  extendsModel: 'View',
//  help: 'Displays the documentation of the given set of features.',

//  properties: [
//    {
//      name:  'data',
//      help: 'The model whose features to view.',
//      postSet: function(old, data) {
//        if (old) Events.unfollow(this.getGroupFromTarget(old), this.dao$);
//        Events.follow(this.getGroupFromTarget(data), this.dao$);
//        this.updateHTML();
//      }
//    },
//    {
//      name:  'dao',
//      model_: 'DAOProperty',
//      defaultValue: [],
//      onDAOUpdate: function() {
//        this.filteredDAO = this.dao;
//      }
//    },
//    {
//      name:  'filteredDAO',
//      model_: 'DAOProperty',
//      onDAOUpdate: function() {
//        var self = this;
//        if (!this.X.documentViewRef) {
//          console.warn("this.X.documentViewRef non-existent");
//        } else if (!this.X.documentViewRef.get()) {
//          console.warn("this.X.documentViewRef not set");
//        } else if (!this.X.documentViewRef.get().valid) {
//          console.warn("this.X.documentViewRef not valid");
//        }

//        this.filteredDAO.select(COUNT())(function(c) {
//          self.hasDAOContent = c.count > 0;
//        });

//        this.selfFeaturesDAO = [].sink;
//        this.X.docModelViewFeatureDAO
//          .where(
//                AND(AND(EQ(DocFeatureInheritanceTracker.MODEL, this.X.documentViewRef.get().resolvedRoot.resolvedModelChain[0].id),
//                        EQ(DocFeatureInheritanceTracker.IS_DECLARED, true)),
//                    CONTAINS(DocFeatureInheritanceTracker.TYPE, this.featureType()))
//                )
//          .select(MAP(DocFeatureInheritanceTracker.FEATURE, this.selfFeaturesDAO));

//        this.inheritedFeaturesDAO = [].sink;
//        this.X.docModelViewFeatureDAO
//          .where(
//                AND(AND(EQ(DocFeatureInheritanceTracker.MODEL, this.X.documentViewRef.get().resolvedRoot.resolvedModelChain[0].id),
//                        EQ(DocFeatureInheritanceTracker.IS_DECLARED, false)),
//                    CONTAINS(DocFeatureInheritanceTracker.TYPE, this.featureType()))
//                )
//          .select(MAP(DocFeatureInheritanceTracker.FEATURE, this.inheritedFeaturesDAO));

//        this.updateHTML();

//      }
//    },
//    {
//      name:  'selfFeaturesDAO',
//      model_: 'DAOProperty',
//      documentation: function() { /*
//          Returns the list of features (matching this feature type) that are
//          declared or overridden in this $$DOC{ref:'Model'}
//      */},
//      onDAOUpdate: function() {
//        var self = this;
//        this.selfFeaturesDAO.select(COUNT())(function(c) {
//          self.hasFeatures = c.count > 0;
//        });
//      }
//    },
//    {
//      name:  'inheritedFeaturesDAO',
//      model_: 'DAOProperty',
//      documentation: function() { /*
//          Returns the list of features (matching this feature type) that are
//          inherited but not declared or overridden in this $$DOC{ref:'Model'}
//      */},
//      onDAOUpdate: function() {
//        var self = this;
//        this.inheritedFeaturesDAO.select(COUNT())(function(c) {
//          self.hasInheritedFeatures = c.count > 0;
//        });
//      }
//    },
//    {
//      name: 'hasDAOContents',
//      defaultValue: false,
//      postSet: function(_, nu) {
//        this.updateHTML();
//      },
//      documentation: function() { /*
//          True if the $$DOC{ref:'.filteredDAO'} is not empty.
//      */}
//    },
//    {
//      name: 'hasFeatures',
//      defaultValue: false,
//      postSet: function(_, nu) {
//        this.updateHTML();
//      },
//      documentation: function() { /*
//          True if the $$DOC{ref:'.selfFeaturesDAO'} is not empty.
//      */}
//    },
//    {
//      name: 'hasInheritedFeatures',
//      defaultValue: false,
//      postSet: function(_, nu) {
//        this.updateHTML();
//      },
//      documentation: function() { /*
//          True if the $$DOC{ref:'.inheritedFeaturesDAO'} is not empty.
//      */}
//    },
//    {
//      name: 'rowView',
//      help: 'Override this to specify the view to use to display each feature.',
//      factory: function() { return 'DocFeatureRowView'; }
//    },
//    {
//      name: 'tagName',
//      defaultValue: 'div'
//    },
//  ],

//  templates: [
//    function toInnerHTML()    {/*
//    <%    this.destroy();
//          if (!this.hasFeatures && !this.hasInheritedFeatures) { %>
//            <p class="feature-type-heading">No <%=this.featureName()%>.</p>
//    <%    } else {
//            if (this.hasFeatures) { %>
//              <p class="feature-type-heading"><%=this.featureName()%>:</p>
//              <div class="memberList">$$selfFeaturesDAO{ model_: 'DAOListView', rowView: this.rowView, data: this.selfFeaturesDAO, model: Property }</div>
//      <%    }
//            if (this.hasInheritedFeatures) { %>
//              <p class="feature-type-heading">Inherited <%=this.featureName()%>:</p>
//      <%
//              var fullView = this.X.DAOListView.create({ rowView: this.rowView, model: Property });
//              var collapsedView = this.X.DocFeatureCollapsedView.create();
//              %>
//              <div class="memberList inherited">$$inheritedFeaturesDAO{ model_: 'CollapsibleView', data: this.inheritedFeaturesDAO, collapsedView: collapsedView, fullView: fullView, showActions: true }</div>
//      <%    } %>
//    <%    } %>
//    */}
//  ],

//  methods: {
//    getGroupFromTarget: function(target) {
//      // implement this to return your desired feature (i.e target.properties$)
//      console.assert(false, 'DocFeaturesView.getGroupFromTarget: implement me!');
//    },
//    featureName: function() {
//      // implement this to return the display name of your feature (i.e. "Properties")
//      console.assert(false, 'DocFeaturesView.featureName: implement me!');
//    },
//    featureType: function() {
//      // implement this to return Model property name (i.e. "properties", "methods", etc.)
//      console.assert(false, 'DocFeaturesView.featureType: implement me!');
//    }
//  }

//});

//CLASS({
//  name: 'DocFeatureCollapsedView',
//  extendsModel: 'DocBodyView',
//  help: 'A generic view for collapsed sets.',

//  properties: [
//    {
//      name: 'data',
//      postSet: function() {
//        this.dao = this.data;
//      }
//    },
//    {
//      name:  'dao',
//      model_: 'DAOProperty',
//      defaultValue: [],
//      onDAOUpdate: function() {
//        var self = this;
//        this.dao.select(COUNT())(function(c) {
//          self.count = c.count;
//        });
//      }
//    },
//    {
//      name: 'count'
//    }
//  ],

//  templates: [
//    function toInnerHTML() {/*
//      <p><%=this.count%> more...</p>
//    */}
//  ]
//});


CLASS({
  name: 'DocFeatureView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.DocView',
  help: 'A generic view for each item in a list of documented features.',

  requires: ['foam.documentation.DocFeatureInheritanceTracker as DocFeatureInheritanceTracker'],

  imports: ['featureDAO'],

  properties: [
    {
      name: 'overridesDAO',
      model_: 'DAOProperty',
      defaultValue: []
    },
    {
      name: 'extraClassName',
      defaultValue: 'feature-row'
    },
    {
      name: 'tagName',
      defaultValue: 'div'
    },

  ],

  methods: {
    init: function() {
      this.SUPER();
      // TODO: do this on postSet instead of pipe?
      this.overridesDAO = [];
      this.featureDAO
          .where(
                AND(EQ(this.DocFeatureInheritanceTracker.NAME, this.data.name),
                    EQ(this.DocFeatureInheritanceTracker.IS_DECLARED, true))
          )
          .orderBy(DESC(this.DocFeatureInheritanceTracker.INHERITANCE_LEVEL))
          .pipe(this.overridesDAO);
    }
  },

  templates: [
    function toInnerHTML() {/*
      <div id="scrollTarget_<%=this.data.name%>">
        <p class="feature-heading"><%=this.data.name%></p>
        <p>$$documentation{ model_: 'foam.documentation.DocBodyView' }</p>
<!--        <p class="inheritance-info">Declared in: $$overridesDAO{ model_: 'DAOListView', rowView: 'foam.documentation.DocFeatureOverridesRefView', model: this.X.foam.documentation.DocFeatureInheritanceTracker }</p> -->
      </div>
    */}
  ]
});

CLASS({
  name: 'DocFeatureOverridesRefView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.DocRefView',
  label: 'Documentation Feature Overrides Reference Link View',
  help: "The view of a documentation reference link based on a Model's overrides.",

  documentation: function() { /*
    <p>An inline link to another place in the documentation. See $$DOC{ref:'DocView'}
    for notes on usage.</p>
    */},

  properties: [
    {
      name: 'data',
      help: 'Shortcut to set reference by Model name.',
      postSet: function() {
        this.ref = this.data.model + "." + this.data.name;
        this.text = this.data.model + " / ";
      },
      documentation: function() { /*
        The target reference Model definition. Use this instead of setting
        $$DOC{ref:'.docRef'}, if you are referencing a $$DOC{ref:'Model'}.
        */}
    },
  ],
});
CLASS({
  name: 'DocFeatureSubmodelRefView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.DocRefView',
  label: 'Documentation Feature Model Link Reference View',
  help: 'The view of a documentation reference link based on a Model.',

  documentation: function() { /*
    <p>An inline link to another place in the documentation. See $$DOC{ref:'DocView'}
    for notes on usage.</p>
    */},

  properties: [
    {
      name: 'data',
      help: 'Shortcut to set reference by Model name.',
      postSet: function() {
        this.ref = "."+this.data.name;
      },
      documentation: function() { /*
        The target reference Model definition. Use this instead of setting
        $$DOC{ref:'.docRef'}, if you are referencing a $$DOC{ref:'Model'}.
        */}
    },
  ],
});


//CLASS({
//  name: 'DocPropertiesView',
//  extendsModel: 'DocFeaturesView',
//  help: 'Displays the documentation of the given Properties.',

//  properties: [
//    {
//      name:  'dao', // filter out hidden properties
//      model_: 'DAOProperty',
//      onDAOUpdate: function() {
//        this.filteredDAO = this.dao.where(EQ(Property.HIDDEN, FALSE));
//      }
//    },
//    {
//      name: 'rowView',
//      factory: function() { return 'DocPropertyRowView'; }
//    }
//  ],

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.properties$;
//    },
//    featureName: function() {
//      return "Properties";
//    },
//    featureType: function() {
//      return "properties";
//    }
//  }

//});

CLASS({
  name: 'PropertyRowDocView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.DocFeatureView',
  help: 'A view for documentation of each item in a list of properties.',

  templates: [
    function toInnerHTML() {/*
      <div id="scrollTarget_<%=this.data.name%>">
        <p><span class="feature-heading"><%=this.data.name%></span>
           <span class="feature-type">($$DOC{ref:this.data.type.replace('[]',''), text:this.data.type})</span></p>
        <p>$$documentation{ model_: 'foam.documentation.DocBodyView' }</p>
<!--        <p class="inheritance-info">Declared in: $$overridesDAO{ model_: 'DAOListView', rowView: 'foam.documentation.DocFeatureOverridesRefView', model: this.X.foam.documentation.DocFeatureInheritanceTracker }</p> -->
      </div>
    */}
  ]
});


CLASS({
  name: 'MethodRowDocView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.DocFeatureView',
  help: 'A view for documentation of each item in a list of methods.',
});
CLASS({
  name: 'RelationshipRowDocView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.DocFeatureView',
  help: 'A view for documentation of each item in a list of methods.',
});
CLASS({
  name: 'IssueRowDocView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.DocFeatureView',
  help: 'A view for documentation of each item in a list of methods.',
});
CLASS({
  name: 'TemplateRowDocView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.DocFeatureView',
  help: 'A view for documentation of each item in a list of methods.',
});
CLASS({
  name: 'ActionRowDocView',
  package: 'foam.documentation',
  extendsModel: 'foam.documentation.DocFeatureView',
  help: 'A view for documentation of each item in a list of methods.',
});

//CLASS({
//  name: 'DocRelationshipsView',
//  extendsModel: 'DocFeaturesView',
//  help: 'Displays the documentation of the given Relationships.',

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.relationships$;
//    },
//    featureName: function() {
//      return "Relationships";
//    },
//    featureType: function() {
//      return "relationships";
//    },
//  }

//});


//CLASS({
//  name: 'DocActionsView',
//  extendsModel: 'DocFeaturesView',
//  help: 'Displays the documentation of the given Actions.',

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.actions$;
//    },
//    featureName: function() {
//      return "Actions";
//    },
//    featureType: function() {
//      return "actions";
//    },
//  }

//});

//CLASS({
//  name: 'DocListenersView',
//  extendsModel: 'DocMethodsView',
//  help: 'Displays the documentation of the given Listeners.',

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.listeners$;
//    },
//    featureName: function() {
//      return "Listeners";
//    },
//    featureType: function() {
//      return "listeners";
//    },
//  }

//});

//CLASS({
//  name: 'DocTemplatesView',
//  extendsModel: 'DocFeaturesView',
//  help: 'Displays the documentation of the given Templates.',

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.templates$;
//    },
//    featureName: function() {
//      return "Templates";
//    },
//    featureType: function() {
//      return "templates";
//    },
//  }

//});


//CLASS({
//  name: 'DocIssuesView',
//  extendsModel: 'DocFeaturesView',
//  help: 'Displays the documentation of the given Issues.',

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.issues$;
//    },
//    featureName: function() {
//      return "Issues";
//    },
//    featureType: function() {
//      return "issues";
//    },
//  }

//});


//CLASS({
//  name: 'DocMethodsView',
//  extendsModel: 'DocFeaturesView',
//  help: 'Displays the documentation of the given Methods.',

//  properties: [
//    {
//      name: 'rowView',
//      help: 'Override this to specify the view to use to display each feature.',
//      factory: function() { return 'DocMethodRowView'; }
//    }
//  ],

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.methods$;
//    },
//    featureName: function() {
//      return "Methods";
//    },
//    featureType: function() {
//      return "methods";
//    },
//  }

//});

//CLASS({
//  name: 'DocMethodRowView',
//  extendsModel: 'DocFeatureRowView',
//  help: 'A view for each item in a list of documented Methods, including arguments.',

//  templates: [
//    function toInnerHTML() {/*
//      <div id="scrollTarget_<%=this.data.name%>">
//        <p class="feature-heading"><%=this.data.name%> $$THISDATA{ model_: 'DocMethodArgumentsSmallView' }</p>
//        <div class="memberList">$$THISDATA{ model_: 'DocMethodArgumentsView' }</div>
//        <p><%=this.renderDocSourceHTML()%></p>
//        <p class="inheritance-info">Declared in: $$overridesDAO{ model_: 'DAOListView', rowView: 'DocFeatureOverridesRefView', data: this.overridesDAO, model: Model }</p>
//      </div>
//    */}
//  ]
//});

//CLASS({
//  name: 'DocMethodArgumentsView',
//  extendsModel: 'DocFeaturesView',
//  help: 'Displays the documentation of the given Method Arguments. Data should be a Method.',

//  properties: [
//    {
//      name: 'rowView',
//      help: 'Override this to specify the view to use to display each feature.',
//      factory: function() { return 'DocMethodArgumentRowView'; }
//    }
//  ],

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.args$;
//    },
//    featureName: function() {
//      return "Arguments";
//    },
//    featureType: function() {
//      return "args";
//    },
//  },

//  templates: [
//    function toInnerHTML()    {/*
//    <%    this.destroy();
//          if (!this.hasDAOContent) { %>
//    <%    } else { %>
//            <p class="feature-sub-heading"><%=this.featureName()%>:</p>
//            <div class="memberList">$$filteredDAO{ model_: 'DAOListView', rowView: this.rowView, data: this.filteredDAO, model: Arg }</div>
//    <%    } %>
//    */}
//  ],
//});

//CLASS({
//  name: 'DocMethodArgumentRowView',
//  extendsModel: 'DocBodyView',
//  help: 'A view for each item in a list of Args.',

//  templates: [
//    function toInnerHTML() {/*
//      <p class="feature-sub-heading"><%=this.data.name%></p>
//      <p><%=this.renderDocSourceHTML()%></p>
//    */}
//  ]
//});

//CLASS({
//  name: 'DocMethodArgumentsSmallView',
//  extendsModel: 'DocMethodArgumentsView',
//  help: 'Displays the documentation of the given Method Arguments. Data should be a Method.',

//  properties: [
//    {
//      name: 'rowView',
//      help: 'Override this to specify the view to use to display each feature.',
//      factory: function() { return 'DocMethodArgumentSmallRowView'; }
//    },
//    {
//      name: 'tagName',
//      defaultValue: 'span'
//    }

//  ],

//  templates: [
//    function toInnerHTML()    {/*<%
//          this.destroy();
//          if (this.hasDAOContent) {
//            %>(<span>$$filteredDAO{ model_: 'DAOListView', rowView: this.rowView, data: this.filteredDAO, model: Arg }</span>)<%
//          } else {
//            %>()<%
//          }
//    %>*/}
//  ],
//});

//CLASS({
//  name: 'DocMethodArgumentSmallRowView',
//  extendsModel: 'DocBodyView',
//  help: 'An in-line view for each item in a list of Args.',

//  templates: [
//    function toInnerHTML() {/* <%=this.data.name%> */}
//  ]
//});



//CLASS({
//  name: 'DocChaptersView',
//  extendsModel: 'DocFeaturesView',
//  help: 'Displays the contents of the given Chapters.',

//  properties: [
//    {
//      name: 'rowView',
//      help: 'Override this to specify the view to use to display each feature.',
//      factory: function() { return 'DocBookView'; }
//    }
//  ],

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.documentation.chapters$;
//    },
//    featureName: function() {
//      return "Chapters";
//    },
//    featureType: function() {
//      return "documentation";
//    },
//  },

//  templates: [
//    function toInnerHTML()    {/*
//    <%    this.destroy();
//          if (!this.hasDAOContent) { %>
//    <%    } else { %>
//            <div class="memberList">$$filteredDAO{ model_: 'DAOListView', rowView: this.rowView, data: this.filteredDAO, model: this.X.Documentation }</div>
//    <%    } %>
//    */}
//  ]
//});


//CLASS({
//  name: 'DocInnerModelsView',
//  extendsModel: 'DocFeaturesView',
//  help: 'Displays the documentation of the given inner Models.',

//  properties: [
//    {
//      name: 'rowView',
//      help: 'Override this to specify the view to use to display each feature.',
//      factory: function() { return 'DocInnerModelsRowView'; }
//    }
//  ],

//  methods: {
//    getGroupFromTarget: function(target) {
//      return target.models$;
//    },
//    featureName: function() {
//      return "Inner Models";
//    },
//    featureType: function() {
//      return "models";
//    },
//  },

//  templates: [
//    function toInnerHTML()    {/*
//    <%    this.destroy();
//          if (!this.hasFeatures && !this.hasInheritedFeatures) { %>

//    <%    } else {
//            if (this.hasFeatures) { %>
//              <p class="feature-type-heading"><%=this.featureName()%>:</p>
//              <div class="memberList">$$selfFeaturesDAO{ model_: 'DAOListView', rowView: this.rowView, data: this.selfFeaturesDAO, model: Model }</div>
//      <%    }
//            if (this.hasInheritedFeatures) { %>
//              <p class="feature-type-heading">Inherited <%=this.featureName()%>:</p>
//      <%
//              var fullView = this.X.DAOListView.create({ rowView: this.rowView, model: Property });
//              var collapsedView = this.X.DocFeatureCollapsedView.create();
//              %>
//              <div class="memberList inherited">$$inheritedFeaturesDAO{ model_: 'CollapsibleView', data: this.inheritedFeaturesDAO, collapsedView: collapsedView, fullView: fullView, showActions: true }</div>
//      <%    } %>
//    <%    } %>
//    */}
//  ]

//});

//CLASS({
//  name: 'DocInnerModelsRowView',
//  extendsModel: 'DocFeatureRowView',
//  help: 'A view for each item in a list of documented Methods, including arguments.',

//  templates: [
//    function toInnerHTML() {/*
//      <div id="scrollTarget_<%=this.data.id%>">
//        <p class="feature-heading">$$data{model_:this.X.DocFeatureSubmodelRefView}</p>
//        <p><%=this.renderDocSourceHTML()%></p>
//      </div>
//    */}
//  ]
//});

