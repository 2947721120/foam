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
  package: 'com.google.watlobby',
  name: 'Topic',

  properties: [
    {
      name: 'topic'
    },
    {
      name: 'image'
    },
    {
      name: 'colour'
    },
    {
      name: 'r'
    },
    {
      name: 'roundImage'
    }
  ]
});


CLASS({
  package: 'com.google.watlobby',
  name: 'Bubble',

  extendsModel: 'foam.demos.physics.PhysicalCircle',

  requires: [ 'foam.graphics.ImageCView' ],

  imports: [ 'lobby' ],

  properties: [
    {
      name: 'topic'
    },
    {
      name: 'image'
    },
    {
      name: 'roundImage'
    }
  ],

  methods: [
    function initCView() {
      this.SUPER();

      if ( this.image ) {
        var img = this.ImageCView.create({src: this.image});
        this.addChild(img);
        this.img = img;
      }
    },
    function setSelected(selected) {
      if ( this.cancel_ ) {
        this.cancel_();
        this.cancel_ = null;
      }
      if ( selected ) {
        this.oldMass_ = this.mass;
        this.oldR_ = this.r;

        this.mass = this.INFINITE_MASS;
        this.vx = this.vy = 0;
        this.cancel_ = Movement.animate(2000, function() {
          var width = this.lobby.width;
          var height = this.lobby.height;
          this.r = Math.min(width, height)/2.4;
          this.x = width/2;
          this.y = height/2;
        }.bind(this), null, function() { /*self.collider.stop(); self.timer.stop();*/ })();
      } else {
        this.mass = this.oldMass_;
        this.cancel_ = Movement.animate(1000, function() {
          this.r = this.oldR_;
        }.bind(this), null, function() { /*self.collider.stop(); self.timer.stop();*/ })();
      }
    },
    function paintSelf() {
      if ( this.image ) {
        var d, s;
        if ( this.roundImage ) {
          this.borderWidth = 0;
          d = 2 * this.r;
          s = -this.r;
        } else {
          d = 2 * this.r * Math.SQRT1_2;
          s = -this.r * Math.SQRT1_2;
        }
        this.img.x = this.img.y = s;
        this.img.width = this.img.height = d;
      }
      this.SUPER();
    }
  ]
});


CLASS({
  package: 'com.google.watlobby',
  name: 'Lobby',
  extendsModel: 'foam.graphics.CView',

  requires: [
    'com.google.watlobby.Bubble',
    'foam.demos.physics.PhysicalCircle',
    'foam.physics.Collider',
    'foam.demos.ClockView',
    'foam.util.Timer'
  ],

  imports: [ 'timer' ],
  exports: [ 'as lobby' ],

  constants: {
    COLOURS: ['#33f','#f00','#fc0', '#3c0']
  },

  properties: [
    { name: 'timer' },
    { name: 'n',          defaultValue: 30 },
    { name: 'width',      defaultValue: window.innerWidth },
    { name: 'height',     defaultValue: window.innerHeight },
    { name: 'background', defaultValue: '#ccf' },
    { name: 'collider',   factory: function() {
      return this.Collider.create();
    }},
    {
      name: 'topics',   factory: function() {
      return JSONUtil.arrayToObjArray(this.X, [
        { topic: 'chrome',       image: 'chrome.png',       r: 180, roundImage: true, colour: 'red' },
        { topic: 'flip',         image: 'flip.jpg',         r: 100, colour: 'red' },
        { topic: 'googlecanada', image: 'googlecanada.gif', r: 200 },
        { topic: 'inbox',        image: 'inbox.png',        r: 160 },
        { topic: 'gmailoffline', image: 'gmailoffline.jpg', r: 160 },
        { topic: 'fiber',        image: 'fiber.jpg',        r: 180 },
        { topic: 'foam',         image: 'foampowered.png',  r: 100 },
        { topic: 'inwatvideo',   image: 'inwatvideo.png', roundImage: true, r: 100 },
        // chromebook, mine sweeper, calculator, I'm feeling lucky
        // thtps://www.youtube.com/watch?v=1Bb29KxXzDs, https://youtu.be/1Bb29KxXzDs

      ], this.Topic);
    }}
  ],

  listeners: [
    {
      name: 'onClick',
      code: function(evt) {
        var self = this;
        // console.log('********************* onClick', evt);
        var child = this.collider.findChildAt(evt.clientX, evt.clientY);
        if ( child === this.selected ) return;

        if ( this.selected ) {
          this.selected.setSelected(false);
          this.selected = null;
        }

        if ( child && child.setSelected ) {
          this.selected = child
          child.setSelected(true);
        }
      }
    }
  ],

  methods: [
    function initCView() {
      this.SUPER();

      if ( ! this.timer ) {
        this.timer = this.Timer.create();
        this.timer.start();
      }

      var N = this.n;
      for ( var i = 0 ; i < N ; i++ ) {
        var colour = this.COLOURS[i % this.COLOURS.length];
        var c = this.Bubble.create({
          r: 20 + Math.random() * 50,
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          borderWidth: 6,
          color: 'white',
          border: colour
        });
        if ( i < this.topics.length ) {
          var t = this.topics[i];
          c.topic = t;
          c.image = t.image;
          c.r = t.r;
          c.roundImage = t.roundImage;
          if ( t.colour ) c.border = t.colour;
        }
        this.addChild(c);

        c.mass = c.r/50;
        Movement.gravity(c, 0.03);
        Movement.inertia(c);
        Movement.friction(c, 0.96);
        this.bounceOnWalls(c, this.width, this.height);
        this.collider.add(c);
      }

      for ( var i = 0 ; i < 200 ; i++ ) {
        var b = this.PhysicalCircle.create({
          r: 5,
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          borderWidth: 0.5,
          color: 'rgba(0,0,255,0.2)',
          border: '#blue',
//          color: 'rgba(100,100,200,0.2)',
//          border: '#55a',
          mass: 0.6
        });

        b.y$.addListener(function(b) {
          if ( b.y < 1 ) {
            b.y = this.height;
            b.x = this.width * Math.random();
          }
        }.bind(this, b));

        b.vy = -4;
        Movement.inertia(b);
        Movement.gravity(b, -0.2);
        Movement.friction(b);
        this.collider.add(b);

        this.addChild(b);

//        this.view.$.addEventListener('click', this.onClick);
       document.body.addEventListener('click', this.onClick);

      }

      var clock = this.ClockView.create({x:this.width-70,y:70, r:60});
      this.addChild(clock);

      this.collider.start();
    },

    function bounceOnWalls(c, w, h) {
      Events.dynamic(function() { c.x; c.y; }, function() {
        var r = c.r + c.borderWidth;
        if ( c.x < r     ) { c.vx += 0.2; c.vy -= 0.19; }
        if ( c.x > w - r ) { c.vx -= 0.2; c.vy += 0.19; }
        if ( c.y < r     ) { c.vy += 0.2; c.vx += 0.19; }
        if ( c.y > h - r ) { c.vy -= 0.2; c.vx -= 0.19; }
      });
    },

    function destroy() {
      this.SUPER();
      this.collider.destroy();
    }
  ]
});
