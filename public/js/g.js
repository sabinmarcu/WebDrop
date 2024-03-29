(function(module){
	/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 *
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
(function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
  // by minimizing calls to random()
  Math.uuidFast = function() {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };

  // A more compact, but less performant, RFC4122v4 solution:
  Math.uuidCompact = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };
})();
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"Addons/ORM/MongoDB": function(exports, require, module) {(function() {
  var Addons;

  Addons = {
    "ORM": {}
  };

  Addons.ORM.MongoDBConnector = (function() {

    function MongoDBConnector() {}

    MongoDBConnector.prototype._identifier = "Mongo";

    MongoDBConnector.prototype.create = function() {
      return this["super"].create.apply(this, arguments);
    };

    MongoDBConnector.prototype.extended = function() {};

    return MongoDBConnector;

  })();

  module.exports = Addons.ORM.MongoDBConnector.prototype;

}).call(this);
}, "ErrorReporter": function(exports, require, module) {(function() {
  var ErrorReporter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ErrorReporter = (function() {

    function ErrorReporter() {
      this.toString = __bind(this.toString, this);

    }

    ErrorReporter._errorGroupMap = [0];

    ErrorReporter._errorGroups = ["Unknown Error"];

    ErrorReporter._errorMessages = ["An unknown error has occurred"];

    ErrorReporter.errorGroupMap = [];

    ErrorReporter.errorGroups = [];

    ErrorReporter.errorMessages = [];

    ErrorReporter.wrapCustomError = function(error) {
      return "[" + error.name + "] " + error.message;
    };

    ErrorReporter.generate = function(errorCode, extra) {
      if (extra == null) {
        extra = null;
      }
      return (new this).generate(errorCode, this, extra);
    };

    ErrorReporter.extended = function() {
      var item, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      if ((this["super"] != null) && (this["super"].errorGroupMap != null)) {
        _ref = this["super"].errorGroupMap;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          this._errorGroupMap.push(item);
        }
      }
      if ((this["super"] != null) && (this["super"].errorGroups != null)) {
        _ref1 = this["super"].errorGroups;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          this._errorGroups.push(item);
        }
      }
      if ((this["super"] != null) && (this["super"].errorMessages != null)) {
        _ref2 = this["super"].errorMessages;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          item = _ref2[_k];
          this._errorMessages.push(item);
        }
      }
      return this.include(ErrorReporter.prototype);
    };

    ErrorReporter.prototype.generate = function(errCode, ER, extra) {
      if (extra == null) {
        extra = null;
      }
      if (!(ER._errorGroupMap[errCode] != null)) {
        this.name = ER._errorGroups[0];
        this.message = ER._errorMessages[0];
      } else {
        this.name = ER._errorGroups[ER._errorGroupMap[errCode]];
        this.message = ER._errorMessages[errCode];
      }
      if ((extra != null) && extra) {
        this.message += ((extra != null) && extra ? " - Extra Data : " + extra : void 0);
      }
      this.errCode = errCode;
      return this;
    };

    ErrorReporter.prototype.toString = function() {
      return "[" + this.name + "] " + this.message + " |" + this.errCode + "|";
    };

    return ErrorReporter;

  })();

  module.exports = ErrorReporter;

}).call(this);
}, "Modules/Mediator": function(exports, require, module) {(function() {
  var Modules;

  Modules = {
    Observer: require("Modules/Observer")
  };

  Modules.Mediator = (function() {
    var extended, included, installTo, key, value, _ref;

    function Mediator() {}

    _ref = Modules.Observer;
    for (key in _ref) {
      value = _ref[key];
      Mediator.prototype[key] = value;
    }

    installTo = function(object) {
      this.delegate("publish", object);
      return this.delegate("subscribe", object);
    };

    included = function() {
      this.prototype.queue = {};
      return this.prototype._delegates = {
        publish: true,
        subscribe: true
      };
    };

    extended = function() {
      this.queue = {};
      return this._delegates = {
        publish: true,
        subscribe: true
      };
    };

    return Mediator;

  })();

  module.exports = Modules.Mediator.prototype;

}).call(this);
}, "Modules/ORM": function(exports, require, module) {(function() {
  var Modules, V,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Modules = {};

  V = require("Variable");

  Modules.ORM = (function() {

    function ORM() {}

    ORM.prototype._identifier = "BasicORM";

    ORM.prototype._reccords = {};

    ORM.prototype._symlinks = {};

    ORM.prototype._head = 0;

    ORM.prototype._props = [];

    ORM.prototype.get = function(which) {
      if (typeof which === "object") {
        return this.getAdv(which);
      }
      return this._symlinks[which] || this._reccords[which] || null;
    };

    ORM.prototype.getAdv = function(what) {
      var check, key, rec, results, _ref, _ref1;
      results = [];
      check = function(rec) {
        var final, k, mod, modfinal, recs, v, val, value, _i, _len;
        for (k in what) {
          v = what[k];
          final = false;
          if (!(rec[k] != null)) {
            break;
          }
          if ((typeof v) === "object") {
            for (mod in v) {
              val = v[mod];
              modfinal = true;
              switch (mod) {
                case "$gt":
                  if ((rec[k].get()) <= val) {
                    modfinal = false;
                    break;
                  }
                  break;
                case "$gte":
                  if ((rec[k].get()) < val) {
                    modfinal = false;
                    break;
                  }
                  break;
                case "$lt":
                  if ((rec[k].get()) >= val) {
                    modfinal = false;
                    break;
                  }
                  break;
                case "$lte":
                  if ((rec[k].get()) > val) {
                    modfinal = false;
                    break;
                  }
                  break;
                case "$contains":
                  recs = rec[k].get();
                  if (recs.constructor !== Array) {
                    modfinal = false;
                    break;
                  }
                  modfinal = false;
                  for (_i = 0, _len = recs.length; _i < _len; _i++) {
                    value = recs[_i];
                    if (value === val) {
                      modfinal = true;
                      break;
                    }
                  }
              }
              if (modfinal === false) {
                break;
              }
            }
            if (modfinal === true) {
              final = true;
            }
          } else if ((rec[k].get()) === v) {
            final = true;
          } else {
            break;
          }
        }
        if (final) {
          return results.push(rec);
        }
      };
      _ref = this._reccords;
      for (key in _ref) {
        rec = _ref[key];
        check(rec);
      }
      _ref1 = this._symlinks;
      for (key in _ref1) {
        rec = _ref1[key];
        check(rec);
      }
      if (results.length === 0) {
        return null;
      }
      if (results.length === 1) {
        return results[0];
      }
      return results;
    };

    ORM.prototype["delete"] = function(which) {
      var _base, _base1, _ref, _ref1;
      if ((_ref = (_base = this._reccords)[which]) == null) {
        _base[which] = null;
      }
      return (_ref1 = (_base1 = this._symlinks)[which]) != null ? _ref1 : _base1[which] = null;
    };

    ORM.prototype.create = function(id, args) {
      var prop, uuid, _i, _len, _ref, _ref1, _ref2;
      if ((_ref = this._reccords) == null) {
        this._reccords = {};
      }
      if (args == null) {
        args = {};
      }
      uuid = id || args._id || this._head;
      if ((_ref1 = args._id) == null) {
        args._id = uuid;
      }
      uuid = Math.uuidFast(uuid);
      args._uuid = uuid;
      args._fn = this;
      if (typeof this.preCreate === "function") {
        this.preCreate(args);
      }
      this._reccords[uuid] = new this(args);
      this._reccords[uuid]._constructor(args);
      if (typeof this.postCreate === "function") {
        this.postCreate(this._reccords[uuid], args);
      }
      if ((id != null) && id !== this._head) {
        this._symlinks[id] = this._reccords[uuid];
      }
      if (uuid === this._head) {
        this._head++;
      }
      _ref2 = this._props;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        prop = _ref2[_i];
        this._reccords[uuid][prop] = V.spawn();
      }
      return this._reccords[uuid];
    };

    ORM.prototype.reuse = function(which, args) {
      var rez;
      if (args == null) {
        args = {};
      }
      rez = this.get(which);
      if (rez != null) {
        return rez;
      }
      return this.create(which, args);
    };

    ORM.prototype.addProp = function(prop) {
      var key, rec, _ref, _ref1, _results;
      this._props.push(prop);
      _ref = this._reccords;
      _results = [];
      for (key in _ref) {
        rec = _ref[key];
        _results.push((_ref1 = rec[prop]) != null ? _ref1 : rec[prop] = V.spawn());
      }
      return _results;
    };

    ORM.prototype.removeProp = function(prop) {
      var k, key, p, rec, _i, _len, _ref, _ref1, _ref2;
      _ref = this._reccords;
      for (key in _ref) {
        rec = _ref[key];
        if ((_ref1 = rec[prop]) == null) {
          rec[prop] = null;
        }
      }
      _ref2 = this._props;
      for (k = _i = 0, _len = _ref2.length; _i < _len; k = ++_i) {
        p = _ref2[k];
        if (p === prop) {
          return this._props.splice(k, 1);
        }
      }
    };

    ORM.prototype.extended = function() {
      this._excludes = ["_fn", "_uuid", "_id"];
      return this.include({
        _constructor: function(args) {
          var k, key, v, value, valueSet, _results;
          valueSet = {};
          this._uuid = args._uuid || null;
          this._id = args._id || null;
          this.fn = args._fn;
          for (key in args) {
            value = args[key];
            if (__indexOf.call(this.fn._excludes, key) < 0 && (this.constructFilter(key, value)) !== false) {
              valueSet[key] = value;
            }
          }
          if (this.init != null) {
            return this.init.call(this, valueSet);
          }
          _results = [];
          for (k in valueSet) {
            v = valueSet[k];
            _results.push(this[k] = v);
          }
          return _results;
        },
        constructFilter: function(key, value) {
          return true;
        },
        remove: function() {
          return this.parent.remove(this.id);
        }
      });
    };

    return ORM;

  })();

  module.exports = function(addon) {
    var item, test, valid, x, _i, _len;
    if ((IS.Addons != null) && (IS.Addons.ORM != null) && IS.Addons.ORM[addon]) {
      x = (require("Object")).clone(Modules.ORM);
      (require("Object")).extend(IS.Addons.ORM[addon], x);
    } else if (addon != null) {
      test = ["reuse", "addProp", "removeProp", "get", "create", "delete"];
      valid = true;
      for (_i = 0, _len = test.length; _i < _len; _i++) {
        item = test[_i];
        if (!(addon[item] != null)) {
          valid = false;
        }
      }
      if (valid) {
        x = (require("Object")).clone(Modules.ORM.prototype);
        (require("Object")).extend(addon, x);
      }
    }
    if (x != null) {
      return x;
    } else {
      return Modules.ORM.prototype;
    }
  };

}).call(this);
}, "Modules/Observer": function(exports, require, module) {(function() {
  var Modules,
    __slice = [].slice;

  Modules = {};

  Modules.Observer = (function() {

    function Observer() {}

    Observer.prototype.delegateEvent = function(event, handler, object) {
      var c, _base, _ref;
      if (object == null) {
        object = window;
      }
      if ((event.substr(0, 2)) === "on") {
        event = event.substr(2);
      }
      if ((_ref = (_base = this.queue)[event]) == null) {
        _base[event] = [];
      }
      c = this.queue[event].length;
      this.queue[event].unshift(function() {
        return handler.apply(object, arguments);
      });
      return c;
    };

    Observer.prototype.subscribe = function(event, handler) {
      return this.delegateEvent(event, handler, this);
    };

    Observer.prototype.publish = function() {
      var args, event, handler, key, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      event = args[0];
      args = args.splice(1);
      if (!event || !(this.queue[event] != null)) {
        return this;
      }
      _ref = this.queue[event];
      for (key in _ref) {
        handler = _ref[key];
        if (key !== "__head") {
          handler.apply(this, args);
        }
      }
      return this;
    };

    Observer.prototype.unsubscribe = function(event, id) {
      if (!this.queue[event]) {
        return null;
      }
      if (!this.queue[event][id]) {
        return null;
      }
      return this.queue[event].splice(id, 1);
    };

    Observer.prototype.included = function() {
      return this.prototype.queue = {};
    };

    Observer.prototype.extended = function() {
      return this.queue = {};
    };

    return Observer;

  })();

  module.exports = Modules.Observer.prototype;

}).call(this);
}, "Modules/StateMachine": function(exports, require, module) {(function() {
  var Modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Modules = {};

  Modules.StateMachine = (function() {

    function StateMachine() {
      this.delegateContext = __bind(this.delegateContext, this);

    }

    StateMachine.prototype.extended = function() {
      this._contexts = [];
      return this._activeContext = null;
    };

    StateMachine.prototype.included = function() {
      this.prototype._contexts = [];
      return this.prototype._activeContext = null;
    };

    StateMachine.prototype.delegateContext = function(context) {
      var l;
      if (this._find(context)) {
        return null;
      }
      l = this._contexts.length;
      this._contexts[l] = context;
      if (!(context.activate != null)) {
        context.activate = function() {};
      }
      if (!(context.deactivate != null)) {
        context.deactivate = function() {};
      }
      return this;
    };

    StateMachine.prototype.getActiveContextID = function() {
      return this._activeContext;
    };

    StateMachine.prototype.getActiveContext = function() {
      return this._activeContext;
    };

    StateMachine.prototype.getContext = function(context) {
      return this._contexts[context] || null;
    };

    StateMachine.prototype._find = function(con) {
      var key, value, _i, _len, _ref;
      _ref = this._contexts;
      for (value = _i = 0, _len = _ref.length; _i < _len; value = ++_i) {
        key = _ref[value];
        if (con === key) {
          return value;
        }
      }
      return null;
    };

    StateMachine.prototype.activateContext = function(context) {
      var con;
      con = this._find(context);
      if (!(con != null)) {
        return null;
      }
      if (this._activeContext === con) {
        return true;
      }
      this._activeContext = con;
      return context.activate();
    };

    StateMachine.prototype.deactivateContext = function(context) {
      if (!((this._find(context)) != null)) {
        return null;
      }
      this._activeContext = null;
      return context.deactivate();
    };

    StateMachine.prototype.switchContext = function(context) {
      var con;
      if (!(context != null)) {
        con = this._activeContext + 1;
        if (con === this._contexts.length) {
          con = 0;
        }
      } else {
        con = this._find(context);
        if (!(con != null)) {
          return null;
        }
      }
      this.deactivateContext(this._contexts[this._activeContext]);
      this.activateContext(this._contexts[con]);
      return this._contexts[con];
    };

    return StateMachine;

  })();

  module.exports = Modules.StateMachine.prototype;

}).call(this);
}, "Object": function(exports, require, module) {(function() {
  var Obiect, clone, _excludes,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  _excludes = ["included", "extended"];

  clone = function(obj) {
    var k, o, v;
    o = obj instanceof Array ? [] : {};
    for (k in obj) {
      v = obj[k];
      if ((v != null) && typeof v === "object") {
        o[k] = clone(v);
      } else {
        o[k] = v;
      }
    }
    return o;
  };

  Obiect = (function() {
    var extended, included;

    function Obiect() {}

    Obiect.clone = function(obj) {
      if (obj == null) {
        obj = this;
      }
      debugger;
      return (Obiect.proxy(Obiect.include, (Obiect.proxy(Obiect.extend, function() {}))(obj)))(obj.prototype);
    };

    Obiect.extend = function(obj, into) {
      var k, value, _ref, _ref1;
      if (into == null) {
        into = this;
      }
      obj = clone(obj);
      for (k in obj) {
        value = obj[k];
        if (!((__indexOf.call(_excludes, k) >= 0) || ((obj._excludes != null) && __indexOf.call(obj._excludes, k) >= 0))) {
          if (into[k] != null) {
            if ((_ref = into["super"]) == null) {
              into["super"] = {};
            }
            into["super"][k] = into[k];
          }
          into[k] = value;
        }
      }
      if ((_ref1 = obj.extended) != null) {
        _ref1.call(into);
      }
      return this;
    };

    Obiect.include = function(obj, into) {
      var key, value, _ref;
      if (into == null) {
        into = this;
      }
      obj = clone(obj);
      for (key in obj) {
        value = obj[key];
        into.prototype[key] = value;
      }
      if ((_ref = obj.included) != null) {
        _ref.call(into);
      }
      return this;
    };

    Obiect.proxy = function() {
      var to, what,
        _this = this;
      what = arguments[0];
      to = arguments[1];
      if (typeof what === "function") {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return what.apply(to, args);
        };
      } else {
        return this[what];
      }
    };

    Obiect.delegate = function(property, context) {
      var _ref;
      if ((((_ref = this._delegates) != null ? _ref[property] : void 0) != null) === false && this._deleagates[property] !== false) {
        trigger("Cannot delegate member " + property + " to " + context);
      }
      return context[property] = this.proxy(function() {
        return this[property](arguments);
      }, this);
    };

    extended = function() {};

    included = function() {};

    Obiect.include({
      proxy: Obiect.proxy
    });

    return Obiect;

  })();

  module.exports = Obiect;

}).call(this);
}, "Variable": function(exports, require, module) {(function() {
  var Variable,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Variable = (function(_super) {

    __extends(Variable, _super);

    function Variable() {
      return Variable.__super__.constructor.apply(this, arguments);
    }

    Variable.spawn = function() {
      var x;
      x = new this;
      x._value = null;
      return x;
    };

    Variable.prototype.get = function() {
      return this._value;
    };

    Variable.prototype.set = function(value) {
      return this._value = value;
    };

    Variable.prototype.add = function(reccord) {
      if (!(this._value != null) || this._value.constructor !== Array) {
        this._value = [];
      }
      return this._value.push(reccord);
    };

    return Variable;

  })(require("Object"));

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Variable;
  }

}).call(this);
}});

	var require = this.require;
	(function() {
  var IS;

  require('Object');

  IS = {
    Variable: require('Variable'),
    Object: require('Object'),
    ErrorReporter: require('ErrorReporter'),
    Addons: {
      ORM: {
        MongoDB: require('Addons/ORM/MongoDB')
      }
    },
    Modules: {
      StateMachine: require('Modules/StateMachine'),
      ORM: require('Modules/ORM'),
      Observer: require('Modules/Observer'),
      Mediator: require('Modules/Mediator')
    }
  };

  if (typeof window !== "undefined" && window !== null) {
    window.IS = IS;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = IS;
  }

  if (typeof root !== "undefined" && root !== null) {
    root.IS = IS;
  }

}).call(this);

}).call({}, typeof(module) == "undefined" ? (typeof(window) == "undefined" ? root : window) : module);
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"Application": function(exports, require, module) {(function() {
  var Application, colors;

  colors = {
    "blue": {
      from: "#8ED6FF",
      to: "#004CB3"
    },
    "red": {
      from: "rgba(256, 20, 80, 0.8)",
      to: "rgba(150, 10, 30, 1)"
    }
  };

  Application = (function() {

    function Application(name) {
      var link;
      document.body.innerHTML = require("views/login")();
      this.styles = require("styles/base");
      document.getElementById("loginForm").onsubmit = Application.loadApplication;
      link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.href = "http://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:200";
      document.head.appendChild(link);
    }

    Application.loadApplication = function(e) {
      document.body.innerHTML = (require("views/game"))({
        name: e.srcElement[0].value,
        colors: colors,
        baseSpeed: 15,
        baseFrequency: 150,
        baseFilter: 0.5
      });
      (require("classes/Renderer"))("activate", colors);
      document.onresize = function() {
        var canvas;
        canvas = document.getElementById("gameCanvas");
        canvas.height = window.innerHeight;
        return (require("classes/Renderer"))("canvasUpdate");
      };
      document.onresize();
      (document.getElementById("exitGameButton")).onclick = function() {
        return (require("classes/Engine"))("exit");
      };
      (document.getElementById("newGameButton")).onclick = function() {
        return (require("classes/Engine"))("start");
      };
      (document.getElementById("resetScoreButton")).onclick = function() {
        return (require("classes/Engine"))("reset");
      };
      (document.getElementById("pauseGameButton")).onclick = function() {
        return (require("classes/Engine"))("pause");
      };
      return e.preventDefault();
    };

    Application.fakeLogin = function() {
      return document.getElementById("loginForm").onsubmit({
        srcElement: [
          {
            value: "Sabin"
          }
        ],
        preventDefault: function() {}
      });
    };

    return Application;

  }).call(this);

  module.exports = Application;

}).call(this);
}, "classes/Bar": function(exports, require, module) {(function() {
  var Bar;

  Bar = (function() {

    function Bar(offset) {
      console.log("New Bar");
      this.xGap = Math.floor(Math.random() * 210 + offset);
      if (this.xGap < 70) {
        this.xGap = 70;
      }
      if (this.xGap > 230) {
        this.xGap = 230;
      }
      this.y = 0;
    }

    Bar.prototype.animate = function() {
      return this.y++;
    };

    Bar.prototype.uncover = function() {
      return {
        y: this.y,
        xGap: this.xGap
      };
    };

    return Bar;

  })();

  module.exports = Bar;

}).call(this);
}, "classes/Engine": function(exports, require, module) {(function() {
  var Engine, EngineErrorReporter, movement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  movement = 0;

  Engine = (function(_super) {

    __extends(Engine, _super);

    function Engine() {
      return Engine.__super__.constructor.apply(this, arguments);
    }

    Engine.bars = [];

    Engine.ball = {};

    Engine.score = 0;

    Engine.reset = function() {
      this.bars = [];
      this.ball = {};
      this.score = 0;
      return (document.getElementById("sessionScore")).innerHTML = "";
    };

    Engine.New = function(speed) {
      if (speed == null) {
        speed = null;
      }
      this.speed = (document.getElementById("speedControl")).value;
      this.genFreq = (document.getElementById("frequencyControl")).value;
      this.ball = {
        x: 150,
        y: 30,
        ax: 0,
        ay: 0
      };
      this.generate();
      if (this.animateTimer != null) {
        window.clearInterval(this.animateTimer);
      }
      if (this.generateTimer != null) {
        window.clearInterval(this.generateTimer);
      }
      this.animateTimer = setInterval(this.proxy(this.tick, this), this.speed);
      return this.generateTimer = setInterval(this.proxy(this.generate, this), this.speed * this.genFreq);
    };

    Engine.tick = function() {
      var bar, _i, _len, _ref, _results;
      if ((this.bars[0] != null) && this.bars[0].x >= window.innerHeight) {
        this.bars.shift();
      }
      this.accelerateBall();
      this.moveBallX();
      this.moveBallY();
      if (this.ball.y === 10) {
        alert("GAME OVER : Your Score is " + this.score);
        this.reset();
      }
      _ref = this.bars;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bar = _ref[_i];
        _results.push(bar.animate());
      }
      return _results;
    };

    Engine.accelerateBall = function() {
      var filter;
      if (!(this.ball.x != null)) {
        return;
      }
      filter = (document.getElementById("filterControl")).value * 1;
      this.ball.ax += filter * movement;
      if (this.ball.ay <= 5) {
        return this.ball.ay += filter * 0.15;
      }
    };

    Engine.moveBallX = function() {
      this.ball.x += this.ball.ax;
      if (this.ball.x < 15) {
        this.ball.ax -= 3 * this.ball.ax;
        this.ball.x = 15;
      }
      if (this.ball.x > 285) {
        this.ball.ax -= 3 * this.ball.ax;
        this.ball.x = 285;
      }
      return this.ball.ax *= 0.85;
    };

    Engine.moveBallY = function() {
      var bar, s, w, xcond, ycond, _i, _len, _ref, _results;
      w = window.innerHeight / 1.6;
      this.ball.y += this.ball.ay;
      if (this.ball.y > w - 15) {
        this.ball.y = w - 10;
      }
      _ref = this.bars;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bar = _ref[_i];
        if ((this.ball.skipbar != null) && this.ball.skipbar === bar) {
          continue;
        }
        s = window.innerHeight - bar.y;
        s = s / 1.6 - 15;
        ycond = this.ball.y >= s && this.ball.y <= s + 15;
        xcond = !(this.ball.x >= bar.xGap - 16 && this.ball.x <= bar.xGap + 16);
        if (!xcond && ycond) {
          this.ball.skipbar = bar;
          this.score += 10;
          this.updateScore();
        }
        if (ycond && xcond) {
          this.ball.y = s;
          _results.push(this.ball.ay -= this.ball.ay * 1.7);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Engine.generate = function() {
      return this.bars.push(new (require("classes/Bar"))(Math.floor(Math.random() * 25)));
    };

    Engine.uncover = function(what) {
      return this[what];
    };

    Engine.updateScore = function() {
      return (document.getElementById("sessionScore")).innerHTML = this.score;
    };

    return Engine;

  })(IS.Object);

  EngineErrorReporter = (function(_super) {

    __extends(EngineErrorReporter, _super);

    function EngineErrorReporter() {
      return EngineErrorReporter.__super__.constructor.apply(this, arguments);
    }

    EngineErrorReporter.errorGroups = ["ProcedureError"];

    EngineErrorReporter.errorGroupMap = [1];

    EngineErrorReporter.errorMessages = ["Unknown Procedure"];

    EngineErrorReporter.extend(IS.ErrorReporter);

    return EngineErrorReporter;

  })(IS.Object);

  window._e = Engine;

  window.onkeydown = function(e) {
    switch (e.keyCode) {
      case 37:
        return movement = -1;
      case 39:
        return movement = 1;
    }
  };

  window.onkeyup = function() {
    return movement = 0;
  };

  module.exports = function() {
    var args, what;
    what = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    switch (what) {
      case "reset":
        return console.log("Reset Score Stub");
      case "start":
        Engine.reset();
        return Engine.New();
      case "pause":
        return alert("Press OK when you wanna return to the game!");
      case "exit":
        if (confirm("Do you really wanna close?")) {
          window.open("", "_self", "");
          return window.close();
        }
        break;
      case "uncover":
        return Engine.uncover.apply(Engine, args);
    }
  };

}).call(this);
}, "classes/Renderer": function(exports, require, module) {(function() {
  var Renderer, RendererErrorReporter, reqAnimFrame,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  reqAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    return setTimeout(callback, 1000 / 60);
  };

  Renderer = (function(_super) {

    __extends(Renderer, _super);

    function Renderer() {
      return Renderer.__super__.constructor.apply(this, arguments);
    }

    Renderer.activate = function(colors) {
      var _this = this;
      this.colors = colors;
      this.color = "red";
      this.canvas = document.getElementById("gameCanvas");
      if (!this.canvas) {
        throw RendererErrorReporter.generate(1);
      }
      this.canvas = this.canvas.getContext("2d");
      if (!this.canvas) {
        throw RendererErrorReporter.generate(2);
      }
      (document.getElementById("ballColors")).onchange = function(e) {
        return _this.color = e.srcElement.value;
      };
      this.getCanvasSize();
      return this.loop();
    };

    Renderer.loop = function() {
      reqAnimFrame(this.proxy(this.loop, this));
      return this.draw();
    };

    Renderer.getCanvasSize = function() {
      var canvas, size;
      canvas = document.getElementById("gameCanvas");
      size = {
        x: canvas.width,
        y: canvas.height
      };
      return this.canvas.size = size;
    };

    Renderer.draw = function() {
      this.drawBackground();
      this.drawBars();
      this.drawBall();
      return this.drawShadows();
    };

    Renderer.drawBall = function() {
      var ball, gradient, x, y;
      ball = (require("classes/Engine"))("uncover", "ball");
      if (!(ball.x != null) || !ball.x) {
        return;
      }
      x = ball.x;
      y = ball.y;
      this.canvas.save();
      this.canvas.scale(1, 1.6);
      gradient = this.canvas.createRadialGradient(x - 3, y - 3, 0, x, y, 15);
      gradient.addColorStop(0, this.colors[this.color].from);
      gradient.addColorStop(1, this.colors[this.color].to);
      this.canvas.fillStyle = gradient;
      this.canvas.beginPath();
      this.canvas.arc(x, y, 15, 0, Math.PI * 2, false);
      this.canvas.fill();
      this.canvas.closePath();
      return this.canvas.restore();
    };

    Renderer.drawBars = function() {
      var bar, bars, _i, _len, _results;
      bars = (require("classes/Engine"))("uncover", "bars");
      if (!bars.length) {
        return;
      }
      _results = [];
      for (_i = 0, _len = bars.length; _i < _len; _i++) {
        bar = bars[_i];
        _results.push(this.drawBar(bar));
      }
      return _results;
    };

    Renderer.drawBar = function(bar) {
      var gradient, xGap, y;
      y = this.canvas.size.y - bar.y;
      xGap = bar.xGap;
      gradient = this.canvas.createLinearGradient(0, y, 0, y + 10);
      gradient.addColorStop(0, "rgba(0, 30, 256, 0.5)");
      gradient.addColorStop(1, "rgba(0, 30, 256, 0.1)");
      this.canvas.fillStyle = gradient;
      this.canvas.fillRect(0, y, xGap - 25, 10);
      return this.canvas.fillRect(xGap + 25, y, this.canvas.size.x, 10);
    };

    Renderer.drawBackground = function() {
      this.canvas.fillStyle = "#f6f6f6";
      return this.canvas.fillRect(0, 0, this.canvas.size.x, this.canvas.size.y);
    };

    Renderer.drawShadows = function() {
      var gradient;
      gradient = this.canvas.createLinearGradient(0, 0, 0, this.canvas.size.y);
      gradient.addColorStop(0, "rgba(256, 256, 256, 1)");
      gradient.addColorStop(50 / this.canvas.size.y, "rgba(256, 256, 256, 0)");
      gradient.addColorStop((this.canvas.size.y - 50) / this.canvas.size.y, "rgba(256, 256, 256, 0)");
      gradient.addColorStop(1, "rgba(256, 256, 256, 1)");
      this.canvas.fillStyle = gradient;
      this.canvas.fillRect(0, 0, this.canvas.size.x, this.canvas.size.y);
      gradient = this.canvas.createLinearGradient(0, 0, this.canvas.size.x, 0);
      gradient.addColorStop(0, "rgba(256, 256, 256, 1)");
      gradient.addColorStop(50 / this.canvas.size.y, "rgba(256, 256, 256, 0)");
      gradient.addColorStop((this.canvas.size.y - 50) / this.canvas.size.y, "rgba(256, 256, 256, 0)");
      gradient.addColorStop(1, "rgba(256, 256, 256, 1)");
      this.canvas.fillStyle = gradient;
      return this.canvas.fillRect(0, 0, this.canvas.size.x, this.canvas.size.y);
    };

    return Renderer;

  })(IS.Object);

  RendererErrorReporter = (function(_super) {

    __extends(RendererErrorReporter, _super);

    function RendererErrorReporter() {
      return RendererErrorReporter.__super__.constructor.apply(this, arguments);
    }

    RendererErrorReporter.errorGroups = ["CanvasError"];

    RendererErrorReporter.errorGroupMap = [1];

    RendererErrorReporter.errorMessages = ["The canvas could not be hooked"];

    RendererErrorReporter.extend(IS.ErrorReporter);

    return RendererErrorReporter;

  })(IS.Object);

  window._r = Renderer;

  module.exports = function() {
    var args, what;
    what = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    switch (what) {
      case "activate":
        return Renderer.activate.apply(Renderer, args);
      case "canvasUpdate":
        return Renderer.getCanvasSize.apply(Renderer);
    }
  };

}).call(this);
}, "styles/base": function(exports, require, module) {s = document.createElement('style'); s.innerHTML = "html,\nbody {\n  margin: 0;\n  padding: 0;\n  font-size: 10pt;\n  height: 100%;\n  width: 100%;\n  font-family: \"Open Sans\", \"Helvetica Neue\";\n  font-weight: 100;\n}\nbody {\n  overflow: hidden;\n  background: white;\n  color: #444;\n}\nbody form {\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  height: 200px;\n  width: 400px;\n  margin: -100px 0 0 -200px;\n  background: #ccc;\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(0.5, #ffffff), color-stop(1, #eeeeee));\n  border-radius: 20px;\n}\nbody form label {\n  font-size: 17pt;\n  display: block;\n  clear: both;\n  text-align: center;\n  margin: 20px 0 40px;\n}\nbody form input {\n  display: block;\n  margin: 0 30px;\n  width: 310px;\n  height: 20px;\n  padding: 15px;\n  background: transparent;\n  border: solid 1px #ccc;\n  border-radius: 5px;\n  outline: none;\n  -webkit-transition: all 0.5s ease-in-out;\n}\nbody form input:hover,\nbody form input:active,\nbody form input:focus {\n  background: rgba(256, 256, 256, 0.8);\n}\nsection {\n  width: 900px;\n  margin: 0 auto;\n  height: 100%;\n}\nsection article {\n  width: 150px;\n  float: left;\n  padding: 50px 25px;\n  height: 100%;\n}\nsection article h1 {\n  font-size: 21pt;\n}\nsection article#playerInfoZone {\n  text-align: right;\n}\nsection article#renderZone {\n  width: 500px;\n  padding: 0;\n}\nsection article#renderZone canvas {\n  width: 100%;\n  height: 100%;\n}\nsection article#menuZone li {\n  list-style: none;\n  font-size: 16pt;\n  color: #ccc;\n  -webkit-transition: all 0.25s ease-in-out;\n  cursor: pointer;\n}\nsection article#menuZone li:hover {\n  color: #222;\n}\n"; s.id = "css-base"; document.head.appendChild(s);}, "views/game": function(exports, require, module) {module.exports = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var color, values, _ref;
    
      __out.push('<section>\n\t<article id="playerInfoZone">\n\t\t<h1 id="playerName">');
    
      __out.push(__sanitize(this.name));
    
      __out.push('</h1>\n\t\t<h4 id="sessionScore"></h4>\n\t</article>\n\t<article id="renderZone"><canvas id="gameCanvas"></canvas></article>\n\t<article id="menuZone">\n\t\t\t<h1>Menu</h1>\n\t\t\t<nav id="menuList">\n\t\t\t\t<li class="menuButton" id="newGameButton">New Game</li>\n\t\t\t\t<li class="menuButton" id="resetScoreButton">Reset Score</li>\n\t\t\t\t<li class="menuButton" id="pauseGameButton">Pause Game</li>\n\t\t\t\t<li class="menuButton" id="exitGameButton">Exit Game</li>\n\t\t\t\t<br />\n\t\t\t\t<br />\n\t\t\t\t<li id="devOptions" class="menuButton">\n\t\t\t\t\t<select id="ballColors" name="ballColors">\n\t\t\t\t\t\t');
    
      _ref = this.colors;
      for (color in _ref) {
        values = _ref[color];
        __out.push('\n\t\t\t\t\t\t<option value="');
        __out.push(__sanitize(color));
        __out.push('" ');
        if (color === "red") {
          __out.push(__sanitize("selected"));
        }
        __out.push('>');
        __out.push(__sanitize(color.substr(0, 1).toUpperCase() + color.substr(1)));
        __out.push('</option>\n\t\t\t\t\t\t');
      }
    
      __out.push('\n\t\t\t\t\t</select>\n\t\t\t\t\t<input id="speedControl" type="number" value="');
    
      __out.push(__sanitize(this.baseSpeed));
    
      __out.push('" />\n\t\t\t\t\t<input id="frequencyControl" type="number" value="');
    
      __out.push(__sanitize(this.baseFrequency));
    
      __out.push('" />\n\t\t\t\t\t<input id="filterControl" type="number" step="0.1" value="');
    
      __out.push(__sanitize(this.baseFilter));
    
      __out.push('" />\n\t\t\t\t</li>\n\t\t\t</nav>\n\t</article>\n</section>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}}, "views/login": function(exports, require, module) {module.exports = function(__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<form id="loginForm" name="nameSelection" action="" method="GET">\n\t<label for="name">Give us your name, so we can <br>sign you up!</label>\n\t<input id="name" type="text" value="" placeholder="Name?" />\n</form>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}}});
