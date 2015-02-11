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
 


// CLASS({
//   name: 'InheritedProperty',
//   extendsModel: 'Property',
//   package: 'foam.views',
//   traits: ['foam.patterns.InheritedPropertyTrait']
// });

// CLASS({
//   name: 'ContextMutableProperty',
//   extendsModel: 'Property',
//   package: 'foam.views',
//   traits: ['foam.patterns.ContextMutablePropertyTrait']
// });





// // View
// CLASS({
//   name: 'DataProviderTrait',
//   package: 'foam.views',
  
//   documentation: function() {/*
//     Trait for providers of a data property. It contains a $$DOC{ref:'.data'}
//     property and exports it by reference to the context.
//   */},
  
//   //exports: ['childDataValue as data$'],
  
//   properties: [
//     {
//       name: 'childData',
//       help: 'Child data value provided to consumers.',
//       documentation: function() {/* 
//         The value provided to consumers child (children) of this provider.
//       */},
//     },
//     {
//       name: 'childX',
//       factory: function() {
//         // juggle context and export data$
//         return this.X.sub({data$: this.childDataValue});
//       }
//     }
//   ],

//   methods: {
      
//     destroy: function() {
//       /* Called to tear down children. Also let the previous child context
//         be garbage collected. */
//       this.childX = this.X.sub();
//       if (arguments.callee.caller.super_) this.SUPER();
//     },
    
//     construct: function() {
//       /* Called to construct new content and children. Create a new context
//          for the children and export our data. */
//       if (arguments.callee.caller.super_) this.SUPER();
//       this.childX = this.X.sub({data$: this.childDataValue});
//     }
//   }
  
// });
 
  
// CLASS({
//   name: 'DataConsumerTrait',
//   package: 'foam.views',
  
//   documentation: function() {/*
//     Trait for consumers of a data property. It contains 
//     an $$DOC{ref:'.data'}
//     property and imports it by reference from the context.
//   */},
  
//   imports: ['data$'],
  
//   properties: [
//     {
//       name: 'data',
//       help: 'The incoming data for this view to use.',
//     },
//   ]

// });



CLASS({
  name: 'ViewActionsTrait',
  package: 'foam.views',
  
  properties: [
    {
      model_: 'BooleanProperty',
      name: 'showActions',
      defaultValue: false,
      postSet: function(oldValue, showActions) {
        // TODO: No way to remove the decorator.
        if ( ! oldValue && showActions ) {
          this.addDecorator(this.X.ActionBorder.create());
        }
      },
      documentation: function() {/*
          If $$DOC{ref:'Action',usePlural:true} are set on this $$DOC{ref:'View'},
          this property enables their automatic display in an $$DOC{ref:'ActionBorder'}.
          If you do not want to show $$DOC{ref:'Action',usePlural:true} or want
          to show them in a different way, leave this false.
      */}
    }
  ],
  
  methods: {
    createActionView: function(action, opt_args) {
      /* Creates a sub-$$DOC{ref:'View'} from $$DOC{ref:'Property'} info
        specifically for $$DOC{ref:'Action',usePlural:true}. */
      var X = ( opt_args && opt_args.X ) || this.childX;
      var modelName = opt_args && opt_args.model_ ?
        opt_args.model_ :
        'foam.views.ActionButton'  ;
      var v = FOAM.lookup(modelName, X).create({action: action}).copyFrom(opt_args);

      this[action.name + 'View'] = v;

      return v;
    },
 
  }
 
});

CLASS({
  name: 'BaseView',
  label: 'View',
  package: 'foam.views',
  
  traits: ['foam.patterns.ChildTreeTrait',
           'foam.views.ViewActionsTrait'],

  requires: ['SimpleReadOnlyValue',
             'foam.ui.PropertyView'],

  documentation: function() {/*
    <p>$$DOC{ref:'View',usePlural:true} render data. This could be a specific
       $$DOC{ref:'Model'} or a $$DOC{ref:'DAO'}. In the case of $$DOC{ref:'DetailView'},
       <em>any</em> $$DOC{ref:'Model'} can be rendered by walking through the
       $$DOC{ref:'Property',usePlural:true} of the data.
    </p>
    <p>$$DOC{ref:'View'} instances are arranged in a tree with parent-child links.
       This represents containment in most cases, where a sub-view appears inside
       its parent.
    </p>
  */},
  
  properties: [
    {
      name: 'selfX',
      help: 'Context with data$ = self',
      documentation: function() {/* 
        The context provided to consumers (children) of this provider when constructed
        from properties of this view.
      */},
    }
  ],

  constants: {
    // TODO?: Model as Topics
    ON_HIDE: ['onHide'], // Indicates that the View has been hidden
    ON_SHOW: ['onShow']  // Indicates that the View is now being reshown
  },

  methods: {
    
    init: function() {
      this.SUPER();
      // DetailView may have already constructed based on a data initialization, so check
      // if we should construct or not.
      if ( ! (this.selfX && this.selfX.data$.value === this) ) this.construct();
    },
    
    construct: function() {
      /* Create an additional context for children based on properties of this,
        rather than data. */
      this.SUPER();
      this.selfX = this.X.sub({data$: this.SimpleReadOnlyValue.create(this)});
    },

    toView_: function() { return this; },

    viewModel: function() {
      /* The $$DOC{ref:'Model'} definition of this $$DOC{ref:'View'}. */
      return this.model_;
    },

    createView: function(prop, opt_args) {
      /* Creates a sub-$$DOC{ref:'View'} from $$DOC{ref:'Property'} info. */
      var X = ( opt_args && opt_args.X ) || this.childX;
      var v = X.foam.ui.PropertyView.create({prop: prop, args: opt_args}, X);
      this.addChild(v);
      return v;
    },
       
    createTemplateView: function(name, opt_args) {
      /*
        Used by the $$DOC{ref:'Template',text:'$$propName'} sub-$$DOC{ref:'View'}
        creation tag in $$DOC{ref:'Template',usePlural:true}.
      */
      
      // Can't call viewModel() here, since DetailView overrides it but relies
      // on falling back on view's implementation. TODO(jacksonic): figure it out
      var o = this.model_[constantize(name)];
      
      if ( ! o ) throw 'Unknown View Name: ' + name;

      var args = opt_args; // opt_args ? opt_args.clone() : {};
      // for properties of this view, use our 'self' property as child data
      args.X = this.selfX;

      var v;
      if ( Action.isInstance(o) )
        v = this.createActionView(o, args);
      else
        v = this.createView(o, args);

      return v;
    },

    destroy: function() {
      /* Cleans up the DOM when regenerating content. You should call this before
         creating new HTML in your $$DOC{ref:'.toInnerHTML'} or $$DOC{ref:'.toHTML'}. */
      this.SUPER();
      // TODO(jacksonic): we often call destroy() in templates, but not the new construct()
      this.selfX = this.X.sub({data$: this.SimpleReadOnlyValue.create(this)});
    },

    close: function() {
      /* Call when permanently closing the $$DOC{ref:'View'}. */
      this.destroy();
      this.publish('closed');
    }
  }
});


CLASS({
  name: 'View',
  package: 'foam.views',
  label: 'HTMLView',
  extendsModel: 'foam.views.BaseView',
  traits: ['foam.views.HTMLViewTrait'],
  
  documentation: function() {/*
    <p>$$DOC{ref:'View',usePlural:true} render data. This could be a specific
       $$DOC{ref:'Model'} or a $$DOC{ref:'DAO'}. In the case of $$DOC{ref:'DetailView'},
       <em>any</em> $$DOC{ref:'Model'} can be rendered by walking through the
       $$DOC{ref:'Property',usePlural:true} of the data.
    </p>
    <p>$$DOC{ref:'View'} instances are arranged in a tree with parent-child links.
       This represents containment in most cases, where a sub-view appears inside
       its parent.
    </p>
    <p>HTML $$DOC{ref:'View',usePlural:true} should provide a $$DOC{ref:'.toInnerHTML'}
       $$DOC{ref:'Method'} or $$DOC{ref:'Template'}. If direct control is required,
       at minimum you must implement $$DOC{ref:'.toHTML'} and $$DOC{ref:'.initHTML'}.
    </p>
  */},
  
});

CLASS({
  name: 'HTMLViewTrait',
  label: 'HTMLViewTrait',
  package: 'foam.views',
  
  documentation: function() {/*
    The HTML implementation for $$DOC{ref:'View'}.
  */},
  
  
  properties: [
    {
      name:  'id',
      label: 'Element ID',
      type:  'String',
      factory: function() { return this.instance_.id || this.nextID(); },
      documentation: function() {/*
        The DOM element id for the outermost tag of
        this $$DOC{ref:'View'}.
      */}
    },
    {
      name:   'shortcuts',
      type:   'Array[Shortcut]',
      factory: function() { return []; },
      documentation: function() {/*
        Keyboard shortcuts for the view. TODO ???
      */}
    },
    {
      name:   '$',
      hidden: true,
      mode:   "read-only",
      getter: function() {
        return this.instance_.$ ? this.instance_.$ : this.instance_.$ = this.X.document.getElementById(this.id);
      },
      help: 'DOM Element.'
    },
    {
      name: 'tagName',
      defaultValue: 'span',
      documentation: function() {/*
          The HTML tag name to use for HTML $$DOC{ref:'View',usePlural:true}.
      */}
    },
    {
      name: 'className',
      help: 'CSS class name(s), space separated.',
      defaultValue: '',
      documentation: function() {/*
          The CSS class names to use for HTML $$DOC{ref:'View',usePlural:true}.
          Separate class names with spaces. Each instance of a $$DOC{ref:'View'}
          may have different classes specified.
      */}
    },
    {
      name: 'tooltip'
    },
    {
      name: 'extraClassName',
      defaultValue: '',
      documentation: function() {/*
          For custom $$DOC{ref:'View',usePlural:true}, you may wish to add standard
          CSS classes in addition to user-specified ones. Set those here and
          they will be appended to those from $$DOC{ref:'.className'}.
      */}
    },
    {
      name: 'initializers_',
      factory: function() { return []; },
      documentation: function() {/*
          When creating new HTML content, intializers are run. This corresponds
          to the lifecycle of the HTML (which may be replaced by toHTML() at any
          time), not the lifecycle of this $$DOC{ref:'View'}.
      */}
    },
    {
      name: 'destructors_',
      factory: function() { return []; },
      documentation: function() {/*
          When destroying HTML content, destructors are run. This corresponds
          to the lifecycle of the HTML (which may be replaced by toHTML() at any
          time), not the lifecycle of this $$DOC{ref:'View'}.
      */}
    }
  ],

  listeners: [
    {
      name: 'openTooltip',
      code: function(e) {
        console.assert(! this.tooltip_, 'Tooltip already defined');
        this.tooltip_ = this.X.Tooltip.create({
          text:   this.tooltip,
          target: this.$
        });
      }
    },
    {
      name: 'closeTooltip',
      code: function(e) {
        if ( this.tooltip_ ) {
          this.tooltip_.close();
          this.tooltip_ = null;
        }
      }
    },
    {
      name: 'onKeyboardShortcut',
      code: function(evt) {
        // console.log('***** key: ', this.evtToKeyCode(evt));
        var action = this.keyMap_[this.evtToKeyCode(evt)];
        if ( action ) {
          action();
          evt.preventDefault();
        }
      },
      documentation: function() {/*
          Automatic mapping of keyboard events to $$DOC{ref:'Action'} trigger.
          To handle keyboard shortcuts, create and attach $$DOC{ref:'Action',usePlural:true}
          to your $$DOC{ref:'View'}.
      */}
    }
  ],


  methods: {
    
    toView_: function() { return this; },

    strToHTML: function(str) {
      /*
        Escape the string to make it HTML safe.
        */
      return XMLUtil.escape(str.toString())
    },

    cssClassAttr: function() {
      /*
        Returns the full CSS class to use for the $$DOC{ref:'View'} DOM element.
       */
      if ( ! this.className && ! this.extraClassName ) return '';

      var s = ' class="';
      if ( this.className ) {
        s += this.className
        if ( this.extraClassName ) s += ' ';
      }
      if ( this.extraClassName ) s += this.extraClassName;

      return s + '"';
    },

    dynamicTag: function(tagName, f) {
      /*
        Creates a dynamic HTML tag whose content will be automatically updated.
       */
      var id = this.nextID();

      this.addInitializer(function() {
        this.X.dynamic(function() {
          var html = f();
          var e = this.X.$(id);
          if ( e ) e.innerHTML = html;
        }.bind(this));
      }.bind(this));

      return '<' + tagName + ' id="' + id + '"></' + tagName + '>';
    },


    focus: function() {
      /* Cause the view to take focus. */
      if ( this.$ && this.$.focus ) this.$.focus();
    },


    addShortcut: function(key, callback, context) {
      /* Add a keyboard shortcut. */
      this.shortcuts.push([key, callback, context]);
    },

    // TODO: make use new static_ scope when available
    nextID: function() {
      /* Convenience method to return unique DOM element ids. */
      return "viewNew" + (arguments.callee._nextId = (arguments.callee._nextId || 0) + 1);
    },

    addInitializer: function(f) {
      /* Adds a DOM initializer */
      this.initializers_.push(f);
    },
    addDestructor: function(f) {
      /* Adds a DOM destructor. */
      this.destructors_.push(f);
    },

    tapClick: function() {
    },

    on: function(event, listener, opt_id) {
      /*
        <p>To create DOM event handlers, use this method to set up your listener:</p>
        <p><code>this.on('click', this.myListener);</code></p>
      */
      opt_id = opt_id || this.nextID();
      listener = listener.bind(this);

      if ( event === 'click' && this.X.gestureManager ) {
        var self = this;
        var manager = this.X.gestureManager;
        var target = this.X.GestureTarget.create({
          containerID: opt_id,
          handler: {
            tapClick: function() {
              // Create a fake event.
              return listener({
                preventDefault: function() { },
                stopPropagation: function() { }
              });
            }
          },
          gesture: 'tap'
        });

        manager.install(target);
        this.addDestructor(function() {
          manager.uninstall(target);
        });
        return opt_id;
      }

      this.addInitializer(function() {
        var e = this.X.$(opt_id);
        // if ( ! e ) console.log('Error Missing element for id: ' + opt_id + ' on event ' + event);
        if ( e ) e.addEventListener(event, listener, false);
      }.bind(this));

      return opt_id;
    },

    setAttribute: function(attributeName, valueFn, opt_id) {
      /* Set a dynamic attribute on the DOM element. */
      opt_id = opt_id || this.nextID();
      valueFn = valueFn.bind(this);
      this.addInitializer(function() {
        this.X.dynamic(valueFn, function() {
          var e = this.X.$(opt_id);
          if ( ! e ) throw EventService.UNSUBSCRIBE_EXCEPTION;
          var newValue = valueFn(e.getAttribute(attributeName));
          if ( newValue == undefined ) e.removeAttribute(attributeName);
          else e.setAttribute(attributeName, newValue);
        }.bind(this))
      }.bind(this));
    },

    setClass: function(className, predicate, opt_id) {
      /* Set a dynamic CSS class on the DOM element. */
      opt_id = opt_id || this.nextID();
      predicate = predicate.bind(this);

      this.addInitializer(function() {
        this.X.dynamic(predicate, function() {
          var e = this.X.$(opt_id);
          if ( ! e ) throw EventService.UNSUBSCRIBE_EXCEPTION;
          DOM.setClass(e, className, predicate());
        });
      }.bind(this));

      return opt_id;
    },

    setClasses: function(map, opt_id) {
      /* Set a map of dynamic CSS classes on the DOM element. Mapped as
         className: predicate.*/
      opt_id = opt_id || this.nextID();
      var keys = Objects.keys(map);
      for ( var i = 0 ; i < keys.length ; i++ ) {
        this.setClass(keys[i], map[keys[i]], opt_id);
      }

      return opt_id;
    },

    insertInElement: function(name) {
      /* Insert this View's toHTML into the Element of the supplied name. */
      var e = this.X.$(name);
      e.innerHTML = this.toHTML();
      this.initHTML();
    },

    write: function(document) {
      /*  Write the View's HTML to the provided document and then initialize. */
      document.writeln(this.toHTML());
      this.initHTML();
    },

    updateHTML: function() {
      this.destroy();
      this.construct();
    },

    toInnerHTML: function() {
      /* <p>In most cases you can override this method to provide all of your HTML
        content. Calling $$DOC{ref:'.updateHTML'} will cause this method to
        be called again, regenerating your content. $$DOC{ref:'Template',usePlural:true}
        are usually called from here, or you may create a
        $$DOC{ref:'.toInnerHTML'} $$DOC{ref:'Template'}.</p>
        <p>If you are generating your content here, you may also need to override
        $$DOC{ref:'.initInnerHTML'} to create event handlers such as
        <code>this.on('click')</code>. */
      return '';
    },

    toHTML: function() {
      /* Generates the complete HTML content of this view, including outermost
        element. This element is managed by $$DOC{ref:'View'}, so in most cases
        you should use $$DOC{ref:'.toInnerHTML'} to generate your content. */
      this.invokeDestructors();
      return '<' + this.tagName + ' id="' + this.id + '"' + this.cssClassAttr() + '>' +
        this.toInnerHTML() +
        '</' + this.tagName + '>';
    },

    initHTML: function() {
      /* This must be called once after your HTML content has been inserted into
        the DOM. Calling $$DOC{ref:'.updateHTML'} will automatically call
        $$DOC{ref:'.initHTML'}. */
      this.initInnerHTML();
      this.initKeyboardShortcuts();
      this.maybeInitTooltip();
    },

    maybeInitTooltip: function() {
      if ( ! this.tooltip ) return;
      this.$.addEventListener('mouseenter', this.openTooltip);
      this.$.addEventListener('mouseleave', this.closeTooltip);
    },

    initInnerHTML: function() {
      /* Initialize this View and all of it's children. Usually just call
         $$DOC{ref:'.initHTML'} instead. When implementing a new $$DOC{ref:'View'}
         and adding listeners (including <code>this.on('click')</code>) that
         will be destroyed each time $$DOC{ref:'.toInnerHTML'} is called, you
         will have to override this $$DOC{ref:'Method'} and add them here.
       */
      // This mostly involves attaching listeners.
      // Must be called activate a view after it has been added to the DOM.

      this.invokeInitializers();
      this.initChildren();
    },

    initChildren: function() {
      /* Initialize all of the children. Usually just call
          $$DOC{ref:'.initHTML'} instead. */
      if ( this.children ) {
        // init children
        for ( var i = 0 ; i < this.children.length ; i++ ) {
          // console.log(i, 'init child: ' + this.children[i]);
          try {
            this.children[i].initHTML();
          } catch (x) {
            console.log('Error on View.child.initHTML', x, x.stack);
          }
        }
      }
    },

    invokeInitializers: function() {
      /* Calls all the DOM $$DOC{ref:'.initializers_'}. */
      for ( var i = 0 ; i < this.initializers_.length ; i++ ) this.initializers_[i]();
      this.initializers_ = [];
    },
    invokeDestructors: function() {
      /* Calls all the DOM $$DOC{ref:'.destructors_'}. */
      for ( var i = 0; i < this.destructors_.length; i++ ) this.destructors_[i]();
      this.destructors_ = [];
    },

    evtToKeyCode: function(evt) {
      /* Maps an event keycode to a string */
      var s = '';
      if ( evt.ctrlKey ) s += 'ctrl-';
      if ( evt.shiftKey ) s += 'shift-';
      s += evt.keyCode;
      return s;
    },

    initKeyboardShortcuts: function() {
      /* Initializes keyboard shortcuts. */
      var keyMap = {};
      var found  = false;
      var self   = this;

      function init(actions, opt_value) {
        actions.forEach(function(action) {
          for ( var j = 0 ; j < action.keyboardShortcuts.length ; j++ ) {
            var key = action.keyboardShortcuts[j];
            keyMap[key] = opt_value ?
              function() { action.callIfEnabled(self.X, opt_value.get()); } :
              action.callIfEnabled.bind(action, self.X, self) ;
            found = true;
          }
        });
      }

      init(this.model_.actions);
      if ( DetailView.isInstance(this) &&
          this.model &&
          this.model.actions )
        init(this.model.actions, this.childDataValue);

      if ( found ) {
        console.assert(this.$, 'View must define outer id when using keyboard shortcuts: ' + this.name_);
        this.keyMap_ = keyMap;
        this.$.parentElement.addEventListener('keydown', this.onKeyboardShortcut);
      }
    },

    construct: function() {
      /* Cause the HTML content to be recreated using a call to
        $$DOC{ref:'.toInnerHTML'}. */
      this.SUPER();
      if ( ! this.$ ) return;

      this.$.innerHTML = this.toInnerHTML();
      this.initInnerHTML();
    },
    
    destroy: function() {
      /* Cleans up the DOM when regenerating content. You should call this before
         creating new HTML in your $$DOC{ref:'.toInnerHTML'} or $$DOC{ref:'.toHTML'}. */
      // TODO: remove listeners   
      this.invokeDestructors();
      delete this.instance_.$;
      this.SUPER();
    },

    close: function() {
      /* Call when permanently closing the $$DOC{ref:'View'}. */
      this.$ && this.$.remove();
      this.destroy();
      this.publish('closed');
    }
  }
});



// PropertyView


 

CLASS({
  name: 'BaseDetailView',
  extendsModel: 'foam.views.BaseView',
  package: 'foam.views',
  
  traits: ['foam.ui.DestructiveDataViewTrait'],
  
  documentation:function() {/*
    When a view based on $$DOC{ref:'Property'} values is desired, $$DOC{ref:'DetailView'}
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
  */},

  properties: [
    {
      name:  'model',
      type:  'Model',
      documentation: function() {/*
        The $$DOC{ref:'.model'} is extracted from $$DOC{ref:'.data'}, or can be
        set in advance when the type of $$DOC{ref:'.data'} is known. The $$DOC{ref:'Model'}
        is used to set up the structure of the $$DOC{ref:'DetailView'}, by examining the
        $$DOC{ref:'Property',usePlural:true}. Changing the $$DOC{ref:'.data'} out
        for another instance of the same $$DOC{ref:'Model'} will refresh the contents
        of the sub-views without destroying and re-creating them.
      */}
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
    
    viewModel: function() { /* The $$DOC{ref:'Model'} type of the $$DOC{ref:'.data'}. */
      return this.model;
    },

    createTemplateView: function(name, opt_args) {
      /* Overridden here to set the new View.$$DOC{ref:'.data'} to this.$$DOC{ref:'.data'}.
         See $$DOC{ref:'View.createTemplateView'}. */
      if (this.viewModel()) {
        var o = this.viewModel().getFeature(name);
        if ( o ) { 
          if (Action.isInstance(o))
            return this.createActionView(o, opt_args);
          else
            return this.createView(o, opt_args);
        }
      }
      return this.SUPER(name, opt_args);
    }

  }
});

CLASS({
  name: 'DetailView',
  package: 'foam.views',
  extendsModel: 'foam.views.BaseDetailView',
  traits: ['foam.views.HTMLViewTrait',
           'foam.views.HTMLDetailViewTrait'],

  documentation:function() {/*
    When a view based on $$DOC{ref:'Property'} values is desired, $$DOC{ref:'DetailView'}
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
});

CLASS({
  name: 'HTMLDetailViewTrait',
  package: 'foam.views',
  
  documentation:function() {/*
    The HTML implementation of $$DOC{ref:'foam.views.DetailView'}.
  */},

  properties: [
    {
      name: 'className',
      defaultValue: 'detailView',
      documentation: function() {/*
          The CSS class names to use for HTML $$DOC{ref:'View',usePlural:true}.
          Separate class names with spaces. Each instance of a $$DOC{ref:'DetailView'}
          may have different classes specified.
      */}
    },
  ],

  methods: {

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
        str += this.rowToHTML(prop, view);
      }

      str += this.endForm();

      if ( this.showRelationships ) {
        var view = this.childX.RelationshipsView.create({}, this.childX);
        str += view.toHTML();
        this.addChild(view);
      }

      str += '</div>';

      return str;
    }
  }
});



// UpdateDetailView


CLASS({
  name: 'UpdateDetailView',
  package: 'foam.views',
  extendsModel: 'foam.views.BaseUpdateDetailView',
  traits: ['foam.views.HTMLViewTrait',
           'foam.views.HTMLDetailViewTrait']
});


// Bring in classic views and upgrade data handling
CLASS({
  name:  'TextFieldView',
  package: 'foam.views',
  label: 'Text Field',

  extendsModel: 'TextFieldView',
  traits: ['foam.ui.DataViewTrait']
});

CLASS({
  name: 'ActionButton',
  package: 'foam.views',
  traits: ['foam.ui.DataViewTrait'],
  extendsModel: 'ActionButton',
});


//
// CLASS({
//   name: 'AbstractDAOView',
//   package: 'foam.views',
//
//   extendsModel: 'AbstractDAOView',
//   traits: ['foam.views.DataConsumerTrait'],
//
// });

CLASS({
  name: 'DAODataTrait',
  package: 'foam.views',
  
  documentation: function() { /*
     <p>For $$DOC{ref:'View',usePlural:true} that take data items from a $$DOC{ref:'DAO'}
     and display them all, $$DOC{ref:'.'} provides the basic interface. Set or bind
     either $$DOC{ref:'.data'} or $$DOC{ref:'.dao'} to your source $$DOC{ref:'DAO'}.</p>
     <p>Call $$DOC{ref:'.onDAOUpdate'} to indicate a data change that should be
      re-rendered.</p>
  */},

  exports: ['dao$ as daoViewCurrentDAO$'],

  properties: [
    {
      name: 'data',
      postSet: function(oldDAO, dao) {
        if ( this.dao !== dao ) {
          this.dao = dao;
        }
      },
      documentation: function() { /*
          Sets the $$DOC{ref:'DAO'} to render items from. Use $$DOC{ref:'.data'}
          or $$DOC{ref:'.dao'} interchangeably.
      */}
    },
    {
      model_: 'DAOProperty',
      name: 'dao',
      label: 'DAO',
      help: 'An alias for the data property.',
      onDAOUpdate: 'onDAOUpdate',
      postSet: function(oldDAO, dao) {
        if (!dao) {
          this.data = "";
        } else if ( this.data !== dao ) {
          this.data = dao;
        }
      },
      documentation: function() { /*
          Sets the $$DOC{ref:'DAO'} to render items from. Use $$DOC{ref:'.data'}
          or $$DOC{ref:'.dao'} interchangeably.
      */}
    }
  ],

  methods: {
    onDAOUpdate: function() { /* Implement this $$DOC{ref:'Method'} in
          sub-models to respond to changes in $$DOC{ref:'.dao'}. */ }
  }
});


CLASS({
  name: 'DAOListView',
  package: 'foam.views',
  extendsModel: 'foam.views.BaseView',
  
  traits: [ 'foam.views.DAODataTrait',
            'foam.views.HTMLViewTrait'], 
  // see updateHTML, item X.sub({data...}) for differences from old DAOListView
  
  properties: [
    {
      model_: 'BooleanProperty',
      name: 'isHidden',
      defaultValue: false,
      postSet: function(_, isHidden) {
        if ( this.dao && ! isHidden ) this.onDAOUpdate();
      }
    },
    {
      model_: 'ViewFactoryProperty',
      name: 'rowView',
      defaultValue: 'DetailView'
    },
    {
      name: 'mode',
      defaultValue: 'read-write',
      view: { factory_: 'ChoiceView', choices: ['read-only', 'read-write', 'final'] }
    },
    {
      name: 'useSelection',
      help: 'Backward compatibility for selection mode. Create a X.selection$ value in your context instead.',
      postSet: function(old, nu) {
        if ( this.useSelection && !this.X.selection$ ) this.X.selection$ = this.X.SimpleValue.create();
        this.selection$ = this.X.selection$;
      }
    },
    {
      name: 'selection',
      help: 'Backward compatibility for selection mode. Create a X.selection$ value in your context instead.',
      factory: function() {
        return this.X.SimpleValue.create();
      }
    },
    {
      name: 'scrollContainer',
      help: 'Containing element that is responsible for scrolling.'
    },
    {
      name: 'chunkSize',
      defaultValue: 0,
      help: 'Number of entries to load in each infinite scroll chunk.'
    },
    {
      name: 'chunksLoaded',
      isHidden: true,
      defaultValue: 1,
      help: 'The number of chunks currently loaded.'
    }
  ],

  methods: {
    init: function() {
      this.SUPER();

      var self = this;
      this.subscribe(this.ON_HIDE, function() {
        self.isHidden = true;
      });

      this.subscribe(this.ON_SHOW, function() {
        self.isHidden = false;
      });

      // bind to selection, if present
      if (this.X.selection$) {
        this.selection$ = this.X.selection$;
      }
    },

    initHTML: function() {
      this.SUPER();

      // If we're doing infinite scrolling, we need to find the container.
      // Either an overflow: scroll element or the window.
      // We keep following the parentElement chain until we get null.
      if ( this.chunkSize > 0 ) {
        var e = this.$;
        while ( e ) {
          if ( window.getComputedStyle(e).overflow === 'scroll' ) break;
          e = e.parentElement;
        }
        this.scrollContainer = e || window;
        this.scrollContainer.addEventListener('scroll', this.onScroll, false);
      }

      if ( ! this.isHidden ) this.updateHTML();
    },

    updateHTML: function() {
      if ( ! this.dao || ! this.$ ) return;
      if ( this.painting ) return;
      this.painting = true;

      var out = [];
      this.children = [];
      this.initializers_ = [];

      var doneFirstItem = false;
      var d = this.dao;
      if ( this.chunkSize ) {
        d = d.limit(this.chunkSize * this.chunksLoaded);
      }
      d.select({put: function(o) {
        if ( this.mode === 'read-write' ) o = o.model_.create(o, this.childX); //.clone();
        var X = this.X.sub({ data$: this.X.SimpleValue.create(o, this.childX) });
        var view = this.rowView({ model: o.model_}, X);
        view.DAO = this.dao;
        if ( this.mode === 'read-write' ) {
          o.addListener(function() {
            // TODO(kgr): remove the deepClone when the DAO does this itself.
            this.dao.put(o.deepClone());
          }.bind(this, o));
        }
        this.addChild(view);
        
        if (!doneFirstItem) {
          doneFirstItem = true;
        } else {
          this.separatorToHTML(out); // optional separator
        }
        
        if ( this.X.selection$ ) {
          out.push('<div class="' + this.className + '-row' + '" id="' + this.on('click', (function() {
            this.selection = o;
          }).bind(this)) + '">');
        }
        out.push(view.toHTML());
        if ( this.X.selection$ ) {
          out.push('</div>');
        }
      }.bind(this)})(function() {
        var e = this.$;

        if ( ! e ) return;

        e.innerHTML = out.join('');
        this.initInnerHTML();
        this.children = [];
        this.painting = false;
      }.bind(this));
    },

    /** Allow rowView to be optional when defined using HTML. **/
    fromElement: function(e) {
      var children = e.children;
      if ( children.length == 1 && children[0].nodeName === 'rowView' ) {
        this.SUPER(e);
      } else {
        this.rowView = e.innerHTML;
      }
    },
    
    // Template method
    separatorToHTML: function(out) {
      /* Template method. Override to provide a separator if required. This
      method is called <em>before</em> each list item, except the first. Use
      out.push("<myhtml>...") for efficiency. */
    }
  },

  listeners: [
    {
      name: 'onDAOUpdate',
      code: function() {
        this.realDAOUpdate();
      }
    },
    {
      name: 'realDAOUpdate',
      isFramed: true,
      code: function() { 
        if ( ! this.isHidden ) this.updateHTML(); 
      }
    },
    {
      name: 'onScroll',
      code: function() {
        var e = this.scrollContainer;
        if ( this.chunkSize > 0 && e.scrollTop + e.offsetHeight >= e.scrollHeight ) {
          this.chunksLoaded++;
          this.updateHTML();
        }
      }
    }
  ]
});


CLASS({
  name: 'CollapsibleView',
  package: 'foam.views',
  traits: ['foam.patterns.ChildTreeTrait',
           'foam.ui.SimpleViewTrait',
           'foam.views.ViewActionsTrait',
           'foam.views.HTMLViewTrait'],
  
  properties: [
    {
      name:  'fullView',
      documentation: function() {/*
        The large, expanded view to show.
      */}
    },
    {
      name:  'collapsedView',
      documentation: function() {/*
        The small, hidden mode view to show.
      */}

    },
    {
      name: 'collapsed',
      documentation: function() {/*
        Indicates if the collapsed or full view is shown. 
      */},
      defaultValue: true,
      postSet: function() {
        if (this.collapsed) {
          this.collapsedView.$.style.height = "";
          this.fullView.$.style.height = "0";

        } else {
          this.collapsedView.$.style.height = "0";
          this.fullView.$.style.height = "";
        }
      }
    }

  ],

  methods: {
    toHTML: function() {
      /* Just render both sub-views, and control their height to show or hide. */

      // TODO: don't render full view until expanded for the first time?
      if (this.collapsedView && this.fullView) {
        var retStr = this.collapsedView.toHTML() + this.fullView.toHTML();
        this.addChild(this.collapsedView);
        this.addChild(this.fullView);
      } else {
        console.warn(model_.id + " missing " 
            + ( this.collapsedView ? "" : "collapsedView" )
            + ( this.fullView ? "" : "fulleView" ));
      }
      return retStr;
    },

    initHTML: function() {
      this.SUPER();
      /* Just render both sub-views, and control their height to show or hide. */

      if (this.collapsedView.$ && this.fullView.$) {        
        // to ensure we can hide by setting the height
        this.collapsedView.$.style.display = "block";
        this.fullView.$.style.display = "block";
        this.collapsedView.$.style.overflow = "hidden";
        this.fullView.$.style.overflow = "hidden";
        this.collapsed = true;
      }
    }
  },

  actions: [
    {
      name:  'toggle',
      help:  'Toggle collapsed state.',

      labelFn: function() {
        return this.collapsed? 'Expand' : 'Hide';
      },
      isAvailable: function() {
        return true;
      },
      isEnabled: function() {
        return true;//this.collapsedView.toHTML && this.fullView.toHTML;
      },
      action: function() {
        this.collapsed = !this.collapsed;
      }
    },
  ]
});



