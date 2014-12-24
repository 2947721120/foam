var VIDEO_PATH = 'https://x20web.corp.google.com/~kgr/power/videos/DemoDen/';

CLASS({
  name: 'Demo',
  properties: [
    'name', 'path', 'keywords', 'image', 'video', 'description',
    {
      name: 'src',
      defaultValueFn: function() {
        var i = window.location.href.indexOf('DemoCat.html');
        var path = window.location.href.substring(0, i);
        return 'view-source: ' + path + this.path;
      }
    }
  ]
});


var demos = JSONUtil.arrayToObjArray(X, [
  {
    name: 'Solar System',
    path: 'SolarSystem.html',
    description: 'An animation which demonstrates reactive-programming.  Use the Time-Wheel to spin-time.  This was the first graphical FOAM demo to be written (in 2011).  I\'ve added the <b>old</b> keyword to this, and other older, non-modernized demos.',
    keywords: ['animation', 'reactive', 'old'],
    src: 'SolarSystem.js',
    image: 'SolarSystem.png',
  },/*
  {
    name: 'Canvas Scrolling',
    path: 'canvasscrolling.html',
    description: 'A demonstration of high-performance canvas (DOM-less) scrolling..',
    keywords: ['canvas'],
    src: 'canvasscrolling.js',
    image: 'canvasscrolling.png',
  },
  */{
    name: 'Reactive Clocks',
    path: 'ReactiveClocks.html',
    description: 'A simple demo of reactive programming.  The first clocks reacts to the position of the mouse while the second clock reacts to the position of the first clock and to time.  Reacting to time essentially gives you an animation system for free.',
    keywords: ['animation', 'reactive'],
    image: 'ReactiveClocks.png',
    video: 'part11.ogv'
  },
  {
    name: 'Unix Simulator',
    path: 'UnixSimulator.html',
    description: "A simulator which demonstrates the advantage of UNIX's architecture over previous operating-sytems.",
    keywords: ['simulation', 'animation', 'architecture', 'old'],
    image: 'UnixSimulator.png',
    video: 'part1.ogv'
  },
  {
    name: 'Google Simulator',
    path: 'GoogleSimulator.html',
    description: 'A simulation of the growth of Google.',
    keywords: ['simulation', 'animation', 'architecture', 'old'],
    image: 'GoogleSimulator.png',
    video: 'part15.ogv'
  },
  {
    name: 'Fading Circles',
    path: 'FadingCircles.html',
    description: 'An reactive-programming animation which demonstrates the use of Events.dynamic() and Movement.animate().',
    keywords: ['animation'],
    image: 'FadingCircles.png'
  },
  {
    name: 'Follow The Leader',
    path: 'FollowTheLeader.html',
    description: 'An animation which uses Movement.moveTowards() to create a chain of circles which follow the mouse.',
    keywords: ['animation'],
    image: 'FollowTheLeader.png'
  },
  {
    name: 'InterpolatedClocks',
    path: 'InterpolatedClocks.html',
    description: 'A demonstration of animation interpolators.  Click to animate the clocks.  Notice how the different clocks use different acceleration curves to reach their targets.',
    keywords: ['animation'],
    image: 'InterpolatedClocks.png'
  },
  {
    name: 'FOAM Architecture Diagram',
    path: 'demoBlockDiagram.html',
    description: 'An animated diagram of FOAM\'s architecture.  Notice the reflections.',
    keywords: ['architecture', 'animation'],
    image: 'DemoBlockDiagram.png',
    video: 'part6.ogv'
  },
  {
    name: 'Dragon Live-Coding',
    path: 'DragonLiveCoding.html',
    description: 'A version of the dragon animation that you can live-code.  Use the Model editor to update methods while the animation is running.',
    keywords: ['animation', 'live-coding'],
    src: 'DragonLiveCoding.js',
    image: 'LiveDragon.png',
    video: 'part12.ogv'
  },
  {
    name: 'Pong',
    path: 'Pong.html',
    description: 'A simple pong game which demonstrates the both the use of graphical traits (motion blur and shadow) and of the physics engine.',
    keywords: ['animation', 'game', 'physics', 'traits', '14'],
    src: 'Pong.js',
    image: 'Pong.png'
  },
  {
    name: 'DAO Samples',
    path: 'dao.html',
    description: 'An extensive set of DAO (Data-Access-Object) samples.  A must read for learning FOAM.',
    keywords: ['DAO', 'database', '14'],
    image: 'DAO.png'
  },
  {
    name: 'Collision',
    path: 'Collision.html',
    description: 'Demonstration of the physics engine and collision-detection.',
    keywords: ['physics', '14'],
    src: 'Collision.js',
    image: 'Collision.png'
  },
  {
    name: 'Collision With Spring',
    path: 'CollisionWithSpring.html',
    description: 'A simple physics simulation which shows the use of springs and collision detection.',
    keywords: ['physics', '14'],
    src: 'CollisionWithSpring.js',
    image: 'CollisionWithSpring.png'
  },
  {
    name: 'Spring',
    path: 'Spring.html',
    description: 'Addictive spring physics simulation.',
    keywords: ['physics', '14'],
    src: 'Spring.js',
    image: 'Spring.png'
  },
  {
    name: 'Trait Graphics',
    path: 'TraitGraphics.html',
    description: 'Demonstrates the use of graphical Traits.  The circles on the left have shadows and those on the right have motion-blur.  Traits are not limited to graphics and are a generalized method for safely providing multiple inheritance.',
    keywords: ['traits','graphics', '14'],
    src: 'TraitGraphics.js',
    image: 'TraitGraphics.png'
  },
  {
    name: 'Internationalization',
    path: 'I18N.html',
    description: 'Simple I18N Example.',
    keywords: ['i18n'],
    src: 'I18N.js',
    image: 'I18N.png'
  },
  {
    name: 'Crop Circles',
    path: 'CropCircle.html',
    description: 'Crop Circle inspired fractals graphics. Can take 10-20 seconds to load on slow machines. Each fractal is implemented in only one line of code.  Just started: needs animation and a graphical live-coding system.',
    keywords: ['graphics', '14'],
    src: 'CropCircle.js',
    image: 'CropCircle.png'
  },
  {
    name: 'Complements',
    path: 'Complements.html',
    description: 'An animated colour wheel.  Ported from the Elm demo.  Shows use of Events.dynamic().',
    keywords: ['animation', '14'],
    image: 'Complements.png'
  },
  {
    name: 'Dragon',
    path: 'Tags.html',
    description: 'Demonstrates use of the FOAM tag to instantiate three views: an animated dragon, a time-wheel, and a DetailView of time.  Use the time-wheel to control the animation.',
    keywords: ['animation', '14'],
    image: 'Dragon.png'
  },
  {
    name: 'Two-Way Data-Binding',
    path: 'TwoWayDataBinding.html',
    description: 'Demonstrates how to do two way data-binding in FOAM. See the same demo implemented <a href="http://n12v.com/2-way-data-binding/?hn">with other JS libraries</a>.',
    keywords: ['tutorial', '14'],
    image: 'TwoWayDataBinding.png'
  },
  {
    name: 'Calculator',
    path: '../apps/calc/Calc.html',
    description: 'A simple calculator application.  Demonstrates the use of templates to completely change the appearance of a DetailView.',
    keywords: ['app', '14'],
    src: '../apps/calc/',
    image: 'Calc.png'
  },
  {
    name: 'Calculator (Material-Design)',
    path: '../apps/acalc/Calc.html',
    description: 'A calculator application with an animated Material-Design interface.',
    keywords: ['app', 'material-design', '14'],
    src: '../apps/acalc/',
    image: 'ACalc.png'
  },
  {
    name: 'GMail (Material-Design)',
    path: '../apps/gmail/main.html',
    description: 'A simple mobile GMail client with a Material-Design interface, in less than 1k lines of code.',
    keywords: ['app', 'material-design', 'gmail', 'mobile', '14'],
    src: '../apps/gmail/',
    image: 'GMail.png'
  },
  {
    name: 'QuickBug',
    path: 'https://chrome.google.com/webstore/detail/quickbug/hmdcjljmcglpjnmmbjhpialomleabcmg',
    description: 'A Chrome packaged-app clone of the crbug.com issue tracker.  Provides many extra features and improved performance.  Be sure to try out grid-view\'s drag-and-drop tiles and PIE charts with warped scrolling features. See: <a href="http://quickbug.foamdev.com">http://quickbug.foamdev.com</a>',
    keywords: ['app', '14'],
    src: '../apps/quickbug/',
    image: 'QuickBug.png'
  },
  {
    name: 'Issue Tracker (Material-Design)',
    path: '../apps/mbug/main.html',
    description: 'A simple mobile code.google.com issue-tracker client with a Material-Design interface.  Triage your Crbugs on the go.  See: <a href="http://mbug.foamdev.com">http://mbug.foamdev.com</a>',
    keywords: ['app', 'material-design', 'mobile', '14', 'android'],
    src: '../apps/mbug/',
    image: 'MBug.png'
  },
  {
    name: 'Phone Catalog',
    path: '../apps/phonecat/Cat.html',
    description: 'A port of an Angular application for browsing a Cellphone catalog.  Create this app yourself by following the <a href="http://foam-framework.github.io/foam/tutorial/0-intro/">tutorial</a>.',
    keywords: ['tutorial', '14'],
    src: '../apps/phonecat/',
    image: 'PhoneCat.png'
  },
  {
    name: 'Quick-Compose',
    path: 'https://chrome.google.com/webstore/detail/quickcompose/elckoikggmpkacmbmpbgdepginigahja',
    description: 'A Chrome App for composing (and sending) quick GMails.  Compose emails while offline and have them delivered when you eventually get a network connection.',
    keywords: ['app', '14'],
    src: '../apps/quickcompose/',
    image: 'QuickCompose.png'
  },
  {
    name: 'Todo',
    path: '../apps/todo/Todo.html',
    description: 'A FOAM implementation of the <a href="http://todomvc.com">http://todomvc.com</a> comparison application.  Notice that the FOAM implementation is by far the shortest listed on the TodoMVC site.',
    keywords: ['tutorial', '14'],
    src: '../apps/todo/',
    image: 'Todo.png'
  },
  {
    name: 'FOAM Code Browser',
    path: '../core/fobrowser.html',
    description: 'A FOAM Model browser.',
    keywords: ['tool', 'dev'],
    src: '../core/fobrowser.js',
    image: 'FOBrowser.png'
  },
  {
    name: 'FOAM Documentation Browser',
    path: '../apps/docs/docbrowser.html',
    description: 'A FOAM Document browser.',
    keywords: ['tool', 'dev', 'docs'],
    src: '../apps/docs/',
    image: '../../apps/docs/images/Model_runtime2.png'
  },
  {
    name: 'DAO Sync',
    path: 'SyncDemo.html',
    description: 'Demonstration of the sync protocol/implementation do synchronize two DAOs.',
    keywords: ['dao', 'sync'],
    image: 'sync.png',
    src: 'SyncDemo.js',
  },
  {
    name: 'FOAM Demo Catalog',
    path: 'DemoCat.html',
    description: 'A FOAM Demo browser.  The demo you\'re currently running.',
    keywords: ['docs', 'demo'],
    src: 'DemoCat.js',
    image: 'DemoCat.png'
  },
], Demo).dao;


CLASS({
  name: 'Controller',
  properties: [
    { name: 'search', view: { factory_: 'TextFieldView', onKeyMode: true } },
    { name: 'dao', defaultValue: demos },
    {
      name: 'filteredDAO',
      model_: 'DAOProperty',
      view: { factory_: 'DAOListView', mode: 'read-only' },
      dynamicValue: function() {
        return this.dao.where(CONTAINS_IC(SEQ(Demo.NAME, Demo.DESCRIPTION, Demo.KEYWORDS), this.search));
      }
    }
  ],
  methods: {
    init: function() {
      this.SUPER();
      var i = window.location.href.indexOf('?q=');
      if ( i != -1 ) this.search = window.location.href.substring(i+3);
    }
  },
  templates: [
    function CSS() {/*
      .thumbnail { margin-bottom: 40px; }
      .screenshot {
        border: 1px solid gray;
        box-shadow: 5px 5px 15px gray;
        margin-left: 30px;
        margin-top: -38px;
      }
      span[name="description"] {
        margin-top: 24px;
        display: block;
        width: 500px;
    */},
    function toDetailHTML() {/*
        &nbsp;&nbsp; Search: $$search
        <p>
        <foam f="filteredDAO" className="demos" tagName="ul">
          <li class="thumbnail">
            <a href="%%data.path" class="thumb">$$name{mode: 'read-only'}</a>
            <br>
            <% if ( this.data.image ) { %> <br><a href="%%data.path"><img class="screenshot" width=250 height=250 src="democat/%%data.image"></a> <% } %>
            <p>$$description{mode: 'read-only', escapeHTML: false}</p>
            <b>Keywords:</b> <%= this.data.keywords.join(', ') %><br>
            <b>Source:</b> <a href="%%data.src">here</a><br>
            <% if ( VIDEO_PATH && this.data.video ) { %>
            <b>Video:</b> <a href="<%= VIDEO_PATH + this.data.video%>"><img style="vertical-align:middle;" width=30 height=30 src="democat/movie-clip-icon.png"></a>
            <% } %>
            <br>
          </li>
        </foam>
    */}
  ]
});
