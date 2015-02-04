/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
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
  package: 'foam.util',
  name: 'Base64Decoder',
  constants: {
    TABLE: (function() {
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/';
      function toValue(c) {
        return c == 43 ? 62 : c == 47 ? 63 : c < 58 ? c+4 : c < 91 ? c-65 : c-71;
      }
      var ret = {};
      for (var i = 0; i < chars.length; i++ ) {
        ret[chars[i]] = toValue(chars[i].charCodeAt(0));
      }
      // Add URL Safe characters
      ret["-"] = 62;
      ret["_"] = 63;
      return ret;
    })()
  },
  properties: [
    {
      model_: 'IntProperty',
      name: 'bufsize',
      help: 'Size of the internal buffer to use.',
      defaultValue: 512
    },
    {
      name: 'buffer',
      factory: function() {
        return new ArrayBuffer(this.bufsize);
      }
    },
    {
      model_: 'IntProperty',
      name: 'pos',
      defaultValue: 0
    },
    {
      model_: 'IntProperty',
      name: 'chunk',
      defaultValue: 3
    },
    { name: 'sink', factory: function() { return [].sink; } }
  ],
  methods: {
    lookup: function(data) {
      return this.TABLE[data];
    },

    put: function(data) {
      var tmp = 0;
      this.view = new DataView(this.buffer);

      for(var i = 0; i < data.length; i++) {
        if (data[i] == '=') break;

        var value = this.lookup(data[i]);
        if (value === undefined) continue; // Be permissive, ignore unknown characters.

        tmp = tmp | (value << (6*this.chunk));
        if (this.chunk == 0) {
          this.emit(3, tmp);
          tmp = 0;
          this.chunk = 3;
        } else {
          this.chunk -= 1;
        }
      }

      if (data[i] == '=') {
        i++;
        if (i < data.length) {
          if (data[i] == '=') {
            this.emit(1, tmp);
          }
        } else {
          this.emit(2, tmp);
        }
      }
    },

    emit: function(bytes, tmp) {
      for(var j = 0; j < bytes; j++) {
        this.view.setUint8(this.pos,
                           (tmp >> ((2-j)*8)) & 0xFF);
        this.pos += 1;
        if (this.pos >= this.buffer.byteLength ) {
          this.sink.put(this.buffer);
          this.buffer = new ArrayBuffer(this.bufsize);
          this.view = new DataView(this.buffer);
          this.pos = 0;
        }
      }
    },

    eof: function() {
      this.sink.put(this.buffer.slice(0, this.pos));
      this.sink.eof && this.sink.eof();
    }
  }
});

CLASS({
  name: 'Base64Encoder',
  package: 'foam.util',
  constants: {
    TABLE: [
      'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P',
      'Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f',
      'g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v',
      'w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/']
  },
  properties: [
    {
      name: 'table',
      defaultValueFn: function() { return this.TABLE; }
    },
    {
      model_: 'BooleanProperty',
      name: 'urlSafe',
      postSet: function(_, v) {
        this.table = this.TABLE.clone();
        if ( v ) {
          this.table[62] = '-';
          this.table[63] = '_';
        }
      }
    }
  ],
  methods: {
    encode: function(b, opt_break) {
      var result = "";
      var out;
      if ( opt_break >= 0 ) {
        var count = 0;
        out = function(c) {
          result += c;
          count = (count + 1) % opt_break;
          if ( count === 0 ) result += "\r\n";
        };
      } else {
        out = function(c) { result += c; };
      }

      var view = new Uint8Array(b);
      for ( var i = 0; i + 2 < b.byteLength; i += 3 ) {
        out(this.table[view[i] >>> 2]);
        out(this.table[((view[i] & 3) << 4) | (view[i+1] >>> 4)]);
        out(this.table[((view[i+1] & 15) << 2) | (view[i+2] >>> 6)]);
        out(this.table[view[i+2] & 63]);
      }

      if ( i < b.byteLength ) {
        out(this.table[view[i] >>> 2]);
        if ( i + 1 < b.byteLength ) {
          out(this.table[((view[i] & 3) << 4) | (view[i+1] >>> 4)]);
          out(this.table[((view[i+1] & 15) << 2)]);
        } else {
          out(this.table[((view[i] & 3) << 4)]);
          out('=');
        }
        out('=');
      }
      return result;
    }
  }
});
