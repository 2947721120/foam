/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved
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
var canv = X.CView2.create({width: 1000, height: 300});
canv.write(document);

var outerLayout = X.canvas.LinearLayout.create();
canv.addChild(outerLayout);

var view = X.canvas.LinearLayout.create({width: 120, height: 300});
outerLayout.addChild(view);

MODEL({
  name: 'LRectangle',
  extendsModel: 'canvas.Rectangle',
  traits: [ 'layout.LayoutItemHorizontalTrait' ],
  
  methods: {
    init: function() {
      this.SUPER();
      
    }
  }
  
});
MODEL({
  name: 'LRectangle2',
  extendsModel: 'canvas.Rectangle',
  traits: [ 'layout.LayoutItemHorizontalTrait' ],

  methods: {
    init: function() {
      this.SUPER();

      this.horizontalConstraints.min.val = 50;
      this.horizontalConstraints.max.val = 400;
      this.horizontalConstraints.preferred.val = 200;
      this.horizontalConstraints.shrinkFactor = 1;
    }
  }

});


MODEL({
  name: 'LLabel',
  extendsModel: 'canvas.Label',
  traits: [ 'layout.LayoutItemHorizontalTrait' ],

  properties: [
    {
      model_: 'BooleanProperty',
      name: 'isShrinkable',
      defaultValue: false,
      documentation: function() {/* Indicates if the minimum size constraint should
        be the same as the preferred size, preventing font shrinking. */}
    }
  ],

  methods: {
    init: function() {
      this.SUPER();

      Events.dynamic( function() { this.text; this.font; this.canvas; }.bind(this), this.updatePreferred );
      this.updatePreferred();
    }
  },
  listeners: [
    {
      name: 'updatePreferred',
      isFramed: true,
      code: function() {
        var c = this.canvas;
        if (c) {
          c.save();
          if (this.font) c.font = this.font;
          this.horizontalConstraints.preferred.val = c.measureText(this.text).width;
          c.restore();
          if (!this.isShrinkable) { // if no shrink, lock minimum to preferred
            this.horizontalConstraints.min.val = this.horizontalConstraints.preferred.val;
          }
        }
      }
    }
  ]


});

var rect1 = view.X.LRectangle.create({
       x: 0,
       y: 20,
       border: 'black',
       width: 120,
       height: 30,
  
});
view.addChild(rect1);

var rect2 = view.X.LLabel.create({
       x: 60,
       y: 25,
       color: 'blue',
       width: 120,
       height: 30,
       text: 'Hello World'
  
});
view.addChild(rect2);

var rect3 = view.X.LRectangle.create({
       x: 120,
       y: 30,
       border: 'red',
       width: 120,
       height: 30,
  
});
view.addChild(rect3);

var rect4 = view.X.LRectangle.create({
       x: 120,
       y: 30,
       border: 'green',
       width: 120,
       height: 30,
  
});
outerLayout.addChild(rect4);

//view.performLayout();
var mouse = X.Mouse.create();
mouse.connect(canv.$);

Events.dynamic(function() { mouse.x; mouse.y; }, function() {
  outerLayout.width = mouse.x;
  outerLayout.height = mouse.y;
});

var editor1 = X.DetailView.create({ data: rect1 });
editor1.write(document);

var editor2 = X.DetailView.create({ data: rect2});
editor2.write(document);

var editor3 = X.DetailView.create({ data: rect3});
editor3.write(document);

var editor4 = X.DetailView.create({ data: rect4});
editor4.write(document);

var editorV = X.DetailView.create({data: view});
editorV.write(document);

// var label = X.canvas.Label.create({
//      x: 20,
//      y: 20,
//      color: 'black',
//      width: 100,
//      height: 30,
//      text: "hello world",
//      font: "12pt Roboto"
//    });
// var box = X.canvas.Rectangle.create({
//     x: 10,
//     y: 10,
//     color: '#ff00ff',
//     width: 100,
//     height: 20,
//     border: "blue"
//   });
//
// var circle = X.Circle2.create({
//    x: 10,
//    y: 10,
//    color: 'red',
//    radius: 20,
//
//  });
//
// view.addChild(box);
// view.addChild(circle);
// view.addChild(label);

