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
  package: 'foam.ui',

  name: 'Window',

  exports: [
    '$$',
    '$',
    'addStyle',
    'animate',
    'cancelAnimationFrame',
    'clearInterval',
    'clearTimeout',
    'console',
    'document',
    'dynamic',
    'error',
    'info',
    'installedModels',
    'log',
    'lookup',
    'requestAnimationFrame',
    'setInterval',
    'setTimeout',
    'warn',
    'window',
    'as FOAMWindow'
  ],

  properties: [
    {
      name: 'registeredModels',
      factory: function() { return {}; }
    },
    {
      model_: 'StringProperty',
      name: 'name',
      defaultValue: 'window'
    },
    {
      name: 'window',
      postSet: function(_, w) {
        // TODO: This would be better if ChromeApp.js added this behaviour
        // in a SubModel of Window, ie. ChromeAppWindow
        if ( this.X.subDocument ) this.X.subDocument(w.document);

        w.X = this.Y;
        this.document = w.document;
      }
    },
    {
      name: 'document'
      // postSet to reset installedModels?
    },
    {
      name: 'installedModels',
      documentation: "Each new Window context introduces a new document and resets installedModels so models will install again in the new document.",
      factory: function() { return {}; }
    },
    {
      model_: 'BooleanProperty',
      name: 'isBackground',
      defaultValue: false
    },
    {
      name: 'console',
      lazyFactory: function() { return this.window.console; }
    },
  ],

  methods: {
    lookup: function(key) {
      var ret = GLOBAL.lookup.call(this.Y, key);
      // var ret = this.X.lookup(key);
      if ( ret && ! this.registeredModels[key] ) {
        // console.log('Registering Model: ', key);
        this.registeredModels[key] = true;
      }
      return ret;
    },
    addStyle: function(css) {
      if ( ! this.document || ! this.document.createElement ) return;
      var s = this.document.createElement('style');
      s.innerHTML = css;
      this.document.head.insertBefore(
        s,
        this.document.head.firstElementChild);
    },
    log:   function() { this.console.log.apply(this.console, arguments); },
    warn:  function() { this.console.warn.apply(this.console, arguments); },
    info:  function() { this.console.info.apply(this.console, arguments); },
    error: function() { this.console.error.apply(this.console, arguments); },
    $: function(id) {
      return ( this.document.FOAM_OBJECTS && this.document.FOAM_OBJECTS[id] ) ?
        this.document.FOAM_OBJECTS[id] :
        this.document.getElementById(id);
    },
    $$: function(cls) {
      return this.document.getElementsByClassName(cls);
    },
    dynamic: function(fn, opt_fn) {
      return Events.dynamic(fn, opt_fn, this.Y);
    },
    animate: function(duration, fn, opt_interp, opt_onEnd) {
      return Movement.animate(duration, fn, opt_interp, opt_onEnd, this.Y);
    },
    setTimeout: function(f, t) {
      return this.window.setTimeout.apply(this.window, arguments);
    },
    clearTimeout: function(id) { this.window.clearTimeout(id); },
    setInterval: function(f, t) {
      return this.window.setInterval.apply(this.window, arguments);
    },
    clearInterval: function(id) { this.window.clearInterval(id); },
    requestAnimationFrame: function(f) {
      if ( this.isBackground ) return this.setTimeout(f, 16);

      console.assert(
        this.window.requestAnimationFrame,
        'requestAnimationFrame not defined');
      return this.window.requestAnimationFrame(f);
    },
    cancelAnimationFrame: function(id) {
      if ( this.isBackground ) {
        this.clearTimeout(id);
        return;
      }

      this.window.cancelAnimationFrame && this.window.cancelAnimationFrame(id);
    }
  }
});


// Using the existence of 'process' to determine that we're running in Node.
(function() {
  var w = foam.ui.Window.create(
    {
      window: window,
      name: 'DEFAULT WINDOW',
      isBackground: typeof process === 'object'
    }, X
  );
  FObject.X = X = w.Y;
})();
