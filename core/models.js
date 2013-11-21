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

/**
 * Only completely modelled models here.
 * All models in this file can be stored and loaded in a DAO.
 **/
var Timer = FOAM({
   model_: 'Model',

   name: 'Timer',

   properties: [
      {
         name:  'interval',
         type:  'int',
         view:  'IntFieldView',
         help:  'Interval of time between updating time.',
         units: 'ms',
         defaultValue: 10
      },
      {
         name:  'i',
         type:  'int',
         view:  'IntFieldView',
         defaultValue: 0
      },
      {
         name:  'timeWarp',
         type:  'float',
         view:  'FloatFieldView',
         defaultValue: 1.0
      },
      {
         name:  'duration',
         type:  'int',
         view:  'IntFieldView',
         units: 'ms',
         defaultValue: -1
      },
      {
         name: 'percent',
         type: 'float',
         view:  'FloatFieldView',
         defaultValue: 0
      },
      {
         name:  'startTime',
         type:  'int',
         view:  'IntFieldView',
         defaultValue: 0
      },
      {
         name:  'time',
         type:  'int',
         help:  'The current time in milliseconds since epoch.',
         view:  'IntFieldView',
         defaultValue: 0
      },
      {
         name:  'second',
         type:  'int',
         help:  'The second of the current minute.',
         view:  'IntFieldView',
         defaultValue: 0
      },
      {
         name:  'minute',
         type:  'int',
         help:  'The minute of the current hour.',
         view:  'IntFieldView',
         defaultValue: 0
      },
      {
         name:  'hour',
         type:  'int',
         help:  'The hour of the current day.',
         view:  'IntFieldView',
         defaultValue: 0
      }
   ],

   actions: [
      {
         model_: 'Action',
         name:  'start',
         help:  'Start the timer.',

         isAvailable: function() { return true; },
         isEnabled:   function() { return ! this.isStarted; },
         action:      function() { if ( this.isStarted ) return; this.isStarted = true; this.tick(); }
      },
      {
         model_: 'Action',
         name:  'step',
         help:  'Step the timer.',

         isAvailable: function() { return true; },
         isEnabled: function()   { return ! this.isStarted; },
         action: function()      {
            this.i++;
            this.time  += this.interval * this.timeWarp;
            this.second = this.time /    1000 % 60 << 0;
            this.minute = this.time /   60000 % 60 << 0;
            this.hour   = this.time / 3600000 % 24 << 0;
         }
      },
      {
         model_: 'Action',
         name:  'stop',
         help:  'Stop the timer.',

         isAvailable: function() { return true; },
         isEnabled: function()   { return this.isStarted; },
         action: function()      {
           this.isStarted = false;
           if ( this.timeout ) {
               clearTimeout(this.timeout);
               this.timeout = undefined;
            }
         }
      }
   ],

   methods: {
      tick: function() {
         this.timeout = undefined;
         if ( ! this.isStarted ) return;

         this.step();
         this.timeout = setTimeout(this.tick.bind(this), this.interval);
      }
   }
});


var Mouse = FOAM({
   model_: 'Model',

   name: 'Mouse',

   properties: [
      {
         name:  'x',
         type:  'int',
         view:  'IntFieldView',
         defaultValue: 10
      },
      {
         name:  'y',
         type:  'int',
         view:  'IntFieldView',
         defaultValue: 10
      }
   ],
   methods: {
      connect: function(e) {
         e.addEventListener('mousemove', EventService.merged(this.onMouseMove,1));
      }
   },

   listeners: [
      {
         model_: 'Method',

         name: 'onMouseMove',
         code: function(evt) {
            this.x = evt.offsetX;
            this.y = evt.offsetY;
         }
      }
   ]
});


/** A Panel is a container of other CViews. **/
var PanelCView = FOAM({
   model_: 'Model',

   name:  'PanelCView',
   label: 'Panel',

   properties: [
      {
         name:  'parent',
         type:  'CView',
         hidden: true
      },
      {
         name:  'x',
         type:  'int',
         view:  'IntFieldView',
         defaultValue: 10
      },
      {
         name:  'y',
         type:  'int',
         view:  'IntFieldView',
         defaultValue: 10
      },
      {
         name:  'children',
         type:  'CView[]',
         valueFactory: function() { return []; }
      },
      {
         name:  'canvas',
         type:  'CView',
         getter: function() {
           return this.parent.canvas;
         },
         setter: undefined
      }
   ],

   methods: {
      toHTML: function() {
//       this.canvasView = Canvas.create(this);
         this.canvasView = Canvas.create({width:this.width+1, height:this.height+2});
         if ( this.backgroundColor ) this.canvasView.backgroundColor = this.backgroundColor;
         return this.canvasView.toHTML();
      },

      initHTML: function() {
         this.canvasView.initHTML();
         this.canvasView.addChild(this);
      },

      write: function(document) {
         document.writeln(this.toHTML());
         this.initHTML();
      },

      addChild: function(child) {
         this.children.push(child);
         child.parent = this;
         return this;
      },

      removeChild: function(child) {
         this.children.remove(child);
         child.parent = undefined;
         return this;
      },

      paint: function() {
         for ( var i = 0 ; i < this.children.length ; i++ ) {
            var child = this.children[i];

            child.paint();
         }
      }
   }
});


/** Abstract CViews. **/
var CView = FOAM({
   model_: 'Model',

   name:  'CView',
   label: 'Panel',

   properties: [
      {
         name:  'parent',
         type:  'CView',
         hidden: true
      },
      {
         name:  'x',
         type:  'int',
         view:  'IntFieldView',
         postSet: function() { this.resizeParent(); },
         defaultValue: 10
      },
      {
         name:  'y',
         type:  'int',
         view:  'IntFieldView',
         postSet: function() { this.resizeParent(); },
         defaultValue: 10
      },
      {
         name:  'width',
         type:  'int',
         view:  'IntFieldView',
         postSet: function() { this.resizeParent(); },
         defaultValue: 10
      },
      {
         name:  'height',
         type:  'int',
         view:  'IntFieldView',
         postSet: function() { this.resizeParent(); },
         defaultValue: 10
      },
      {
         name:  'children',
         type:  'CView[]',
         valueFactory: function() { return []; },
         hidden: true
      },
      {
         name:  'background',
         label: 'Background Color',
         type:  'String',
         defaultValue: 'white'
      },
      {
         name:  'canvas',
         type:  'CView',
         getter: function() {
           return this.parent.canvas;
         },
         setter: undefined,
         hidden: true
      }
   ],

   methods: {
      toHTML: function() {

         // If being added to HTML directly, then needs to create own Canvas as parent.
         this.parent = Canvas.create();
         this.resizeParent();
         return this.parent.toHTML();
      },

      resizeParent: function() {
        this.parent.width  = this.x + this.width + 1;
        this.parent.height = this.y + this.height + 2;
      },

      initHTML: function() {
         var self = this;
         var parent = this.parent;

         parent.initHTML();
         parent.addChild(this);
         Events.dynamic(
           function() { self.background; }, function() {
             parent.background = self.background;
           });
      },

      write: function(document) {
         document.writeln(this.toHTML());
         this.initHTML();
      },

      addChild: function(child) {
         this.children.push(child);
         child.parent = this;
         return this;
      },

      removeChild: function(child) {
         this.children.remove(child);
         child.parent = undefined;
         return this;
      },

      erase: function() {
         this.canvas.fillStyle = this.background;
         this.canvas.fillRect(0, 0, this.width, this.height);
      },

      paintChildren: function() {
         for ( var i = 0 ; i < this.children.length ; i++ ) {
            var child = this.children[i];
            this.canvas.save();
            child.paint();
            this.canvas.restore();
         }
      },

      paint: function() {
         this.erase();
         this.paintChildren();
      }
   }
});


var ProgressCView = FOAM({

   model_: 'Model',

   extendsModel: 'PanelCView',

   name:  'ProgressCView',
   label: 'ProgressCView',

   properties: [
      {
         name:  'value',
         type:  'Value',
         valueFactory: function() { return SimpleValue.create(); },
         postSet: function(newValue, oldValue) {
           oldValue && oldValue.removeListener(this.updateValue);
           newValue.addListener(this.updateValue);
         }
      }
   ],

   listeners: {
     updateValue: function() {
       this.paint();
     }
   },

   methods: {

    paint: function() {
        var c = this.canvas;

        c.fillStyle = '#fff';
        c.fillRect(0, 0, 104, 20);

        c.strokeStyle = '#000';
        c.strokeRect(0, 0, 104, 20);
        c.fillStyle = '#f00';
        c.fillRect(2, 2, parseInt(this.value.get()), 16);
    },

    destroy: function() {
      this.value.removeListener(this.listener_);
    }
   }
});


/*
var FilteredModel = FOAM({

   model_: 'Model',

   name: 'FilteredModel',

   properties: [
      {
         name:  'delegate',
         type:  'Model',
         postSet: function(model) {
            this.filteredValue = undefined;
         }
      },
      {
         name:  'filteredValue',
         type:  'Array[Object]'
      },
      {
         name:  'predicate',
         type:  'predicate',
         defaultValue: function() {
             return true;
         },
         postSet: function() {
            this.filteredValue = undefined;
         }
      }
   ],

   methods: {
      get: function() {
         if ( ! this.filteredValue )
         {
            var val = this.delegate.get();

            this.filteredValue = [];

            for ( var i = 0 ; i < val.length ; i++ )
            {
               if ( this.predicate(val[i]) ) this.filteredValue.push(val[i]);
            }
         }

         return this.filteredValue;
      },

      set: function(val) {
         this.delegate.set(val);

         this.filteredValue = undefined;

         return this;
      }

      addListener: function(listener)
      {
         return this.delegate.addListener(val);
      },

      removeListener: function(listener)
      {

      }

   }
});
*/



var Graph = FOAM({
   model_: 'Model',

   extendsModel: 'PanelCView',

   name:  'Graph',

   properties: [
      {
         name:  'style',
         type:  'String',
         defaultValue: 'Line',
         // TODO: fix the view, it's not storabe
         view: {
            create: function() { return ChoiceView.create({choices: [
              'Bar',
              'Line',
              'Point'
            ]});}
         }
      },
      {
         name:  'width',
         type:  'int',
         view:  'IntFieldView',
         defaultValue: 5
      },
      {
         name:  'height',
         type:  'int',
         view:  'IntFieldView',
         defaultValue: 5
      },
      {
         name:  'graphColor',
         type:  'String',
         defaultValue: 'green'
      },
      {
         name:  'backgroundColor',
         type:  'String',
         defaultValue: undefined
      },
      {
         name:  'lineWidth',
         type:  'int',
         defaultValue: 6
      },
      {
         name:  'drawShadow',
         type:  'boolean',
         defaultValue: true
      },
      {
         name:  'capColor',
         type:  'String',
         defaultValue: ''
      },
      {
         name:  'axisColor',
         type:  'String',
         defaultValue: 'black'
      },
      {
         name:  'gridColor',
         type:  'String',
         defaultValue: undefined
      },
      {
         name:  'axisSize',
         type:  'int',
         defaultValue: 2
      },
      {
         name:  'xAxisInterval',
         type:  'int',
         defaultValue: 0
      },
      {
         name:  'yAxisInterval',
         type:  'int',
         defaultValue: 0
      },
      {
         name:  'maxValue',
         label: 'Maximum Value',
         type:  'float',
         defaultValue: -1
      },
      {
         name:  'data',
         type:  'Array[float]',
         valueFactory: function() {
            return [];
         }
//       defaultValue: []
      },
      {
         name: 'f',
         label: 'Data Function',
         type: 'Function',
         required: false,
         displayWidth: 70,
         displayHeight: 3,
         view: 'FunctionView',
         defaultValue: function (x) { return x; },
         help: 'The graph\'s data function.'
      }

   ],

   issues: [
    {
      id: 1000,
      severity: 'Major',
      status: 'Open',
      summary: 'Make \'style\' view serializable',
      created: 'Sun Dec 23 2012 18:14:56 GMT-0500 (EST)',
      createdBy: 'kgr',
      assignedTo: 'kgr',
      notes: 'ChoiceView factory prevents Model from being serializable.'
    }
   ],

   methods: {
      paintLineData: function(canvas, x, y, xs, w, h, maxValue) {
         if ( this.graphColor ) {
           canvas.fillStyle = this.graphColor;
           canvas.beginPath();
           canvas.moveTo(x+xs, y+h-xs);
           for ( var i = 0 ; i < this.data.length ; i++ ) {
             var d = this.f(this.data[i]);
             var lx = x+xs+(i==0?0:w*i/(this.data.length-1));
             var ly = this.toY(d, maxValue);

             canvas.lineTo(lx, ly);
           }

           canvas.lineTo(x+this.width-1, y+h-xs);
           canvas.lineTo(x+xs, y+h-xs);
           canvas.fill();
         }

         if ( this.capColor ) {
           if ( this.drawShadow ) {
             canvas.shadowOffsetX = 0;
             canvas.shadowOffsetY = 2;
             canvas.shadowBlur = 2;
             canvas.shadowColor = "rgba(0, 0, 0, 0.5)";
           }

           canvas.strokeStyle = this.capColor;
           canvas.lineWidth = this.lineWidth;
           canvas.lineJoin = 'round';
           canvas.beginPath();
           for ( var i = 0 ; i < this.data.length ; i++ ) {
             var d = this.f(this.data[i]);
             var lx = this.toX(i)+0.5;
             var ly = this.toY(d, maxValue)/*+0.5*/-5;

             if ( i == 0 )
               canvas.moveTo(lx, ly);
             else
               canvas.lineTo(lx, ly);
           }

           canvas.stroke();
         }
      },


      paintPointData: function(canvas, x, y, xs, w, h, maxValue)
      {
         canvas.shadowOffsetX = 2;
         canvas.shadowOffsetY = 2;
         canvas.shadowBlur = 2;
         canvas.shadowColor = "rgba(0, 0, 0, 0.5)";

         canvas.strokeStyle = this.capColor;
         canvas.lineWidth = 2;
         canvas.lineJoin = 'round';
         canvas.beginPath();
         for ( var i = 0 ; i < this.data.length ; i++ )
         {
            var d = this.f(this.data[i]);
            var lx = this.toX(i)+0.5;
            var ly = this.toY(d, maxValue)+0.5;

            if ( i == 0 )
               canvas.moveTo(lx, ly);
            else
               canvas.lineTo(lx, ly);
         }

         canvas.stroke();

         canvas.lineWidth = 3;
         for ( var i = 0 ; i < this.data.length ; i++ )
         {
            var d = this.f(this.data[i]);
            var lx = this.toX(i)+0.5;
            var ly = this.toY(d, maxValue)+0.5;

            canvas.beginPath();
            canvas.arc(lx,ly,4,0,-Math.PI/2);
            canvas.closePath();
            canvas.stroke();
         }

      },


      paintBarData: function(canvas, x, y, xs, w, h, maxValue)
      {
         canvas.fillStyle = this.graphColor;

         for ( var i = 0 ; i < this.data.length ; i++ )
         {
            var d = this.f(this.data[i]);
            var x1 = x+xs+w*i/this.data.length;
            var y1 = this.toY(d, maxValue);

            canvas.fillRect(x1, y1, w/this.data.length+1.5, d*h/maxValue);
         }
      },

      paint: function()
      {
         var canvas = this.canvas;
         var x  = this.x;
         var y  = this.y;
         var xs = this.axisSize;
         var w  = this.width-xs;
         var h  = this.height-xs;
         var maxValue = this.maxValue;

         if ( this.backgroundColor ) {
            canvas.fillStyle = this.backgroundColor;
            canvas.fillRect(x,y,w,h);
         }

         if ( maxValue == -1 ) {
            maxValue = 0.001;

            for ( var i = 0 ; i < this.data.length ; i++ ) {
               var d = this.f(this.data[i]);

               maxValue = Math.max(maxValue, d);
            }
         }

         if ( this.style == 'Line' ) this.paintLineData(canvas, x, y, xs, w, h, maxValue);
         else if ( this.style == 'Bar' ) this.paintBarData(canvas, x, y, xs, w, h, maxValue);
         else if ( this.style == 'Point' ) this.paintPointData(canvas, x, y, xs, w, h, maxValue);

         if ( this.axisColor && xs != 0 ) {
            canvas.fillStyle = this.axisColor;
            // x-axis
            canvas.fillRect(x, y+h-xs*1.5, this.width, xs);
            // y-axis
            canvas.fillRect(x, y, xs, this.height-xs*1.5);
         }

         if ( this.xAxisInterval )
         for ( var i = this.xAxisInterval ; i <= this.data.length ; i += this.xAxisInterval )
         {
            var x2 = this.toX(i);

            if ( this.gridColor ) {
               canvas.save();
               canvas.shadowOffsetX = 0;
               canvas.shadowOffsetY = 0;
               canvas.shadowBlur = 0;
               canvas.fillStyle = this.gridColor;
               canvas.fillRect(x2+1.5, this.toY(0,1)-2*xs, 0.5, -this.height);
               canvas.restore();
            }

            canvas.fillRect(x2, this.toY(0,1)-2*xs, xs/2, -xs);
         }

         if ( this.yAxisInterval )
         for ( var i = this.yAxisInterval ; i <= maxValue ; i += this.yAxisInterval )
         {
            var y = this.toY(i, maxValue);

            if ( this.gridColor ) {
               canvas.save();
               canvas.shadowOffsetX = 0;
               canvas.shadowOffsetY = 0;
               canvas.shadowBlur = 0;
               canvas.fillStyle = this.gridColor;
               canvas.fillRect(x+xs, y+3, this.width, 0.5);
               canvas.restore();
            }

            canvas.fillRect(x+xs, y, xs, xs/2);
         }

      },

      toX: function(val) {
         var w  = this.width-this.axisSize;
         return this.x+this.axisSize+(val==0?0:w*val/(this.data.length-1));
      },

      toY: function(val, maxValue) {
         var h  = this.height-this.axisSize;
         return this.y+h-val*h/maxValue+0.5;
      },

      lastValue: function() {
         return this.data[this.data.length-1];
      },

      addData: function(value, opt_maxNumValues) {
         var maxNumValues = opt_maxNumValues || this.width;

         this.data.push(value);
         if ( this.data.length > maxNumValues ) this.data.shift();
      },

      watch: function(value, opt_maxNumValues) {
         var graph = this;

         value.addListener(function() {
           graph.addData(value.get(), opt_maxNumValues);
         });
      }

   }
});


var ViewChoice = FOAM({

   model_: 'Model',

   name: 'ViewChoice',

   tableProperties: [
      'label',
      'view'
   ],

    properties: [
       {
           name: 'label',
           type: 'String',
           displayWidth: 20,
           defaultValue: '',
           help: "View's label."
       },
       {
           name: 'view',
           type: 'view',
           defaultValue: 'DetailView',
           help: 'View factory.'
       }
    ]

});


var AlternateView = FOAM({

   model_: 'Model',

   extendsModel: 'AbstractView',

   name: 'AlternateView',

    properties: [
       {
          name:  'selection'
       },
       {
           name: 'views',
           type: 'Array[ViewChoice]',
           subType: 'ViewChoice',
           view: 'ArrayView',
           defaultValue: [],
           help: 'View choices.'
       },
       {
           name:  'dao',
           label: 'DAO',
           type: 'DAO',
           postSet: function(dao) {
             // HACK: we should just update the dao of the current view,
             // but not all views currently redraw on DAO update.  Swtich
             // once the views are fixed/finished.
             if ( this.view ) this.installSubView(this.view);
//           if (this.view && this.view.model_ && this.view.model_.getProperty('dao')) this.view.dao = dao;
           }
       },
       {
          name:  'view',
          postSet: function(viewChoice) {
             if ( this.elementId ) this.installSubView(viewChoice);
          },
          hidden: true
       }
    ],

   methods: {
      init: function() {
         this.SUPER()

         this.value = SimpleValue.create("");
         this.view = this.views[0];
     },

      installSubView: function(viewChoice) {
        var view = typeof(viewChoice.view) === 'function' ?
          viewChoice.view(this.value.get().model_, this.value) :
          GLOBAL[viewChoice.view].create({
            model: this.value.get().model_,
            value: this.value
          });

        // TODO: some views are broken and don't have model_, remove
        // first guard when fixed.
        if (view.model_ && view.model_.getProperty('dao')) view.dao = this.dao;

        this.$.innerHTML = view.toHTML();
        view.initHTML();
        view.value && view.value.set(this.value.get());
        //       if ( view.set ) view.set(this.model.get());
        //       Events.link(this.model, this.view.model);
      },

      toHTML: function() {
         var str  = [];
         var viewChoice = this.views[0];
         var buttons;

         str.push('<div style="width:100%;margin-bottom:5px;"><div class="altViewButtons">');
         for ( var i = 0 ; i < this.views.length ; i++ ) {
            var view = this.views[i];
            var listener = function(altView, view) { return function (e) {
               altView.view = view;

               // This is a bit hackish, each element should listen on a 'selected'
               // property and update themselves
               for ( var j = 0 ; j < buttons.length ; j++ ) {
                 DOM.setClass($(buttons[j][0]), 'mode_button_active', false);
               }

               DOM.setClass(e.toElement, 'mode_button_active');

               return false;
            };}(this,view);
//          str.push('<a href="#top" id="' + this.registerCallback('click', listener) + '">' + view.label + '</a>');
            str.push('<a class="buttonify" id="' + this.registerCallback('click', listener) + '">' + view.label + '</a>');
            if ( view.label == this.selected ) viewChoice = view;
         }
         str.push('</div>');
         buttons = this.callbacks_;
         this.buttons_ = buttons;

         str.push('<br/>');
// console.log("viewChoice: ", viewChoice);

//       Events.link(this.model, this.view.model);

//       str.push(this.view.toHTML());
         str.push('<div style="width:100%" id="' + this.getID() + '" class="altView"> </div>');
        str.push('</div>');
         return str.join('');
      },


      initHTML: function() {
         this.SUPER();

         if ( ! this.view ) this.view = this.views[0];
         this.installSubView(this.view);

         DOM.setClass($(this.buttons_[0][0]), 'mode_button_active');
         DOM.setClass($(this.buttons_[0][0]), 'capsule_left');
         DOM.setClass($(this.buttons_[this.buttons_.length-1][0]), 'capsule_right');
      }

  }

});



var FloatFieldView = FOAM({

   model_: 'Model',

   name:  'FloatFieldView',

   extendsModel: 'TextFieldView',

   methods: {
     textToValue: function(text) {
       return parseFloat(text);
     }
   }
});


var IntFieldView = FOAM({

   model_: 'Model',

   name:  'IntFieldView',

   extendsModel: 'TextFieldView',

   methods: {
     textToValue: function(text) {
       return parseInt(text);
     }
   }
});


var StringArrayView = FOAM({

   model_: 'Model',

   name:  'StringArrayView',

   extendsModel: 'TextFieldView',

   methods: {
     textToValue: function(text) {
       return text.replace(/\s/g,'').split(',');
     },
     valueToText: function(value) {
       return value ? value.toString() : "";
     }
   }
});


var SplitView = FOAM({

   model_: 'Model',

   extendsModel: 'AbstractView',

   name: 'SplitView',

    properties: [
       {
          name:  'view1',
          label: 'View 1'
       },
       {
          name:  'view2',
          label: 'View 2'
       }
    ],

   methods: {
      init: function() {
        this.SUPER();
/*
         this.view1 = AlternateView.create();
         this.view2 = AlternateView.create();
*/
        this.view1 = DetailView2.create();
        this.view2 = JSView.create();

        this.setValue(SimpleValue.create(""));
      },

      // Sets the Data-Model
      setValue: function(value) {
        this.value = value;
        if ( this.view1 ) this.view1.setValue(value);
        if ( this.view2 ) this.view2.setValue(value);
      },

      set: function(obj) {
         this.value.set(obj);
      },

      get: function() {
         return this.value.get();
      },

      toHTML: function() {
         var str  = [];
         str.push('<table width=80%><tr><td width=40%>');
         str.push(this.view1.toHTML());
         str.push('</td><td>');
         str.push(this.view2.toHTML());
         str.push('</td></tr></table><tr><td width=40%>');
         return str.join('');
      },

      initHTML: function() {
         this.view1.initHTML();
         this.view2.initHTML();
      }
  }

});



var Binding = FOAM({

   model_: 'Model',

   name: 'Binding',

   properties: [
      // TODO: add support for named sub-contexts
      {
         name:  'id',
         hidden: true
      },
      {
         name:  'value',
         hidden: true
      }
   ]
});


var PersistentContext = FOAM({

   model_: 'Model',

   name: 'PersistentContext',

   properties: [
      {
         name:  'dao',
         label: 'DAO',
         type: 'DAO',
         hidden: true
      },
      {
         name:  'context',
         hidden: true
      },
      {
          name: 'predicate',
          type: 'EXPR',
          defaultValueFn: function() { return TRUE; },
          hidden: true
      }
   ],

   methods: {
      /**
       * Manage persistene for an object.
       * Resave it in the DAO whenever it first propertyChange events.
       **/
      manage: function(name, obj) {
         obj.addListener(EventService.merged((function() {
            console.log('PersistentContext', 'updating', name);
            this.dao.put(Binding.create({
               id:    name,
               value: JSONUtil.compact.where(this.predicate).stringify(obj)
             }));
         }).bind(this)));
      },
      bindObjects: function(a) {
         // TODO: implement
      },
      bindObject: function(name, model, createArgs) {
         console.log('PersistentContext', 'binding', name);
        var future = afuture();
        createArgs = createArgs || {};

         if ( this.context[name] ) {
            future.set(this.context[name]);
         } else {
            this.dao.find(name, {
               put: function (binding) {
                  console.log('PersistentContext', 'existingInit', name);
//                  var obj = JSONUtil.parse(binding.value);
//                  var obj = JSON.parse(binding.value);
                  var json = JSON.parse(binding.value);
                  json.__proto__ = createArgs;
                  var obj = JSONUtil.mapToObj(json);
                  this.context[name] = obj;
                  this.manage(name, obj);
                  future.set(obj);
               }.bind(this),
               error: function() {
                  console.log('PersistentContext', 'newInit', name);
                  var obj = model.create(createArgs);
                  this.context[name] = obj;
                  this.manage(name, obj);
                  future.set(obj);
               }.bind(this)
            });
         }

         return future.get;
      }
  }
});

var ListValueView = FOAM({
  model_: 'Model',

  name: 'ListValueView',
  help: 'Combines an input view with a value view for the edited value.',

  extendsModel: 'AbstractView',

  properties: [
    {
      name: 'valueView',
    },
    {
      name: 'inputView'
    },
    {
      name: 'value',
      valueFactory: function() { return SimpleValue.create({ value: [] }); },
      postSet: function(newValue, oldValue) {
        this.inputView.setValue(newValue);
        this.valueView.value = newValue;
      }
    }
  ],

  methods: {
    toHTML: function() {
      return this.valueView.toHTML() + this.inputView.toHTML();
    },
    setValue: function(value) {
      this.value = value;
    },
    initHTML: function() {
      this.SUPER();
      this.valueView.initHTML();
      this.inputView.initHTML();
    }
  }
});

var ListInputView = FOAM({
  model_: 'Model',

  extendsModel: 'AbstractView',

  name: 'ListInputView',

  properties: [
    {
      name: 'dao',
      help: 'The DAO to fetch autocomplete objects from.',
    },
    {
      name: 'property',
      help: 'The property model to map autocomplete objecst to values with.'
    },
    {
      model_: 'ArrayProperty',
      name: 'searchProperties',
      help: 'The properties with which to construct the autocomplete query with.'
    },
    {
      name: 'autocompleteView',
    },
    {
      name: 'value',
      help: 'The array value we are editing.',
      valueFactory: function() {
        return SimpleValue.create({
          value: []
        });
      }
    },
    {
      name: 'domInputValue',
    },
  ],

  methods: {
    toHTML: function() {
      this.registerCallback('keydown', this.onKeyDown, this.getID());

      return '<input id="' + this.getID() + '">' + this.autocompleteView.toHTML();
    },
    setValue: function(value) {
      this.value = value;
    },
    initHTML: function() {
      this.SUPER();
      this.autocompleteView.initHTML();
      this.domInputValue = DomValue.create(this.$, 'input');
      this.domInputValue.addListener(this.onInput);
    },
    pushValue: function(v) {
      this.value.set(this.value.get().concat(v));
      this.domInputValue.set('');
      // Previous line doesn't trigger listeners.
      this.onInput();
    },
    popValue: function() {
      var value = this.value.get().slice();
      value.pop();
      this.value.set(value);
    }
  },

  listeners: [
    {
      name: 'onInput',
      code: function() {
        var value = this.domInputValue.get();

        if ( value.charAt(value.length - 1) === ',' ) {
          if ( value.length > 1 ) this.pushValue(value.substring(0, value.length - 1));
          else this.domInputValue.set('');
          return;
        }

        if ( value === '' ) {
          this.autocompleteView.dao = this.dao.where(FALSE);
          return;
        }

        var predicate = OR();
        var value = this.domInputValue.get();
        for ( var i = 0; i < this.searchProperties.length; i++ ) {
          predicate.args.push(STARTS_WITH(this.searchProperties[i], value));
        }
        value = this.value.get();
        if ( value.length > 0 ) {
          predicate = AND(NOT(IN(this.property, value)), predicate);
        }
        this.autocompleteView.dao = this.dao.where(predicate);
      }
    },
    {
      name: 'onKeyDown',
      code: function(e) {
        if ( e.keyCode === 40 /* down */) {
          this.autocompleteView.nextSelection();
          e.preventDefault();
        } else if ( e.keyCode === 38 /* up */ ) {
          this.autocompleteView.prevSelection();
          e.preventDefault();
        } else if ( e.keyCode === 13 /* RET */ ) {
          if ( this.autocompleteView.value.get() ) {
            this.pushValue(
              this.property.f(this.autocompleteView.value.get()));
            e.preventDefault();
          }
        } else if ( e.keyCode === 8 && this.domInputValue.get() === '' ) {
          this.popValue();
        }
      }
    },
  ]
});

var ArrayTileView = FOAM({
  model_: 'Model',

  extendsModel: 'AbstractView',

  name: 'ArrayTileView',

  properties: [
    {
      name: 'dao',
    },
    {
      name: 'property',
    },
    {
      name: 'tileView',
    },
    {
      name: 'value',
      valueFactory: function() { return SimpleValue.create(); },
      postSet: function(newValue, oldValue) {
        oldValue && oldValue.removeListener(this.paint);
        newValue.addListener(this.paint);
      }
    },
    {
      model_: 'BooleanProperty',
      name: 'painting',
      defaultValue: false
    }
  ],

  methods: {
    toHTML: function() {
      return '<ul id="' + this.getID() + '" class="arrayTileView"></ul>';
    },
  },

  listeners: [
    {
      name: 'paint',
      animate: true,
      code: function() {
        if ( this.painting ) {
          this.paint();
          return;
        }

        this.painting = true;
        this.children = [];
        var value = this.value.get();
        var count = value.length;
        var self = this;
        var render = function() {
          self.$.innerHTML = self.children.map(
            function(c) { return '<li class="arrayTileItem">' + c.toHTML() + '</li>'; }).join('');
          self.children.forEach(
            function(c) { c.initHTML(); });
          self.painting = false;
        };

        if ( value.length == 0 ) render();
        for ( var i = 0; i < value.length; i++ ) {
          this.dao.find(EQ(this.property, value[i]), {
            put: function(obj) {
              var view = self.tileView.create();
              view.value.set(obj);
              self.addChild(view);
              count--;
              if ( count == 0 ) render();
            },
            error: function() {
              // Ignore missing values
              count--;
              if ( count == 0 ) render();
            },
          });
        }
      }
    }
  ]
});

var AutocompleteListView = FOAM({
  model_: 'Model',

  extendsModel: 'AbstractView',

  name: 'AutocompleteListView',

  properties: [
    {
      name: 'dao',
      postSet: function(newValue, oldValue) {
        oldValue && oldValue.unlisten(this.paint);
        newValue.listen(this.paint);
        this.value.set('');
        this.paint();
      },
      hidden: true
    },
    {
      name: 'next'
    },
    {
      name: 'prev'
    },
    {
      name: 'value',
      hidden: true,
      valueFactory: function() { return SimpleValue.create(); },
      postSet: function(newValue, oldValue) {
        if ( oldValue ) {
          oldValue.removeListener(this.paint);
        }
        newValue.addListener(this.paint);
      }
    },
    {
      name: 'model',
      hidden: true
    },
    {
      name: 'innerView',
      type: 'AbstractView',
      preSet: function(value) {
        if ( typeof value === "string" ) value = GLOBAL[value];
        return value;
      },
      defaultValueFn: function() {
        return this.model.listView;
      }
    },
    {
      model_: 'IntegerProperty',
      name: 'count'
    },
    {
      model_: 'BooleanProperty',
      name: 'painting',
      defaultValue: false
    },
    {
      model_: 'IntegerProperty',
      name: 'left',
    },
    {
      model_: 'IntegerProperty',
      name: 'top'
    },
    {
      model_: 'BooleanProperty',
      name: 'float'
    },
  ],

  methods: {
    setValue: function(value) {
      this.value = value;
    },

    toHTML: function() {
      return '<ul class="listView" id="' + this.getID() + '"></ul>';
    },

    initHTML: function() {
      this.SUPER();
      this.$.style.display = 'none';
      if ( this.float ) {
        this.$.className = 'listViewFloat';
        var self = this;
        this.propertyValue('left').addListener(function(v) {
          self.$.left = v;
        });
        this.propertyValue('top').addListener(function(v) {
          self.$.top = v;
        });
      }
    },

    nextSelection: function() {
      this.value.set(this.next);
    },

    prevSelection: function() {
      this.value.set(this.prev);
    }
  },

  listeners: [
    {
      name: 'paint',
      animate: true,
      code: function() {
        // TODO Determine if its worth double buffering the dom.

        // Don't start a new paint if we're in the middle of one.
        if ( this.painting) {
          this.paint();
          return;
        }

        // Clear old list
        this.$.innerHTML = '';
        this.painting = true;
        var self = this;

        var found = false;
        var first;
        var second;
        self.next = '';
        self.prev = '';

        this.dao.limit(this.count).select({
          put: function(obj) {
            if ( found && ! self.next ) {
              self.next = obj;
            }

            if ( obj.id === self.value.get().id ) {
              found = true;
            }

            if ( ! found && self.value.get() ) {
              self.prev = obj;
            }

            if ( ! self.value.get() ) {
              self.value.set(obj);
              found = true;
            }

            var view = self.innerView.create({});
            var container = document.createElement('li');
            container.onclick = function() {
              self.value.set(obj);
            };
            container.className = 'listItem';
            if ( obj.id === self.value.get().id ) {
              container.className += ' selectedListItem';
            }
            self.$.appendChild(container);
            view.value.set(obj);
            container.innerHTML = view.toHTML();
            view.initHTML();
            if ( ! first ) {
              first = [obj, container];
            }
            if ( first && ! second ) {
              second = obj;
            }
          },
          eof: function() {
            self.painting = false;
            if ( ! first ) self.$.style.display = 'none';
            else self.$.style.display = '';

            if ( ! found ) {
              if ( ! first ) {
                self.value.set('');
                self.$.style.display = 'none';
              } else {
                self.value.set(first[0]);
                first[1].className += 'selectedListItem';
                self.prev = '';
                self.next = second;
              }
            }
          },
          error: function() {
            console.error.apply(console, arguments);
            self.painting = false;
          }
        });
      }
    }
  ]
});
