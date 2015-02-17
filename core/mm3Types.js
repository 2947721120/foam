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

var StringProperty = Model.create({
  extendsModel: 'Property',

  name:  'StringProperty',
  help:  "Describes a properties of type String.",

  properties: [
    {
      name: 'displayHeight',
      type: 'int',
      displayWidth: 8,
      defaultValue: 1,
      help: 'The display height of the property.'
    },
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'String',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'preSet',
      defaultValue: function (_, v) {
        return v === undefined || v === null ? '' :
        typeof v === 'function'              ? multiline(v) : v.toString() ;
      }
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 70,
      defaultValue: 'String',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.TextFieldView'
    },
    {
      name: 'pattern',
      help: 'Regex pattern for property.'
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    }
  ]
});


var BooleanProperty = Model.create({
  extendsModel: 'Property',

  name:  'BooleanProperty',
  help:  "Describes a properties of type String.",

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Boolean',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 70,
      defaultValue: 'bool',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'BooleanView'
    },
    {
      name: 'defaultValue',
      defaultValue: false
    },
    {
      name: 'preSet',
      defaultValue: function (_, v) { return !!v; }
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    },
    {
      name: 'fromString',
      defaultValue: function(s, p) {
        var txt = s.trim();
        this[p.name] =
          txt.equalsIC('y')    ||
          txt.equalsIC('yes')  ||
          txt.equalsIC('true') ||
          txt.equalsIC('t');
      },
      help: 'Function to extract value from a String.'
    }
  ]
});


var DateProperty = Model.create({
  extendsModel: 'Property',

  name:  'DateProperty',
  help:  "Describes a properties of type String.",

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Date',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 50
    },
    {
      name: 'javaType',
      type: 'String',
      defaultValue: 'Date',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      // TODO: create custom DateView
      defaultValue: 'DateFieldView'
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    },
    {
      name: 'preSet',
      defaultValue: function (_, d) {
        return typeof d === 'string' ? new Date(d) : d;
      }
    },
    {
      name: 'tableFormatter',
      defaultValue: function(d) {
        return d ? d.toRelativeDateString() : '';
      }
    },
    {
      name: 'compareProperty',
      defaultValue: function(o1, o2) {
        if ( ! o1 ) return ( ! o2 ) ? 0: -1;
        if ( ! o2 ) return 1;

        return o1.compareTo(o2);
      }
    }
  ]
});


var DateTimeProperty = Model.create({
  extendsModel: 'DateProperty',

  name:  'DateTimeProperty',
  help:  "Describes a properties of type String.",

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 25,
      defaultValue: 'datetime',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'preSet',
      defaultValue: function(_, d) {
        if ( typeof d === 'number' ) return new Date(d);
        if ( typeof d === 'string' ) return new Date(d);
        return d;
      }
    },
    {
      name: 'view',
      defaultValue: 'DateTimeFieldView'
    }
  ]
});


var IntProperty = Model.create({
  extendsModel: 'Property',

  name:  'IntProperty',
  help:  "Describes a properties of type Int.",

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Int',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 10
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValue: 'int',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.IntFieldView'
    },
    {
      name: 'preSet',
      defaultValue: function (_, v) { return parseInt(v || 0); }
    },
    {
      name: 'defaultValue',
      defaultValue: 0
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    },
    {
      name: 'compareProperty',
      defaultValue: function(o1, o2) {
        return o1 === o2 ? 0 : o1 > o2 ? 1 : -1;
      }
    }
  ]
});


var FloatProperty = Model.create({
  extendsModel: 'Property',

  name:  'FloatProperty',
  help:  'Describes a properties of type Float.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Float',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'defaultValue',
      defaultValue: 0.0
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValue: 'double',
      help: 'The Java type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 15
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.FloatFieldView'
    },
    {
      name: 'preSet',
      defaultValue: function (_, v) { return parseFloat(v || 0.0); }
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    }
  ]
});


var FunctionProperty = Model.create({
  extendsModel: 'Property',

  name:  'FunctionProperty',
  help:  "Describes a properties of type Function.",

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Function',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValue: 'Function',
      help: 'The Java type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 15
    },
    {
      name: 'view',
      defaultValue: 'FunctionView'
    },
    {
      name: 'defaultValue',
      defaultValue: function() {}
    },
    {
      name: 'fromElement',
      defaultValue: function(e, p) {
        var txt = e.innerHTML.trim();

        this[p.name] = txt.startsWith('function') ?
          eval('(' + txt + ')') :
          new Function(txt) ;
      }
    },
    {
      name: 'preSet',
      defaultValue: function(_, value) {
        if ( typeof value === 'string' ) {
          return value.startsWith('function') ?
              eval('(' + value + ')') :
              new Function(value);
        }
        return value;
      }
    }
  ]
});


var ArrayProperty = Model.create({
  extendsModel: 'Property',

  name:  'ArrayProperty',
  help:  "Describes a properties of type Array.",

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Array',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'singular',
      type: 'String',
      displayWidth: 70,
      defaultValueFn: function() { return this.name.replace(/s$/, ''); },
      help: 'The plural form of this model\'s name.',
      documentation: function() { /* The singular form of $$DOC{ref:'Property.name'}.*/}
    },
    {
      name: 'subType',
      type: 'String',
      displayWidth: 20,
      defaultValue: '',
      help: 'The FOAM sub-type of this property.'
    },
    {
      name: 'protobufType',
      defaultValueFn: function() { return this.subType; }
    },
    {
      name: 'preSet',
      defaultValue: function(_, a, prop) {
        var m = FOAM.lookup(prop.subType, this.X) ||
          FOAM.lookup(prop.subType, GLOBAL);

        // if ( ! Array.isArray(a) ) a = [a];  // ???: Is this a good idea?
        if ( ! m ) return a;

        for ( var i = 0 ; i < a.length ; i++ )
          a[i] = a[i].model_ ? FOAM(a[i]) : m.create(a[i]);

        return a;
      }
    },
    {
      name: 'postSet',
      defaultValue: function(oldA, a, prop) {
        var name = prop.name + 'ArrayRelay_';
        var l = this[name] || ( this[name] = function() {
          this.propertyChange(prop.name, null, this[prop.name]);
        }.bind(this) );
        if ( oldA && oldA.unlisten ) oldA.unlisten(l);
        if ( a && a.listen ) a.listen(l);
      }
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValueFn: function(p) { return p.subType + '[]'; },
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'ArrayView'
    },
    {
      name: 'factory',
      defaultValue: function() { return []; }
    },
    {
      name: 'propertyToJSON',
      defaultValue: function(visitor, output, o) {
        if ( ! this.transient && o[this.name].length )
          output[this.name] = visitor.visitArray(o[this.name]);
      }
    },
    {
      name: 'install',
      defaultValue: function(prop) {
        defineLazyProperty(this, prop.name + '$Proxy', function() {
          var proxy = ProxyDAO.create({delegate: this[prop.name].dao});

          this.addPropertyListener(prop.name, function(_, _, _, a) {
            proxy.delegate = a.dao;
          });

          return {
            get: function() { return proxy; },
            configurable: true
          };
        });
      }
    },
    {
      name: 'fromElement',
      defaultValue: function(e, p) {
        var model = FOAM.lookup(e.getAttribute('model') || p.subType, this.X);
        var o = model.create(null, this.X);
        o.fromElement(e);
        this[p.name] = this[p.name].pushF(o);
      }
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    }
  ]
});


var ReferenceProperty = Model.create({
  extendsModel: 'Property',

  name:  'ReferenceProperty',
  help:  "A foreign key reference to another Entity.",

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Reference',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'subType',
      type: 'String',
      displayWidth: 20,
      defaultValue: '',
      help: 'The FOAM sub-type of this property.'
    },
    {
      name: 'subKey',
      type: 'EXPR',
      displayWidth: 20,
      defaultValue: 'ID',
      help: 'The foreign key that this property references.'
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      // TODO: should obtain primary-key type from subType
      defaultValueFn: function(p) { return 'Object'; },
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.TextFieldView'
// TODO: Uncomment when all usages of ReferenceProperty/ReferenceArrayProperty fixed.
//      defaultValue: 'KeyView'
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    }
  ]
});


var StringArrayProperty = Model.create({
  extendsModel: 'Property',

  name:  'StringArrayProperty',
  help:  "An array of String values.",

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Array[]',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'singular',
      type: 'String',
      displayWidth: 70,
      defaultValueFn: function() { return this.name.replace(/s$/, ''); },
      help: 'The plural form of this model\'s name.',
      documentation: function() { /* The singular form of $$DOC{ref:'Property.name'}.*/}
    },
    {
      name: 'subType',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'String',
      help: 'The FOAM sub-type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 50
    },
    {
      name: 'preSet',
      defaultValue: function(_, v) { return Array.isArray(v) ? v : [v]; }
    },
    {
      name: 'factory',
      defaultValue: function() { return []; }
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValue: 'String[]',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'StringArrayView'
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    },
    {
      name: 'exclusive',
      defaultValue: false
    },
    {
      name: 'fromElement',
      defaultValue: function(e, p) {
        this[p.name] = this[p.name].pushF(e.innerHTML);
      }
    }
  ]
});


var DAOProperty = Model.create({
  extendsModel: 'Property',

  name: 'DAOProperty',
  help: "Describes a DAO property.",

  properties: [
    {
      name: 'type',
      defaultValue: 'DAO',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'ArrayView'
    },
    {
//      model_: 'FunctionProperty',
      name: 'onDAOUpdate'
    },
    {
      name: 'install',
      defaultValue: function(prop) {
        defineLazyProperty(this, prop.name + '$Proxy', function() {
          if ( ! this[prop.name] ) {
            var future = afuture();
            var delegate = FutureDAO.create({
              future: future.get
            });
          } else
            delegate = this[prop.name];

          var proxy = ProxyDAO.create({delegate: delegate});

          this.addPropertyListener(prop.name, function(_, _, _, dao) {
            if ( future ) {
              future.set(dao);
              future = null;
              return;
            }
            proxy.delegate = dao;
          });

          return {
            get: function() { return proxy; },
            configurable: true
          };
        });
      }
    }
  ]
});


var ModelProperty = Model.create({
  name: 'ModelProperty',
  extendsModel: 'Property',

  help: "Describes a Model property.",

  properties: [
    {
      name: 'type',
      defaultValue: 'Model'
    },
    {
      name: 'getter',
      defaultValue: function(name) {
        var value = this.instance_[name];
        if ( typeof value === 'undefined' ) {
          var prop = this.model_.getProperty(name);
          if ( prop && prop.defaultValueFn )
            value = prop.defaultValueFn.call(this, prop);
          else
            value = prop.defaultValue;
        }
        return FOAM.lookup(value, this.X);
      }
    },
    {
      name: 'propertyToJSON',
      defaultValue: function(visitor, output, o) {
        if ( ! this.transient ) output[this.name] = o[this.name].id;
      }
    }
  ]
});


var ViewProperty = Model.create({
  name: 'ViewProperty',
  extendsModel: 'Property',

  help: "Describes a View-Factory property.",

  properties: [
    {
      name: 'preSet',
      doc: "Can be specified as either a function, a Model, a Model path, or a JSON object.",
      defaultValue: function(_, f) {
        if ( typeof f === 'function' ) return f;

        if ( typeof f === 'string' ) {
          return function(d, opt_X) {
            return FOAM.lookup(f, opt_X || this.X).create(d);
          }.bind(this);
        }

        if ( typeof f.create === 'function' ) return f.create.bind(f);
        if ( typeof f.model_ === 'string' ) return function(d, opt_X) {
          return FOAM(f, opt_X || this.X).copyFrom(d);
        }

        console.error('******* Unknown view factory: ', f);
        return f;
      }
    },
    {
      name: 'defaultValue',
      preSet: function(_, f) { return ViewProperty.PRE_SET.defaultValue.call(this, null, f); }
    }
  ]
});


var FactoryProperty = Model.create({
  name: 'FactoryProperty',
  extendsModel: 'Property',

  help: 'Describes a Factory property.',

  properties: [
    {
      name: 'preSet',
      doc: "Can be specified as either a function, a Model, a Model path, or a JSON object.",
      defaultValue: function(_, f) {
        // A Factory Function
        if ( typeof f === 'function' ) return f;

        // A String Path to a Model
        if ( typeof f === 'string' ) return function(map, opt_X) {
          return FOAM.lookup(f, opt_X || this.X).create(map);
        }.bind(this);

        // An actual Model
        if ( Model.isInstance(f) ) return f.create.bind(f);

        // A JSON Model Factory: { factory_ : 'ModelName', arg1: value1, ... }
        if ( f.factory_ ) return function(map, opt_X) {
          var X = opt_X || this.X;
          var m = FOAM.lookup(f.factory_, X);
          console.assert(m, 'Unknown Factory Model: ' + f.factory_);
          return m.create(f, X);
        }.bind(this);

        console.error('******* Invalid Factory: ', f);
        return f;
      }
    }
  ]
});


var ViewFactoryProperty = Model.create({
  name: 'ViewFactoryProperty',
  extendsModel: 'FactoryProperty',

  help: 'Describes a View Factory property.',

  /* Doesn't work yet!
  constants: {
    VIEW_CACHE: {}
  },
  */

  properties: [
    {
      name: 'defaultValue',
      preSet: function(_, f) { return ViewFactoryProperty.PRE_SET.defaultValue.call(this, null, f); }
    },
    {
      name: 'fromElement',
      defaultValue: function(e, p) {
        this[p.name] = e.innerHTML_ || ( e.innerHTML_ = e.innerHTML );
      }
    },
    {
      name: 'preSet',
      doc: "Can be specified as either a function, a Model, a Model path, or a JSON object.",
      defaultValue: function(_, f) {
        // Undefined values
        if ( ! f ) return f;
        // A Factory Function
        if ( typeof f === 'function' ) return f;

        // A String Path to a Model
        if ( typeof f === 'string' ) {
          // if not a valid model path then treat as a template
          if ( /[^0-9a-zA-Z$_.]/.exec(f) ) {
            // Cache the creation of an DetailView so that we don't
            // keep recompiling the template
            var VIEW_CACHE = ViewFactoryProperty.VIEW_CACHE ||
              ( ViewFactoryProperty.VIEW_CACHE = {} );
            var viewModel = VIEW_CACHE[f];
            if ( ! viewModel ) {
                viewModel = VIEW_CACHE[f] = Model.create({
                  name: 'InnerDetailView' + this.$UID,
                  extendsModel: 'DetailView',
                  templates:[{name: 'toHTML', template: f}]
                });
              // TODO(kgr): this isn't right because compiling the View
              // template is async.  Should create a FutureView to handle this.
              arequireModel(viewModel);
            }
            return function(args, X) { return viewModel.create(args, X || this.X); };
          }

          return function(map, opt_X) {
            return FOAM.lookup(f, opt_X || this.X).create(map, opt_X || this.X);
          }.bind(this);
        }

        // An actual Model
        if ( Model.isInstance(f) ) return f.create.bind(f);

        // A JSON Model Factory: { factory_ : 'ModelName', arg1: value1, ... }
        if ( f.factory_ ) return function(map, opt_X) {
          var X = opt_X || this.X;
          var m = FOAM.lookup(f.factory_, X);
          console.assert(m, 'Unknown ViewFactory Model: ' + f.factory_);
          return m.create(f, X).copyFrom(map);
        }.bind(this);

        if ( View.isInstance(f) ) return constantFn(f);

        console.error('******* Invalid Factory: ', f);
        return f;
      }
    }
  ]
});


var ReferenceArrayProperty = Model.create({
  name: 'ReferenceArrayProperty',
  extendsModel: 'ReferenceProperty',

  properties: [
    {
      name: 'type',
      defaultValue: 'Array',
      displayWidth: 20,
      help: 'The FOAM type of this property.'
    },
    {
      name: 'factory',
      defaultValue: function() { return []; },
    },
    {
      name: 'view',
      defaultValue: 'StringArrayView',
// TODO: Uncomment when all usages of ReferenceProperty/ReferenceArrayProperty fixed.
//      defaultValue: 'DAOKeyView'
    }
  ]
});

var EMailProperty = StringProperty;
var URLProperty = StringProperty;

var DocumentationProperty = Model.create({
  extendsModel: 'Property',
  name: 'DocumentationProperty',
  help: 'Describes the documentation properties found on Models, Properties, Actions, Methods, etc.',
  documentation: "The developer documentation for this $$DOC{ref:'.'}. Use a $$DOC{ref:'DocModelView'} to view documentation.",

  properties: [
    {
      name: 'type',
      type: 'String',
      defaultvalue: 'Documentation'
    },
    { // Note: defaultValue: for the getter function didn't work. factory: does.
      name: 'getter',
      type: 'Function',
      factory: function() { return function() {
        var doc = this.instance_.documentation;
        if (doc && typeof Documentation != "undefined" && Documentation // a source has to exist (otherwise we'll return undefined below)
            && (  !doc.model_ // but we don't know if the user set model_
               || !doc.model_.getPrototype // model_ could be a string
               || !Documentation.isInstance(doc) // check for correct type
            ) ) {
          // So in this case we have something in documentation, but it's not of the
          // "Documentation" model type, so FOAMalize it.
          if (doc.body) {
            this.instance_.documentation = Documentation.create( doc );
          } else {
            this.instance_.documentation = Documentation.create({ body: doc });
          }
        }
        // otherwise return the previously FOAMalized model or undefined if nothing specified.
        return this.instance_.documentation;
      }; }
    },
    {
      name: 'view',
      defaultValue: 'DetailView'
    },
    {
      name: 'help',
      defaultValue: 'Documentation for this entity.'
    },
    {
      name: 'documentation',
      factory: function() { return "The developer documentation for this $$DOC{ref:'.'}. Use a $$DOC{ref:'DocModelView'} to view documentation."; }
   }
  ]
});

CLASS({
  name: 'EnumPropertyTrait',
  package: 'foam.core.types',
  properties: [
    {
      name: 'choices',
      type: 'Array',
      help: 'Array of [value, label] choices.',
      preSet: function(_, a) { return a.map(function(c) { return Array.isArray(c) ? c : [c, c]; }); },
      required: true
    },
    {
      name: 'view',
      defaultValue: 'ChoiceView'
    }
  ]
});

CLASS({
  name: 'StringEnumProperty',
  package: 'foam.core.types',
  traits: ['foam.core.types.EnumPropertyTrait'],
  extendsModel: 'StringProperty'
});

CLASS({
  name: 'DOMElementProperty',
  package: 'foam.core.types',
  extendsModel: 'StringProperty',
  properties: [
    {
      name: 'getter',
      defaultValue: function(name) { return this.X.document.getElementById(this.instance_[name]); }
    }
  ]
});
