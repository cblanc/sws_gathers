(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = e(require("react")) : "function" == typeof define && define.amd ? define(["react"], e) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.ReactAutolink = e(require("react")) : t.ReactAutolink = e(t.React);
}(undefined, function (t) {
  return function (t) {
    function e(n) {
      if (r[n]) return r[n].exports;var o = r[n] = { exports: {}, id: n, loaded: !1 };return t[n].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports;
    }var r = {};return e.m = t, e.c = r, e.p = "", e(0);
  }([function (t, e, r) {
    "use strict";
    var n = function n(t) {
      return t && t.__esModule ? t["default"] : t;
    },
        o = n(r(2)),
        u = n(r(1)),
        a = function a() {
      var t = /((?:https?:\/\/)?(?:(?:[a-z0-9]?(?:[a-z0-9\-]{1,61}[a-z0-9])?\.[^\.|\s])+[a-z\.]*[a-z]+|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?::\d{1,5})*[a-z0-9.,_\/~#&=;%+?\-\\(\\)]*)/gi,
          e = function e(t, _e) {
        return t.slice(0, _e.length) === _e;
      };return { autolink: function autolink(r) {
          var n = void 0 === arguments[1] ? {} : arguments[1];return r ? r.split(t).map(function (r) {
            var a = r.match(t);if (a) {
              var i = a[0],
                  c = i.split("/");return "" !== c[1] && c[0].length < 5 ? r : o.createElement("a", u({ href: e(i, "http") ? i : "http://" + i }, n), i);
            }return r;
          }) : [];
        } };
    };t.exports = a();
  }, function (t, e, r) {
    "use strict";
    function n(t) {
      if (null == t) throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t);
    }t.exports = Object.assign || function (t, e) {
      for (var r, o, u = n(t), a = 1; a < arguments.length; a++) {
        r = arguments[a], o = Object.keys(Object(r));for (var i = 0; i < o.length; i++) {
          u[o[i]] = r[o[i]];
        }
      }return u;
    };
  }, function (e, r, n) {
    e.exports = t;
  }]);
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery");+function (a) {
  "use strict";
  function b() {
    var a = document.createElement("bootstrap"),
        b = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" };for (var c in b) {
      if (void 0 !== a.style[c]) return { end: b[c] };
    }return !1;
  }a.fn.emulateTransitionEnd = function (b) {
    var c = !1,
        d = this;a(this).one(a.support.transition.end, function () {
      c = !0;
    });var e = function e() {
      c || a(d).trigger(a.support.transition.end);
    };return setTimeout(e, b), this;
  }, a(function () {
    a.support.transition = b();
  });
}(jQuery), +function (a) {
  "use strict";
  var b = '[data-dismiss="alert"]',
      c = function c(_c) {
    a(_c).on("click", b, this.close);
  };c.prototype.close = function (b) {
    function c() {
      f.trigger("closed.bs.alert").remove();
    }var d = a(this),
        e = d.attr("data-target");e || (e = d.attr("href"), e = e && e.replace(/.*(?=#[^\s]*$)/, ""));var f = a(e);b && b.preventDefault(), f.length || (f = d.hasClass("alert") ? d : d.parent()), f.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one(a.support.transition.end, c).emulateTransitionEnd(150) : c());
  };var d = a.fn.alert;a.fn.alert = function (b) {
    return this.each(function () {
      var d = a(this),
          e = d.data("bs.alert");e || d.data("bs.alert", e = new c(this)), "string" == typeof b && e[b].call(d);
    });
  }, a.fn.alert.Constructor = c, a.fn.alert.noConflict = function () {
    return a.fn.alert = d, this;
  }, a(document).on("click.bs.alert.data-api", b, c.prototype.close);
}(jQuery), +function (a) {
  "use strict";
  var b = function b(c, d) {
    this.$element = a(c), this.options = a.extend({}, b.DEFAULTS, d), this.isLoading = !1;
  };b.DEFAULTS = { loadingText: "loading..." }, b.prototype.setState = function (b) {
    var c = "disabled",
        d = this.$element,
        e = d.is("input") ? "val" : "html",
        f = d.data();b += "Text", f.resetText || d.data("resetText", d[e]()), d[e](f[b] || this.options[b]), setTimeout(a.proxy(function () {
      "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c));
    }, this), 0);
  }, b.prototype.toggle = function () {
    var a = !0,
        b = this.$element.closest('[data-toggle="buttons"]');if (b.length) {
      var c = this.$element.find("input");"radio" == c.prop("type") && (c.prop("checked") && this.$element.hasClass("active") ? a = !1 : b.find(".active").removeClass("active")), a && c.prop("checked", !this.$element.hasClass("active")).trigger("change");
    }a && this.$element.toggleClass("active");
  };var c = a.fn.button;a.fn.button = function (c) {
    return this.each(function () {
      var d = a(this),
          e = d.data("bs.button"),
          f = "object" == (typeof c === "undefined" ? "undefined" : _typeof(c)) && c;e || d.data("bs.button", e = new b(this, f)), "toggle" == c ? e.toggle() : c && e.setState(c);
    });
  }, a.fn.button.Constructor = b, a.fn.button.noConflict = function () {
    return a.fn.button = c, this;
  }, a(document).on("click.bs.button.data-api", "[data-toggle^=button]", function (b) {
    var c = a(b.target);c.hasClass("btn") || (c = c.closest(".btn")), c.button("toggle"), b.preventDefault();
  });
}(jQuery), +function (a) {
  "use strict";
  var b = function b(_b, c) {
    this.$element = a(_b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = this.sliding = this.interval = this.$active = this.$items = null, "hover" == this.options.pause && this.$element.on("mouseenter", a.proxy(this.pause, this)).on("mouseleave", a.proxy(this.cycle, this));
  };b.DEFAULTS = { interval: 5e3, pause: "hover", wrap: !0 }, b.prototype.cycle = function (b) {
    return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this;
  }, b.prototype.getActiveIndex = function () {
    return this.$active = this.$element.find(".item.active"), this.$items = this.$active.parent().children(), this.$items.index(this.$active);
  }, b.prototype.to = function (b) {
    var c = this,
        d = this.getActiveIndex();return b > this.$items.length - 1 || 0 > b ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function () {
      c.to(b);
    }) : d == b ? this.pause().cycle() : this.slide(b > d ? "next" : "prev", a(this.$items[b]));
  }, b.prototype.pause = function (b) {
    return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this;
  }, b.prototype.next = function () {
    return this.sliding ? void 0 : this.slide("next");
  }, b.prototype.prev = function () {
    return this.sliding ? void 0 : this.slide("prev");
  }, b.prototype.slide = function (b, c) {
    var d = this.$element.find(".item.active"),
        e = c || d[b](),
        f = this.interval,
        g = "next" == b ? "left" : "right",
        h = "next" == b ? "first" : "last",
        i = this;if (!e.length) {
      if (!this.options.wrap) return;e = this.$element.find(".item")[h]();
    }if (e.hasClass("active")) return this.sliding = !1;var j = a.Event("slide.bs.carousel", { relatedTarget: e[0], direction: g });return this.$element.trigger(j), j.isDefaultPrevented() ? void 0 : (this.sliding = !0, f && this.pause(), this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), this.$element.one("slid.bs.carousel", function () {
      var b = a(i.$indicators.children()[i.getActiveIndex()]);b && b.addClass("active");
    })), a.support.transition && this.$element.hasClass("slide") ? (e.addClass(b), e[0].offsetWidth, d.addClass(g), e.addClass(g), d.one(a.support.transition.end, function () {
      e.removeClass([b, g].join(" ")).addClass("active"), d.removeClass(["active", g].join(" ")), i.sliding = !1, setTimeout(function () {
        i.$element.trigger("slid.bs.carousel");
      }, 0);
    }).emulateTransitionEnd(1e3 * d.css("transition-duration").slice(0, -1))) : (d.removeClass("active"), e.addClass("active"), this.sliding = !1, this.$element.trigger("slid.bs.carousel")), f && this.cycle(), this);
  };var c = a.fn.carousel;a.fn.carousel = function (c) {
    return this.each(function () {
      var d = a(this),
          e = d.data("bs.carousel"),
          f = a.extend({}, b.DEFAULTS, d.data(), "object" == (typeof c === "undefined" ? "undefined" : _typeof(c)) && c),
          g = "string" == typeof c ? c : f.slide;e || d.data("bs.carousel", e = new b(this, f)), "number" == typeof c ? e.to(c) : g ? e[g]() : f.interval && e.pause().cycle();
    });
  }, a.fn.carousel.Constructor = b, a.fn.carousel.noConflict = function () {
    return a.fn.carousel = c, this;
  }, a(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function (b) {
    var c,
        d = a(this),
        e = a(d.attr("data-target") || (c = d.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "")),
        f = a.extend({}, e.data(), d.data()),
        g = d.attr("data-slide-to");g && (f.interval = !1), e.carousel(f), (g = d.attr("data-slide-to")) && e.data("bs.carousel").to(g), b.preventDefault();
  }), a(window).on("load", function () {
    a('[data-ride="carousel"]').each(function () {
      var b = a(this);b.carousel(b.data());
    });
  });
}(jQuery), +function (a) {
  "use strict";
  var b = function b(c, d) {
    this.$element = a(c), this.options = a.extend({}, b.DEFAULTS, d), this.transitioning = null, this.options.parent && (this.$parent = a(this.options.parent)), this.options.toggle && this.toggle();
  };b.DEFAULTS = { toggle: !0 }, b.prototype.dimension = function () {
    var a = this.$element.hasClass("width");return a ? "width" : "height";
  }, b.prototype.show = function () {
    if (!this.transitioning && !this.$element.hasClass("in")) {
      var b = a.Event("show.bs.collapse");if (this.$element.trigger(b), !b.isDefaultPrevented()) {
        var c = this.$parent && this.$parent.find("> .panel > .in");if (c && c.length) {
          var d = c.data("bs.collapse");if (d && d.transitioning) return;c.collapse("hide"), d || c.data("bs.collapse", null);
        }var e = this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[e](0), this.transitioning = 1;var f = function f() {
          this.$element.removeClass("collapsing").addClass("collapse in")[e]("auto"), this.transitioning = 0, this.$element.trigger("shown.bs.collapse");
        };if (!a.support.transition) return f.call(this);var g = a.camelCase(["scroll", e].join("-"));this.$element.one(a.support.transition.end, a.proxy(f, this)).emulateTransitionEnd(350)[e](this.$element[0][g]);
      }
    }
  }, b.prototype.hide = function () {
    if (!this.transitioning && this.$element.hasClass("in")) {
      var b = a.Event("hide.bs.collapse");if (this.$element.trigger(b), !b.isDefaultPrevented()) {
        var c = this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"), this.transitioning = 1;var d = function d() {
          this.transitioning = 0, this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse");
        };return a.support.transition ? void this.$element[c](0).one(a.support.transition.end, a.proxy(d, this)).emulateTransitionEnd(350) : d.call(this);
      }
    }
  }, b.prototype.toggle = function () {
    this[this.$element.hasClass("in") ? "hide" : "show"]();
  };var c = a.fn.collapse;a.fn.collapse = function (c) {
    return this.each(function () {
      var d = a(this),
          e = d.data("bs.collapse"),
          f = a.extend({}, b.DEFAULTS, d.data(), "object" == (typeof c === "undefined" ? "undefined" : _typeof(c)) && c);!e && f.toggle && "show" == c && (c = !c), e || d.data("bs.collapse", e = new b(this, f)), "string" == typeof c && e[c]();
    });
  }, a.fn.collapse.Constructor = b, a.fn.collapse.noConflict = function () {
    return a.fn.collapse = c, this;
  }, a(document).on("click.bs.collapse.data-api", "[data-toggle=collapse]", function (b) {
    var c,
        d = a(this),
        e = d.attr("data-target") || b.preventDefault() || (c = d.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, ""),
        f = a(e),
        g = f.data("bs.collapse"),
        h = g ? "toggle" : d.data(),
        i = d.attr("data-parent"),
        j = i && a(i);g && g.transitioning || (j && j.find('[data-toggle=collapse][data-parent="' + i + '"]').not(d).addClass("collapsed"), d[f.hasClass("in") ? "addClass" : "removeClass"]("collapsed")), f.collapse(h);
  });
}(jQuery), +function (a) {
  "use strict";
  function b(b) {
    a(d).remove(), a(e).each(function () {
      var d = c(a(this)),
          e = { relatedTarget: this };d.hasClass("open") && (d.trigger(b = a.Event("hide.bs.dropdown", e)), b.isDefaultPrevented() || d.removeClass("open").trigger("hidden.bs.dropdown", e));
    });
  }function c(b) {
    var c = b.attr("data-target");c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));var d = c && a(c);return d && d.length ? d : b.parent();
  }var d = ".dropdown-backdrop",
      e = "[data-toggle=dropdown]",
      f = function f(b) {
    a(b).on("click.bs.dropdown", this.toggle);
  };f.prototype.toggle = function (d) {
    var e = a(this);if (!e.is(".disabled, :disabled")) {
      var f = c(e),
          g = f.hasClass("open");if (b(), !g) {
        "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click", b);var h = { relatedTarget: this };if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented()) return;f.toggleClass("open").trigger("shown.bs.dropdown", h), e.focus();
      }return !1;
    }
  }, f.prototype.keydown = function (b) {
    if (/(38|40|27)/.test(b.keyCode)) {
      var d = a(this);if (b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled")) {
        var f = c(d),
            g = f.hasClass("open");if (!g || g && 27 == b.keyCode) return 27 == b.which && f.find(e).focus(), d.click();var h = " li:not(.divider):visible a",
            i = f.find("[role=menu]" + h + ", [role=listbox]" + h);if (i.length) {
          var j = i.index(i.filter(":focus"));38 == b.keyCode && j > 0 && j--, 40 == b.keyCode && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).focus();
        }
      }
    }
  };var g = a.fn.dropdown;a.fn.dropdown = function (b) {
    return this.each(function () {
      var c = a(this),
          d = c.data("bs.dropdown");d || c.data("bs.dropdown", d = new f(this)), "string" == typeof b && d[b].call(c);
    });
  }, a.fn.dropdown.Constructor = f, a.fn.dropdown.noConflict = function () {
    return a.fn.dropdown = g, this;
  }, a(document).on("click.bs.dropdown.data-api", b).on("click.bs.dropdown.data-api", ".dropdown form", function (a) {
    a.stopPropagation();
  }).on("click.bs.dropdown.data-api", e, f.prototype.toggle).on("keydown.bs.dropdown.data-api", e + ", [role=menu], [role=listbox]", f.prototype.keydown);
}(jQuery), +function (a) {
  "use strict";
  var b = function b(_b2, c) {
    this.options = c, this.$element = a(_b2), this.$backdrop = this.isShown = null, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function () {
      this.$element.trigger("loaded.bs.modal");
    }, this));
  };b.DEFAULTS = { backdrop: !0, keyboard: !0, show: !0 }, b.prototype.toggle = function (a) {
    return this[this.isShown ? "hide" : "show"](a);
  }, b.prototype.show = function (b) {
    var c = this,
        d = a.Event("show.bs.modal", { relatedTarget: b });this.$element.trigger(d), this.isShown || d.isDefaultPrevented() || (this.isShown = !0, this.escape(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.backdrop(function () {
      var d = a.support.transition && c.$element.hasClass("fade");c.$element.parent().length || c.$element.appendTo(document.body), c.$element.show().scrollTop(0), d && c.$element[0].offsetWidth, c.$element.addClass("in").attr("aria-hidden", !1), c.enforceFocus();var e = a.Event("shown.bs.modal", { relatedTarget: b });d ? c.$element.find(".modal-dialog").one(a.support.transition.end, function () {
        c.$element.focus().trigger(e);
      }).emulateTransitionEnd(300) : c.$element.focus().trigger(e);
    }));
  }, b.prototype.hide = function (b) {
    b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one(a.support.transition.end, a.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal());
  }, b.prototype.enforceFocus = function () {
    a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function (a) {
      this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.focus();
    }, this));
  }, b.prototype.escape = function () {
    this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", a.proxy(function (a) {
      27 == a.which && this.hide();
    }, this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal");
  }, b.prototype.hideModal = function () {
    var a = this;this.$element.hide(), this.backdrop(function () {
      a.removeBackdrop(), a.$element.trigger("hidden.bs.modal");
    });
  }, b.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove(), this.$backdrop = null;
  }, b.prototype.backdrop = function (b) {
    var c = this.$element.hasClass("fade") ? "fade" : "";if (this.isShown && this.options.backdrop) {
      var d = a.support.transition && c;if (this.$backdrop = a('<div class="modal-backdrop ' + c + '" />').appendTo(document.body), this.$element.on("click.dismiss.bs.modal", a.proxy(function (a) {
        a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this));
      }, this)), d && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;d ? this.$backdrop.one(a.support.transition.end, b).emulateTransitionEnd(150) : b();
    } else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(a.support.transition.end, b).emulateTransitionEnd(150) : b()) : b && b();
  };var c = a.fn.modal;a.fn.modal = function (c, d) {
    return this.each(function () {
      var e = a(this),
          f = e.data("bs.modal"),
          g = a.extend({}, b.DEFAULTS, e.data(), "object" == (typeof c === "undefined" ? "undefined" : _typeof(c)) && c);f || e.data("bs.modal", f = new b(this, g)), "string" == typeof c ? f[c](d) : g.show && f.show(d);
    });
  }, a.fn.modal.Constructor = b, a.fn.modal.noConflict = function () {
    return a.fn.modal = c, this;
  }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (b) {
    var c = a(this),
        d = c.attr("href"),
        e = a(c.attr("data-target") || d && d.replace(/.*(?=#[^\s]+$)/, "")),
        f = e.data("bs.modal") ? "toggle" : a.extend({ remote: !/#/.test(d) && d }, e.data(), c.data());c.is("a") && b.preventDefault(), e.modal(f, this).one("hide", function () {
      c.is(":visible") && c.focus();
    });
  }), a(document).on("show.bs.modal", ".modal", function () {
    a(document.body).addClass("modal-open");
  }).on("hidden.bs.modal", ".modal", function () {
    a(document.body).removeClass("modal-open");
  });
}(jQuery), +function (a) {
  "use strict";
  var b = function b(a, _b3) {
    this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", a, _b3);
  };b.DEFAULTS = { animation: !0, placement: "top", selector: !1, template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: !1, container: !1 }, b.prototype.init = function (b, c, d) {
    this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d);for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
      var g = e[f];if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));else if ("manual" != g) {
        var h = "hover" == g ? "mouseenter" : "focusin",
            i = "hover" == g ? "mouseleave" : "focusout";this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this));
      }
    }this.options.selector ? this._options = a.extend({}, this.options, { trigger: "manual", selector: "" }) : this.fixTitle();
  }, b.prototype.getDefaults = function () {
    return b.DEFAULTS;
  }, b.prototype.getOptions = function (b) {
    return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = { show: b.delay, hide: b.delay }), b;
  }, b.prototype.getDelegateOptions = function () {
    var b = {},
        c = this.getDefaults();return this._options && a.each(this._options, function (a, d) {
      c[a] != d && (b[a] = d);
    }), b;
  }, b.prototype.enter = function (b) {
    var c = b instanceof this.constructor ? b : a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);return clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void (c.timeout = setTimeout(function () {
      "in" == c.hoverState && c.show();
    }, c.options.delay.show)) : c.show();
  }, b.prototype.leave = function (b) {
    var c = b instanceof this.constructor ? b : a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);return clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void (c.timeout = setTimeout(function () {
      "out" == c.hoverState && c.hide();
    }, c.options.delay.hide)) : c.hide();
  }, b.prototype.show = function () {
    var b = a.Event("show.bs." + this.type);if (this.hasContent() && this.enabled) {
      if (this.$element.trigger(b), b.isDefaultPrevented()) return;var c = this,
          d = this.tip();this.setContent(), this.options.animation && d.addClass("fade");var e = "function" == typeof this.options.placement ? this.options.placement.call(this, d[0], this.$element[0]) : this.options.placement,
          f = /\s?auto?\s?/i,
          g = f.test(e);g && (e = e.replace(f, "") || "top"), d.detach().css({ top: 0, left: 0, display: "block" }).addClass(e), this.options.container ? d.appendTo(this.options.container) : d.insertAfter(this.$element);var h = this.getPosition(),
          i = d[0].offsetWidth,
          j = d[0].offsetHeight;if (g) {
        var k = this.$element.parent(),
            l = e,
            m = document.documentElement.scrollTop || document.body.scrollTop,
            n = "body" == this.options.container ? window.innerWidth : k.outerWidth(),
            o = "body" == this.options.container ? window.innerHeight : k.outerHeight(),
            p = "body" == this.options.container ? 0 : k.offset().left;e = "bottom" == e && h.top + h.height + j - m > o ? "top" : "top" == e && h.top - m - j < 0 ? "bottom" : "right" == e && h.right + i > n ? "left" : "left" == e && h.left - i < p ? "right" : e, d.removeClass(l).addClass(e);
      }var q = this.getCalculatedOffset(e, h, i, j);this.applyPlacement(q, e), this.hoverState = null;var r = function r() {
        c.$element.trigger("shown.bs." + c.type);
      };a.support.transition && this.$tip.hasClass("fade") ? d.one(a.support.transition.end, r).emulateTransitionEnd(150) : r();
    }
  }, b.prototype.applyPlacement = function (b, c) {
    var d,
        e = this.tip(),
        f = e[0].offsetWidth,
        g = e[0].offsetHeight,
        h = parseInt(e.css("margin-top"), 10),
        i = parseInt(e.css("margin-left"), 10);isNaN(h) && (h = 0), isNaN(i) && (i = 0), b.top = b.top + h, b.left = b.left + i, a.offset.setOffset(e[0], a.extend({ using: function using(a) {
        e.css({ top: Math.round(a.top), left: Math.round(a.left) });
      } }, b), 0), e.addClass("in");var j = e[0].offsetWidth,
        k = e[0].offsetHeight;if ("top" == c && k != g && (d = !0, b.top = b.top + g - k), /bottom|top/.test(c)) {
      var l = 0;b.left < 0 && (l = -2 * b.left, b.left = 0, e.offset(b), j = e[0].offsetWidth, k = e[0].offsetHeight), this.replaceArrow(l - f + j, j, "left");
    } else this.replaceArrow(k - g, k, "top");d && e.offset(b);
  }, b.prototype.replaceArrow = function (a, b, c) {
    this.arrow().css(c, a ? 50 * (1 - a / b) + "%" : "");
  }, b.prototype.setContent = function () {
    var a = this.tip(),
        b = this.getTitle();a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right");
  }, b.prototype.hide = function () {
    function b() {
      "in" != c.hoverState && d.detach(), c.$element.trigger("hidden.bs." + c.type);
    }var c = this,
        d = this.tip(),
        e = a.Event("hide.bs." + this.type);return this.$element.trigger(e), e.isDefaultPrevented() ? void 0 : (d.removeClass("in"), a.support.transition && this.$tip.hasClass("fade") ? d.one(a.support.transition.end, b).emulateTransitionEnd(150) : b(), this.hoverState = null, this);
  }, b.prototype.fixTitle = function () {
    var a = this.$element;(a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "");
  }, b.prototype.hasContent = function () {
    return this.getTitle();
  }, b.prototype.getPosition = function () {
    var b = this.$element[0];return a.extend({}, "function" == typeof b.getBoundingClientRect ? b.getBoundingClientRect() : { width: b.offsetWidth, height: b.offsetHeight }, this.$element.offset());
  }, b.prototype.getCalculatedOffset = function (a, b, c, d) {
    return "bottom" == a ? { top: b.top + b.height, left: b.left + b.width / 2 - c / 2 } : "top" == a ? { top: b.top - d, left: b.left + b.width / 2 - c / 2 } : "left" == a ? { top: b.top + b.height / 2 - d / 2, left: b.left - c } : { top: b.top + b.height / 2 - d / 2, left: b.left + b.width };
  }, b.prototype.getTitle = function () {
    var a,
        b = this.$element,
        c = this.options;return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title);
  }, b.prototype.tip = function () {
    return this.$tip = this.$tip || a(this.options.template);
  }, b.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
  }, b.prototype.validate = function () {
    this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null);
  }, b.prototype.enable = function () {
    this.enabled = !0;
  }, b.prototype.disable = function () {
    this.enabled = !1;
  }, b.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  }, b.prototype.toggle = function (b) {
    var c = b ? a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type) : this;c.tip().hasClass("in") ? c.leave(c) : c.enter(c);
  }, b.prototype.destroy = function () {
    clearTimeout(this.timeout), this.hide().$element.off("." + this.type).removeData("bs." + this.type);
  };var c = a.fn.tooltip;a.fn.tooltip = function (c) {
    return this.each(function () {
      var d = a(this),
          e = d.data("bs.tooltip"),
          f = "object" == (typeof c === "undefined" ? "undefined" : _typeof(c)) && c;(e || "destroy" != c) && (e || d.data("bs.tooltip", e = new b(this, f)), "string" == typeof c && e[c]());
    });
  }, a.fn.tooltip.Constructor = b, a.fn.tooltip.noConflict = function () {
    return a.fn.tooltip = c, this;
  };
}(jQuery), +function (a) {
  "use strict";
  var b = function b(a, _b4) {
    this.init("popover", a, _b4);
  };if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");b.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, { placement: "right", trigger: "click", content: "", template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>' }), b.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), b.prototype.constructor = b, b.prototype.getDefaults = function () {
    return b.DEFAULTS;
  }, b.prototype.setContent = function () {
    var a = this.tip(),
        b = this.getTitle(),
        c = this.getContent();a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content")[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide();
  }, b.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  }, b.prototype.getContent = function () {
    var a = this.$element,
        b = this.options;return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content);
  }, b.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find(".arrow");
  }, b.prototype.tip = function () {
    return this.$tip || (this.$tip = a(this.options.template)), this.$tip;
  };var c = a.fn.popover;a.fn.popover = function (c) {
    return this.each(function () {
      var d = a(this),
          e = d.data("bs.popover"),
          f = "object" == (typeof c === "undefined" ? "undefined" : _typeof(c)) && c;(e || "destroy" != c) && (e || d.data("bs.popover", e = new b(this, f)), "string" == typeof c && e[c]());
    });
  }, a.fn.popover.Constructor = b, a.fn.popover.noConflict = function () {
    return a.fn.popover = c, this;
  };
}(jQuery), +function (a) {
  "use strict";
  function b(c, d) {
    var e,
        f = a.proxy(this.process, this);this.$element = a(a(c).is("body") ? window : c), this.$body = a("body"), this.$scrollElement = this.$element.on("scroll.bs.scroll-spy.data-api", f), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || (e = a(c).attr("href")) && e.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a", this.offsets = a([]), this.targets = a([]), this.activeTarget = null, this.refresh(), this.process();
  }b.DEFAULTS = { offset: 10 }, b.prototype.refresh = function () {
    var b = this.$element[0] == window ? "offset" : "position";this.offsets = a([]), this.targets = a([]);{
      var c = this;this.$body.find(this.selector).map(function () {
        var d = a(this),
            e = d.data("target") || d.attr("href"),
            f = /^#./.test(e) && a(e);return f && f.length && f.is(":visible") && [[f[b]().top + (!a.isWindow(c.$scrollElement.get(0)) && c.$scrollElement.scrollTop()), e]] || null;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).each(function () {
        c.offsets.push(this[0]), c.targets.push(this[1]);
      });
    }
  }, b.prototype.process = function () {
    var a,
        b = this.$scrollElement.scrollTop() + this.options.offset,
        c = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
        d = c - this.$scrollElement.height(),
        e = this.offsets,
        f = this.targets,
        g = this.activeTarget;if (b >= d) return g != (a = f.last()[0]) && this.activate(a);if (g && b <= e[0]) return g != (a = f[0]) && this.activate(a);for (a = e.length; a--;) {
      g != f[a] && b >= e[a] && (!e[a + 1] || b <= e[a + 1]) && this.activate(f[a]);
    }
  }, b.prototype.activate = function (b) {
    this.activeTarget = b, a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
        d = a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy");
  };var c = a.fn.scrollspy;a.fn.scrollspy = function (c) {
    return this.each(function () {
      var d = a(this),
          e = d.data("bs.scrollspy"),
          f = "object" == (typeof c === "undefined" ? "undefined" : _typeof(c)) && c;e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]();
    });
  }, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function () {
    return a.fn.scrollspy = c, this;
  }, a(window).on("load", function () {
    a('[data-spy="scroll"]').each(function () {
      var b = a(this);b.scrollspy(b.data());
    });
  });
}(jQuery), +function (a) {
  "use strict";
  var b = function b(_b5) {
    this.element = a(_b5);
  };b.prototype.show = function () {
    var b = this.element,
        c = b.closest("ul:not(.dropdown-menu)"),
        d = b.data("target");if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
      var e = c.find(".active:last a")[0],
          f = a.Event("show.bs.tab", { relatedTarget: e });if (b.trigger(f), !f.isDefaultPrevented()) {
        var g = a(d);this.activate(b.parent("li"), c), this.activate(g, g.parent(), function () {
          b.trigger({ type: "shown.bs.tab", relatedTarget: e });
        });
      }
    }
  }, b.prototype.activate = function (b, c, d) {
    function e() {
      f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"), b.addClass("active"), g ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu") && b.closest("li.dropdown").addClass("active"), d && d();
    }var f = c.find("> .active"),
        g = d && a.support.transition && f.hasClass("fade");g ? f.one(a.support.transition.end, e).emulateTransitionEnd(150) : e(), f.removeClass("in");
  };var c = a.fn.tab;a.fn.tab = function (c) {
    return this.each(function () {
      var d = a(this),
          e = d.data("bs.tab");e || d.data("bs.tab", e = new b(this)), "string" == typeof c && e[c]();
    });
  }, a.fn.tab.Constructor = b, a.fn.tab.noConflict = function () {
    return a.fn.tab = c, this;
  }, a(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function (b) {
    b.preventDefault(), a(this).tab("show");
  });
}(jQuery), +function (a) {
  "use strict";
  var b = function b(c, d) {
    this.options = a.extend({}, b.DEFAULTS, d), this.$window = a(window).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(c), this.affixed = this.unpin = this.pinnedOffset = null, this.checkPosition();
  };b.RESET = "affix affix-top affix-bottom", b.DEFAULTS = { offset: 0 }, b.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;this.$element.removeClass(b.RESET).addClass("affix");var a = this.$window.scrollTop(),
        c = this.$element.offset();return this.pinnedOffset = c.top - a;
  }, b.prototype.checkPositionWithEventLoop = function () {
    setTimeout(a.proxy(this.checkPosition, this), 1);
  }, b.prototype.checkPosition = function () {
    if (this.$element.is(":visible")) {
      var c = a(document).height(),
          d = this.$window.scrollTop(),
          e = this.$element.offset(),
          f = this.options.offset,
          g = f.top,
          h = f.bottom;"top" == this.affixed && (e.top += d), "object" != (typeof f === "undefined" ? "undefined" : _typeof(f)) && (h = g = f), "function" == typeof g && (g = f.top(this.$element)), "function" == typeof h && (h = f.bottom(this.$element));var i = null != this.unpin && d + this.unpin <= e.top ? !1 : null != h && e.top + this.$element.height() >= c - h ? "bottom" : null != g && g >= d ? "top" : !1;if (this.affixed !== i) {
        this.unpin && this.$element.css("top", "");var j = "affix" + (i ? "-" + i : ""),
            k = a.Event(j + ".bs.affix");this.$element.trigger(k), k.isDefaultPrevented() || (this.affixed = i, this.unpin = "bottom" == i ? this.getPinnedOffset() : null, this.$element.removeClass(b.RESET).addClass(j).trigger(a.Event(j.replace("affix", "affixed"))), "bottom" == i && this.$element.offset({ top: c - h - this.$element.height() }));
      }
    }
  };var c = a.fn.affix;a.fn.affix = function (c) {
    return this.each(function () {
      var d = a(this),
          e = d.data("bs.affix"),
          f = "object" == (typeof c === "undefined" ? "undefined" : _typeof(c)) && c;e || d.data("bs.affix", e = new b(this, f)), "string" == typeof c && e[c]();
    });
  }, a.fn.affix.Constructor = b, a.fn.affix.noConflict = function () {
    return a.fn.affix = c, this;
  }, a(window).on("load", function () {
    a('[data-spy="affix"]').each(function () {
      var b = a(this),
          c = b.data();c.offset = c.offset || {}, c.offsetBottom && (c.offset.bottom = c.offsetBottom), c.offsetTop && (c.offset.top = c.offsetTop), b.affix(c);
    });
  });
}(jQuery);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

!function (f, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = e(require("react")) : "function" == typeof define && define.amd ? define(["react"], e) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.ReactEmoji = e(require("react")) : f.ReactEmoji = e(f.React);
}(undefined, function (f) {
  return function (f) {
    function e(o) {
      if (a[o]) return a[o].exports;var r = a[o] = { exports: {}, id: o, loaded: !1 };return f[o].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports;
    }var a = {};return e.m = f, e.c = a, e.p = "", e(0);
  }([function (f, e, a) {
    "use strict";
    var o = function o(f) {
      return f && f.__esModule ? f["default"] : f;
    },
        r = o(a(6)),
        t = o(a(1)),
        n = o(a(2)),
        i = o(a(3)),
        c = o(a(5)),
        s = o(a(4)),
        _ = function _() {
      var f = function f(_f) {
        return Object.keys(_f).map(function (f) {
          return i(f);
        }).join("|");
      },
          e = function e(f) {
        var e = { useEmoticon: f.useEmoticon === !1 ? !1 : !0, emojiType: f.emojiType || "twemoji", host: f.host || "", path: f.path || "", ext: f.ext || "svg", singleEmoji: f.singleEmoji || !1, strict: f.strict || !1 };return e.attributes = c({ width: "20px", height: "20px" }, f.attributes), e;
      },
          a = { ":/": "1f615" },
          o = "\\:\\/(?!\\/)",
          _ = { delimiter: new RegExp("(:(?:" + f(t) + "):|" + f(n) + "|" + o + ")", "g"), dict: c(t, n, a) },
          l = { delimiter: new RegExp("(:(?:" + f(t) + "):)", "g"), dict: t },
          b = function b(f, e) {
        if (e.host) return s([e.host, e.path, "" + f + "." + e.ext]).join("/");if ("twemoji" === e.emojiType) return "https://twemoji.maxcdn.com/" + e.ext + "/" + f + "." + e.ext;if ("emojione" === e.emojiType) return "http://cdn.jsdelivr.net/emojione/assets/" + e.ext + "/" + f.toUpperCase() + "." + e.ext;throw new Error("Invalid emojiType is passed");
      },
          u = function u(f) {
        return f.match(/^:.*:$/) ? f.replace(/^:/, "").replace(/:$/, "") : f;
      },
          d = function d(f, e) {
        var a = e.useEmoticon ? _ : l,
            o = a.dict,
            t = o[u(f)];if (e.strict && !t) throw new Error("Could not find emoji: " + f + ".");return t ? r.createElement("img", c(e.attributes, { src: b(t, e) })) : f;
      },
          h = function h(f, e) {
        var a = e.useEmoticon ? _ : l,
            o = a.delimiter,
            t = a.dict;return s(f.split(o).map(function (f, a) {
          var n = f.match(o);if (e.strict && "" !== f && null === n) throw new Error("Could not find emoji: " + f + ".");if (n) {
            var i = t[u(n[0])];return null === i ? f : r.createElement("img", c(e.attributes, { key: a, src: b(i, e) }));
          }return f;
        }));
      };return { emojify: function emojify(f) {
          var a = void 0 === arguments[1] ? {} : arguments[1];return f ? (a = e(a), a.singleEmoji ? d(f, a) : h(f, a)) : null;
        } };
    };f.exports = _();
  }, function (f, e) {
    f.exports = { "+1": "1f44d", "-1": "1f44e", 100: "1f4af", 1234: "1f522", "8ball": "1f3b1", a: "1f170", ab: "1f18e", abc: "1f524", abcd: "1f521", accept: "1f251", aerial_tramway: "1f6a1", airplane: "2708", alarm_clock: "23f0", alien: "1f47d", ambulance: "1f691", anchor: "2693", angel: "1f47c", anger: "1f4a2", angry: "1f620", anguished: "1f627", ant: "1f41c", apple: "1f34e", aquarius: "2652", aries: "2648", arrow_backward: "25c0", arrow_double_down: "23ec", arrow_double_up: "23eb", arrow_down: "2b07", arrow_down_small: "1f53d", arrow_forward: "25b6", arrow_heading_down: "2935", arrow_heading_up: "2934", arrow_left: "2b05", arrow_lower_left: "2199", arrow_lower_right: "2198", arrow_right: "27a1", arrow_right_hook: "21aa", arrow_up: "2b06", arrow_up_down: "2195", arrow_up_small: "1f53c", arrow_upper_left: "2196", arrow_upper_right: "2197", arrows_clockwise: "1f503", arrows_counterclockwise: "1f504", art: "1f3a8", articulated_lorry: "1f69b", astonished: "1f632", athletic_shoe: "1f45f", atm: "1f3e7", b: "1f171", baby: "1f476", baby_bottle: "1f37c", baby_chick: "1f424", baby_symbol: "1f6bc", back: "1f519", baggage_claim: "1f6c4", balloon: "1f388", ballot_box_with_check: "2611", bamboo: "1f38d", banana: "1f34c", bangbang: "203c", bank: "1f3e6", bar_chart: "1f4ca", barber: "1f488", baseball: "26be", basketball: "1f3c0", bath: "1f6c0", bathtub: "1f6c1", battery: "1f50b", bear: "1f43b", bee: "1f41d", beer: "1f37a", beers: "1f37b", beetle: "1f41e", beginner: "1f530", bell: "1f514", bento: "1f371", bicyclist: "1f6b4", bike: "1f6b2", bikini: "1f459", bird: "1f426", birthday: "1f382", black_circle: "26ab", black_joker: "1f0cf", black_large_square: "2b1b", black_medium_small_square: "25fe", black_medium_square: "25fc", black_nib: "2712", black_small_square: "25aa", black_square_button: "1f532", blossom: "1f33c", blowfish: "1f421", blue_book: "1f4d8", blue_car: "1f699", blue_heart: "1f499", blush: "1f60a", boar: "1f417", boat: "26f5", bomb: "1f4a3", book: "1f4d6", bookmark: "1f516", bookmark_tabs: "1f4d1", books: "1f4da", boom: "1f4a5", boot: "1f462", bouquet: "1f490", bow: "1f647", bowling: "1f3b3", bowtie: null, boy: "1f466", bread: "1f35e", bride_with_veil: "1f470", bridge_at_night: "1f309", briefcase: "1f4bc", broken_heart: "1f494", bug: "1f41b", bulb: "1f4a1", bullettrain_front: "1f685", bullettrain_side: "1f684", bus: "1f68c", busstop: "1f68f", bust_in_silhouette: "1f464", busts_in_silhouette: "1f465", cactus: "1f335", cake: "1f370", calendar: "1f4c6", calling: "1f4f2", camel: "1f42b", camera: "1f4f7", cancer: "264b", candy: "1f36c", capital_abcd: "1f520", capricorn: "2651", car: "1f697", card_index: "1f4c7", carousel_horse: "1f3a0", cat: "1f431", cat2: "1f408", cd: "1f4bf", chart: "1f4b9", chart_with_downwards_trend: "1f4c9", chart_with_upwards_trend: "1f4c8", checkered_flag: "1f3c1", cherries: "1f352", cherry_blossom: "1f338", chestnut: "1f330", chicken: "1f414", children_crossing: "1f6b8", chocolate_bar: "1f36b", christmas_tree: "1f384", church: "26ea", cinema: "1f3a6", circus_tent: "1f3aa", city_sunrise: "1f307", city_sunset: "1f306", cl: "1f191", clap: "1f44f", clapper: "1f3ac", clipboard: "1f4cb", clock1: "1f550", clock10: "1f559", clock1030: "1f565", clock11: "1f55a", clock1130: "1f566", clock12: "1f55b", clock1230: "1f567", clock130: "1f55c", clock2: "1f551", clock230: "1f55d", clock3: "1f552", clock330: "1f55e", clock4: "1f553", clock430: "1f55f", clock5: "1f554", clock530: "1f560", clock6: "1f555", clock630: "1f561", clock7: "1f556", clock730: "1f562", clock8: "1f557", clock830: "1f563", clock9: "1f558", clock930: "1f564", closed_book: "1f4d5", closed_lock_with_key: "1f510", closed_umbrella: "1f302", cloud: "2601", clubs: "2663", cn: "1f1e8-1f1f3", cocktail: "1f378", coffee: "2615", cold_sweat: "1f630", collision: "1f4a5", computer: "1f4bb", confetti_ball: "1f38a", confounded: "1f616", confused: "1f615", congratulations: "3297", construction: "1f6a7", construction_worker: "1f477", convenience_store: "1f3ea", cookie: "1f36a", cool: "1f192", cop: "1f46e", copyright: "00a9", corn: "1f33d", couple: "1f46b", couple_with_heart: "1f491", couplekiss: "1f48f", cow: "1f42e", cow2: "1f404", credit_card: "1f4b3", crescent_moon: "1f319", crocodile: "1f40a", crossed_flags: "1f38c", crown: "1f451", cry: "1f622", crying_cat_face: "1f63f", crystal_ball: "1f52e", cupid: "1f498", curly_loop: "27b0", currency_exchange: "1f4b1", curry: "1f35b", custard: "1f36e", customs: "1f6c3", cyclone: "1f300", dancer: "1f483", dancers: "1f46f", dango: "1f361", dart: "1f3af", dash: "1f4a8", date: "1f4c5", de: "1f1e9-1f1ea", deciduous_tree: "1f333", department_store: "1f3ec", diamond_shape_with_a_dot_inside: "1f4a0", diamonds: "2666", disappointed: "1f61e", disappointed_relieved: "1f625", dizzy: "1f4ab", dizzy_face: "1f635", do_not_litter: "1f6af", dog: "1f436", dog2: "1f415", dollar: "1f4b5", dolls: "1f38e", dolphin: "1f42c", door: "1f6aa", doughnut: "1f369", dragon: "1f409", dragon_face: "1f432", dress: "1f457", dromedary_camel: "1f42a", droplet: "1f4a7", dvd: "1f4c0", "e-mail": "1f4e7", ear: "1f442", ear_of_rice: "1f33e", earth_africa: "1f30d", earth_americas: "1f30e", earth_asia: "1f30f", egg: "1f373", eggplant: "1f346", eight: "0038-20e3", eight_pointed_black_star: "2734", eight_spoked_asterisk: "2733", electric_plug: "1f50c", elephant: "1f418", email: "2709", end: "1f51a", envelope: "2709", envelope_with_arrow: "1f4e9", es: "1f1ea-1f1f8", euro: "1f4b6", european_castle: "1f3f0", european_post_office: "1f3e4", evergreen_tree: "1f332", exclamation: "2757", expressionless: "1f611", eyeglasses: "1f453", eyes: "1f440", facepunch: "1f44a", factory: "1f3ed", fallen_leaf: "1f342", family: "1f46a", fast_forward: "23e9", fax: "1f4e0", fearful: "1f628", feelsgood: null, feet: "1f43e", ferris_wheel: "1f3a1", file_folder: "1f4c1", finnadie: null, fire: "1f525", fire_engine: "1f692", fireworks: "1f386", first_quarter_moon: "1f313", first_quarter_moon_with_face: "1f31b", fish: "1f41f", fish_cake: "1f365", fishing_pole_and_fish: "1f3a3", fist: "270a", five: "0035-20e3", flags: "1f38f", flashlight: "1f526", flipper: "1f42c", floppy_disk: "1f4be", flower_playing_cards: "1f3b4", flushed: "1f633", foggy: "1f301", football: "1f3c8", footprints: "1f463", fork_and_knife: "1f374", fountain: "26f2", four: "0034-20e3", four_leaf_clover: "1f340", fr: "1f1eb-1f1f7", free: "1f193", fried_shrimp: "1f364", fries: "1f35f", frog: "1f438", frowning: "1f626", fu: null, fuelpump: "26fd", full_moon: "1f315", full_moon_with_face: "1f31d", game_die: "1f3b2", gb: "1f1ec-1f1e7", gem: "1f48e", gemini: "264a", ghost: "1f47b", gift: "1f381", gift_heart: "1f49d", girl: "1f467", globe_with_meridians: "1f310", goat: "1f410", goberserk: null, godmode: null, golf: "26f3", grapes: "1f347", green_apple: "1f34f", green_book: "1f4d7", green_heart: "1f49a", grey_exclamation: "2755", grey_question: "2754", grimacing: "1f62c", grin: "1f601", grinning: "1f600", guardsman: "1f482", guitar: "1f3b8", gun: "1f52b", haircut: "1f487", hamburger: "1f354", hammer: "1f528", hamster: "1f439", hand: "270b", handbag: "1f45c", hankey: "1f4a9", hash: "0023-20e3", hatched_chick: "1f425", hatching_chick: "1f423", headphones: "1f3a7", hear_no_evil: "1f649", heart: "2764", heart_decoration: "1f49f", heart_eyes: "1f60d", heart_eyes_cat: "1f63b", heartbeat: "1f493", heartpulse: "1f497", hearts: "2665", heavy_check_mark: "2714", heavy_division_sign: "2797", heavy_dollar_sign: "1f4b2", heavy_exclamation_mark: "2757", heavy_minus_sign: "2796", heavy_multiplication_x: "2716", heavy_plus_sign: "2795", helicopter: "1f681", herb: "1f33f", hibiscus: "1f33a", high_brightness: "1f506", high_heel: "1f460", hocho: "1f52a", honey_pot: "1f36f", honeybee: "1f41d", horse: "1f434", horse_racing: "1f3c7", hospital: "1f3e5", hotel: "1f3e8", hotsprings: "2668", hourglass: "231b", hourglass_flowing_sand: "23f3", house: "1f3e0", house_with_garden: "1f3e1", hurtrealbad: null, hushed: "1f62f", ice_cream: "1f368", icecream: "1f366", id: "1f194", ideograph_advantage: "1f250", imp: "1f47f", inbox_tray: "1f4e5", incoming_envelope: "1f4e8", information_desk_person: "1f481", information_source: "2139", innocent: "1f607", interrobang: "2049", iphone: "1f4f1", it: "1f1ee-1f1f9", izakaya_lantern: "1f3ee", jack_o_lantern: "1f383", japan: "1f5fe", japanese_castle: "1f3ef", japanese_goblin: "1f47a", japanese_ogre: "1f479", jeans: "1f456", joy: "1f602", joy_cat: "1f639", jp: "1f1ef-1f1f5", key: "1f511", keycap_ten: "1f51f", kimono: "1f458", kiss: "1f48b", kissing: "1f617", kissing_cat: "1f63d", kissing_closed_eyes: "1f61a", kissing_heart: "1f618", kissing_smiling_eyes: "1f619", knife: "1f52a", koala: "1f428", koko: "1f201", kr: "1f1f0-1f1f7", lantern: "1f3ee", large_blue_circle: "1f535", large_blue_diamond: "1f537", large_orange_diamond: "1f536", last_quarter_moon: "1f317", last_quarter_moon_with_face: "1f31c", laughing: "1f606", leaves: "1f343", ledger: "1f4d2", left_luggage: "1f6c5", left_right_arrow: "2194", leftwards_arrow_with_hook: "21a9", lemon: "1f34b", leo: "264c", leopard: "1f406", libra: "264e", light_rail: "1f688", link: "1f517", lips: "1f444", lipstick: "1f484", lock: "1f512", lock_with_ink_pen: "1f50f", lollipop: "1f36d", loop: "27bf", loud_sound: "1f50a", loudspeaker: "1f4e2", love_hotel: "1f3e9", love_letter: "1f48c", low_brightness: "1f505", m: "24c2", mag: "1f50d", mag_right: "1f50e", mahjong: "1f004", mailbox: "1f4eb", mailbox_closed: "1f4ea", mailbox_with_mail: "1f4ec", mailbox_with_no_mail: "1f4ed", man: "1f468", man_with_gua_pi_mao: "1f472", man_with_turban: "1f473", mans_shoe: "1f45e", maple_leaf: "1f341", mask: "1f637", massage: "1f486", meat_on_bone: "1f356", mega: "1f4e3", melon: "1f348", memo: "1f4dd", mens: "1f6b9", metal: null, metro: "1f687", microphone: "1f3a4", microscope: "1f52c", milky_way: "1f30c", minibus: "1f690", minidisc: "1f4bd", mobile_phone_off: "1f4f4", money_with_wings: "1f4b8", moneybag: "1f4b0", monkey: "1f412", monkey_face: "1f435", monorail: "1f69d", moon: "1f314", mortar_board: "1f393", mount_fuji: "1f5fb", mountain_bicyclist: "1f6b5", mountain_cableway: "1f6a0", mountain_railway: "1f69e", mouse: "1f42d", mouse2: "1f401", movie_camera: "1f3a5", moyai: "1f5ff", muscle: "1f4aa", mushroom: "1f344", musical_keyboard: "1f3b9", musical_note: "1f3b5", musical_score: "1f3bc", mute: "1f507", nail_care: "1f485", name_badge: "1f4db", neckbeard: null, necktie: "1f454", negative_squared_cross_mark: "274e", neutral_face: "1f610", "new": "1f195", new_moon: "1f311", new_moon_with_face: "1f31a", newspaper: "1f4f0", ng: "1f196", night_with_stars: "1f303", nine: "0039-20e3", no_bell: "1f515", no_bicycles: "1f6b3", no_entry: "26d4", no_entry_sign: "1f6ab", no_good: "1f645", no_mobile_phones: "1f4f5", no_mouth: "1f636", no_pedestrians: "1f6b7", no_smoking: "1f6ad", "non-potable_water": "1f6b1", nose: "1f443", notebook: "1f4d3", notebook_with_decorative_cover: "1f4d4", notes: "1f3b6", nut_and_bolt: "1f529", o: "2b55", o2: "1f17e", ocean: "1f30a", octocat: null, octopus: "1f419", oden: "1f362", office: "1f3e2", ok: "1f197", ok_hand: "1f44c", ok_woman: "1f646", older_man: "1f474", older_woman: "1f475", on: "1f51b", oncoming_automobile: "1f698", oncoming_bus: "1f68d", oncoming_police_car: "1f694", oncoming_taxi: "1f696", one: "0031-20e3", open_book: "1f4d6", open_file_folder: "1f4c2", open_hands: "1f450", open_mouth: "1f62e", ophiuchus: "26ce", orange_book: "1f4d9", outbox_tray: "1f4e4", ox: "1f402", "package": "1f4e6", page_facing_up: "1f4c4", page_with_curl: "1f4c3", pager: "1f4df", palm_tree: "1f334", panda_face: "1f43c", paperclip: "1f4ce", parking: "1f17f", part_alternation_mark: "303d", partly_sunny: "26c5", passport_control: "1f6c2", paw_prints: "1f43e", peach: "1f351", pear: "1f350", pencil: "1f4dd", pencil2: "270f", penguin: "1f427", pensive: "1f614", performing_arts: "1f3ad", persevere: "1f623", person_frowning: "1f64d", person_with_blond_hair: "1f471", person_with_pouting_face: "1f64e", phone: "260e", pig: "1f437", pig2: "1f416", pig_nose: "1f43d", pill: "1f48a", pineapple: "1f34d", pisces: "2653", pizza: "1f355", point_down: "1f447", point_left: "1f448", point_right: "1f449", point_up: "261d", point_up_2: "1f446", police_car: "1f693", poodle: "1f429", poop: "1f4a9", post_office: "1f3e3", postal_horn: "1f4ef", postbox: "1f4ee", potable_water: "1f6b0", pouch: "1f45d", poultry_leg: "1f357", pound: "1f4b7", pouting_cat: "1f63e", pray: "1f64f", princess: "1f478", punch: "1f44a", purple_heart: "1f49c", purse: "1f45b", pushpin: "1f4cc", put_litter_in_its_place: "1f6ae", question: "2753", rabbit: "1f430", rabbit2: "1f407", racehorse: "1f40e", radio: "1f4fb", radio_button: "1f518", rage: "1f621", rage1: null, rage2: null, rage3: null, rage4: null, railway_car: "1f683", rainbow: "1f308", raised_hand: "270b", raised_hands: "1f64c", raising_hand: "1f64b", ram: "1f40f", ramen: "1f35c", rat: "1f400", recycle: "267b", red_car: "1f697", red_circle: "1f534", registered: "00ae", relaxed: "263a", relieved: "1f60c", repeat: "1f501", repeat_one: "1f502", restroom: "1f6bb", revolving_hearts: "1f49e", rewind: "23ea", ribbon: "1f380", rice: "1f35a", rice_ball: "1f359", rice_cracker: "1f358", rice_scene: "1f391", ring: "1f48d", rocket: "1f680", roller_coaster: "1f3a2", rooster: "1f413", rose: "1f339", rotating_light: "1f6a8", round_pushpin: "1f4cd", rowboat: "1f6a3", ru: "1f1f7-1f1fa", rugby_football: "1f3c9", runner: "1f3c3", running: "1f3c3", running_shirt_with_sash: "1f3bd", sa: "1f202", sagittarius: "2650", sailboat: "26f5", sake: "1f376", sandal: "1f461", santa: "1f385", satellite: "1f4e1", satisfied: "1f606", saxophone: "1f3b7", school: "1f3eb", school_satchel: "1f392", scissors: "2702", scorpius: "264f", scream: "1f631", scream_cat: "1f640", scroll: "1f4dc", seat: "1f4ba", secret: "3299", see_no_evil: "1f648", seedling: "1f331", seven: "0037-20e3", shaved_ice: "1f367", sheep: "1f411", shell: "1f41a", ship: "1f6a2", shipit: null, shirt: "1f455", shit: "1f4a9", shoe: "1f45e", shower: "1f6bf", signal_strength: "1f4f6", six: "0036-20e3", six_pointed_star: "1f52f", ski: "1f3bf", skull: "1f480", sleeping: "1f634", sleepy: "1f62a", slot_machine: "1f3b0", small_blue_diamond: "1f539", small_orange_diamond: "1f538", small_red_triangle: "1f53a", small_red_triangle_down: "1f53b", smile: "1f604", smile_cat: "1f638", smiley: "1f603", smiley_cat: "1f63a", smiling_imp: "1f608", smirk: "1f60f", smirk_cat: "1f63c", smoking: "1f6ac", snail: "1f40c", snake: "1f40d", snowboarder: "1f3c2", snowflake: "2744", snowman: "26c4", sob: "1f62d", soccer: "26bd", soon: "1f51c", sos: "1f198", sound: "1f509", space_invader: "1f47e", spades: "2660", spaghetti: "1f35d", sparkle: "2747", sparkler: "1f387", sparkles: "2728", sparkling_heart: "1f496", speak_no_evil: "1f64a", speaker: "1f508", speech_balloon: "1f4ac", speedboat: "1f6a4", squirrel: null, star: "2b50", star2: "1f31f", stars: "1f320", station: "1f689", statue_of_liberty: "1f5fd", steam_locomotive: "1f682", stew: "1f372", straight_ruler: "1f4cf", strawberry: "1f353", stuck_out_tongue: "1f61b", stuck_out_tongue_closed_eyes: "1f61d", stuck_out_tongue_winking_eye: "1f61c", sun_with_face: "1f31e", sunflower: "1f33b", sunglasses: "1f60e", sunny: "2600", sunrise: "1f305", sunrise_over_mountains: "1f304", surfer: "1f3c4", sushi: "1f363", suspect: null, suspension_railway: "1f69f", sweat: "1f613", sweat_drops: "1f4a6", sweat_smile: "1f605", sweet_potato: "1f360", swimmer: "1f3ca", symbols: "1f523", syringe: "1f489", tada: "1f389", tanabata_tree: "1f38b", tangerine: "1f34a", taurus: "2649", taxi: "1f695", tea: "1f375", telephone: "260e", telephone_receiver: "1f4de", telescope: "1f52d", tennis: "1f3be", tent: "26fa", thought_balloon: "1f4ad", three: "0033-20e3", thumbsdown: "1f44e", thumbsup: "1f44d", ticket: "1f3ab", tiger: "1f42f", tiger2: "1f405", tired_face: "1f62b", tm: "2122", toilet: "1f6bd", tokyo_tower: "1f5fc", tomato: "1f345", tongue: "1f445", top: "1f51d", tophat: "1f3a9", tractor: "1f69c", traffic_light: "1f6a5", train: "1f68b", train2: "1f686", tram: "1f68a", triangular_flag_on_post: "1f6a9", triangular_ruler: "1f4d0", trident: "1f531", triumph: "1f624", trolleybus: "1f68e", trollface: null, trophy: "1f3c6", tropical_drink: "1f379", tropical_fish: "1f420", truck: "1f69a", trumpet: "1f3ba", tshirt: "1f455", tulip: "1f337", turtle: "1f422", tv: "1f4fa", twisted_rightwards_arrows: "1f500", two: "0032-20e3", two_hearts: "1f495", two_men_holding_hands: "1f46c", two_women_holding_hands: "1f46d", u5272: "1f239", u5408: "1f234", u55b6: "1f23a", u6307: "1f22f", u6708: "1f237", u6709: "1f236", u6e80: "1f235", u7121: "1f21a", u7533: "1f238", u7981: "1f232", u7a7a: "1f233", uk: "1f1ec-1f1e7", umbrella: "2614", unamused: "1f612", underage: "1f51e", unlock: "1f513", up: "1f199", us: "1f1fa-1f1f8", v: "270c", vertical_traffic_light: "1f6a6", vhs: "1f4fc", vibration_mode: "1f4f3", video_camera: "1f4f9", video_game: "1f3ae", violin: "1f3bb", virgo: "264d", volcano: "1f30b", vs: "1f19a", walking: "1f6b6", waning_crescent_moon: "1f318", waning_gibbous_moon: "1f316", warning: "26a0", watch: "231a", water_buffalo: "1f403", watermelon: "1f349", wave: "1f44b", wavy_dash: "3030", waxing_crescent_moon: "1f312", waxing_gibbous_moon: "1f314", wc: "1f6be", weary: "1f629", wedding: "1f492", whale: "1f433", whale2: "1f40b", wheelchair: "267f", white_check_mark: "2705", white_circle: "26aa", white_flower: "1f4ae", white_large_square: "2b1c", white_medium_small_square: "25fd", white_medium_square: "25fb", white_small_square: "25ab", white_square_button: "1f533", wind_chime: "1f390", wine_glass: "1f377", wink: "1f609", wolf: "1f43a", woman: "1f469", womans_clothes: "1f45a", womans_hat: "1f452", womens: "1f6ba", worried: "1f61f", wrench: "1f527", x: "274c", yellow_heart: "1f49b", yen: "1f4b4", yum: "1f60b", zap: "26a1", zero: "0030-20e3", zzz: "1f4a4" };
  }, function (f, e) {
    f.exports = { "<3": "2764", "</3": "1f494", ":')": "1f602", ":'-)": "1f602", ":D": "1f603", ":-D": "1f603", "=D": "1f603", ":)": "1f604", ":-)": "1f604", "=]": "1f604", "=)": "1f604", ":]": "1f604", "':)": "1f605", "':-)": "1f605", "'=)": "1f605", "':D": "1f605", "':-D": "1f605", "'=D": "1f605", ">:)": "1f606", ">;)": "1f606", ">:-)": "1f606", ">=)": "1f606", ";)": "1f609", ";-)": "1f609", "*-)": "1f609", "*)": "1f609", ";-]": "1f609", ";]": "1f609", ";D": "1f609", ";^)": "1f609", "':(": "1f613", "':-(": "1f613", "'=(": "1f613", ":*": "1f618", ":-*": "1f618", "=*": "1f618", ":^*": "1f618", ">:P": "1f61c", "X-P": "1f61c", "x-p": "1f61c", ">:[": "1f61e", ":-(": "1f61e", ":(": "1f61e", ":-[": "1f61e", ":[": "1f61e", "=(": "1f61e", ">:(": "1f620", ">:-(": "1f620", ":@": "1f620", ":'(": "1f622", ":'-(": "1f622", ";(": "1f622", ";-(": "1f622", ">.<": "1f623", ":$": "1f633", "=$": "1f633", "#-)": "1f635", "#)": "1f635", "%-)": "1f635", "%)": "1f635", "X)": "1f635", "X-)": "1f635", "*\\0/*": "1f646", "\\0/": "1f646", "*\\O/*": "1f646", "\\O/": "1f646", "O:-)": "1f607", "0:-3": "1f607", "0:3": "1f607", "0:-)": "1f607", "0:)": "1f607", "0;^)": "1f607", "O:)": "1f607", "O;-)": "1f607", "O=)": "1f607", "0;-)": "1f607", "O:-3": "1f607", "O:3": "1f607", "B-)": "1f60e", "B)": "1f60e", "8)": "1f60e", "8-)": "1f60e", "B-D": "1f60e", "8-D": "1f60e", "-_-": "1f611", "-__-": "1f611", "-___-": "1f611", ">:\\": "1f615", ">:/": "1f615", ":-/": "1f615", ":-.": "1f615", ":\\": "1f615", "=/": "1f615", "=\\": "1f615", ":L": "1f615", "=L": "1f615", ":P": "1f61b", ":-P": "1f61b", "=P": "1f61b", ":-p": "1f61b", ":p": "1f61b", "=p": "1f61b", ":-Þ": "1f61b", ":Þ": "1f61b", ":þ": "1f61b", ":-þ": "1f61b", ":-b": "1f61b", ":b": "1f61b", "d:": "1f61b", ":-O": "1f62e", ":O": "1f62e", ":-o": "1f62e", ":o": "1f62e", O_O: "1f62e", ">:O": "1f62e", ":-X": "1f636", ":X": "1f636", ":-#": "1f636", ":#": "1f636", "=X": "1f636", "=x": "1f636", ":x": "1f636", ":-x": "1f636", "=#": "1f636" };
  }, function (f, e) {
    "use strict";
    var a = /[|\\{}()[\]^$+*?.]/g;f.exports = function (f) {
      if ("string" != typeof f) throw new TypeError("Expected a string");return f.replace(a, "\\$&");
    };
  }, function (f, e) {
    function a(f) {
      for (var e = -1, a = f ? f.length : 0, o = -1, r = []; ++e < a;) {
        var t = f[e];t && (r[++o] = t);
      }return r;
    }f.exports = a;
  }, function (f, e) {
    "use strict";
    function a(f) {
      if (null == f) throw new TypeError("Object.assign cannot be called with null or undefined");return Object(f);
    }f.exports = Object.assign || function (f, e) {
      for (var o, r, t = a(f), n = 1; n < arguments.length; n++) {
        o = arguments[n], r = Object.keys(Object(o));for (var i = 0; i < r.length; i++) {
          t[r[i]] = o[r[i]];
        }
      }return t;
    };
  }, function (e, a) {
    e.exports = f;
  }]);
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*!
 *  howler.js v1.1.26
 *  howlerjs.com
 *
 *  (c) 2013-2015, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */
!function () {
  var e = {},
      o = null,
      n = !0,
      t = !1;try {
    "undefined" != typeof AudioContext ? o = new AudioContext() : "undefined" != typeof webkitAudioContext ? o = new webkitAudioContext() : n = !1;
  } catch (r) {
    n = !1;
  }if (!n) if ("undefined" != typeof Audio) try {
    new Audio();
  } catch (r) {
    t = !0;
  } else t = !0;if (n) {
    var a = "undefined" == typeof o.createGain ? o.createGainNode() : o.createGain();a.gain.value = 1, a.connect(o.destination);
  }var i = function i(e) {
    this._volume = 1, this._muted = !1, this.usingWebAudio = n, this.ctx = o, this.noAudio = t, this._howls = [], this._codecs = e, this.iOSAutoEnable = !0;
  };i.prototype = { volume: function volume(e) {
      var o = this;if (e = parseFloat(e), e >= 0 && 1 >= e) {
        o._volume = e, n && (a.gain.value = e);for (var t in o._howls) {
          if (o._howls.hasOwnProperty(t) && o._howls[t]._webAudio === !1) for (var r = 0; r < o._howls[t]._audioNode.length; r++) {
            o._howls[t]._audioNode[r].volume = o._howls[t]._volume * o._volume;
          }
        }return o;
      }return n ? a.gain.value : o._volume;
    }, mute: function mute() {
      return this._setMuted(!0), this;
    }, unmute: function unmute() {
      return this._setMuted(!1), this;
    }, _setMuted: function _setMuted(e) {
      var o = this;o._muted = e, n && (a.gain.value = e ? 0 : o._volume);for (var t in o._howls) {
        if (o._howls.hasOwnProperty(t) && o._howls[t]._webAudio === !1) for (var r = 0; r < o._howls[t]._audioNode.length; r++) {
          o._howls[t]._audioNode[r].muted = e;
        }
      }
    }, codecs: function codecs(e) {
      return this._codecs[e];
    }, _enableiOSAudio: function _enableiOSAudio() {
      var e = this;if (!o || !e._iOSEnabled && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        e._iOSEnabled = !1;var n = function n() {
          var t = o.createBuffer(1, 1, 22050),
              r = o.createBufferSource();r.buffer = t, r.connect(o.destination), "undefined" == typeof r.start ? r.noteOn(0) : r.start(0), setTimeout(function () {
            (r.playbackState === r.PLAYING_STATE || r.playbackState === r.FINISHED_STATE) && (e._iOSEnabled = !0, e.iOSAutoEnable = !1, window.removeEventListener("touchstart", n, !1));
          }, 0);
        };return window.addEventListener("touchstart", n, !1), e;
      }
    } };var u = null,
      d = {};t || (u = new Audio(), d = { mp3: !!u.canPlayType("audio/mpeg;").replace(/^no$/, ""), opus: !!u.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""), ogg: !!u.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), wav: !!u.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), aac: !!u.canPlayType("audio/aac;").replace(/^no$/, ""), m4a: !!(u.canPlayType("audio/x-m4a;") || u.canPlayType("audio/m4a;") || u.canPlayType("audio/aac;")).replace(/^no$/, ""), mp4: !!(u.canPlayType("audio/x-mp4;") || u.canPlayType("audio/mp4;") || u.canPlayType("audio/aac;")).replace(/^no$/, ""), weba: !!u.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "") });var l = new i(d),
      f = function f(e) {
    var t = this;t._autoplay = e.autoplay || !1, t._buffer = e.buffer || !1, t._duration = e.duration || 0, t._format = e.format || null, t._loop = e.loop || !1, t._loaded = !1, t._sprite = e.sprite || {}, t._src = e.src || "", t._pos3d = e.pos3d || [0, 0, -.5], t._volume = void 0 !== e.volume ? e.volume : 1, t._urls = e.urls || [], t._rate = e.rate || 1, t._model = e.model || null, t._onload = [e.onload || function () {}], t._onloaderror = [e.onloaderror || function () {}], t._onend = [e.onend || function () {}], t._onpause = [e.onpause || function () {}], t._onplay = [e.onplay || function () {}], t._onendTimer = [], t._webAudio = n && !t._buffer, t._audioNode = [], t._webAudio && t._setupAudioNode(), "undefined" != typeof o && o && l.iOSAutoEnable && l._enableiOSAudio(), l._howls.push(t), t.load();
  };if (f.prototype = { load: function load() {
      var e = this,
          o = null;if (t) return void e.on("loaderror");for (var n = 0; n < e._urls.length; n++) {
        var r, a;if (e._format) r = e._format;else {
          if (a = e._urls[n], r = /^data:audio\/([^;,]+);/i.exec(a), r || (r = /\.([^.]+)$/.exec(a.split("?", 1)[0])), !r) return void e.on("loaderror");r = r[1].toLowerCase();
        }if (d[r]) {
          o = e._urls[n];break;
        }
      }if (!o) return void e.on("loaderror");if (e._src = o, e._webAudio) _(e, o);else {
        var u = new Audio();u.addEventListener("error", function () {
          u.error && 4 === u.error.code && (i.noAudio = !0), e.on("loaderror", { type: u.error ? u.error.code : 0 });
        }, !1), e._audioNode.push(u), u.src = o, u._pos = 0, u.preload = "auto", u.volume = l._muted ? 0 : e._volume * l.volume();var f = function f() {
          e._duration = Math.ceil(10 * u.duration) / 10, 0 === Object.getOwnPropertyNames(e._sprite).length && (e._sprite = { _default: [0, 1e3 * e._duration] }), e._loaded || (e._loaded = !0, e.on("load")), e._autoplay && e.play(), u.removeEventListener("canplaythrough", f, !1);
        };u.addEventListener("canplaythrough", f, !1), u.load();
      }return e;
    }, urls: function urls(e) {
      var o = this;return e ? (o.stop(), o._urls = "string" == typeof e ? [e] : e, o._loaded = !1, o.load(), o) : o._urls;
    }, play: function play(e, n) {
      var t = this;return "function" == typeof e && (n = e), e && "function" != typeof e || (e = "_default"), t._loaded ? t._sprite[e] ? (t._inactiveNode(function (r) {
        r._sprite = e;var a = r._pos > 0 ? r._pos : t._sprite[e][0] / 1e3,
            i = 0;t._webAudio ? (i = t._sprite[e][1] / 1e3 - r._pos, r._pos > 0 && (a = t._sprite[e][0] / 1e3 + a)) : i = t._sprite[e][1] / 1e3 - (a - t._sprite[e][0] / 1e3);var u,
            d = !(!t._loop && !t._sprite[e][2]),
            f = "string" == typeof n ? n : Math.round(Date.now() * Math.random()) + "";if (function () {
          var o = { id: f, sprite: e, loop: d };u = setTimeout(function () {
            !t._webAudio && d && t.stop(o.id).play(e, o.id), t._webAudio && !d && (t._nodeById(o.id).paused = !0, t._nodeById(o.id)._pos = 0, t._clearEndTimer(o.id)), t._webAudio || d || t.stop(o.id), t.on("end", f);
          }, 1e3 * i), t._onendTimer.push({ timer: u, id: o.id });
        }(), t._webAudio) {
          var _ = t._sprite[e][0] / 1e3,
              s = t._sprite[e][1] / 1e3;r.id = f, r.paused = !1, p(t, [d, _, s], f), t._playStart = o.currentTime, r.gain.value = t._volume, "undefined" == typeof r.bufferSource.start ? d ? r.bufferSource.noteGrainOn(0, a, 86400) : r.bufferSource.noteGrainOn(0, a, i) : d ? r.bufferSource.start(0, a, 86400) : r.bufferSource.start(0, a, i);
        } else {
          if (4 !== r.readyState && (r.readyState || !navigator.isCocoonJS)) return t._clearEndTimer(f), function () {
            var o = t,
                a = e,
                i = n,
                u = r,
                d = function d() {
              o.play(a, i), u.removeEventListener("canplaythrough", d, !1);
            };u.addEventListener("canplaythrough", d, !1);
          }(), t;r.readyState = 4, r.id = f, r.currentTime = a, r.muted = l._muted || r.muted, r.volume = t._volume * l.volume(), setTimeout(function () {
            r.play();
          }, 0);
        }return t.on("play"), "function" == typeof n && n(f), t;
      }), t) : ("function" == typeof n && n(), t) : (t.on("load", function () {
        t.play(e, n);
      }), t);
    }, pause: function pause(e) {
      var o = this;if (!o._loaded) return o.on("play", function () {
        o.pause(e);
      }), o;o._clearEndTimer(e);var n = e ? o._nodeById(e) : o._activeNode();if (n) if (n._pos = o.pos(null, e), o._webAudio) {
        if (!n.bufferSource || n.paused) return o;n.paused = !0, "undefined" == typeof n.bufferSource.stop ? n.bufferSource.noteOff(0) : n.bufferSource.stop(0);
      } else n.pause();return o.on("pause"), o;
    }, stop: function stop(e) {
      var o = this;if (!o._loaded) return o.on("play", function () {
        o.stop(e);
      }), o;o._clearEndTimer(e);var n = e ? o._nodeById(e) : o._activeNode();if (n) if (n._pos = 0, o._webAudio) {
        if (!n.bufferSource || n.paused) return o;n.paused = !0, "undefined" == typeof n.bufferSource.stop ? n.bufferSource.noteOff(0) : n.bufferSource.stop(0);
      } else isNaN(n.duration) || (n.pause(), n.currentTime = 0);return o;
    }, mute: function mute(e) {
      var o = this;if (!o._loaded) return o.on("play", function () {
        o.mute(e);
      }), o;var n = e ? o._nodeById(e) : o._activeNode();return n && (o._webAudio ? n.gain.value = 0 : n.muted = !0), o;
    }, unmute: function unmute(e) {
      var o = this;if (!o._loaded) return o.on("play", function () {
        o.unmute(e);
      }), o;var n = e ? o._nodeById(e) : o._activeNode();return n && (o._webAudio ? n.gain.value = o._volume : n.muted = !1), o;
    }, volume: function volume(e, o) {
      var n = this;if (e = parseFloat(e), e >= 0 && 1 >= e) {
        if (n._volume = e, !n._loaded) return n.on("play", function () {
          n.volume(e, o);
        }), n;var t = o ? n._nodeById(o) : n._activeNode();return t && (n._webAudio ? t.gain.value = e : t.volume = e * l.volume()), n;
      }return n._volume;
    }, loop: function loop(e) {
      var o = this;return "boolean" == typeof e ? (o._loop = e, o) : o._loop;
    }, sprite: function sprite(e) {
      var o = this;return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) ? (o._sprite = e, o) : o._sprite;
    }, pos: function pos(e, n) {
      var t = this;if (!t._loaded) return t.on("load", function () {
        t.pos(e);
      }), "number" == typeof e ? t : t._pos || 0;e = parseFloat(e);var r = n ? t._nodeById(n) : t._activeNode();if (r) return e >= 0 ? (t.pause(n), r._pos = e, t.play(r._sprite, n), t) : t._webAudio ? r._pos + (o.currentTime - t._playStart) : r.currentTime;if (e >= 0) return t;for (var a = 0; a < t._audioNode.length; a++) {
        if (t._audioNode[a].paused && 4 === t._audioNode[a].readyState) return t._webAudio ? t._audioNode[a]._pos : t._audioNode[a].currentTime;
      }
    }, pos3d: function pos3d(e, o, n, t) {
      var r = this;if (o = "undefined" != typeof o && o ? o : 0, n = "undefined" != typeof n && n ? n : -.5, !r._loaded) return r.on("play", function () {
        r.pos3d(e, o, n, t);
      }), r;if (!(e >= 0 || 0 > e)) return r._pos3d;if (r._webAudio) {
        var a = t ? r._nodeById(t) : r._activeNode();a && (r._pos3d = [e, o, n], a.panner.setPosition(e, o, n), a.panner.panningModel = r._model || "HRTF");
      }return r;
    }, fade: function fade(e, o, n, t, r) {
      var a = this,
          i = Math.abs(e - o),
          u = e > o ? "down" : "up",
          d = i / .01,
          l = n / d;if (!a._loaded) return a.on("load", function () {
        a.fade(e, o, n, t, r);
      }), a;a.volume(e, r);for (var f = 1; d >= f; f++) {
        !function () {
          var e = a._volume + ("up" === u ? .01 : -.01) * f,
              n = Math.round(1e3 * e) / 1e3,
              i = o;setTimeout(function () {
            a.volume(n, r), n === i && t && t();
          }, l * f);
        }();
      }
    }, fadeIn: function fadeIn(e, o, n) {
      return this.volume(0).play().fade(0, e, o, n);
    }, fadeOut: function fadeOut(e, o, n, t) {
      var r = this;return r.fade(r._volume, e, o, function () {
        n && n(), r.pause(t), r.on("end");
      }, t);
    }, _nodeById: function _nodeById(e) {
      for (var o = this, n = o._audioNode[0], t = 0; t < o._audioNode.length; t++) {
        if (o._audioNode[t].id === e) {
          n = o._audioNode[t];break;
        }
      }return n;
    }, _activeNode: function _activeNode() {
      for (var e = this, o = null, n = 0; n < e._audioNode.length; n++) {
        if (!e._audioNode[n].paused) {
          o = e._audioNode[n];break;
        }
      }return e._drainPool(), o;
    }, _inactiveNode: function _inactiveNode(e) {
      for (var o = this, n = null, t = 0; t < o._audioNode.length; t++) {
        if (o._audioNode[t].paused && 4 === o._audioNode[t].readyState) {
          e(o._audioNode[t]), n = !0;break;
        }
      }if (o._drainPool(), !n) {
        var r;if (o._webAudio) r = o._setupAudioNode(), e(r);else {
          o.load(), r = o._audioNode[o._audioNode.length - 1];var a = navigator.isCocoonJS ? "canplaythrough" : "loadedmetadata",
              i = function i() {
            r.removeEventListener(a, i, !1), e(r);
          };r.addEventListener(a, i, !1);
        }
      }
    }, _drainPool: function _drainPool() {
      var e,
          o = this,
          n = 0;for (e = 0; e < o._audioNode.length; e++) {
        o._audioNode[e].paused && n++;
      }for (e = o._audioNode.length - 1; e >= 0 && !(5 >= n); e--) {
        o._audioNode[e].paused && (o._webAudio && o._audioNode[e].disconnect(0), n--, o._audioNode.splice(e, 1));
      }
    }, _clearEndTimer: function _clearEndTimer(e) {
      for (var o = this, n = 0, t = 0; t < o._onendTimer.length; t++) {
        if (o._onendTimer[t].id === e) {
          n = t;break;
        }
      }var r = o._onendTimer[n];r && (clearTimeout(r.timer), o._onendTimer.splice(n, 1));
    }, _setupAudioNode: function _setupAudioNode() {
      var e = this,
          n = e._audioNode,
          t = e._audioNode.length;return n[t] = "undefined" == typeof o.createGain ? o.createGainNode() : o.createGain(), n[t].gain.value = e._volume, n[t].paused = !0, n[t]._pos = 0, n[t].readyState = 4, n[t].connect(a), n[t].panner = o.createPanner(), n[t].panner.panningModel = e._model || "equalpower", n[t].panner.setPosition(e._pos3d[0], e._pos3d[1], e._pos3d[2]), n[t].panner.connect(n[t]), n[t];
    }, on: function on(e, o) {
      var n = this,
          t = n["_on" + e];if ("function" == typeof o) t.push(o);else for (var r = 0; r < t.length; r++) {
        o ? t[r].call(n, o) : t[r].call(n);
      }return n;
    }, off: function off(e, o) {
      var n = this,
          t = n["_on" + e],
          r = o ? o.toString() : null;if (r) {
        for (var a = 0; a < t.length; a++) {
          if (r === t[a].toString()) {
            t.splice(a, 1);break;
          }
        }
      } else n["_on" + e] = [];return n;
    }, unload: function unload() {
      for (var o = this, n = o._audioNode, t = 0; t < o._audioNode.length; t++) {
        n[t].paused || (o.stop(n[t].id), o.on("end", n[t].id)), o._webAudio ? n[t].disconnect(0) : n[t].src = "";
      }for (t = 0; t < o._onendTimer.length; t++) {
        clearTimeout(o._onendTimer[t].timer);
      }var r = l._howls.indexOf(o);null !== r && r >= 0 && l._howls.splice(r, 1), delete e[o._src], o = null;
    } }, n) var _ = function _(o, n) {
    if (n in e) return o._duration = e[n].duration, void c(o);if (/^data:[^;]+;base64,/.test(n)) {
      for (var t = atob(n.split(",")[1]), r = new Uint8Array(t.length), a = 0; a < t.length; ++a) {
        r[a] = t.charCodeAt(a);
      }s(r.buffer, o, n);
    } else {
      var i = new XMLHttpRequest();i.open("GET", n, !0), i.responseType = "arraybuffer", i.onload = function () {
        s(i.response, o, n);
      }, i.onerror = function () {
        o._webAudio && (o._buffer = !0, o._webAudio = !1, o._audioNode = [], delete o._gainNode, delete e[n], o.load());
      };try {
        i.send();
      } catch (u) {
        i.onerror();
      }
    }
  },
      s = function s(n, t, r) {
    o.decodeAudioData(n, function (o) {
      o && (e[r] = o, c(t, o));
    }, function (e) {
      t.on("loaderror");
    });
  },
      c = function c(e, o) {
    e._duration = o ? o.duration : e._duration, 0 === Object.getOwnPropertyNames(e._sprite).length && (e._sprite = { _default: [0, 1e3 * e._duration] }), e._loaded || (e._loaded = !0, e.on("load")), e._autoplay && e.play();
  },
      p = function p(n, t, r) {
    var a = n._nodeById(r);a.bufferSource = o.createBufferSource(), a.bufferSource.buffer = e[n._src], a.bufferSource.connect(a.panner), a.bufferSource.loop = t[0], t[0] && (a.bufferSource.loopStart = t[1], a.bufferSource.loopEnd = t[1] + t[2]), a.bufferSource.playbackRate.value = n._rate;
  };"function" == typeof define && define.amd && define(function () {
    return { Howler: l, Howl: f };
  }), "undefined" != typeof exports && (exports.Howler = l, exports.Howl = f), "undefined" != typeof window && (window.Howler = l, window.Howl = f);
}();
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* perfect-scrollbar v0.6.5 */
!function t(e, n, r) {
  function o(l, s) {
    if (!n[l]) {
      if (!e[l]) {
        var a = "function" == typeof require && require;if (!s && a) return a(l, !0);if (i) return i(l, !0);var c = new Error("Cannot find module '" + l + "'");throw c.code = "MODULE_NOT_FOUND", c;
      }var u = n[l] = { exports: {} };e[l][0].call(u.exports, function (t) {
        var n = e[l][1][t];return o(n ? n : t);
      }, u, u.exports, t, e, n, r);
    }return n[l].exports;
  }for (var i = "function" == typeof require && require, l = 0; l < r.length; l++) {
    o(r[l]);
  }return o;
}({ 1: [function (t, e, n) {
    "use strict";
    function r(t) {
      t.fn.perfectScrollbar = function (e) {
        return this.each(function () {
          if ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) || "undefined" == typeof e) {
            var n = e;i.get(this) || o.initialize(this, n);
          } else {
            var r = e;"update" === r ? o.update(this) : "destroy" === r && o.destroy(this);
          }return t(this);
        });
      };
    }var o = t("../main"),
        i = t("../plugin/instances");if ("function" == typeof define && define.amd) define(["jquery"], r);else {
      var l = window.jQuery ? window.jQuery : window.$;"undefined" != typeof l && r(l);
    }e.exports = r;
  }, { "../main": 7, "../plugin/instances": 18 }], 2: [function (t, e, n) {
    "use strict";
    function r(t, e) {
      var n = t.className.split(" ");n.indexOf(e) < 0 && n.push(e), t.className = n.join(" ");
    }function o(t, e) {
      var n = t.className.split(" "),
          r = n.indexOf(e);r >= 0 && n.splice(r, 1), t.className = n.join(" ");
    }n.add = function (t, e) {
      t.classList ? t.classList.add(e) : r(t, e);
    }, n.remove = function (t, e) {
      t.classList ? t.classList.remove(e) : o(t, e);
    }, n.list = function (t) {
      return t.classList ? t.classList : t.className.split(" ");
    };
  }, {}], 3: [function (t, e, n) {
    "use strict";
    function r(t, e) {
      return window.getComputedStyle(t)[e];
    }function o(t, e, n) {
      return "number" == typeof n && (n = n.toString() + "px"), t.style[e] = n, t;
    }function i(t, e) {
      for (var n in e) {
        var r = e[n];"number" == typeof r && (r = r.toString() + "px"), t.style[n] = r;
      }return t;
    }var l = {};l.e = function (t, e) {
      var n = document.createElement(t);return n.className = e, n;
    }, l.appendTo = function (t, e) {
      return e.appendChild(t), t;
    }, l.css = function (t, e, n) {
      return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) ? i(t, e) : "undefined" == typeof n ? r(t, e) : o(t, e, n);
    }, l.matches = function (t, e) {
      return "undefined" != typeof t.matches ? t.matches(e) : "undefined" != typeof t.matchesSelector ? t.matchesSelector(e) : "undefined" != typeof t.webkitMatchesSelector ? t.webkitMatchesSelector(e) : "undefined" != typeof t.mozMatchesSelector ? t.mozMatchesSelector(e) : "undefined" != typeof t.msMatchesSelector ? t.msMatchesSelector(e) : void 0;
    }, l.remove = function (t) {
      "undefined" != typeof t.remove ? t.remove() : t.parentNode && t.parentNode.removeChild(t);
    }, l.queryChildren = function (t, e) {
      return Array.prototype.filter.call(t.childNodes, function (t) {
        return l.matches(t, e);
      });
    }, e.exports = l;
  }, {}], 4: [function (t, e, n) {
    "use strict";
    var r = function r(t) {
      this.element = t, this.events = {};
    };r.prototype.bind = function (t, e) {
      "undefined" == typeof this.events[t] && (this.events[t] = []), this.events[t].push(e), this.element.addEventListener(t, e, !1);
    }, r.prototype.unbind = function (t, e) {
      var n = "undefined" != typeof e;this.events[t] = this.events[t].filter(function (r) {
        return n && r !== e ? !0 : (this.element.removeEventListener(t, r, !1), !1);
      }, this);
    }, r.prototype.unbindAll = function () {
      for (var t in this.events) {
        this.unbind(t);
      }
    };var o = function o() {
      this.eventElements = [];
    };o.prototype.eventElement = function (t) {
      var e = this.eventElements.filter(function (e) {
        return e.element === t;
      })[0];return "undefined" == typeof e && (e = new r(t), this.eventElements.push(e)), e;
    }, o.prototype.bind = function (t, e, n) {
      this.eventElement(t).bind(e, n);
    }, o.prototype.unbind = function (t, e, n) {
      this.eventElement(t).unbind(e, n);
    }, o.prototype.unbindAll = function () {
      for (var t = 0; t < this.eventElements.length; t++) {
        this.eventElements[t].unbindAll();
      }
    }, o.prototype.once = function (t, e, n) {
      var r = this.eventElement(t),
          o = function o(t) {
        r.unbind(e, o), n(t);
      };r.bind(e, o);
    }, e.exports = o;
  }, {}], 5: [function (t, e, n) {
    "use strict";
    e.exports = function () {
      function t() {
        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
      }return function () {
        return t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t();
      };
    }();
  }, {}], 6: [function (t, e, n) {
    "use strict";
    var r = t("./class"),
        o = t("./dom");n.toInt = function (t) {
      return parseInt(t, 10) || 0;
    }, n.clone = function (t) {
      if (null === t) return null;if ("object" == (typeof t === "undefined" ? "undefined" : _typeof(t))) {
        var e = {};for (var n in t) {
          e[n] = this.clone(t[n]);
        }return e;
      }return t;
    }, n.extend = function (t, e) {
      var n = this.clone(t);for (var r in e) {
        n[r] = this.clone(e[r]);
      }return n;
    }, n.isEditable = function (t) {
      return o.matches(t, "input,[contenteditable]") || o.matches(t, "select,[contenteditable]") || o.matches(t, "textarea,[contenteditable]") || o.matches(t, "button,[contenteditable]");
    }, n.removePsClasses = function (t) {
      for (var e = r.list(t), n = 0; n < e.length; n++) {
        var o = e[n];0 === o.indexOf("ps-") && r.remove(t, o);
      }
    }, n.outerWidth = function (t) {
      return this.toInt(o.css(t, "width")) + this.toInt(o.css(t, "paddingLeft")) + this.toInt(o.css(t, "paddingRight")) + this.toInt(o.css(t, "borderLeftWidth")) + this.toInt(o.css(t, "borderRightWidth"));
    }, n.startScrolling = function (t, e) {
      r.add(t, "ps-in-scrolling"), "undefined" != typeof e ? r.add(t, "ps-" + e) : (r.add(t, "ps-x"), r.add(t, "ps-y"));
    }, n.stopScrolling = function (t, e) {
      r.remove(t, "ps-in-scrolling"), "undefined" != typeof e ? r.remove(t, "ps-" + e) : (r.remove(t, "ps-x"), r.remove(t, "ps-y"));
    }, n.env = { isWebKit: "WebkitAppearance" in document.documentElement.style, supportsTouch: "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch, supportsIePointer: null !== window.navigator.msMaxTouchPoints };
  }, { "./class": 2, "./dom": 3 }], 7: [function (t, e, n) {
    "use strict";
    var r = t("./plugin/destroy"),
        o = t("./plugin/initialize"),
        i = t("./plugin/update");e.exports = { initialize: o, update: i, destroy: r };
  }, { "./plugin/destroy": 9, "./plugin/initialize": 17, "./plugin/update": 20 }], 8: [function (t, e, n) {
    "use strict";
    e.exports = { wheelSpeed: 1, wheelPropagation: !1, swipePropagation: !0, minScrollbarLength: null, maxScrollbarLength: null, useBothWheelAxes: !1, useKeyboard: !0, suppressScrollX: !1, suppressScrollY: !1, scrollXMarginOffset: 0, scrollYMarginOffset: 0, stopPropagationOnClick: !0 };
  }, {}], 9: [function (t, e, n) {
    "use strict";
    var r = t("../lib/dom"),
        o = t("../lib/helper"),
        i = t("./instances");e.exports = function (t) {
      var e = i.get(t);e && (e.event.unbindAll(), r.remove(e.scrollbarX), r.remove(e.scrollbarY), r.remove(e.scrollbarXRail), r.remove(e.scrollbarYRail), o.removePsClasses(t), i.remove(t));
    };
  }, { "../lib/dom": 3, "../lib/helper": 6, "./instances": 18 }], 10: [function (t, e, n) {
    "use strict";
    function r(t, e) {
      function n(t) {
        return t.getBoundingClientRect();
      }var r = window.Event.prototype.stopPropagation.bind;e.settings.stopPropagationOnClick && e.event.bind(e.scrollbarY, "click", r), e.event.bind(e.scrollbarYRail, "click", function (r) {
        var i = o.toInt(e.scrollbarYHeight / 2),
            s = e.railYRatio * (r.pageY - window.scrollY - n(e.scrollbarYRail).top - i),
            a = e.railYRatio * (e.railYHeight - e.scrollbarYHeight),
            c = s / a;0 > c ? c = 0 : c > 1 && (c = 1), t.scrollTop = (e.contentHeight - e.containerHeight) * c, l(t), r.stopPropagation();
      }), e.settings.stopPropagationOnClick && e.event.bind(e.scrollbarX, "click", r), e.event.bind(e.scrollbarXRail, "click", function (r) {
        var i = o.toInt(e.scrollbarXWidth / 2),
            s = e.railXRatio * (r.pageX - window.scrollX - n(e.scrollbarXRail).left - i),
            a = e.railXRatio * (e.railXWidth - e.scrollbarXWidth),
            c = s / a;0 > c ? c = 0 : c > 1 && (c = 1), t.scrollLeft = (e.contentWidth - e.containerWidth) * c - e.negativeScrollAdjustment, l(t), r.stopPropagation();
      });
    }var o = t("../../lib/helper"),
        i = t("../instances"),
        l = t("../update-geometry");e.exports = function (t) {
      var e = i.get(t);r(t, e);
    };
  }, { "../../lib/helper": 6, "../instances": 18, "../update-geometry": 19 }], 11: [function (t, e, n) {
    "use strict";
    function r(t, e) {
      function n(n) {
        var o = r + n * e.railXRatio,
            i = e.scrollbarXRail.getBoundingClientRect().left + e.railXRatio * (e.railXWidth - e.scrollbarXWidth);e.scrollbarXLeft = 0 > o ? 0 : o > i ? i : o;var s = l.toInt(e.scrollbarXLeft * (e.contentWidth - e.containerWidth) / (e.containerWidth - e.railXRatio * e.scrollbarXWidth)) - e.negativeScrollAdjustment;t.scrollLeft = s;
      }var r = null,
          o = null,
          s = function s(e) {
        n(e.pageX - o), a(t), e.stopPropagation(), e.preventDefault();
      },
          c = function c() {
        l.stopScrolling(t, "x"), e.event.unbind(e.ownerDocument, "mousemove", s);
      };e.event.bind(e.scrollbarX, "mousedown", function (n) {
        o = n.pageX, r = l.toInt(i.css(e.scrollbarX, "left")) * e.railXRatio, l.startScrolling(t, "x"), e.event.bind(e.ownerDocument, "mousemove", s), e.event.once(e.ownerDocument, "mouseup", c), n.stopPropagation(), n.preventDefault();
      });
    }function o(t, e) {
      function n(n) {
        var o = r + n * e.railYRatio,
            i = e.scrollbarYRail.getBoundingClientRect().top + e.railYRatio * (e.railYHeight - e.scrollbarYHeight);e.scrollbarYTop = 0 > o ? 0 : o > i ? i : o;var s = l.toInt(e.scrollbarYTop * (e.contentHeight - e.containerHeight) / (e.containerHeight - e.railYRatio * e.scrollbarYHeight));t.scrollTop = s;
      }var r = null,
          o = null,
          s = function s(e) {
        n(e.pageY - o), a(t), e.stopPropagation(), e.preventDefault();
      },
          c = function c() {
        l.stopScrolling(t, "y"), e.event.unbind(e.ownerDocument, "mousemove", s);
      };e.event.bind(e.scrollbarY, "mousedown", function (n) {
        o = n.pageY, r = l.toInt(i.css(e.scrollbarY, "top")) * e.railYRatio, l.startScrolling(t, "y"), e.event.bind(e.ownerDocument, "mousemove", s), e.event.once(e.ownerDocument, "mouseup", c), n.stopPropagation(), n.preventDefault();
      });
    }var i = t("../../lib/dom"),
        l = t("../../lib/helper"),
        s = t("../instances"),
        a = t("../update-geometry");e.exports = function (t) {
      var e = s.get(t);r(t, e), o(t, e);
    };
  }, { "../../lib/dom": 3, "../../lib/helper": 6, "../instances": 18, "../update-geometry": 19 }], 12: [function (t, e, n) {
    "use strict";
    function r(t, e) {
      function n(n, r) {
        var o = t.scrollTop;if (0 === n) {
          if (!e.scrollbarYActive) return !1;if (0 === o && r > 0 || o >= e.contentHeight - e.containerHeight && 0 > r) return !e.settings.wheelPropagation;
        }var i = t.scrollLeft;if (0 === r) {
          if (!e.scrollbarXActive) return !1;if (0 === i && 0 > n || i >= e.contentWidth - e.containerWidth && n > 0) return !e.settings.wheelPropagation;
        }return !0;
      }var r = !1;e.event.bind(t, "mouseenter", function () {
        r = !0;
      }), e.event.bind(t, "mouseleave", function () {
        r = !1;
      });var i = !1;e.event.bind(e.ownerDocument, "keydown", function (s) {
        if ((!s.isDefaultPrevented || !s.isDefaultPrevented()) && r) {
          var a = document.activeElement ? document.activeElement : e.ownerDocument.activeElement;if (a) {
            for (; a.shadowRoot;) {
              a = a.shadowRoot.activeElement;
            }if (o.isEditable(a)) return;
          }var c = 0,
              u = 0;switch (s.which) {case 37:
              c = -30;break;case 38:
              u = 30;break;case 39:
              c = 30;break;case 40:
              u = -30;break;case 33:
              u = 90;break;case 32:
              u = s.shiftKey ? 90 : -90;break;case 34:
              u = -90;break;case 35:
              u = s.ctrlKey ? -e.contentHeight : -e.containerHeight;break;case 36:
              u = s.ctrlKey ? t.scrollTop : e.containerHeight;break;default:
              return;}t.scrollTop = t.scrollTop - u, t.scrollLeft = t.scrollLeft + c, l(t), i = n(c, u), i && s.preventDefault();
        }
      });
    }var o = t("../../lib/helper"),
        i = t("../instances"),
        l = t("../update-geometry");e.exports = function (t) {
      var e = i.get(t);r(t, e);
    };
  }, { "../../lib/helper": 6, "../instances": 18, "../update-geometry": 19 }], 13: [function (t, e, n) {
    "use strict";
    function r(t, e) {
      function n(n, r) {
        var o = t.scrollTop;if (0 === n) {
          if (!e.scrollbarYActive) return !1;if (0 === o && r > 0 || o >= e.contentHeight - e.containerHeight && 0 > r) return !e.settings.wheelPropagation;
        }var i = t.scrollLeft;if (0 === r) {
          if (!e.scrollbarXActive) return !1;if (0 === i && 0 > n || i >= e.contentWidth - e.containerWidth && n > 0) return !e.settings.wheelPropagation;
        }return !0;
      }function r(t) {
        var e = t.deltaX,
            n = -1 * t.deltaY;return ("undefined" == typeof e || "undefined" == typeof n) && (e = -1 * t.wheelDeltaX / 6, n = t.wheelDeltaY / 6), t.deltaMode && 1 === t.deltaMode && (e *= 10, n *= 10), e !== e && n !== n && (e = 0, n = t.wheelDelta), [e, n];
      }function i(e, n) {
        var r = t.querySelector("textarea:hover");if (r) {
          var o = r.scrollHeight - r.clientHeight;if (o > 0 && !(0 === r.scrollTop && n > 0 || r.scrollTop === o && 0 > n)) return !0;var i = r.scrollLeft - r.clientWidth;if (i > 0 && !(0 === r.scrollLeft && 0 > e || r.scrollLeft === i && e > 0)) return !0;
        }return !1;
      }function s(s) {
        if (o.env.isWebKit || !t.querySelector("select:focus")) {
          var c = r(s),
              u = c[0],
              d = c[1];i(u, d) || (a = !1, e.settings.useBothWheelAxes ? e.scrollbarYActive && !e.scrollbarXActive ? (t.scrollTop = d ? t.scrollTop - d * e.settings.wheelSpeed : t.scrollTop + u * e.settings.wheelSpeed, a = !0) : e.scrollbarXActive && !e.scrollbarYActive && (t.scrollLeft = u ? t.scrollLeft + u * e.settings.wheelSpeed : t.scrollLeft - d * e.settings.wheelSpeed, a = !0) : (t.scrollTop = t.scrollTop - d * e.settings.wheelSpeed, t.scrollLeft = t.scrollLeft + u * e.settings.wheelSpeed), l(t), a = a || n(u, d), a && (s.stopPropagation(), s.preventDefault()));
        }
      }var a = !1;"undefined" != typeof window.onwheel ? e.event.bind(t, "wheel", s) : "undefined" != typeof window.onmousewheel && e.event.bind(t, "mousewheel", s);
    }var o = t("../../lib/helper"),
        i = t("../instances"),
        l = t("../update-geometry");e.exports = function (t) {
      var e = i.get(t);r(t, e);
    };
  }, { "../../lib/helper": 6, "../instances": 18, "../update-geometry": 19 }], 14: [function (t, e, n) {
    "use strict";
    function r(t, e) {
      e.event.bind(t, "scroll", function () {
        i(t);
      });
    }var o = t("../instances"),
        i = t("../update-geometry");e.exports = function (t) {
      var e = o.get(t);r(t, e);
    };
  }, { "../instances": 18, "../update-geometry": 19 }], 15: [function (t, e, n) {
    "use strict";
    function r(t, e) {
      function n() {
        var t = window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : "";return 0 === t.toString().length ? null : t.getRangeAt(0).commonAncestorContainer;
      }function r() {
        a || (a = setInterval(function () {
          return i.get(t) ? (t.scrollTop = t.scrollTop + c.top, t.scrollLeft = t.scrollLeft + c.left, void l(t)) : void clearInterval(a);
        }, 50));
      }function s() {
        a && (clearInterval(a), a = null), o.stopScrolling(t);
      }var a = null,
          c = { top: 0, left: 0 },
          u = !1;e.event.bind(e.ownerDocument, "selectionchange", function () {
        t.contains(n()) ? u = !0 : (u = !1, s());
      }), e.event.bind(window, "mouseup", function () {
        u && (u = !1, s());
      }), e.event.bind(window, "mousemove", function (e) {
        if (u) {
          var n = { x: e.pageX, y: e.pageY },
              i = { left: t.offsetLeft, right: t.offsetLeft + t.offsetWidth, top: t.offsetTop, bottom: t.offsetTop + t.offsetHeight };n.x < i.left + 3 ? (c.left = -5, o.startScrolling(t, "x")) : n.x > i.right - 3 ? (c.left = 5, o.startScrolling(t, "x")) : c.left = 0, n.y < i.top + 3 ? (c.top = i.top + 3 - n.y < 5 ? -5 : -20, o.startScrolling(t, "y")) : n.y > i.bottom - 3 ? (c.top = n.y - i.bottom + 3 < 5 ? 5 : 20, o.startScrolling(t, "y")) : c.top = 0, 0 === c.top && 0 === c.left ? s() : r();
        }
      });
    }var o = t("../../lib/helper"),
        i = t("../instances"),
        l = t("../update-geometry");e.exports = function (t) {
      var e = i.get(t);r(t, e);
    };
  }, { "../../lib/helper": 6, "../instances": 18, "../update-geometry": 19 }], 16: [function (t, e, n) {
    "use strict";
    function r(t, e, n, r) {
      function l(n, r) {
        var o = t.scrollTop,
            i = t.scrollLeft,
            l = Math.abs(n),
            s = Math.abs(r);if (s > l) {
          if (0 > r && o === e.contentHeight - e.containerHeight || r > 0 && 0 === o) return !e.settings.swipePropagation;
        } else if (l > s && (0 > n && i === e.contentWidth - e.containerWidth || n > 0 && 0 === i)) return !e.settings.swipePropagation;return !0;
      }function s(e, n) {
        t.scrollTop = t.scrollTop - n, t.scrollLeft = t.scrollLeft - e, i(t);
      }function a() {
        y = !0;
      }function c() {
        y = !1;
      }function u(t) {
        return t.targetTouches ? t.targetTouches[0] : t;
      }function d(t) {
        return t.targetTouches && 1 === t.targetTouches.length ? !0 : t.pointerType && "mouse" !== t.pointerType && t.pointerType !== t.MSPOINTER_TYPE_MOUSE ? !0 : !1;
      }function p(t) {
        if (d(t)) {
          Y = !0;var e = u(t);b.pageX = e.pageX, b.pageY = e.pageY, g = new Date().getTime(), null !== m && clearInterval(m), t.stopPropagation();
        }
      }function f(t) {
        if (!y && Y && d(t)) {
          var e = u(t),
              n = { pageX: e.pageX, pageY: e.pageY },
              r = n.pageX - b.pageX,
              o = n.pageY - b.pageY;s(r, o), b = n;var i = new Date().getTime(),
              a = i - g;a > 0 && (v.x = r / a, v.y = o / a, g = i), l(r, o) && (t.stopPropagation(), t.preventDefault());
        }
      }function h() {
        !y && Y && (Y = !1, clearInterval(m), m = setInterval(function () {
          return o.get(t) ? Math.abs(v.x) < .01 && Math.abs(v.y) < .01 ? void clearInterval(m) : (s(30 * v.x, 30 * v.y), v.x *= .8, void (v.y *= .8)) : void clearInterval(m);
        }, 10));
      }var b = {},
          g = 0,
          v = {},
          m = null,
          y = !1,
          Y = !1;n && (e.event.bind(window, "touchstart", a), e.event.bind(window, "touchend", c), e.event.bind(t, "touchstart", p), e.event.bind(t, "touchmove", f), e.event.bind(t, "touchend", h)), r && (window.PointerEvent ? (e.event.bind(window, "pointerdown", a), e.event.bind(window, "pointerup", c), e.event.bind(t, "pointerdown", p), e.event.bind(t, "pointermove", f), e.event.bind(t, "pointerup", h)) : window.MSPointerEvent && (e.event.bind(window, "MSPointerDown", a), e.event.bind(window, "MSPointerUp", c), e.event.bind(t, "MSPointerDown", p), e.event.bind(t, "MSPointerMove", f), e.event.bind(t, "MSPointerUp", h)));
    }var o = t("../instances"),
        i = t("../update-geometry");e.exports = function (t, e, n) {
      var i = o.get(t);r(t, i, e, n);
    };
  }, { "../instances": 18, "../update-geometry": 19 }], 17: [function (t, e, n) {
    "use strict";
    var r = t("../lib/class"),
        o = t("../lib/helper"),
        i = t("./instances"),
        l = t("./update-geometry"),
        s = t("./handler/click-rail"),
        a = t("./handler/drag-scrollbar"),
        c = t("./handler/keyboard"),
        u = t("./handler/mouse-wheel"),
        d = t("./handler/native-scroll"),
        p = t("./handler/selection"),
        f = t("./handler/touch");e.exports = function (t, e) {
      e = "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) ? e : {}, r.add(t, "ps-container");var n = i.add(t);n.settings = o.extend(n.settings, e), s(t), a(t), u(t), d(t), p(t), (o.env.supportsTouch || o.env.supportsIePointer) && f(t, o.env.supportsTouch, o.env.supportsIePointer), n.settings.useKeyboard && c(t), l(t);
    };
  }, { "../lib/class": 2, "../lib/helper": 6, "./handler/click-rail": 10, "./handler/drag-scrollbar": 11, "./handler/keyboard": 12, "./handler/mouse-wheel": 13, "./handler/native-scroll": 14, "./handler/selection": 15, "./handler/touch": 16, "./instances": 18, "./update-geometry": 19 }], 18: [function (t, e, n) {
    "use strict";
    function r(t) {
      var e = this;e.settings = d.clone(a), e.containerWidth = null, e.containerHeight = null, e.contentWidth = null, e.contentHeight = null, e.isRtl = "rtl" === s.css(t, "direction"), e.isNegativeScroll = function () {
        var e = t.scrollLeft,
            n = null;return t.scrollLeft = -1, n = t.scrollLeft < 0, t.scrollLeft = e, n;
      }(), e.negativeScrollAdjustment = e.isNegativeScroll ? t.scrollWidth - t.clientWidth : 0, e.event = new c(), e.ownerDocument = t.ownerDocument || document, e.scrollbarXRail = s.appendTo(s.e("div", "ps-scrollbar-x-rail"), t), e.scrollbarX = s.appendTo(s.e("div", "ps-scrollbar-x"), e.scrollbarXRail), e.scrollbarXActive = null, e.scrollbarXWidth = null, e.scrollbarXLeft = null, e.scrollbarXBottom = d.toInt(s.css(e.scrollbarXRail, "bottom")), e.isScrollbarXUsingBottom = e.scrollbarXBottom === e.scrollbarXBottom, e.scrollbarXTop = e.isScrollbarXUsingBottom ? null : d.toInt(s.css(e.scrollbarXRail, "top")), e.railBorderXWidth = d.toInt(s.css(e.scrollbarXRail, "borderLeftWidth")) + d.toInt(s.css(e.scrollbarXRail, "borderRightWidth")), s.css(e.scrollbarXRail, "display", "block"), e.railXMarginWidth = d.toInt(s.css(e.scrollbarXRail, "marginLeft")) + d.toInt(s.css(e.scrollbarXRail, "marginRight")), s.css(e.scrollbarXRail, "display", ""), e.railXWidth = null, e.railXRatio = null, e.scrollbarYRail = s.appendTo(s.e("div", "ps-scrollbar-y-rail"), t), e.scrollbarY = s.appendTo(s.e("div", "ps-scrollbar-y"), e.scrollbarYRail), e.scrollbarYActive = null, e.scrollbarYHeight = null, e.scrollbarYTop = null, e.scrollbarYRight = d.toInt(s.css(e.scrollbarYRail, "right")), e.isScrollbarYUsingRight = e.scrollbarYRight === e.scrollbarYRight, e.scrollbarYLeft = e.isScrollbarYUsingRight ? null : d.toInt(s.css(e.scrollbarYRail, "left")), e.scrollbarYOuterWidth = e.isRtl ? d.outerWidth(e.scrollbarY) : null, e.railBorderYWidth = d.toInt(s.css(e.scrollbarYRail, "borderTopWidth")) + d.toInt(s.css(e.scrollbarYRail, "borderBottomWidth")), s.css(e.scrollbarYRail, "display", "block"), e.railYMarginHeight = d.toInt(s.css(e.scrollbarYRail, "marginTop")) + d.toInt(s.css(e.scrollbarYRail, "marginBottom")), s.css(e.scrollbarYRail, "display", ""), e.railYHeight = null, e.railYRatio = null;
    }function o(t) {
      return "undefined" == typeof t.dataset ? t.getAttribute("data-ps-id") : t.dataset.psId;
    }function i(t, e) {
      "undefined" == typeof t.dataset ? t.setAttribute("data-ps-id", e) : t.dataset.psId = e;
    }function l(t) {
      "undefined" == typeof t.dataset ? t.removeAttribute("data-ps-id") : delete t.dataset.psId;
    }var s = t("../lib/dom"),
        a = t("./default-setting"),
        c = t("../lib/event-manager"),
        u = t("../lib/guid"),
        d = t("../lib/helper"),
        p = {};n.add = function (t) {
      var e = u();return i(t, e), p[e] = new r(t), p[e];
    }, n.remove = function (t) {
      delete p[o(t)], l(t);
    }, n.get = function (t) {
      return p[o(t)];
    };
  }, { "../lib/dom": 3, "../lib/event-manager": 4, "../lib/guid": 5, "../lib/helper": 6, "./default-setting": 8 }], 19: [function (t, e, n) {
    "use strict";
    function r(t, e) {
      return t.settings.minScrollbarLength && (e = Math.max(e, t.settings.minScrollbarLength)), t.settings.maxScrollbarLength && (e = Math.min(e, t.settings.maxScrollbarLength)), e;
    }function o(t, e) {
      var n = { width: e.railXWidth };n.left = e.isRtl ? e.negativeScrollAdjustment + t.scrollLeft + e.containerWidth - e.contentWidth : t.scrollLeft, e.isScrollbarXUsingBottom ? n.bottom = e.scrollbarXBottom - t.scrollTop : n.top = e.scrollbarXTop + t.scrollTop, l.css(e.scrollbarXRail, n);var r = { top: t.scrollTop, height: e.railYHeight };e.isScrollbarYUsingRight ? r.right = e.isRtl ? e.contentWidth - (e.negativeScrollAdjustment + t.scrollLeft) - e.scrollbarYRight - e.scrollbarYOuterWidth : e.scrollbarYRight - t.scrollLeft : r.left = e.isRtl ? e.negativeScrollAdjustment + t.scrollLeft + 2 * e.containerWidth - e.contentWidth - e.scrollbarYLeft - e.scrollbarYOuterWidth : e.scrollbarYLeft + t.scrollLeft, l.css(e.scrollbarYRail, r), l.css(e.scrollbarX, { left: e.scrollbarXLeft, width: e.scrollbarXWidth - e.railBorderXWidth }), l.css(e.scrollbarY, { top: e.scrollbarYTop, height: e.scrollbarYHeight - e.railBorderYWidth });
    }var i = t("../lib/class"),
        l = t("../lib/dom"),
        s = t("../lib/helper"),
        a = t("./instances");e.exports = function (t) {
      var e = a.get(t);e.containerWidth = t.clientWidth, e.containerHeight = t.clientHeight, e.contentWidth = t.scrollWidth, e.contentHeight = t.scrollHeight;var n;t.contains(e.scrollbarXRail) || (n = l.queryChildren(t, ".ps-scrollbar-x-rail"), n.length > 0 && n.forEach(function (t) {
        l.remove(t);
      }), l.appendTo(e.scrollbarXRail, t)), t.contains(e.scrollbarYRail) || (n = l.queryChildren(t, ".ps-scrollbar-y-rail"), n.length > 0 && n.forEach(function (t) {
        l.remove(t);
      }), l.appendTo(e.scrollbarYRail, t)), !e.settings.suppressScrollX && e.containerWidth + e.settings.scrollXMarginOffset < e.contentWidth ? (e.scrollbarXActive = !0, e.railXWidth = e.containerWidth - e.railXMarginWidth, e.railXRatio = e.containerWidth / e.railXWidth, e.scrollbarXWidth = r(e, s.toInt(e.railXWidth * e.containerWidth / e.contentWidth)), e.scrollbarXLeft = s.toInt((e.negativeScrollAdjustment + t.scrollLeft) * (e.railXWidth - e.scrollbarXWidth) / (e.contentWidth - e.containerWidth))) : (e.scrollbarXActive = !1, e.scrollbarXWidth = 0, e.scrollbarXLeft = 0, t.scrollLeft = 0), !e.settings.suppressScrollY && e.containerHeight + e.settings.scrollYMarginOffset < e.contentHeight ? (e.scrollbarYActive = !0, e.railYHeight = e.containerHeight - e.railYMarginHeight, e.railYRatio = e.containerHeight / e.railYHeight, e.scrollbarYHeight = r(e, s.toInt(e.railYHeight * e.containerHeight / e.contentHeight)), e.scrollbarYTop = s.toInt(t.scrollTop * (e.railYHeight - e.scrollbarYHeight) / (e.contentHeight - e.containerHeight))) : (e.scrollbarYActive = !1, e.scrollbarYHeight = 0, e.scrollbarYTop = 0, t.scrollTop = 0), e.scrollbarXLeft >= e.railXWidth - e.scrollbarXWidth && (e.scrollbarXLeft = e.railXWidth - e.scrollbarXWidth), e.scrollbarYTop >= e.railYHeight - e.scrollbarYHeight && (e.scrollbarYTop = e.railYHeight - e.scrollbarYHeight), o(t, e), i[e.scrollbarXActive ? "add" : "remove"](t, "ps-active-x"), i[e.scrollbarYActive ? "add" : "remove"](t, "ps-active-y");
    };
  }, { "../lib/class": 2, "../lib/dom": 3, "../lib/helper": 6, "./instances": 18 }], 20: [function (t, e, n) {
    "use strict";
    var r = t("../lib/dom"),
        o = t("../lib/helper"),
        i = t("./instances"),
        l = t("./update-geometry");e.exports = function (t) {
      var e = i.get(t);e && (e.negativeScrollAdjustment = e.isNegativeScroll ? t.scrollWidth - t.clientWidth : 0, r.css(e.scrollbarXRail, "display", "block"), r.css(e.scrollbarYRail, "display", "block"), e.railXMarginWidth = o.toInt(r.css(e.scrollbarXRail, "marginLeft")) + o.toInt(r.css(e.scrollbarXRail, "marginRight")), e.railYMarginHeight = o.toInt(r.css(e.scrollbarYRail, "marginTop")) + o.toInt(r.css(e.scrollbarYRail, "marginBottom")), r.css(e.scrollbarXRail, "display", "none"), r.css(e.scrollbarYRail, "display", "none"), l(t), r.css(e.scrollbarXRail, "display", ""), r.css(e.scrollbarYRail, "display", ""));
    };
  }, { "../lib/dom": 3, "../lib/helper": 6, "./instances": 18, "./update-geometry": 19 }] }, {}, [1]);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! =======================================================
                      VERSION  5.2.4              
========================================================= */
/*! =========================================================
 * bootstrap-slider.js
 *
 * Maintainers:
 *		Kyle Kemp
 *			- Twitter: @seiyria
 *			- Github:  seiyria
 *		Rohit Kalkur
 *			- Twitter: @Rovolutionary
 *			- Github:  rovolution
 *
 * =========================================================
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
!function (a, b) {
  if ("function" == typeof define && define.amd) define(["jquery"], b);else if ("object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && module.exports) {
    var c;try {
      c = require("jquery");
    } catch (d) {
      c = null;
    }module.exports = b(c);
  } else a.Slider = b(a.jQuery);
}(undefined, function (a) {
  var b;return function (a) {
    "use strict";
    function b() {}function c(a) {
      function c(b) {
        b.prototype.option || (b.prototype.option = function (b) {
          a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b));
        });
      }function e(b, c) {
        a.fn[b] = function (e) {
          if ("string" == typeof e) {
            for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
              var j = this[h],
                  k = a.data(j, b);if (k) {
                if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                  var l = k[e].apply(k, g);if (void 0 !== l && l !== k) return l;
                } else f("no such method '" + e + "' for " + b + " instance");
              } else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'");
            }return this;
          }var m = this.map(function () {
            var d = a.data(this, b);return d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d)), a(this);
          });return !m || m.length > 1 ? m : m[0];
        };
      }if (a) {
        var f = "undefined" == typeof console ? b : function (a) {
          console.error(a);
        };return a.bridget = function (a, b) {
          c(b), e(a, b);
        }, a.bridget;
      }
    }var d = Array.prototype.slice;c(a);
  }(a), function (a) {
    function c(b, c) {
      function d(a, b) {
        var c = "data-slider-" + b.replace(/_/g, "-"),
            d = a.getAttribute(c);try {
          return JSON.parse(d);
        } catch (e) {
          return d;
        }
      }this._state = { value: null, enabled: null, offset: null, size: null, percentage: null, inDrag: !1, over: !1 }, "string" == typeof b ? this.element = document.querySelector(b) : b instanceof HTMLElement && (this.element = b), c = c ? c : {};for (var f = Object.keys(this.defaultOptions), g = 0; g < f.length; g++) {
        var h = f[g],
            i = c[h];i = "undefined" != typeof i ? i : d(this.element, h), i = null !== i ? i : this.defaultOptions[h], this.options || (this.options = {}), this.options[h] = i;
      }"vertical" !== this.options.orientation || "top" !== this.options.tooltip_position && "bottom" !== this.options.tooltip_position ? "horizontal" !== this.options.orientation || "left" !== this.options.tooltip_position && "right" !== this.options.tooltip_position || (this.options.tooltip_position = "top") : this.options.tooltip_position = "right";var j,
          k,
          l,
          m,
          n,
          o = this.element.style.width,
          p = !1,
          q = this.element.parentNode;if (this.sliderElem) p = !0;else {
        this.sliderElem = document.createElement("div"), this.sliderElem.className = "slider";var r = document.createElement("div");if (r.className = "slider-track", k = document.createElement("div"), k.className = "slider-track-low", j = document.createElement("div"), j.className = "slider-selection", l = document.createElement("div"), l.className = "slider-track-high", m = document.createElement("div"), m.className = "slider-handle min-slider-handle", n = document.createElement("div"), n.className = "slider-handle max-slider-handle", r.appendChild(k), r.appendChild(j), r.appendChild(l), this.ticks = [], Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
          for (g = 0; g < this.options.ticks.length; g++) {
            var s = document.createElement("div");s.className = "slider-tick", this.ticks.push(s), r.appendChild(s);
          }j.className += " tick-slider-selection";
        }if (r.appendChild(m), r.appendChild(n), this.tickLabels = [], Array.isArray(this.options.ticks_labels) && this.options.ticks_labels.length > 0) for (this.tickLabelContainer = document.createElement("div"), this.tickLabelContainer.className = "slider-tick-label-container", g = 0; g < this.options.ticks_labels.length; g++) {
          var t = document.createElement("div"),
              u = 0 === this.options.ticks_positions.length,
              v = this.options.reversed && u ? this.options.ticks_labels.length - (g + 1) : g;t.className = "slider-tick-label", t.innerHTML = this.options.ticks_labels[v], this.tickLabels.push(t), this.tickLabelContainer.appendChild(t);
        }var w = function w(a) {
          var b = document.createElement("div");b.className = "tooltip-arrow";var c = document.createElement("div");c.className = "tooltip-inner", a.appendChild(b), a.appendChild(c);
        },
            x = document.createElement("div");x.className = "tooltip tooltip-main", w(x);var y = document.createElement("div");y.className = "tooltip tooltip-min", w(y);var z = document.createElement("div");z.className = "tooltip tooltip-max", w(z), this.sliderElem.appendChild(r), this.sliderElem.appendChild(x), this.sliderElem.appendChild(y), this.sliderElem.appendChild(z), this.tickLabelContainer && this.sliderElem.appendChild(this.tickLabelContainer), q.insertBefore(this.sliderElem, this.element), this.element.style.display = "none";
      }if (a && (this.$element = a(this.element), this.$sliderElem = a(this.sliderElem)), this.eventToCallbackMap = {}, this.sliderElem.id = this.options.id, this.touchCapable = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch, this.tooltip = this.sliderElem.querySelector(".tooltip-main"), this.tooltipInner = this.tooltip.querySelector(".tooltip-inner"), this.tooltip_min = this.sliderElem.querySelector(".tooltip-min"), this.tooltipInner_min = this.tooltip_min.querySelector(".tooltip-inner"), this.tooltip_max = this.sliderElem.querySelector(".tooltip-max"), this.tooltipInner_max = this.tooltip_max.querySelector(".tooltip-inner"), e[this.options.scale] && (this.options.scale = e[this.options.scale]), p === !0 && (this._removeClass(this.sliderElem, "slider-horizontal"), this._removeClass(this.sliderElem, "slider-vertical"), this._removeClass(this.tooltip, "hide"), this._removeClass(this.tooltip_min, "hide"), this._removeClass(this.tooltip_max, "hide"), ["left", "top", "width", "height"].forEach(function (a) {
        this._removeProperty(this.trackLow, a), this._removeProperty(this.trackSelection, a), this._removeProperty(this.trackHigh, a);
      }, this), [this.handle1, this.handle2].forEach(function (a) {
        this._removeProperty(a, "left"), this._removeProperty(a, "top");
      }, this), [this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function (a) {
        this._removeProperty(a, "left"), this._removeProperty(a, "top"), this._removeProperty(a, "margin-left"), this._removeProperty(a, "margin-top"), this._removeClass(a, "right"), this._removeClass(a, "top");
      }, this)), "vertical" === this.options.orientation ? (this._addClass(this.sliderElem, "slider-vertical"), this.stylePos = "top", this.mousePos = "pageY", this.sizePos = "offsetHeight") : (this._addClass(this.sliderElem, "slider-horizontal"), this.sliderElem.style.width = o, this.options.orientation = "horizontal", this.stylePos = "left", this.mousePos = "pageX", this.sizePos = "offsetWidth"), this._setTooltipPosition(), Array.isArray(this.options.ticks) && this.options.ticks.length > 0 && (this.options.max = Math.max.apply(Math, this.options.ticks), this.options.min = Math.min.apply(Math, this.options.ticks)), Array.isArray(this.options.value) ? (this.options.range = !0, this._state.value = this.options.value) : this._state.value = this.options.range ? [this.options.value, this.options.max] : this.options.value, this.trackLow = k || this.trackLow, this.trackSelection = j || this.trackSelection, this.trackHigh = l || this.trackHigh, "none" === this.options.selection && (this._addClass(this.trackLow, "hide"), this._addClass(this.trackSelection, "hide"), this._addClass(this.trackHigh, "hide")), this.handle1 = m || this.handle1, this.handle2 = n || this.handle2, p === !0) for (this._removeClass(this.handle1, "round triangle"), this._removeClass(this.handle2, "round triangle hide"), g = 0; g < this.ticks.length; g++) {
        this._removeClass(this.ticks[g], "round triangle hide");
      }var A = ["round", "triangle", "custom"],
          B = -1 !== A.indexOf(this.options.handle);if (B) for (this._addClass(this.handle1, this.options.handle), this._addClass(this.handle2, this.options.handle), g = 0; g < this.ticks.length; g++) {
        this._addClass(this.ticks[g], this.options.handle);
      }this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos], this.setValue(this._state.value), this.handle1Keydown = this._keydown.bind(this, 0), this.handle1.addEventListener("keydown", this.handle1Keydown, !1), this.handle2Keydown = this._keydown.bind(this, 1), this.handle2.addEventListener("keydown", this.handle2Keydown, !1), this.mousedown = this._mousedown.bind(this), this.touchCapable && this.sliderElem.addEventListener("touchstart", this.mousedown, !1), this.sliderElem.addEventListener("mousedown", this.mousedown, !1), "hide" === this.options.tooltip ? (this._addClass(this.tooltip, "hide"), this._addClass(this.tooltip_min, "hide"), this._addClass(this.tooltip_max, "hide")) : "always" === this.options.tooltip ? (this._showTooltip(), this._alwaysShowTooltip = !0) : (this.showTooltip = this._showTooltip.bind(this), this.hideTooltip = this._hideTooltip.bind(this), this.sliderElem.addEventListener("mouseenter", this.showTooltip, !1), this.sliderElem.addEventListener("mouseleave", this.hideTooltip, !1), this.handle1.addEventListener("focus", this.showTooltip, !1), this.handle1.addEventListener("blur", this.hideTooltip, !1), this.handle2.addEventListener("focus", this.showTooltip, !1), this.handle2.addEventListener("blur", this.hideTooltip, !1)), this.options.enabled ? this.enable() : this.disable();
    }var d = { formatInvalidInputErrorMsg: function formatInvalidInputErrorMsg(a) {
        return "Invalid input value '" + a + "' passed in";
      }, callingContextNotSliderInstance: "Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method" },
        e = { linear: { toValue: function toValue(a) {
          var b = a / 100 * (this.options.max - this.options.min);if (this.options.ticks_positions.length > 0) {
            for (var c, d, e, f = 0, g = 0; g < this.options.ticks_positions.length; g++) {
              if (a <= this.options.ticks_positions[g]) {
                c = g > 0 ? this.options.ticks[g - 1] : 0, e = g > 0 ? this.options.ticks_positions[g - 1] : 0, d = this.options.ticks[g], f = this.options.ticks_positions[g];break;
              }
            }if (g > 0) {
              var h = (a - e) / (f - e);b = c + h * (d - c);
            }
          }var i = this.options.min + Math.round(b / this.options.step) * this.options.step;return i < this.options.min ? this.options.min : i > this.options.max ? this.options.max : i;
        }, toPercentage: function toPercentage(a) {
          if (this.options.max === this.options.min) return 0;if (this.options.ticks_positions.length > 0) {
            for (var b, c, d, e = 0, f = 0; f < this.options.ticks.length; f++) {
              if (a <= this.options.ticks[f]) {
                b = f > 0 ? this.options.ticks[f - 1] : 0, d = f > 0 ? this.options.ticks_positions[f - 1] : 0, c = this.options.ticks[f], e = this.options.ticks_positions[f];break;
              }
            }if (f > 0) {
              var g = (a - b) / (c - b);return d + g * (e - d);
            }
          }return 100 * (a - this.options.min) / (this.options.max - this.options.min);
        } }, logarithmic: { toValue: function toValue(a) {
          var b = 0 === this.options.min ? 0 : Math.log(this.options.min),
              c = Math.log(this.options.max),
              d = Math.exp(b + (c - b) * a / 100);return d = this.options.min + Math.round((d - this.options.min) / this.options.step) * this.options.step, d < this.options.min ? this.options.min : d > this.options.max ? this.options.max : d;
        }, toPercentage: function toPercentage(a) {
          if (this.options.max === this.options.min) return 0;var b = Math.log(this.options.max),
              c = 0 === this.options.min ? 0 : Math.log(this.options.min),
              d = 0 === a ? 0 : Math.log(a);return 100 * (d - c) / (b - c);
        } } };if (b = function b(a, _b) {
      return c.call(this, a, _b), this;
    }, b.prototype = { _init: function _init() {}, constructor: b, defaultOptions: { id: "", min: 0, max: 10, step: 1, precision: 0, orientation: "horizontal", value: 5, range: !1, selection: "before", tooltip: "show", tooltip_split: !1, handle: "round", reversed: !1, enabled: !0, formatter: function formatter(a) {
          return Array.isArray(a) ? a[0] + " : " + a[1] : a;
        }, natural_arrow_keys: !1, ticks: [], ticks_positions: [], ticks_labels: [], ticks_snap_bounds: 0, scale: "linear", focus: !1, tooltip_position: null }, getElement: function getElement() {
        return this.sliderElem;
      }, getValue: function getValue() {
        return this.options.range ? this._state.value : this._state.value[0];
      }, setValue: function setValue(a, b, c) {
        a || (a = 0);var d = this.getValue();this._state.value = this._validateInputValue(a);var e = this._applyPrecision.bind(this);this.options.range ? (this._state.value[0] = e(this._state.value[0]), this._state.value[1] = e(this._state.value[1]), this._state.value[0] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[0])), this._state.value[1] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[1]))) : (this._state.value = e(this._state.value), this._state.value = [Math.max(this.options.min, Math.min(this.options.max, this._state.value))], this._addClass(this.handle2, "hide"), this._state.value[1] = "after" === this.options.selection ? this.options.max : this.options.min), this._state.percentage = this.options.max > this.options.min ? [this._toPercentage(this._state.value[0]), this._toPercentage(this._state.value[1]), 100 * this.options.step / (this.options.max - this.options.min)] : [0, 0, 100], this._layout();var f = this.options.range ? this._state.value : this._state.value[0];return b === !0 && this._trigger("slide", f), d !== f && c === !0 && this._trigger("change", { oldValue: d, newValue: f }), this._setDataVal(f), this;
      }, destroy: function destroy() {
        this._removeSliderEventHandlers(), this.sliderElem.parentNode.removeChild(this.sliderElem), this.element.style.display = "", this._cleanUpEventCallbacksMap(), this.element.removeAttribute("data"), a && (this._unbindJQueryEventHandlers(), this.$element.removeData("slider"));
      }, disable: function disable() {
        return this._state.enabled = !1, this.handle1.removeAttribute("tabindex"), this.handle2.removeAttribute("tabindex"), this._addClass(this.sliderElem, "slider-disabled"), this._trigger("slideDisabled"), this;
      }, enable: function enable() {
        return this._state.enabled = !0, this.handle1.setAttribute("tabindex", 0), this.handle2.setAttribute("tabindex", 0), this._removeClass(this.sliderElem, "slider-disabled"), this._trigger("slideEnabled"), this;
      }, toggle: function toggle() {
        return this._state.enabled ? this.disable() : this.enable(), this;
      }, isEnabled: function isEnabled() {
        return this._state.enabled;
      }, on: function on(a, b) {
        return this._bindNonQueryEventHandler(a, b), this;
      }, off: function off(b, c) {
        a ? (this.$element.off(b, c), this.$sliderElem.off(b, c)) : this._unbindNonQueryEventHandler(b, c);
      }, getAttribute: function getAttribute(a) {
        return a ? this.options[a] : this.options;
      }, setAttribute: function setAttribute(a, b) {
        return this.options[a] = b, this;
      }, refresh: function refresh() {
        return this._removeSliderEventHandlers(), c.call(this, this.element, this.options), a && a.data(this.element, "slider", this), this;
      }, relayout: function relayout() {
        return this._layout(), this;
      }, _removeSliderEventHandlers: function _removeSliderEventHandlers() {
        this.handle1.removeEventListener("keydown", this.handle1Keydown, !1), this.handle2.removeEventListener("keydown", this.handle2Keydown, !1), this.showTooltip && (this.handle1.removeEventListener("focus", this.showTooltip, !1), this.handle2.removeEventListener("focus", this.showTooltip, !1)), this.hideTooltip && (this.handle1.removeEventListener("blur", this.hideTooltip, !1), this.handle2.removeEventListener("blur", this.hideTooltip, !1)), this.showTooltip && this.sliderElem.removeEventListener("mouseenter", this.showTooltip, !1), this.hideTooltip && this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, !1), this.sliderElem.removeEventListener("touchstart", this.mousedown, !1), this.sliderElem.removeEventListener("mousedown", this.mousedown, !1);
      }, _bindNonQueryEventHandler: function _bindNonQueryEventHandler(a, b) {
        void 0 === this.eventToCallbackMap[a] && (this.eventToCallbackMap[a] = []), this.eventToCallbackMap[a].push(b);
      }, _unbindNonQueryEventHandler: function _unbindNonQueryEventHandler(a, b) {
        var c = this.eventToCallbackMap[a];if (void 0 !== c) for (var d = 0; d < c.length; d++) {
          if (c[d] === b) {
            c.splice(d, 1);break;
          }
        }
      }, _cleanUpEventCallbacksMap: function _cleanUpEventCallbacksMap() {
        for (var a = Object.keys(this.eventToCallbackMap), b = 0; b < a.length; b++) {
          var c = a[b];this.eventToCallbackMap[c] = null;
        }
      }, _showTooltip: function _showTooltip() {
        this.options.tooltip_split === !1 ? (this._addClass(this.tooltip, "in"), this.tooltip_min.style.display = "none", this.tooltip_max.style.display = "none") : (this._addClass(this.tooltip_min, "in"), this._addClass(this.tooltip_max, "in"), this.tooltip.style.display = "none"), this._state.over = !0;
      }, _hideTooltip: function _hideTooltip() {
        this._state.inDrag === !1 && this.alwaysShowTooltip !== !0 && (this._removeClass(this.tooltip, "in"), this._removeClass(this.tooltip_min, "in"), this._removeClass(this.tooltip_max, "in")), this._state.over = !1;
      }, _layout: function _layout() {
        var a;if (a = this.options.reversed ? [100 - this._state.percentage[0], this.options.range ? 100 - this._state.percentage[1] : this._state.percentage[1]] : [this._state.percentage[0], this._state.percentage[1]], this.handle1.style[this.stylePos] = a[0] + "%", this.handle2.style[this.stylePos] = a[1] + "%", Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
          var b = "vertical" === this.options.orientation ? "height" : "width",
              c = "vertical" === this.options.orientation ? "marginTop" : "marginLeft",
              d = this._state.size / (this.options.ticks.length - 1);if (this.tickLabelContainer) {
            var e = 0;if (0 === this.options.ticks_positions.length) this.tickLabelContainer.style[c] = -d / 2 + "px", e = this.tickLabelContainer.offsetHeight;else for (f = 0; f < this.tickLabelContainer.childNodes.length; f++) {
              this.tickLabelContainer.childNodes[f].offsetHeight > e && (e = this.tickLabelContainer.childNodes[f].offsetHeight);
            }"horizontal" === this.options.orientation && (this.sliderElem.style.marginBottom = e + "px");
          }for (var f = 0; f < this.options.ticks.length; f++) {
            var g = this.options.ticks_positions[f] || this._toPercentage(this.options.ticks[f]);this.options.reversed && (g = 100 - g), this.ticks[f].style[this.stylePos] = g + "%", this._removeClass(this.ticks[f], "in-selection"), this.options.range ? g >= a[0] && g <= a[1] && this._addClass(this.ticks[f], "in-selection") : "after" === this.options.selection && g >= a[0] ? this._addClass(this.ticks[f], "in-selection") : "before" === this.options.selection && g <= a[0] && this._addClass(this.ticks[f], "in-selection"), this.tickLabels[f] && (this.tickLabels[f].style[b] = d + "px", void 0 !== this.options.ticks_positions[f] && (this.tickLabels[f].style.position = "absolute", this.tickLabels[f].style[this.stylePos] = g + "%", this.tickLabels[f].style[c] = -d / 2 + "px"));
          }
        }var h;if (this.options.range) {
          h = this.options.formatter(this._state.value), this._setText(this.tooltipInner, h), this.tooltip.style[this.stylePos] = (a[1] + a[0]) / 2 + "%", "vertical" === this.options.orientation ? this._css(this.tooltip, "margin-top", -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-left", -this.tooltip.offsetWidth / 2 + "px"), "vertical" === this.options.orientation ? this._css(this.tooltip, "margin-top", -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-left", -this.tooltip.offsetWidth / 2 + "px");var i = this.options.formatter(this._state.value[0]);this._setText(this.tooltipInner_min, i);var j = this.options.formatter(this._state.value[1]);this._setText(this.tooltipInner_max, j), this.tooltip_min.style[this.stylePos] = a[0] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip_min, "margin-top", -this.tooltip_min.offsetHeight / 2 + "px") : this._css(this.tooltip_min, "margin-left", -this.tooltip_min.offsetWidth / 2 + "px"), this.tooltip_max.style[this.stylePos] = a[1] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip_max, "margin-top", -this.tooltip_max.offsetHeight / 2 + "px") : this._css(this.tooltip_max, "margin-left", -this.tooltip_max.offsetWidth / 2 + "px");
        } else h = this.options.formatter(this._state.value[0]), this._setText(this.tooltipInner, h), this.tooltip.style[this.stylePos] = a[0] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip, "margin-top", -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-left", -this.tooltip.offsetWidth / 2 + "px");if ("vertical" === this.options.orientation) this.trackLow.style.top = "0", this.trackLow.style.height = Math.min(a[0], a[1]) + "%", this.trackSelection.style.top = Math.min(a[0], a[1]) + "%", this.trackSelection.style.height = Math.abs(a[0] - a[1]) + "%", this.trackHigh.style.bottom = "0", this.trackHigh.style.height = 100 - Math.min(a[0], a[1]) - Math.abs(a[0] - a[1]) + "%";else {
          this.trackLow.style.left = "0", this.trackLow.style.width = Math.min(a[0], a[1]) + "%", this.trackSelection.style.left = Math.min(a[0], a[1]) + "%", this.trackSelection.style.width = Math.abs(a[0] - a[1]) + "%", this.trackHigh.style.right = "0", this.trackHigh.style.width = 100 - Math.min(a[0], a[1]) - Math.abs(a[0] - a[1]) + "%";var k = this.tooltip_min.getBoundingClientRect(),
              l = this.tooltip_max.getBoundingClientRect();k.right > l.left ? (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = "18px") : (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = this.tooltip_min.style.top);
        }
      }, _removeProperty: function _removeProperty(a, b) {
        a.style.removeProperty ? a.style.removeProperty(b) : a.style.removeAttribute(b);
      }, _mousedown: function _mousedown(a) {
        if (!this._state.enabled) return !1;this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos];var b = this._getPercentage(a);if (this.options.range) {
          var c = Math.abs(this._state.percentage[0] - b),
              d = Math.abs(this._state.percentage[1] - b);this._state.dragged = d > c ? 0 : 1;
        } else this._state.dragged = 0;this._state.percentage[this._state.dragged] = b, this._layout(), this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), this.mousemove && document.removeEventListener("mousemove", this.mousemove, !1), this.mouseup && document.removeEventListener("mouseup", this.mouseup, !1), this.mousemove = this._mousemove.bind(this), this.mouseup = this._mouseup.bind(this), this.touchCapable && (document.addEventListener("touchmove", this.mousemove, !1), document.addEventListener("touchend", this.mouseup, !1)), document.addEventListener("mousemove", this.mousemove, !1), document.addEventListener("mouseup", this.mouseup, !1), this._state.inDrag = !0;var e = this._calculateValue();return this._trigger("slideStart", e), this._setDataVal(e), this.setValue(e, !1, !0), this._pauseEvent(a), this.options.focus && this._triggerFocusOnHandle(this._state.dragged), !0;
      }, _triggerFocusOnHandle: function _triggerFocusOnHandle(a) {
        0 === a && this.handle1.focus(), 1 === a && this.handle2.focus();
      }, _keydown: function _keydown(a, b) {
        if (!this._state.enabled) return !1;var c;switch (b.keyCode) {case 37:case 40:
            c = -1;break;case 39:case 38:
            c = 1;}if (c) {
          if (this.options.natural_arrow_keys) {
            var d = "vertical" === this.options.orientation && !this.options.reversed,
                e = "horizontal" === this.options.orientation && this.options.reversed;(d || e) && (c = -c);
          }var f = this._state.value[a] + c * this.options.step;return this.options.range && (f = [a ? this._state.value[0] : f, a ? f : this._state.value[1]]), this._trigger("slideStart", f), this._setDataVal(f), this.setValue(f, !0, !0), this._setDataVal(f), this._trigger("slideStop", f), this._layout(), this._pauseEvent(b), !1;
        }
      }, _pauseEvent: function _pauseEvent(a) {
        a.stopPropagation && a.stopPropagation(), a.preventDefault && a.preventDefault(), a.cancelBubble = !0, a.returnValue = !1;
      }, _mousemove: function _mousemove(a) {
        if (!this._state.enabled) return !1;var b = this._getPercentage(a);this._adjustPercentageForRangeSliders(b), this._state.percentage[this._state.dragged] = b, this._layout();var c = this._calculateValue(!0);return this.setValue(c, !0, !0), !1;
      }, _adjustPercentageForRangeSliders: function _adjustPercentageForRangeSliders(a) {
        if (this.options.range) {
          var b = this._getNumDigitsAfterDecimalPlace(a);b = b ? b - 1 : 0;var c = this._applyToFixedAndParseFloat(a, b);0 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[1], b) < c ? (this._state.percentage[0] = this._state.percentage[1], this._state.dragged = 1) : 1 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[0], b) > c && (this._state.percentage[1] = this._state.percentage[0], this._state.dragged = 0);
        }
      }, _mouseup: function _mouseup() {
        if (!this._state.enabled) return !1;this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), document.removeEventListener("mousemove", this.mousemove, !1), document.removeEventListener("mouseup", this.mouseup, !1), this._state.inDrag = !1, this._state.over === !1 && this._hideTooltip();var a = this._calculateValue(!0);return this._layout(), this._setDataVal(a), this._trigger("slideStop", a), !1;
      }, _calculateValue: function _calculateValue(a) {
        var b;if (this.options.range ? (b = [this.options.min, this.options.max], 0 !== this._state.percentage[0] && (b[0] = this._toValue(this._state.percentage[0]), b[0] = this._applyPrecision(b[0])), 100 !== this._state.percentage[1] && (b[1] = this._toValue(this._state.percentage[1]), b[1] = this._applyPrecision(b[1]))) : (b = this._toValue(this._state.percentage[0]), b = parseFloat(b), b = this._applyPrecision(b)), a) {
          for (var c = [b, 1 / 0], d = 0; d < this.options.ticks.length; d++) {
            var e = Math.abs(this.options.ticks[d] - b);e <= c[1] && (c = [this.options.ticks[d], e]);
          }if (c[1] <= this.options.ticks_snap_bounds) return c[0];
        }return b;
      }, _applyPrecision: function _applyPrecision(a) {
        var b = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);return this._applyToFixedAndParseFloat(a, b);
      }, _getNumDigitsAfterDecimalPlace: function _getNumDigitsAfterDecimalPlace(a) {
        var b = ("" + a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return b ? Math.max(0, (b[1] ? b[1].length : 0) - (b[2] ? +b[2] : 0)) : 0;
      }, _applyToFixedAndParseFloat: function _applyToFixedAndParseFloat(a, b) {
        var c = a.toFixed(b);return parseFloat(c);
      }, _getPercentage: function _getPercentage(a) {
        !this.touchCapable || "touchstart" !== a.type && "touchmove" !== a.type || (a = a.touches[0]);var b = a[this.mousePos],
            c = this._state.offset[this.stylePos],
            d = b - c,
            e = d / this._state.size * 100;return e = Math.round(e / this._state.percentage[2]) * this._state.percentage[2], this.options.reversed && (e = 100 - e), Math.max(0, Math.min(100, e));
      }, _validateInputValue: function _validateInputValue(a) {
        if ("number" == typeof a) return a;if (Array.isArray(a)) return this._validateArray(a), a;throw new Error(d.formatInvalidInputErrorMsg(a));
      }, _validateArray: function _validateArray(a) {
        for (var b = 0; b < a.length; b++) {
          var c = a[b];if ("number" != typeof c) throw new Error(d.formatInvalidInputErrorMsg(c));
        }
      }, _setDataVal: function _setDataVal(a) {
        this.element.setAttribute("data-value", a), this.element.setAttribute("value", a), this.element.value = a;
      }, _trigger: function _trigger(b, c) {
        c = c || 0 === c ? c : void 0;var d = this.eventToCallbackMap[b];if (d && d.length) for (var e = 0; e < d.length; e++) {
          var f = d[e];f(c);
        }a && this._triggerJQueryEvent(b, c);
      }, _triggerJQueryEvent: function _triggerJQueryEvent(a, b) {
        var c = { type: a, value: b };this.$element.trigger(c), this.$sliderElem.trigger(c);
      }, _unbindJQueryEventHandlers: function _unbindJQueryEventHandlers() {
        this.$element.off(), this.$sliderElem.off();
      }, _setText: function _setText(a, b) {
        "undefined" != typeof a.innerText ? a.innerText = b : "undefined" != typeof a.textContent && (a.textContent = b);
      }, _removeClass: function _removeClass(a, b) {
        for (var c = b.split(" "), d = a.className, e = 0; e < c.length; e++) {
          var f = c[e],
              g = new RegExp("(?:\\s|^)" + f + "(?:\\s|$)");d = d.replace(g, " ");
        }a.className = d.trim();
      }, _addClass: function _addClass(a, b) {
        for (var c = b.split(" "), d = a.className, e = 0; e < c.length; e++) {
          var f = c[e],
              g = new RegExp("(?:\\s|^)" + f + "(?:\\s|$)"),
              h = g.test(d);h || (d += " " + f);
        }a.className = d.trim();
      }, _offsetLeft: function _offsetLeft(a) {
        return a.getBoundingClientRect().left;
      }, _offsetTop: function _offsetTop(a) {
        for (var b = a.offsetTop; (a = a.offsetParent) && !isNaN(a.offsetTop);) {
          b += a.offsetTop;
        }return b;
      }, _offset: function _offset(a) {
        return { left: this._offsetLeft(a), top: this._offsetTop(a) };
      }, _css: function _css(b, c, d) {
        if (a) a.style(b, c, d);else {
          var e = c.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function (a, b) {
            return b.toUpperCase();
          });b.style[e] = d;
        }
      }, _toValue: function _toValue(a) {
        return this.options.scale.toValue.apply(this, [a]);
      }, _toPercentage: function _toPercentage(a) {
        return this.options.scale.toPercentage.apply(this, [a]);
      }, _setTooltipPosition: function _setTooltipPosition() {
        var a = [this.tooltip, this.tooltip_min, this.tooltip_max];if ("vertical" === this.options.orientation) {
          var b = this.options.tooltip_position || "right",
              c = "left" === b ? "right" : "left";a.forEach(function (a) {
            this._addClass(a, b), a.style[c] = "100%";
          }.bind(this));
        } else a.forEach("bottom" === this.options.tooltip_position ? function (a) {
          this._addClass(a, "bottom"), a.style.top = "22px";
        }.bind(this) : function (a) {
          this._addClass(a, "top"), a.style.top = -this.tooltip.outerHeight - 14 + "px";
        }.bind(this));
      } }, a) {
      var f = a.fn.slider ? "bootstrapSlider" : "slider";a.bridget(f, b);
    }
  }(a), b;
});
"use strict";

var SnowMachine = function SnowMachine() {
	this.canvas = document.getElementById("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.mp = 25;
	this.angle = 0;
	window.addEventListener('resize', this.resizeCanvas, false);
	this.resizeCanvas();
};

SnowMachine.prototype.resizeCanvas = function () {
	var canvas = this.canvas;
	this.W = window.innerWidth;
	this.H = window.innerHeight;
	canvas.width = this.W;
	canvas.height = this.H;
};

SnowMachine.prototype.initCanvas = function () {
	this.particles = [];
	for (var i = 0; i < this.mp; i++) {
		this.particles.push({
			x: Math.random() * this.W,
			y: Math.random() * this.H,
			r: Math.random() * 4 + 1,
			d: Math.random() * this.mp
		});
	}
};

SnowMachine.prototype.draw = function () {
	var ctx = this.ctx;
	var W = this.W;
	var H = this.H;
	ctx.clearRect(0, 0, W, H);
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.beginPath();
	for (var i = 0; i < this.mp; i++) {
		var p = this.particles[i];
		ctx.moveTo(p.x, p.y);
		ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
	}
	ctx.fill();
	this.update();
};

SnowMachine.prototype.update = function () {
	var particles = this.particles;
	var W = this.W;
	var H = this.H;
	var mp = this.mp;
	this.angle += 0.01;

	for (var i = 0; i < mp; i++) {
		var p = particles[i];
		p.y += Math.cos(this.angle + p.d) + 1 + p.r / 2;
		p.x += Math.sin(this.angle) * 2;

		//Sending flakes back from the top when it exits
		//Lets make it a bit more organic and let flakes enter from the left and right also.
		if (p.x > W + 5 || p.x < -5 || p.y > H) {
			if (i % 3 > 0) {
				//66.67% of the flakes
				particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d };
			} else {
				//If the flake is exitting from the right
				if (Math.sin(this.angle) > 0) {
					//Enter from the left
					particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d };
				} else {
					//Enter from the right
					particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d };
				}
			}
		}
	}
};

SnowMachine.prototype.start = function () {
	this.initCanvas();
	this.timer = setInterval(this.draw.bind(this), 33);
};

SnowMachine.prototype.stop = function () {
	if (this.timer) {
		window.clearInterval(this.timer);
		this.timer = null;
	}
};
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.io = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (_dereq_, module, exports) {
      module.exports = _dereq_("./lib/");
    }, { "./lib/": 2 }], 2: [function (_dereq_, module, exports) {
      module.exports = _dereq_("./socket");module.exports.parser = _dereq_("engine.io-parser");
    }, { "./socket": 3, "engine.io-parser": 19 }], 3: [function (_dereq_, module, exports) {
      (function (global) {
        var transports = _dereq_("./transports");var Emitter = _dereq_("component-emitter");var debug = _dereq_("debug")("engine.io-client:socket");var index = _dereq_("indexof");var parser = _dereq_("engine.io-parser");var parseuri = _dereq_("parseuri");var parsejson = _dereq_("parsejson");var parseqs = _dereq_("parseqs");module.exports = Socket;function noop() {}function Socket(uri, opts) {
          if (!(this instanceof Socket)) return new Socket(uri, opts);opts = opts || {};if (uri && "object" == (typeof uri === "undefined" ? "undefined" : _typeof(uri))) {
            opts = uri;uri = null;
          }if (uri) {
            uri = parseuri(uri);opts.hostname = uri.host;opts.secure = uri.protocol == "https" || uri.protocol == "wss";opts.port = uri.port;if (uri.query) opts.query = uri.query;
          } else if (opts.host) {
            opts.hostname = parseuri(opts.host).host;
          }this.secure = null != opts.secure ? opts.secure : global.location && "https:" == location.protocol;if (opts.hostname && !opts.port) {
            opts.port = this.secure ? "443" : "80";
          }this.agent = opts.agent || false;this.hostname = opts.hostname || (global.location ? location.hostname : "localhost");this.port = opts.port || (global.location && location.port ? location.port : this.secure ? 443 : 80);this.query = opts.query || {};if ("string" == typeof this.query) this.query = parseqs.decode(this.query);this.upgrade = false !== opts.upgrade;this.path = (opts.path || "/engine.io").replace(/\/$/, "") + "/";this.forceJSONP = !!opts.forceJSONP;this.jsonp = false !== opts.jsonp;this.forceBase64 = !!opts.forceBase64;this.enablesXDR = !!opts.enablesXDR;this.timestampParam = opts.timestampParam || "t";this.timestampRequests = opts.timestampRequests;this.transports = opts.transports || ["polling", "websocket"];this.readyState = "";this.writeBuffer = [];this.policyPort = opts.policyPort || 843;this.rememberUpgrade = opts.rememberUpgrade || false;this.binaryType = null;this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;this.perMessageDeflate = false !== opts.perMessageDeflate ? opts.perMessageDeflate || {} : false;if (true === this.perMessageDeflate) this.perMessageDeflate = {};if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
            this.perMessageDeflate.threshold = 1024;
          }this.pfx = opts.pfx || null;this.key = opts.key || null;this.passphrase = opts.passphrase || null;this.cert = opts.cert || null;this.ca = opts.ca || null;this.ciphers = opts.ciphers || null;this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? null : opts.rejectUnauthorized;var freeGlobal = (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global;if (freeGlobal.global === freeGlobal) {
            if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
              this.extraHeaders = opts.extraHeaders;
            }
          }this.open();
        }Socket.priorWebsocketSuccess = false;Emitter(Socket.prototype);Socket.protocol = parser.protocol;Socket.Socket = Socket;Socket.Transport = _dereq_("./transport");Socket.transports = _dereq_("./transports");Socket.parser = _dereq_("engine.io-parser");Socket.prototype.createTransport = function (name) {
          debug('creating transport "%s"', name);var query = clone(this.query);query.EIO = parser.protocol;query.transport = name;if (this.id) query.sid = this.id;var transport = new transports[name]({ agent: this.agent, hostname: this.hostname, port: this.port, secure: this.secure, path: this.path, query: query, forceJSONP: this.forceJSONP, jsonp: this.jsonp, forceBase64: this.forceBase64, enablesXDR: this.enablesXDR, timestampRequests: this.timestampRequests, timestampParam: this.timestampParam, policyPort: this.policyPort, socket: this, pfx: this.pfx, key: this.key, passphrase: this.passphrase, cert: this.cert, ca: this.ca, ciphers: this.ciphers, rejectUnauthorized: this.rejectUnauthorized, perMessageDeflate: this.perMessageDeflate, extraHeaders: this.extraHeaders });return transport;
        };function clone(obj) {
          var o = {};for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
              o[i] = obj[i];
            }
          }return o;
        }Socket.prototype.open = function () {
          var transport;if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf("websocket") != -1) {
            transport = "websocket";
          } else if (0 === this.transports.length) {
            var self = this;setTimeout(function () {
              self.emit("error", "No transports available");
            }, 0);return;
          } else {
            transport = this.transports[0];
          }this.readyState = "opening";try {
            transport = this.createTransport(transport);
          } catch (e) {
            this.transports.shift();this.open();return;
          }transport.open();this.setTransport(transport);
        };Socket.prototype.setTransport = function (transport) {
          debug("setting transport %s", transport.name);var self = this;if (this.transport) {
            debug("clearing existing transport %s", this.transport.name);this.transport.removeAllListeners();
          }this.transport = transport;transport.on("drain", function () {
            self.onDrain();
          }).on("packet", function (packet) {
            self.onPacket(packet);
          }).on("error", function (e) {
            self.onError(e);
          }).on("close", function () {
            self.onClose("transport close");
          });
        };Socket.prototype.probe = function (name) {
          debug('probing transport "%s"', name);var transport = this.createTransport(name, { probe: 1 }),
              failed = false,
              self = this;Socket.priorWebsocketSuccess = false;function onTransportOpen() {
            if (self.onlyBinaryUpgrades) {
              var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;failed = failed || upgradeLosesBinary;
            }if (failed) return;debug('probe transport "%s" opened', name);transport.send([{ type: "ping", data: "probe" }]);transport.once("packet", function (msg) {
              if (failed) return;if ("pong" == msg.type && "probe" == msg.data) {
                debug('probe transport "%s" pong', name);self.upgrading = true;self.emit("upgrading", transport);if (!transport) return;Socket.priorWebsocketSuccess = "websocket" == transport.name;debug('pausing current transport "%s"', self.transport.name);self.transport.pause(function () {
                  if (failed) return;if ("closed" == self.readyState) return;debug("changing transport and sending upgrade packet");cleanup();self.setTransport(transport);transport.send([{ type: "upgrade" }]);self.emit("upgrade", transport);transport = null;self.upgrading = false;self.flush();
                });
              } else {
                debug('probe transport "%s" failed', name);var err = new Error("probe error");err.transport = transport.name;self.emit("upgradeError", err);
              }
            });
          }function freezeTransport() {
            if (failed) return;failed = true;cleanup();transport.close();transport = null;
          }function onerror(err) {
            var error = new Error("probe error: " + err);error.transport = transport.name;freezeTransport();debug('probe transport "%s" failed because of error: %s', name, err);self.emit("upgradeError", error);
          }function onTransportClose() {
            onerror("transport closed");
          }function onclose() {
            onerror("socket closed");
          }function onupgrade(to) {
            if (transport && to.name != transport.name) {
              debug('"%s" works - aborting "%s"', to.name, transport.name);freezeTransport();
            }
          }function cleanup() {
            transport.removeListener("open", onTransportOpen);transport.removeListener("error", onerror);transport.removeListener("close", onTransportClose);self.removeListener("close", onclose);self.removeListener("upgrading", onupgrade);
          }transport.once("open", onTransportOpen);transport.once("error", onerror);transport.once("close", onTransportClose);this.once("close", onclose);this.once("upgrading", onupgrade);transport.open();
        };Socket.prototype.onOpen = function () {
          debug("socket open");this.readyState = "open";Socket.priorWebsocketSuccess = "websocket" == this.transport.name;this.emit("open");this.flush();if ("open" == this.readyState && this.upgrade && this.transport.pause) {
            debug("starting upgrade probes");for (var i = 0, l = this.upgrades.length; i < l; i++) {
              this.probe(this.upgrades[i]);
            }
          }
        };Socket.prototype.onPacket = function (packet) {
          if ("opening" == this.readyState || "open" == this.readyState) {
            debug('socket receive: type "%s", data "%s"', packet.type, packet.data);this.emit("packet", packet);this.emit("heartbeat");switch (packet.type) {case "open":
                this.onHandshake(parsejson(packet.data));break;case "pong":
                this.setPing();this.emit("pong");break;case "error":
                var err = new Error("server error");err.code = packet.data;this.onError(err);break;case "message":
                this.emit("data", packet.data);this.emit("message", packet.data);break;}
          } else {
            debug('packet received with socket readyState "%s"', this.readyState);
          }
        };Socket.prototype.onHandshake = function (data) {
          this.emit("handshake", data);this.id = data.sid;this.transport.query.sid = data.sid;this.upgrades = this.filterUpgrades(data.upgrades);this.pingInterval = data.pingInterval;this.pingTimeout = data.pingTimeout;this.onOpen();if ("closed" == this.readyState) return;this.setPing();this.removeListener("heartbeat", this.onHeartbeat);this.on("heartbeat", this.onHeartbeat);
        };Socket.prototype.onHeartbeat = function (timeout) {
          clearTimeout(this.pingTimeoutTimer);var self = this;self.pingTimeoutTimer = setTimeout(function () {
            if ("closed" == self.readyState) return;self.onClose("ping timeout");
          }, timeout || self.pingInterval + self.pingTimeout);
        };Socket.prototype.setPing = function () {
          var self = this;clearTimeout(self.pingIntervalTimer);self.pingIntervalTimer = setTimeout(function () {
            debug("writing ping packet - expecting pong within %sms", self.pingTimeout);self.ping();self.onHeartbeat(self.pingTimeout);
          }, self.pingInterval);
        };Socket.prototype.ping = function () {
          var self = this;this.sendPacket("ping", function () {
            self.emit("ping");
          });
        };Socket.prototype.onDrain = function () {
          this.writeBuffer.splice(0, this.prevBufferLen);this.prevBufferLen = 0;if (0 === this.writeBuffer.length) {
            this.emit("drain");
          } else {
            this.flush();
          }
        };Socket.prototype.flush = function () {
          if ("closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
            debug("flushing %d packets in socket", this.writeBuffer.length);this.transport.send(this.writeBuffer);this.prevBufferLen = this.writeBuffer.length;this.emit("flush");
          }
        };Socket.prototype.write = Socket.prototype.send = function (msg, options, fn) {
          this.sendPacket("message", msg, options, fn);return this;
        };Socket.prototype.sendPacket = function (type, data, options, fn) {
          if ("function" == typeof data) {
            fn = data;data = undefined;
          }if ("function" == typeof options) {
            fn = options;options = null;
          }if ("closing" == this.readyState || "closed" == this.readyState) {
            return;
          }options = options || {};options.compress = false !== options.compress;var packet = { type: type, data: data, options: options };this.emit("packetCreate", packet);this.writeBuffer.push(packet);if (fn) this.once("flush", fn);this.flush();
        };Socket.prototype.close = function () {
          if ("opening" == this.readyState || "open" == this.readyState) {
            this.readyState = "closing";var self = this;if (this.writeBuffer.length) {
              this.once("drain", function () {
                if (this.upgrading) {
                  waitForUpgrade();
                } else {
                  close();
                }
              });
            } else if (this.upgrading) {
              waitForUpgrade();
            } else {
              close();
            }
          }function close() {
            self.onClose("forced close");debug("socket closing - telling transport to close");self.transport.close();
          }function cleanupAndClose() {
            self.removeListener("upgrade", cleanupAndClose);self.removeListener("upgradeError", cleanupAndClose);close();
          }function waitForUpgrade() {
            self.once("upgrade", cleanupAndClose);self.once("upgradeError", cleanupAndClose);
          }return this;
        };Socket.prototype.onError = function (err) {
          debug("socket error %j", err);Socket.priorWebsocketSuccess = false;this.emit("error", err);this.onClose("transport error", err);
        };Socket.prototype.onClose = function (reason, desc) {
          if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
            debug('socket close with reason: "%s"', reason);var self = this;clearTimeout(this.pingIntervalTimer);clearTimeout(this.pingTimeoutTimer);this.transport.removeAllListeners("close");this.transport.close();this.transport.removeAllListeners();this.readyState = "closed";this.id = null;this.emit("close", reason, desc);self.writeBuffer = [];self.prevBufferLen = 0;
          }
        };Socket.prototype.filterUpgrades = function (upgrades) {
          var filteredUpgrades = [];for (var i = 0, j = upgrades.length; i < j; i++) {
            if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
          }return filteredUpgrades;
        };
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { "./transport": 4, "./transports": 5, "component-emitter": 15, debug: 17, "engine.io-parser": 19, indexof: 23, parsejson: 26, parseqs: 27, parseuri: 28 }], 4: [function (_dereq_, module, exports) {
      var parser = _dereq_("engine.io-parser");var Emitter = _dereq_("component-emitter");module.exports = Transport;function Transport(opts) {
        this.path = opts.path;this.hostname = opts.hostname;this.port = opts.port;this.secure = opts.secure;this.query = opts.query;this.timestampParam = opts.timestampParam;this.timestampRequests = opts.timestampRequests;this.readyState = "";this.agent = opts.agent || false;this.socket = opts.socket;this.enablesXDR = opts.enablesXDR;this.pfx = opts.pfx;this.key = opts.key;this.passphrase = opts.passphrase;this.cert = opts.cert;this.ca = opts.ca;this.ciphers = opts.ciphers;this.rejectUnauthorized = opts.rejectUnauthorized;this.extraHeaders = opts.extraHeaders;
      }Emitter(Transport.prototype);Transport.prototype.onError = function (msg, desc) {
        var err = new Error(msg);err.type = "TransportError";err.description = desc;this.emit("error", err);return this;
      };Transport.prototype.open = function () {
        if ("closed" == this.readyState || "" == this.readyState) {
          this.readyState = "opening";this.doOpen();
        }return this;
      };Transport.prototype.close = function () {
        if ("opening" == this.readyState || "open" == this.readyState) {
          this.doClose();this.onClose();
        }return this;
      };Transport.prototype.send = function (packets) {
        if ("open" == this.readyState) {
          this.write(packets);
        } else {
          throw new Error("Transport not open");
        }
      };Transport.prototype.onOpen = function () {
        this.readyState = "open";this.writable = true;this.emit("open");
      };Transport.prototype.onData = function (data) {
        var packet = parser.decodePacket(data, this.socket.binaryType);this.onPacket(packet);
      };Transport.prototype.onPacket = function (packet) {
        this.emit("packet", packet);
      };Transport.prototype.onClose = function () {
        this.readyState = "closed";this.emit("close");
      };
    }, { "component-emitter": 15, "engine.io-parser": 19 }], 5: [function (_dereq_, module, exports) {
      (function (global) {
        var XMLHttpRequest = _dereq_("xmlhttprequest-ssl");var XHR = _dereq_("./polling-xhr");var JSONP = _dereq_("./polling-jsonp");var websocket = _dereq_("./websocket");exports.polling = polling;exports.websocket = websocket;function polling(opts) {
          var xhr;var xd = false;var xs = false;var jsonp = false !== opts.jsonp;if (global.location) {
            var isSSL = "https:" == location.protocol;var port = location.port;if (!port) {
              port = isSSL ? 443 : 80;
            }xd = opts.hostname != location.hostname || port != opts.port;xs = opts.secure != isSSL;
          }opts.xdomain = xd;opts.xscheme = xs;xhr = new XMLHttpRequest(opts);if ("open" in xhr && !opts.forceJSONP) {
            return new XHR(opts);
          } else {
            if (!jsonp) throw new Error("JSONP disabled");return new JSONP(opts);
          }
        }
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { "./polling-jsonp": 6, "./polling-xhr": 7, "./websocket": 9, "xmlhttprequest-ssl": 10 }], 6: [function (_dereq_, module, exports) {
      (function (global) {
        var Polling = _dereq_("./polling");var inherit = _dereq_("component-inherit");module.exports = JSONPPolling;var rNewline = /\n/g;var rEscapedNewline = /\\n/g;var callbacks;var index = 0;function empty() {}function JSONPPolling(opts) {
          Polling.call(this, opts);this.query = this.query || {};if (!callbacks) {
            if (!global.___eio) global.___eio = [];callbacks = global.___eio;
          }this.index = callbacks.length;var self = this;callbacks.push(function (msg) {
            self.onData(msg);
          });this.query.j = this.index;if (global.document && global.addEventListener) {
            global.addEventListener("beforeunload", function () {
              if (self.script) self.script.onerror = empty;
            }, false);
          }
        }inherit(JSONPPolling, Polling);JSONPPolling.prototype.supportsBinary = false;JSONPPolling.prototype.doClose = function () {
          if (this.script) {
            this.script.parentNode.removeChild(this.script);this.script = null;
          }if (this.form) {
            this.form.parentNode.removeChild(this.form);this.form = null;this.iframe = null;
          }Polling.prototype.doClose.call(this);
        };JSONPPolling.prototype.doPoll = function () {
          var self = this;var script = document.createElement("script");if (this.script) {
            this.script.parentNode.removeChild(this.script);this.script = null;
          }script.async = true;script.src = this.uri();script.onerror = function (e) {
            self.onError("jsonp poll error", e);
          };var insertAt = document.getElementsByTagName("script")[0];if (insertAt) {
            insertAt.parentNode.insertBefore(script, insertAt);
          } else {
            (document.head || document.body).appendChild(script);
          }this.script = script;var isUAgecko = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);if (isUAgecko) {
            setTimeout(function () {
              var iframe = document.createElement("iframe");document.body.appendChild(iframe);document.body.removeChild(iframe);
            }, 100);
          }
        };JSONPPolling.prototype.doWrite = function (data, fn) {
          var self = this;if (!this.form) {
            var form = document.createElement("form");var area = document.createElement("textarea");var id = this.iframeId = "eio_iframe_" + this.index;var iframe;form.className = "socketio";form.style.position = "absolute";form.style.top = "-1000px";form.style.left = "-1000px";form.target = id;form.method = "POST";form.setAttribute("accept-charset", "utf-8");area.name = "d";form.appendChild(area);document.body.appendChild(form);this.form = form;this.area = area;
          }this.form.action = this.uri();function complete() {
            initIframe();fn();
          }function initIframe() {
            if (self.iframe) {
              try {
                self.form.removeChild(self.iframe);
              } catch (e) {
                self.onError("jsonp polling iframe removal error", e);
              }
            }try {
              var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';iframe = document.createElement(html);
            } catch (e) {
              iframe = document.createElement("iframe");iframe.name = self.iframeId;iframe.src = "javascript:0";
            }iframe.id = self.iframeId;self.form.appendChild(iframe);self.iframe = iframe;
          }initIframe();data = data.replace(rEscapedNewline, "\\\n");this.area.value = data.replace(rNewline, "\\n");try {
            this.form.submit();
          } catch (e) {}if (this.iframe.attachEvent) {
            this.iframe.onreadystatechange = function () {
              if (self.iframe.readyState == "complete") {
                complete();
              }
            };
          } else {
            this.iframe.onload = complete;
          }
        };
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { "./polling": 8, "component-inherit": 16 }], 7: [function (_dereq_, module, exports) {
      (function (global) {
        var XMLHttpRequest = _dereq_("xmlhttprequest-ssl");var Polling = _dereq_("./polling");var Emitter = _dereq_("component-emitter");var inherit = _dereq_("component-inherit");var debug = _dereq_("debug")("engine.io-client:polling-xhr");module.exports = XHR;module.exports.Request = Request;function empty() {}function XHR(opts) {
          Polling.call(this, opts);if (global.location) {
            var isSSL = "https:" == location.protocol;var port = location.port;if (!port) {
              port = isSSL ? 443 : 80;
            }this.xd = opts.hostname != global.location.hostname || port != opts.port;this.xs = opts.secure != isSSL;
          } else {
            this.extraHeaders = opts.extraHeaders;
          }
        }inherit(XHR, Polling);XHR.prototype.supportsBinary = true;XHR.prototype.request = function (opts) {
          opts = opts || {};opts.uri = this.uri();opts.xd = this.xd;opts.xs = this.xs;opts.agent = this.agent || false;opts.supportsBinary = this.supportsBinary;opts.enablesXDR = this.enablesXDR;opts.pfx = this.pfx;opts.key = this.key;opts.passphrase = this.passphrase;opts.cert = this.cert;opts.ca = this.ca;opts.ciphers = this.ciphers;opts.rejectUnauthorized = this.rejectUnauthorized;opts.extraHeaders = this.extraHeaders;return new Request(opts);
        };XHR.prototype.doWrite = function (data, fn) {
          var isBinary = typeof data !== "string" && data !== undefined;var req = this.request({ method: "POST", data: data, isBinary: isBinary });var self = this;req.on("success", fn);req.on("error", function (err) {
            self.onError("xhr post error", err);
          });this.sendXhr = req;
        };XHR.prototype.doPoll = function () {
          debug("xhr poll");var req = this.request();var self = this;req.on("data", function (data) {
            self.onData(data);
          });req.on("error", function (err) {
            self.onError("xhr poll error", err);
          });this.pollXhr = req;
        };function Request(opts) {
          this.method = opts.method || "GET";this.uri = opts.uri;this.xd = !!opts.xd;this.xs = !!opts.xs;this.async = false !== opts.async;this.data = undefined != opts.data ? opts.data : null;this.agent = opts.agent;this.isBinary = opts.isBinary;this.supportsBinary = opts.supportsBinary;this.enablesXDR = opts.enablesXDR;this.pfx = opts.pfx;this.key = opts.key;this.passphrase = opts.passphrase;this.cert = opts.cert;this.ca = opts.ca;this.ciphers = opts.ciphers;this.rejectUnauthorized = opts.rejectUnauthorized;this.extraHeaders = opts.extraHeaders;this.create();
        }Emitter(Request.prototype);Request.prototype.create = function () {
          var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };opts.pfx = this.pfx;opts.key = this.key;opts.passphrase = this.passphrase;opts.cert = this.cert;opts.ca = this.ca;opts.ciphers = this.ciphers;opts.rejectUnauthorized = this.rejectUnauthorized;var xhr = this.xhr = new XMLHttpRequest(opts);var self = this;try {
            debug("xhr open %s: %s", this.method, this.uri);xhr.open(this.method, this.uri, this.async);try {
              if (this.extraHeaders) {
                xhr.setDisableHeaderCheck(true);for (var i in this.extraHeaders) {
                  if (this.extraHeaders.hasOwnProperty(i)) {
                    xhr.setRequestHeader(i, this.extraHeaders[i]);
                  }
                }
              }
            } catch (e) {}if (this.supportsBinary) {
              xhr.responseType = "arraybuffer";
            }if ("POST" == this.method) {
              try {
                if (this.isBinary) {
                  xhr.setRequestHeader("Content-type", "application/octet-stream");
                } else {
                  xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                }
              } catch (e) {}
            }if ("withCredentials" in xhr) {
              xhr.withCredentials = true;
            }if (this.hasXDR()) {
              xhr.onload = function () {
                self.onLoad();
              };xhr.onerror = function () {
                self.onError(xhr.responseText);
              };
            } else {
              xhr.onreadystatechange = function () {
                if (4 != xhr.readyState) return;if (200 == xhr.status || 1223 == xhr.status) {
                  self.onLoad();
                } else {
                  setTimeout(function () {
                    self.onError(xhr.status);
                  }, 0);
                }
              };
            }debug("xhr data %s", this.data);xhr.send(this.data);
          } catch (e) {
            setTimeout(function () {
              self.onError(e);
            }, 0);return;
          }if (global.document) {
            this.index = Request.requestsCount++;Request.requests[this.index] = this;
          }
        };Request.prototype.onSuccess = function () {
          this.emit("success");this.cleanup();
        };Request.prototype.onData = function (data) {
          this.emit("data", data);this.onSuccess();
        };Request.prototype.onError = function (err) {
          this.emit("error", err);this.cleanup(true);
        };Request.prototype.cleanup = function (fromError) {
          if ("undefined" == typeof this.xhr || null === this.xhr) {
            return;
          }if (this.hasXDR()) {
            this.xhr.onload = this.xhr.onerror = empty;
          } else {
            this.xhr.onreadystatechange = empty;
          }if (fromError) {
            try {
              this.xhr.abort();
            } catch (e) {}
          }if (global.document) {
            delete Request.requests[this.index];
          }this.xhr = null;
        };Request.prototype.onLoad = function () {
          var data;try {
            var contentType;try {
              contentType = this.xhr.getResponseHeader("Content-Type").split(";")[0];
            } catch (e) {}if (contentType === "application/octet-stream") {
              data = this.xhr.response;
            } else {
              if (!this.supportsBinary) {
                data = this.xhr.responseText;
              } else {
                try {
                  data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
                } catch (e) {
                  var ui8Arr = new Uint8Array(this.xhr.response);var dataArray = [];for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
                    dataArray.push(ui8Arr[idx]);
                  }data = String.fromCharCode.apply(null, dataArray);
                }
              }
            }
          } catch (e) {
            this.onError(e);
          }if (null != data) {
            this.onData(data);
          }
        };Request.prototype.hasXDR = function () {
          return "undefined" !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
        };Request.prototype.abort = function () {
          this.cleanup();
        };if (global.document) {
          Request.requestsCount = 0;Request.requests = {};if (global.attachEvent) {
            global.attachEvent("onunload", unloadHandler);
          } else if (global.addEventListener) {
            global.addEventListener("beforeunload", unloadHandler, false);
          }
        }function unloadHandler() {
          for (var i in Request.requests) {
            if (Request.requests.hasOwnProperty(i)) {
              Request.requests[i].abort();
            }
          }
        }
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { "./polling": 8, "component-emitter": 15, "component-inherit": 16, debug: 17, "xmlhttprequest-ssl": 10 }], 8: [function (_dereq_, module, exports) {
      var Transport = _dereq_("../transport");var parseqs = _dereq_("parseqs");var parser = _dereq_("engine.io-parser");var inherit = _dereq_("component-inherit");var yeast = _dereq_("yeast");var debug = _dereq_("debug")("engine.io-client:polling");module.exports = Polling;var hasXHR2 = function () {
        var XMLHttpRequest = _dereq_("xmlhttprequest-ssl");var xhr = new XMLHttpRequest({ xdomain: false });return null != xhr.responseType;
      }();function Polling(opts) {
        var forceBase64 = opts && opts.forceBase64;if (!hasXHR2 || forceBase64) {
          this.supportsBinary = false;
        }Transport.call(this, opts);
      }inherit(Polling, Transport);Polling.prototype.name = "polling";Polling.prototype.doOpen = function () {
        this.poll();
      };Polling.prototype.pause = function (onPause) {
        var pending = 0;var self = this;this.readyState = "pausing";function pause() {
          debug("paused");self.readyState = "paused";onPause();
        }if (this.polling || !this.writable) {
          var total = 0;if (this.polling) {
            debug("we are currently polling - waiting to pause");total++;this.once("pollComplete", function () {
              debug("pre-pause polling complete");--total || pause();
            });
          }if (!this.writable) {
            debug("we are currently writing - waiting to pause");total++;this.once("drain", function () {
              debug("pre-pause writing complete");--total || pause();
            });
          }
        } else {
          pause();
        }
      };Polling.prototype.poll = function () {
        debug("polling");this.polling = true;this.doPoll();this.emit("poll");
      };Polling.prototype.onData = function (data) {
        var self = this;debug("polling got data %s", data);var callback = function callback(packet, index, total) {
          if ("opening" == self.readyState) {
            self.onOpen();
          }if ("close" == packet.type) {
            self.onClose();return false;
          }self.onPacket(packet);
        };parser.decodePayload(data, this.socket.binaryType, callback);if ("closed" != this.readyState) {
          this.polling = false;this.emit("pollComplete");if ("open" == this.readyState) {
            this.poll();
          } else {
            debug('ignoring poll - transport state "%s"', this.readyState);
          }
        }
      };Polling.prototype.doClose = function () {
        var self = this;function close() {
          debug("writing close packet");self.write([{ type: "close" }]);
        }if ("open" == this.readyState) {
          debug("transport open - closing");close();
        } else {
          debug("transport not open - deferring close");this.once("open", close);
        }
      };Polling.prototype.write = function (packets) {
        var self = this;this.writable = false;var callbackfn = function callbackfn() {
          self.writable = true;self.emit("drain");
        };var self = this;parser.encodePayload(packets, this.supportsBinary, function (data) {
          self.doWrite(data, callbackfn);
        });
      };Polling.prototype.uri = function () {
        var query = this.query || {};var schema = this.secure ? "https" : "http";var port = "";if (false !== this.timestampRequests) {
          query[this.timestampParam] = yeast();
        }if (!this.supportsBinary && !query.sid) {
          query.b64 = 1;
        }query = parseqs.encode(query);if (this.port && ("https" == schema && this.port != 443 || "http" == schema && this.port != 80)) {
          port = ":" + this.port;
        }if (query.length) {
          query = "?" + query;
        }var ipv6 = this.hostname.indexOf(":") !== -1;return schema + "://" + (ipv6 ? "[" + this.hostname + "]" : this.hostname) + port + this.path + query;
      };
    }, { "../transport": 4, "component-inherit": 16, debug: 17, "engine.io-parser": 19, parseqs: 27, "xmlhttprequest-ssl": 10, yeast: 30 }], 9: [function (_dereq_, module, exports) {
      (function (global) {
        var Transport = _dereq_("../transport");var parser = _dereq_("engine.io-parser");var parseqs = _dereq_("parseqs");var inherit = _dereq_("component-inherit");var yeast = _dereq_("yeast");var debug = _dereq_("debug")("engine.io-client:websocket");var BrowserWebSocket = global.WebSocket || global.MozWebSocket;var WebSocket = BrowserWebSocket || (typeof window !== "undefined" ? null : _dereq_("ws"));module.exports = WS;function WS(opts) {
          var forceBase64 = opts && opts.forceBase64;if (forceBase64) {
            this.supportsBinary = false;
          }this.perMessageDeflate = opts.perMessageDeflate;Transport.call(this, opts);
        }inherit(WS, Transport);WS.prototype.name = "websocket";WS.prototype.supportsBinary = true;WS.prototype.doOpen = function () {
          if (!this.check()) {
            return;
          }var self = this;var uri = this.uri();var protocols = void 0;var opts = { agent: this.agent, perMessageDeflate: this.perMessageDeflate };opts.pfx = this.pfx;opts.key = this.key;opts.passphrase = this.passphrase;opts.cert = this.cert;opts.ca = this.ca;opts.ciphers = this.ciphers;opts.rejectUnauthorized = this.rejectUnauthorized;if (this.extraHeaders) {
            opts.headers = this.extraHeaders;
          }this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);if (this.ws.binaryType === undefined) {
            this.supportsBinary = false;
          }if (this.ws.supports && this.ws.supports.binary) {
            this.supportsBinary = true;this.ws.binaryType = "buffer";
          } else {
            this.ws.binaryType = "arraybuffer";
          }this.addEventListeners();
        };WS.prototype.addEventListeners = function () {
          var self = this;this.ws.onopen = function () {
            self.onOpen();
          };this.ws.onclose = function () {
            self.onClose();
          };this.ws.onmessage = function (ev) {
            self.onData(ev.data);
          };this.ws.onerror = function (e) {
            self.onError("websocket error", e);
          };
        };if ("undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
          WS.prototype.onData = function (data) {
            var self = this;setTimeout(function () {
              Transport.prototype.onData.call(self, data);
            }, 0);
          };
        }WS.prototype.write = function (packets) {
          var self = this;this.writable = false;var total = packets.length;for (var i = 0, l = total; i < l; i++) {
            (function (packet) {
              parser.encodePacket(packet, self.supportsBinary, function (data) {
                if (!BrowserWebSocket) {
                  var opts = {};if (packet.options) {
                    opts.compress = packet.options.compress;
                  }if (self.perMessageDeflate) {
                    var len = "string" == typeof data ? global.Buffer.byteLength(data) : data.length;if (len < self.perMessageDeflate.threshold) {
                      opts.compress = false;
                    }
                  }
                }try {
                  if (BrowserWebSocket) {
                    self.ws.send(data);
                  } else {
                    self.ws.send(data, opts);
                  }
                } catch (e) {
                  debug("websocket closed before onclose event");
                }--total || done();
              });
            })(packets[i]);
          }function done() {
            self.emit("flush");setTimeout(function () {
              self.writable = true;self.emit("drain");
            }, 0);
          }
        };WS.prototype.onClose = function () {
          Transport.prototype.onClose.call(this);
        };WS.prototype.doClose = function () {
          if (typeof this.ws !== "undefined") {
            this.ws.close();
          }
        };WS.prototype.uri = function () {
          var query = this.query || {};var schema = this.secure ? "wss" : "ws";var port = "";if (this.port && ("wss" == schema && this.port != 443 || "ws" == schema && this.port != 80)) {
            port = ":" + this.port;
          }if (this.timestampRequests) {
            query[this.timestampParam] = yeast();
          }if (!this.supportsBinary) {
            query.b64 = 1;
          }query = parseqs.encode(query);if (query.length) {
            query = "?" + query;
          }var ipv6 = this.hostname.indexOf(":") !== -1;return schema + "://" + (ipv6 ? "[" + this.hostname + "]" : this.hostname) + port + this.path + query;
        };WS.prototype.check = function () {
          return !!WebSocket && !("__initialize" in WebSocket && this.name === WS.prototype.name);
        };
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { "../transport": 4, "component-inherit": 16, debug: 17, "engine.io-parser": 19, parseqs: 27, ws: undefined, yeast: 30 }], 10: [function (_dereq_, module, exports) {
      var hasCORS = _dereq_("has-cors");module.exports = function (opts) {
        var xdomain = opts.xdomain;var xscheme = opts.xscheme;var enablesXDR = opts.enablesXDR;try {
          if ("undefined" != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
            return new XMLHttpRequest();
          }
        } catch (e) {}try {
          if ("undefined" != typeof XDomainRequest && !xscheme && enablesXDR) {
            return new XDomainRequest();
          }
        } catch (e) {}if (!xdomain) {
          try {
            return new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {}
        }
      };
    }, { "has-cors": 22 }], 11: [function (_dereq_, module, exports) {
      module.exports = after;function after(count, callback, err_cb) {
        var bail = false;err_cb = err_cb || noop;proxy.count = count;return count === 0 ? callback() : proxy;function proxy(err, result) {
          if (proxy.count <= 0) {
            throw new Error("after called too many times");
          }--proxy.count;if (err) {
            bail = true;callback(err);callback = err_cb;
          } else if (proxy.count === 0 && !bail) {
            callback(null, result);
          }
        }
      }function noop() {}
    }, {}], 12: [function (_dereq_, module, exports) {
      module.exports = function (arraybuffer, start, end) {
        var bytes = arraybuffer.byteLength;start = start || 0;end = end || bytes;if (arraybuffer.slice) {
          return arraybuffer.slice(start, end);
        }if (start < 0) {
          start += bytes;
        }if (end < 0) {
          end += bytes;
        }if (end > bytes) {
          end = bytes;
        }if (start >= bytes || start >= end || bytes === 0) {
          return new ArrayBuffer(0);
        }var abv = new Uint8Array(arraybuffer);var result = new Uint8Array(end - start);for (var i = start, ii = 0; i < end; i++, ii++) {
          result[ii] = abv[i];
        }return result.buffer;
      };
    }, {}], 13: [function (_dereq_, module, exports) {
      (function (chars) {
        "use strict";
        exports.encode = function (arraybuffer) {
          var bytes = new Uint8Array(arraybuffer),
              i,
              len = bytes.length,
              base64 = "";for (i = 0; i < len; i += 3) {
            base64 += chars[bytes[i] >> 2];base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
            base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];base64 += chars[bytes[i + 2] & 63];
          }if (len % 3 === 2) {
            base64 = base64.substring(0, base64.length - 1) + "=";
          } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + "==";
          }return base64;
        };exports.decode = function (base64) {
          var bufferLength = base64.length * .75,
              len = base64.length,
              i,
              p = 0,
              encoded1,
              encoded2,
              encoded3,
              encoded4;if (base64[base64.length - 1] === "=") {
            bufferLength--;if (base64[base64.length - 2] === "=") {
              bufferLength--;
            }
          }var arraybuffer = new ArrayBuffer(bufferLength),
              bytes = new Uint8Array(arraybuffer);for (i = 0; i < len; i += 4) {
            encoded1 = chars.indexOf(base64[i]);encoded2 = chars.indexOf(base64[i + 1]);encoded3 = chars.indexOf(base64[i + 2]);encoded4 = chars.indexOf(base64[i + 3]);bytes[p++] = encoded1 << 2 | encoded2 >> 4;bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
          }return arraybuffer;
        };
      })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
    }, {}], 14: [function (_dereq_, module, exports) {
      (function (global) {
        var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MSBlobBuilder || global.MozBlobBuilder;var blobSupported = function () {
          try {
            var a = new Blob(["hi"]);return a.size === 2;
          } catch (e) {
            return false;
          }
        }();var blobSupportsArrayBufferView = blobSupported && function () {
          try {
            var b = new Blob([new Uint8Array([1, 2])]);return b.size === 2;
          } catch (e) {
            return false;
          }
        }();var blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;function mapArrayBufferViews(ary) {
          for (var i = 0; i < ary.length; i++) {
            var chunk = ary[i];if (chunk.buffer instanceof ArrayBuffer) {
              var buf = chunk.buffer;if (chunk.byteLength !== buf.byteLength) {
                var copy = new Uint8Array(chunk.byteLength);copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));buf = copy.buffer;
              }ary[i] = buf;
            }
          }
        }function BlobBuilderConstructor(ary, options) {
          options = options || {};var bb = new BlobBuilder();mapArrayBufferViews(ary);for (var i = 0; i < ary.length; i++) {
            bb.append(ary[i]);
          }return options.type ? bb.getBlob(options.type) : bb.getBlob();
        }function BlobConstructor(ary, options) {
          mapArrayBufferViews(ary);return new Blob(ary, options || {});
        }module.exports = function () {
          if (blobSupported) {
            return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
          } else if (blobBuilderSupported) {
            return BlobBuilderConstructor;
          } else {
            return undefined;
          }
        }();
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, {}], 15: [function (_dereq_, module, exports) {
      module.exports = Emitter;function Emitter(obj) {
        if (obj) return mixin(obj);
      }function mixin(obj) {
        for (var key in Emitter.prototype) {
          obj[key] = Emitter.prototype[key];
        }return obj;
      }Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
        this._callbacks = this._callbacks || {};(this._callbacks[event] = this._callbacks[event] || []).push(fn);return this;
      };Emitter.prototype.once = function (event, fn) {
        var self = this;this._callbacks = this._callbacks || {};function on() {
          self.off(event, on);fn.apply(this, arguments);
        }on.fn = fn;this.on(event, on);return this;
      };Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
        this._callbacks = this._callbacks || {};if (0 == arguments.length) {
          this._callbacks = {};return this;
        }var callbacks = this._callbacks[event];if (!callbacks) return this;if (1 == arguments.length) {
          delete this._callbacks[event];return this;
        }var cb;for (var i = 0; i < callbacks.length; i++) {
          cb = callbacks[i];if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1);break;
          }
        }return this;
      };Emitter.prototype.emit = function (event) {
        this._callbacks = this._callbacks || {};var args = [].slice.call(arguments, 1),
            callbacks = this._callbacks[event];if (callbacks) {
          callbacks = callbacks.slice(0);for (var i = 0, len = callbacks.length; i < len; ++i) {
            callbacks[i].apply(this, args);
          }
        }return this;
      };Emitter.prototype.listeners = function (event) {
        this._callbacks = this._callbacks || {};return this._callbacks[event] || [];
      };Emitter.prototype.hasListeners = function (event) {
        return !!this.listeners(event).length;
      };
    }, {}], 16: [function (_dereq_, module, exports) {
      module.exports = function (a, b) {
        var fn = function fn() {};fn.prototype = b.prototype;a.prototype = new fn();a.prototype.constructor = a;
      };
    }, {}], 17: [function (_dereq_, module, exports) {
      exports = module.exports = _dereq_("./debug");exports.log = log;exports.formatArgs = formatArgs;exports.save = save;exports.load = load;exports.useColors = useColors;exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();exports.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"];function useColors() {
        return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
      }exports.formatters.j = function (v) {
        return JSON.stringify(v);
      };function formatArgs() {
        var args = arguments;var useColors = this.useColors;args[0] = (useColors ? "%c" : "") + this.namespace + (useColors ? " %c" : " ") + args[0] + (useColors ? "%c " : " ") + "+" + exports.humanize(this.diff);if (!useColors) return args;var c = "color: " + this.color;args = [args[0], c, "color: inherit"].concat(Array.prototype.slice.call(args, 1));var index = 0;var lastC = 0;args[0].replace(/%[a-z%]/g, function (match) {
          if ("%%" === match) return;index++;if ("%c" === match) {
            lastC = index;
          }
        });args.splice(lastC, 0, c);return args;
      }function log() {
        return "object" === (typeof console === "undefined" ? "undefined" : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
      }function save(namespaces) {
        try {
          if (null == namespaces) {
            exports.storage.removeItem("debug");
          } else {
            exports.storage.debug = namespaces;
          }
        } catch (e) {}
      }function load() {
        var r;try {
          r = exports.storage.debug;
        } catch (e) {}return r;
      }exports.enable(load());function localstorage() {
        try {
          return window.localStorage;
        } catch (e) {}
      }
    }, { "./debug": 18 }], 18: [function (_dereq_, module, exports) {
      exports = module.exports = debug;exports.coerce = coerce;exports.disable = disable;exports.enable = enable;exports.enabled = enabled;exports.humanize = _dereq_("ms");exports.names = [];exports.skips = [];exports.formatters = {};var prevColor = 0;var prevTime;function selectColor() {
        return exports.colors[prevColor++ % exports.colors.length];
      }function debug(namespace) {
        function disabled() {}disabled.enabled = false;function enabled() {
          var self = enabled;var curr = +new Date();var ms = curr - (prevTime || curr);self.diff = ms;self.prev = prevTime;self.curr = curr;prevTime = curr;if (null == self.useColors) self.useColors = exports.useColors();if (null == self.color && self.useColors) self.color = selectColor();var args = Array.prototype.slice.call(arguments);args[0] = exports.coerce(args[0]);if ("string" !== typeof args[0]) {
            args = ["%o"].concat(args);
          }var index = 0;args[0] = args[0].replace(/%([a-z%])/g, function (match, format) {
            if (match === "%%") return match;index++;var formatter = exports.formatters[format];if ("function" === typeof formatter) {
              var val = args[index];match = formatter.call(self, val);args.splice(index, 1);index--;
            }return match;
          });if ("function" === typeof exports.formatArgs) {
            args = exports.formatArgs.apply(self, args);
          }var logFn = enabled.log || exports.log || console.log.bind(console);logFn.apply(self, args);
        }enabled.enabled = true;var fn = exports.enabled(namespace) ? enabled : disabled;fn.namespace = namespace;return fn;
      }function enable(namespaces) {
        exports.save(namespaces);var split = (namespaces || "").split(/[\s,]+/);var len = split.length;for (var i = 0; i < len; i++) {
          if (!split[i]) continue;namespaces = split[i].replace(/\*/g, ".*?");if (namespaces[0] === "-") {
            exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
          } else {
            exports.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }function disable() {
        exports.enable("");
      }function enabled(name) {
        var i, len;for (i = 0, len = exports.skips.length; i < len; i++) {
          if (exports.skips[i].test(name)) {
            return false;
          }
        }for (i = 0, len = exports.names.length; i < len; i++) {
          if (exports.names[i].test(name)) {
            return true;
          }
        }return false;
      }function coerce(val) {
        if (val instanceof Error) return val.stack || val.message;return val;
      }
    }, { ms: 25 }], 19: [function (_dereq_, module, exports) {
      (function (global) {
        var keys = _dereq_("./keys");var hasBinary = _dereq_("has-binary");var sliceBuffer = _dereq_("arraybuffer.slice");var base64encoder = _dereq_("base64-arraybuffer");var after = _dereq_("after");var utf8 = _dereq_("utf8");var isAndroid = navigator.userAgent.match(/Android/i);var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);var dontSendBlobs = isAndroid || isPhantomJS;exports.protocol = 3;var packets = exports.packets = { open: 0, close: 1, ping: 2, pong: 3, message: 4, upgrade: 5, noop: 6 };var packetslist = keys(packets);var err = { type: "error", data: "parser error" };var Blob = _dereq_("blob");exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
          if ("function" == typeof supportsBinary) {
            callback = supportsBinary;supportsBinary = false;
          }if ("function" == typeof utf8encode) {
            callback = utf8encode;utf8encode = null;
          }var data = packet.data === undefined ? undefined : packet.data.buffer || packet.data;if (global.ArrayBuffer && data instanceof ArrayBuffer) {
            return encodeArrayBuffer(packet, supportsBinary, callback);
          } else if (Blob && data instanceof global.Blob) {
            return encodeBlob(packet, supportsBinary, callback);
          }if (data && data.base64) {
            return encodeBase64Object(packet, callback);
          }var encoded = packets[packet.type];if (undefined !== packet.data) {
            encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
          }return callback("" + encoded);
        };function encodeBase64Object(packet, callback) {
          var message = "b" + exports.packets[packet.type] + packet.data.data;return callback(message);
        }function encodeArrayBuffer(packet, supportsBinary, callback) {
          if (!supportsBinary) {
            return exports.encodeBase64Packet(packet, callback);
          }var data = packet.data;var contentArray = new Uint8Array(data);var resultBuffer = new Uint8Array(1 + data.byteLength);resultBuffer[0] = packets[packet.type];for (var i = 0; i < contentArray.length; i++) {
            resultBuffer[i + 1] = contentArray[i];
          }return callback(resultBuffer.buffer);
        }function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
          if (!supportsBinary) {
            return exports.encodeBase64Packet(packet, callback);
          }var fr = new FileReader();fr.onload = function () {
            packet.data = fr.result;exports.encodePacket(packet, supportsBinary, true, callback);
          };return fr.readAsArrayBuffer(packet.data);
        }function encodeBlob(packet, supportsBinary, callback) {
          if (!supportsBinary) {
            return exports.encodeBase64Packet(packet, callback);
          }if (dontSendBlobs) {
            return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
          }var length = new Uint8Array(1);length[0] = packets[packet.type];var blob = new Blob([length.buffer, packet.data]);return callback(blob);
        }exports.encodeBase64Packet = function (packet, callback) {
          var message = "b" + exports.packets[packet.type];if (Blob && packet.data instanceof global.Blob) {
            var fr = new FileReader();fr.onload = function () {
              var b64 = fr.result.split(",")[1];callback(message + b64);
            };return fr.readAsDataURL(packet.data);
          }var b64data;try {
            b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
          } catch (e) {
            var typed = new Uint8Array(packet.data);var basic = new Array(typed.length);for (var i = 0; i < typed.length; i++) {
              basic[i] = typed[i];
            }b64data = String.fromCharCode.apply(null, basic);
          }message += global.btoa(b64data);return callback(message);
        };exports.decodePacket = function (data, binaryType, utf8decode) {
          if (typeof data == "string" || data === undefined) {
            if (data.charAt(0) == "b") {
              return exports.decodeBase64Packet(data.substr(1), binaryType);
            }if (utf8decode) {
              try {
                data = utf8.decode(data);
              } catch (e) {
                return err;
              }
            }var type = data.charAt(0);if (Number(type) != type || !packetslist[type]) {
              return err;
            }if (data.length > 1) {
              return { type: packetslist[type], data: data.substring(1) };
            } else {
              return { type: packetslist[type] };
            }
          }var asArray = new Uint8Array(data);var type = asArray[0];var rest = sliceBuffer(data, 1);if (Blob && binaryType === "blob") {
            rest = new Blob([rest]);
          }return { type: packetslist[type], data: rest };
        };exports.decodeBase64Packet = function (msg, binaryType) {
          var type = packetslist[msg.charAt(0)];if (!global.ArrayBuffer) {
            return { type: type, data: { base64: true, data: msg.substr(1) } };
          }var data = base64encoder.decode(msg.substr(1));if (binaryType === "blob" && Blob) {
            data = new Blob([data]);
          }return { type: type, data: data };
        };exports.encodePayload = function (packets, supportsBinary, callback) {
          if (typeof supportsBinary == "function") {
            callback = supportsBinary;supportsBinary = null;
          }var isBinary = hasBinary(packets);if (supportsBinary && isBinary) {
            if (Blob && !dontSendBlobs) {
              return exports.encodePayloadAsBlob(packets, callback);
            }return exports.encodePayloadAsArrayBuffer(packets, callback);
          }if (!packets.length) {
            return callback("0:");
          }function setLengthHeader(message) {
            return message.length + ":" + message;
          }function encodeOne(packet, doneCallback) {
            exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function (message) {
              doneCallback(null, setLengthHeader(message));
            });
          }map(packets, encodeOne, function (err, results) {
            return callback(results.join(""));
          });
        };function map(ary, each, done) {
          var result = new Array(ary.length);var next = after(ary.length, done);var eachWithIndex = function eachWithIndex(i, el, cb) {
            each(el, function (error, msg) {
              result[i] = msg;cb(error, result);
            });
          };for (var i = 0; i < ary.length; i++) {
            eachWithIndex(i, ary[i], next);
          }
        }exports.decodePayload = function (data, binaryType, callback) {
          if (typeof data != "string") {
            return exports.decodePayloadAsBinary(data, binaryType, callback);
          }if (typeof binaryType === "function") {
            callback = binaryType;binaryType = null;
          }var packet;if (data == "") {
            return callback(err, 0, 1);
          }var length = "",
              n,
              msg;for (var i = 0, l = data.length; i < l; i++) {
            var chr = data.charAt(i);if (":" != chr) {
              length += chr;
            } else {
              if ("" == length || length != (n = Number(length))) {
                return callback(err, 0, 1);
              }msg = data.substr(i + 1, n);if (length != msg.length) {
                return callback(err, 0, 1);
              }if (msg.length) {
                packet = exports.decodePacket(msg, binaryType, true);if (err.type == packet.type && err.data == packet.data) {
                  return callback(err, 0, 1);
                }var ret = callback(packet, i + n, l);if (false === ret) return;
              }i += n;length = "";
            }
          }if (length != "") {
            return callback(err, 0, 1);
          }
        };exports.encodePayloadAsArrayBuffer = function (packets, callback) {
          if (!packets.length) {
            return callback(new ArrayBuffer(0));
          }function encodeOne(packet, doneCallback) {
            exports.encodePacket(packet, true, true, function (data) {
              return doneCallback(null, data);
            });
          }map(packets, encodeOne, function (err, encodedPackets) {
            var totalLength = encodedPackets.reduce(function (acc, p) {
              var len;if (typeof p === "string") {
                len = p.length;
              } else {
                len = p.byteLength;
              }return acc + len.toString().length + len + 2;
            }, 0);var resultArray = new Uint8Array(totalLength);var bufferIndex = 0;encodedPackets.forEach(function (p) {
              var isString = typeof p === "string";var ab = p;if (isString) {
                var view = new Uint8Array(p.length);for (var i = 0; i < p.length; i++) {
                  view[i] = p.charCodeAt(i);
                }ab = view.buffer;
              }if (isString) {
                resultArray[bufferIndex++] = 0;
              } else {
                resultArray[bufferIndex++] = 1;
              }var lenStr = ab.byteLength.toString();for (var i = 0; i < lenStr.length; i++) {
                resultArray[bufferIndex++] = parseInt(lenStr[i]);
              }resultArray[bufferIndex++] = 255;var view = new Uint8Array(ab);for (var i = 0; i < view.length; i++) {
                resultArray[bufferIndex++] = view[i];
              }
            });return callback(resultArray.buffer);
          });
        };exports.encodePayloadAsBlob = function (packets, callback) {
          function encodeOne(packet, doneCallback) {
            exports.encodePacket(packet, true, true, function (encoded) {
              var binaryIdentifier = new Uint8Array(1);binaryIdentifier[0] = 1;if (typeof encoded === "string") {
                var view = new Uint8Array(encoded.length);for (var i = 0; i < encoded.length; i++) {
                  view[i] = encoded.charCodeAt(i);
                }encoded = view.buffer;binaryIdentifier[0] = 0;
              }var len = encoded instanceof ArrayBuffer ? encoded.byteLength : encoded.size;var lenStr = len.toString();var lengthAry = new Uint8Array(lenStr.length + 1);for (var i = 0; i < lenStr.length; i++) {
                lengthAry[i] = parseInt(lenStr[i]);
              }lengthAry[lenStr.length] = 255;if (Blob) {
                var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);doneCallback(null, blob);
              }
            });
          }map(packets, encodeOne, function (err, results) {
            return callback(new Blob(results));
          });
        };exports.decodePayloadAsBinary = function (data, binaryType, callback) {
          if (typeof binaryType === "function") {
            callback = binaryType;binaryType = null;
          }var bufferTail = data;var buffers = [];var numberTooLong = false;while (bufferTail.byteLength > 0) {
            var tailArray = new Uint8Array(bufferTail);var isString = tailArray[0] === 0;var msgLength = "";for (var i = 1;; i++) {
              if (tailArray[i] == 255) break;if (msgLength.length > 310) {
                numberTooLong = true;break;
              }msgLength += tailArray[i];
            }if (numberTooLong) return callback(err, 0, 1);bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);msgLength = parseInt(msgLength);var msg = sliceBuffer(bufferTail, 0, msgLength);if (isString) {
              try {
                msg = String.fromCharCode.apply(null, new Uint8Array(msg));
              } catch (e) {
                var typed = new Uint8Array(msg);msg = "";for (var i = 0; i < typed.length; i++) {
                  msg += String.fromCharCode(typed[i]);
                }
              }
            }buffers.push(msg);bufferTail = sliceBuffer(bufferTail, msgLength);
          }var total = buffers.length;buffers.forEach(function (buffer, i) {
            callback(exports.decodePacket(buffer, binaryType, true), i, total);
          });
        };
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { "./keys": 20, after: 11, "arraybuffer.slice": 12, "base64-arraybuffer": 13, blob: 14, "has-binary": 21, utf8: 29 }], 20: [function (_dereq_, module, exports) {
      module.exports = Object.keys || function keys(obj) {
        var arr = [];var has = Object.prototype.hasOwnProperty;for (var i in obj) {
          if (has.call(obj, i)) {
            arr.push(i);
          }
        }return arr;
      };
    }, {}], 21: [function (_dereq_, module, exports) {
      (function (global) {
        var isArray = _dereq_("isarray");module.exports = hasBinary;function hasBinary(data) {
          function _hasBinary(obj) {
            if (!obj) return false;if (global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
              return true;
            }if (isArray(obj)) {
              for (var i = 0; i < obj.length; i++) {
                if (_hasBinary(obj[i])) {
                  return true;
                }
              }
            } else if (obj && "object" == (typeof obj === "undefined" ? "undefined" : _typeof(obj))) {
              if (obj.toJSON) {
                obj = obj.toJSON();
              }for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
                  return true;
                }
              }
            }return false;
          }return _hasBinary(data);
        }
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { isarray: 24 }], 22: [function (_dereq_, module, exports) {
      try {
        module.exports = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
      } catch (err) {
        module.exports = false;
      }
    }, {}], 23: [function (_dereq_, module, exports) {
      var indexOf = [].indexOf;module.exports = function (arr, obj) {
        if (indexOf) return arr.indexOf(obj);for (var i = 0; i < arr.length; ++i) {
          if (arr[i] === obj) return i;
        }return -1;
      };
    }, {}], 24: [function (_dereq_, module, exports) {
      module.exports = Array.isArray || function (arr) {
        return Object.prototype.toString.call(arr) == "[object Array]";
      };
    }, {}], 25: [function (_dereq_, module, exports) {
      var s = 1e3;var m = s * 60;var h = m * 60;var d = h * 24;var y = d * 365.25;module.exports = function (val, options) {
        options = options || {};if ("string" == typeof val) return parse(val);return options.long ? long(val) : short(val);
      };function parse(str) {
        str = "" + str;if (str.length > 1e4) return;var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);if (!match) return;var n = parseFloat(match[1]);var type = (match[2] || "ms").toLowerCase();switch (type) {case "years":case "year":case "yrs":case "yr":case "y":
            return n * y;case "days":case "day":case "d":
            return n * d;case "hours":case "hour":case "hrs":case "hr":case "h":
            return n * h;case "minutes":case "minute":case "mins":case "min":case "m":
            return n * m;case "seconds":case "second":case "secs":case "sec":case "s":
            return n * s;case "milliseconds":case "millisecond":case "msecs":case "msec":case "ms":
            return n;}
      }function short(ms) {
        if (ms >= d) return Math.round(ms / d) + "d";if (ms >= h) return Math.round(ms / h) + "h";if (ms >= m) return Math.round(ms / m) + "m";if (ms >= s) return Math.round(ms / s) + "s";return ms + "ms";
      }function long(ms) {
        return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
      }function plural(ms, n, name) {
        if (ms < n) return;if (ms < n * 1.5) return Math.floor(ms / n) + " " + name;return Math.ceil(ms / n) + " " + name + "s";
      }
    }, {}], 26: [function (_dereq_, module, exports) {
      (function (global) {
        var rvalidchars = /^[\],:{}\s]*$/;var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;var rtrimLeft = /^\s+/;var rtrimRight = /\s+$/;module.exports = function parsejson(data) {
          if ("string" != typeof data || !data) {
            return null;
          }data = data.replace(rtrimLeft, "").replace(rtrimRight, "");if (global.JSON && JSON.parse) {
            return JSON.parse(data);
          }if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
            return new Function("return " + data)();
          }
        };
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, {}], 27: [function (_dereq_, module, exports) {
      exports.encode = function (obj) {
        var str = "";for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (str.length) str += "&";str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
          }
        }return str;
      };exports.decode = function (qs) {
        var qry = {};var pairs = qs.split("&");for (var i = 0, l = pairs.length; i < l; i++) {
          var pair = pairs[i].split("=");qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }return qry;
      };
    }, {}], 28: [function (_dereq_, module, exports) {
      var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];module.exports = function parseuri(str) {
        var src = str,
            b = str.indexOf("["),
            e = str.indexOf("]");if (b != -1 && e != -1) {
          str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
        }var m = re.exec(str || ""),
            uri = {},
            i = 14;while (i--) {
          uri[parts[i]] = m[i] || "";
        }if (b != -1 && e != -1) {
          uri.source = src;uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");uri.ipv6uri = true;
        }return uri;
      };
    }, {}], 29: [function (_dereq_, module, exports) {
      (function (global) {
        (function (root) {
          var freeExports = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && exports;var freeModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object" && module && module.exports == freeExports && module;var freeGlobal = (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global;if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
            root = freeGlobal;
          }var stringFromCharCode = String.fromCharCode;function ucs2decode(string) {
            var output = [];var counter = 0;var length = string.length;var value;var extra;while (counter < length) {
              value = string.charCodeAt(counter++);if (value >= 55296 && value <= 56319 && counter < length) {
                extra = string.charCodeAt(counter++);if ((extra & 64512) == 56320) {
                  output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
                } else {
                  output.push(value);counter--;
                }
              } else {
                output.push(value);
              }
            }return output;
          }function ucs2encode(array) {
            var length = array.length;var index = -1;var value;var output = "";while (++index < length) {
              value = array[index];if (value > 65535) {
                value -= 65536;output += stringFromCharCode(value >>> 10 & 1023 | 55296);value = 56320 | value & 1023;
              }output += stringFromCharCode(value);
            }return output;
          }function checkScalarValue(codePoint) {
            if (codePoint >= 55296 && codePoint <= 57343) {
              throw Error("Lone surrogate U+" + codePoint.toString(16).toUpperCase() + " is not a scalar value");
            }
          }function createByte(codePoint, shift) {
            return stringFromCharCode(codePoint >> shift & 63 | 128);
          }function encodeCodePoint(codePoint) {
            if ((codePoint & 4294967168) == 0) {
              return stringFromCharCode(codePoint);
            }var symbol = "";if ((codePoint & 4294965248) == 0) {
              symbol = stringFromCharCode(codePoint >> 6 & 31 | 192);
            } else if ((codePoint & 4294901760) == 0) {
              checkScalarValue(codePoint);symbol = stringFromCharCode(codePoint >> 12 & 15 | 224);symbol += createByte(codePoint, 6);
            } else if ((codePoint & 4292870144) == 0) {
              symbol = stringFromCharCode(codePoint >> 18 & 7 | 240);symbol += createByte(codePoint, 12);symbol += createByte(codePoint, 6);
            }symbol += stringFromCharCode(codePoint & 63 | 128);return symbol;
          }function utf8encode(string) {
            var codePoints = ucs2decode(string);var length = codePoints.length;var index = -1;var codePoint;var byteString = "";while (++index < length) {
              codePoint = codePoints[index];byteString += encodeCodePoint(codePoint);
            }return byteString;
          }function readContinuationByte() {
            if (byteIndex >= byteCount) {
              throw Error("Invalid byte index");
            }var continuationByte = byteArray[byteIndex] & 255;byteIndex++;if ((continuationByte & 192) == 128) {
              return continuationByte & 63;
            }throw Error("Invalid continuation byte");
          }function decodeSymbol() {
            var byte1;var byte2;var byte3;var byte4;var codePoint;if (byteIndex > byteCount) {
              throw Error("Invalid byte index");
            }if (byteIndex == byteCount) {
              return false;
            }byte1 = byteArray[byteIndex] & 255;byteIndex++;if ((byte1 & 128) == 0) {
              return byte1;
            }if ((byte1 & 224) == 192) {
              var byte2 = readContinuationByte();codePoint = (byte1 & 31) << 6 | byte2;if (codePoint >= 128) {
                return codePoint;
              } else {
                throw Error("Invalid continuation byte");
              }
            }if ((byte1 & 240) == 224) {
              byte2 = readContinuationByte();byte3 = readContinuationByte();codePoint = (byte1 & 15) << 12 | byte2 << 6 | byte3;if (codePoint >= 2048) {
                checkScalarValue(codePoint);return codePoint;
              } else {
                throw Error("Invalid continuation byte");
              }
            }if ((byte1 & 248) == 240) {
              byte2 = readContinuationByte();byte3 = readContinuationByte();byte4 = readContinuationByte();codePoint = (byte1 & 15) << 18 | byte2 << 12 | byte3 << 6 | byte4;if (codePoint >= 65536 && codePoint <= 1114111) {
                return codePoint;
              }
            }throw Error("Invalid UTF-8 detected");
          }var byteArray;var byteCount;var byteIndex;function utf8decode(byteString) {
            byteArray = ucs2decode(byteString);byteCount = byteArray.length;byteIndex = 0;var codePoints = [];var tmp;while ((tmp = decodeSymbol()) !== false) {
              codePoints.push(tmp);
            }return ucs2encode(codePoints);
          }var utf8 = { version: "2.0.0", encode: utf8encode, decode: utf8decode };if (typeof define == "function" && _typeof(define.amd) == "object" && define.amd) {
            define(function () {
              return utf8;
            });
          } else if (freeExports && !freeExports.nodeType) {
            if (freeModule) {
              freeModule.exports = utf8;
            } else {
              var object = {};var hasOwnProperty = object.hasOwnProperty;for (var key in utf8) {
                hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
              }
            }
          } else {
            root.utf8 = utf8;
          }
        })(this);
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, {}], 30: [function (_dereq_, module, exports) {
      "use strict";
      var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),
          length = 64,
          map = {},
          seed = 0,
          i = 0,
          prev;function encode(num) {
        var encoded = "";do {
          encoded = alphabet[num % length] + encoded;num = Math.floor(num / length);
        } while (num > 0);return encoded;
      }function decode(str) {
        var decoded = 0;for (i = 0; i < str.length; i++) {
          decoded = decoded * length + map[str.charAt(i)];
        }return decoded;
      }function yeast() {
        var now = encode(+new Date());if (now !== prev) return seed = 0, prev = now;return now + "." + encode(seed++);
      }for (; i < length; i++) {
        map[alphabet[i]] = i;
      }yeast.encode = encode;yeast.decode = decode;module.exports = yeast;
    }, {}], 31: [function (_dereq_, module, exports) {
      var url = _dereq_("./url");var parser = _dereq_("socket.io-parser");var Manager = _dereq_("./manager");var debug = _dereq_("debug")("socket.io-client");module.exports = exports = lookup;var cache = exports.managers = {};function lookup(uri, opts) {
        if ((typeof uri === "undefined" ? "undefined" : _typeof(uri)) == "object") {
          opts = uri;uri = undefined;
        }opts = opts || {};var parsed = url(uri);var source = parsed.source;var id = parsed.id;var path = parsed.path;var sameNamespace = cache[id] && path in cache[id].nsps;var newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;var io;if (newConnection) {
          debug("ignoring socket cache for %s", source);io = Manager(source, opts);
        } else {
          if (!cache[id]) {
            debug("new io instance for %s", source);cache[id] = Manager(source, opts);
          }io = cache[id];
        }return io.socket(parsed.path);
      }exports.protocol = parser.protocol;exports.connect = lookup;exports.Manager = _dereq_("./manager");exports.Socket = _dereq_("./socket");
    }, { "./manager": 32, "./socket": 34, "./url": 35, debug: 39, "socket.io-parser": 47 }], 32: [function (_dereq_, module, exports) {
      var eio = _dereq_("engine.io-client");var Socket = _dereq_("./socket");var Emitter = _dereq_("component-emitter");var parser = _dereq_("socket.io-parser");var on = _dereq_("./on");var bind = _dereq_("component-bind");var debug = _dereq_("debug")("socket.io-client:manager");var indexOf = _dereq_("indexof");var Backoff = _dereq_("backo2");var has = Object.prototype.hasOwnProperty;module.exports = Manager;function Manager(uri, opts) {
        if (!(this instanceof Manager)) return new Manager(uri, opts);if (uri && "object" == (typeof uri === "undefined" ? "undefined" : _typeof(uri))) {
          opts = uri;uri = undefined;
        }opts = opts || {};opts.path = opts.path || "/socket.io";this.nsps = {};this.subs = [];this.opts = opts;this.reconnection(opts.reconnection !== false);this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);this.reconnectionDelay(opts.reconnectionDelay || 1e3);this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);this.randomizationFactor(opts.randomizationFactor || .5);this.backoff = new Backoff({ min: this.reconnectionDelay(), max: this.reconnectionDelayMax(), jitter: this.randomizationFactor() });this.timeout(null == opts.timeout ? 2e4 : opts.timeout);this.readyState = "closed";this.uri = uri;this.connecting = [];this.lastPing = null;this.encoding = false;this.packetBuffer = [];this.encoder = new parser.Encoder();this.decoder = new parser.Decoder();this.autoConnect = opts.autoConnect !== false;if (this.autoConnect) this.open();
      }Manager.prototype.emitAll = function () {
        this.emit.apply(this, arguments);for (var nsp in this.nsps) {
          if (has.call(this.nsps, nsp)) {
            this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
          }
        }
      };Manager.prototype.updateSocketIds = function () {
        for (var nsp in this.nsps) {
          if (has.call(this.nsps, nsp)) {
            this.nsps[nsp].id = this.engine.id;
          }
        }
      };Emitter(Manager.prototype);Manager.prototype.reconnection = function (v) {
        if (!arguments.length) return this._reconnection;this._reconnection = !!v;return this;
      };Manager.prototype.reconnectionAttempts = function (v) {
        if (!arguments.length) return this._reconnectionAttempts;this._reconnectionAttempts = v;return this;
      };Manager.prototype.reconnectionDelay = function (v) {
        if (!arguments.length) return this._reconnectionDelay;this._reconnectionDelay = v;this.backoff && this.backoff.setMin(v);return this;
      };Manager.prototype.randomizationFactor = function (v) {
        if (!arguments.length) return this._randomizationFactor;this._randomizationFactor = v;this.backoff && this.backoff.setJitter(v);return this;
      };Manager.prototype.reconnectionDelayMax = function (v) {
        if (!arguments.length) return this._reconnectionDelayMax;this._reconnectionDelayMax = v;this.backoff && this.backoff.setMax(v);return this;
      };Manager.prototype.timeout = function (v) {
        if (!arguments.length) return this._timeout;this._timeout = v;return this;
      };Manager.prototype.maybeReconnectOnOpen = function () {
        if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
          this.reconnect();
        }
      };Manager.prototype.open = Manager.prototype.connect = function (fn) {
        debug("readyState %s", this.readyState);if (~this.readyState.indexOf("open")) return this;debug("opening %s", this.uri);this.engine = eio(this.uri, this.opts);var socket = this.engine;var self = this;this.readyState = "opening";this.skipReconnect = false;var openSub = on(socket, "open", function () {
          self.onopen();fn && fn();
        });var errorSub = on(socket, "error", function (data) {
          debug("connect_error");self.cleanup();self.readyState = "closed";self.emitAll("connect_error", data);if (fn) {
            var err = new Error("Connection error");err.data = data;fn(err);
          } else {
            self.maybeReconnectOnOpen();
          }
        });if (false !== this._timeout) {
          var timeout = this._timeout;debug("connect attempt will timeout after %d", timeout);var timer = setTimeout(function () {
            debug("connect attempt timed out after %d", timeout);openSub.destroy();socket.close();socket.emit("error", "timeout");self.emitAll("connect_timeout", timeout);
          }, timeout);this.subs.push({ destroy: function destroy() {
              clearTimeout(timer);
            } });
        }this.subs.push(openSub);this.subs.push(errorSub);return this;
      };Manager.prototype.onopen = function () {
        debug("open");this.cleanup();this.readyState = "open";this.emit("open");var socket = this.engine;this.subs.push(on(socket, "data", bind(this, "ondata")));this.subs.push(on(socket, "ping", bind(this, "onping")));this.subs.push(on(socket, "pong", bind(this, "onpong")));this.subs.push(on(socket, "error", bind(this, "onerror")));this.subs.push(on(socket, "close", bind(this, "onclose")));this.subs.push(on(this.decoder, "decoded", bind(this, "ondecoded")));
      };Manager.prototype.onping = function () {
        this.lastPing = new Date();this.emitAll("ping");
      };Manager.prototype.onpong = function () {
        this.emitAll("pong", new Date() - this.lastPing);
      };Manager.prototype.ondata = function (data) {
        this.decoder.add(data);
      };Manager.prototype.ondecoded = function (packet) {
        this.emit("packet", packet);
      };Manager.prototype.onerror = function (err) {
        debug("error", err);this.emitAll("error", err);
      };Manager.prototype.socket = function (nsp) {
        var socket = this.nsps[nsp];if (!socket) {
          socket = new Socket(this, nsp);this.nsps[nsp] = socket;var self = this;socket.on("connecting", onConnecting);socket.on("connect", function () {
            socket.id = self.engine.id;
          });if (this.autoConnect) {
            onConnecting();
          }
        }function onConnecting() {
          if (! ~indexOf(self.connecting, socket)) {
            self.connecting.push(socket);
          }
        }return socket;
      };Manager.prototype.destroy = function (socket) {
        var index = indexOf(this.connecting, socket);if (~index) this.connecting.splice(index, 1);if (this.connecting.length) return;this.close();
      };Manager.prototype.packet = function (packet) {
        debug("writing packet %j", packet);var self = this;if (!self.encoding) {
          self.encoding = true;this.encoder.encode(packet, function (encodedPackets) {
            for (var i = 0; i < encodedPackets.length; i++) {
              self.engine.write(encodedPackets[i], packet.options);
            }self.encoding = false;self.processPacketQueue();
          });
        } else {
          self.packetBuffer.push(packet);
        }
      };Manager.prototype.processPacketQueue = function () {
        if (this.packetBuffer.length > 0 && !this.encoding) {
          var pack = this.packetBuffer.shift();this.packet(pack);
        }
      };Manager.prototype.cleanup = function () {
        debug("cleanup");var sub;while (sub = this.subs.shift()) {
          sub.destroy();
        }this.packetBuffer = [];this.encoding = false;this.lastPing = null;this.decoder.destroy();
      };Manager.prototype.close = Manager.prototype.disconnect = function () {
        debug("disconnect");this.skipReconnect = true;this.reconnecting = false;if ("opening" == this.readyState) {
          this.cleanup();
        }this.backoff.reset();this.readyState = "closed";if (this.engine) this.engine.close();
      };Manager.prototype.onclose = function (reason) {
        debug("onclose");this.cleanup();this.backoff.reset();this.readyState = "closed";this.emit("close", reason);if (this._reconnection && !this.skipReconnect) {
          this.reconnect();
        }
      };Manager.prototype.reconnect = function () {
        if (this.reconnecting || this.skipReconnect) return this;var self = this;if (this.backoff.attempts >= this._reconnectionAttempts) {
          debug("reconnect failed");this.backoff.reset();this.emitAll("reconnect_failed");this.reconnecting = false;
        } else {
          var delay = this.backoff.duration();debug("will wait %dms before reconnect attempt", delay);this.reconnecting = true;var timer = setTimeout(function () {
            if (self.skipReconnect) return;debug("attempting reconnect");self.emitAll("reconnect_attempt", self.backoff.attempts);self.emitAll("reconnecting", self.backoff.attempts);if (self.skipReconnect) return;self.open(function (err) {
              if (err) {
                debug("reconnect attempt error");self.reconnecting = false;self.reconnect();self.emitAll("reconnect_error", err.data);
              } else {
                debug("reconnect success");self.onreconnect();
              }
            });
          }, delay);this.subs.push({ destroy: function destroy() {
              clearTimeout(timer);
            } });
        }
      };Manager.prototype.onreconnect = function () {
        var attempt = this.backoff.attempts;this.reconnecting = false;this.backoff.reset();this.updateSocketIds();this.emitAll("reconnect", attempt);
      };
    }, { "./on": 33, "./socket": 34, backo2: 36, "component-bind": 37, "component-emitter": 38, debug: 39, "engine.io-client": 1, indexof: 42, "socket.io-parser": 47 }], 33: [function (_dereq_, module, exports) {
      module.exports = on;function on(obj, ev, fn) {
        obj.on(ev, fn);return { destroy: function destroy() {
            obj.removeListener(ev, fn);
          } };
      }
    }, {}], 34: [function (_dereq_, module, exports) {
      var parser = _dereq_("socket.io-parser");var Emitter = _dereq_("component-emitter");var toArray = _dereq_("to-array");var on = _dereq_("./on");var bind = _dereq_("component-bind");var debug = _dereq_("debug")("socket.io-client:socket");var hasBin = _dereq_("has-binary");module.exports = exports = Socket;var events = { connect: 1, connect_error: 1, connect_timeout: 1, connecting: 1, disconnect: 1, error: 1, reconnect: 1, reconnect_attempt: 1, reconnect_failed: 1, reconnect_error: 1, reconnecting: 1, ping: 1, pong: 1 };var emit = Emitter.prototype.emit;function Socket(io, nsp) {
        this.io = io;this.nsp = nsp;this.json = this;this.ids = 0;this.acks = {};this.receiveBuffer = [];this.sendBuffer = [];this.connected = false;this.disconnected = true;if (this.io.autoConnect) this.open();
      }Emitter(Socket.prototype);Socket.prototype.subEvents = function () {
        if (this.subs) return;var io = this.io;this.subs = [on(io, "open", bind(this, "onopen")), on(io, "packet", bind(this, "onpacket")), on(io, "close", bind(this, "onclose"))];
      };Socket.prototype.open = Socket.prototype.connect = function () {
        if (this.connected) return this;this.subEvents();this.io.open();if ("open" == this.io.readyState) this.onopen();this.emit("connecting");return this;
      };Socket.prototype.send = function () {
        var args = toArray(arguments);args.unshift("message");this.emit.apply(this, args);return this;
      };Socket.prototype.emit = function (ev) {
        if (events.hasOwnProperty(ev)) {
          emit.apply(this, arguments);return this;
        }var args = toArray(arguments);var parserType = parser.EVENT;if (hasBin(args)) {
          parserType = parser.BINARY_EVENT;
        }var packet = { type: parserType, data: args };packet.options = {};packet.options.compress = !this.flags || false !== this.flags.compress;if ("function" == typeof args[args.length - 1]) {
          debug("emitting packet with ack id %d", this.ids);this.acks[this.ids] = args.pop();packet.id = this.ids++;
        }if (this.connected) {
          this.packet(packet);
        } else {
          this.sendBuffer.push(packet);
        }delete this.flags;return this;
      };Socket.prototype.packet = function (packet) {
        packet.nsp = this.nsp;this.io.packet(packet);
      };Socket.prototype.onopen = function () {
        debug("transport is open - connecting");if ("/" != this.nsp) {
          this.packet({ type: parser.CONNECT });
        }
      };Socket.prototype.onclose = function (reason) {
        debug("close (%s)", reason);this.connected = false;this.disconnected = true;delete this.id;this.emit("disconnect", reason);
      };Socket.prototype.onpacket = function (packet) {
        if (packet.nsp != this.nsp) return;switch (packet.type) {case parser.CONNECT:
            this.onconnect();break;case parser.EVENT:
            this.onevent(packet);break;case parser.BINARY_EVENT:
            this.onevent(packet);break;case parser.ACK:
            this.onack(packet);break;case parser.BINARY_ACK:
            this.onack(packet);break;case parser.DISCONNECT:
            this.ondisconnect();break;case parser.ERROR:
            this.emit("error", packet.data);break;}
      };Socket.prototype.onevent = function (packet) {
        var args = packet.data || [];debug("emitting event %j", args);if (null != packet.id) {
          debug("attaching ack callback to event");args.push(this.ack(packet.id));
        }if (this.connected) {
          emit.apply(this, args);
        } else {
          this.receiveBuffer.push(args);
        }
      };Socket.prototype.ack = function (id) {
        var self = this;var sent = false;return function () {
          if (sent) return;sent = true;var args = toArray(arguments);debug("sending ack %j", args);var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;self.packet({ type: type, id: id, data: args });
        };
      };Socket.prototype.onack = function (packet) {
        var ack = this.acks[packet.id];if ("function" == typeof ack) {
          debug("calling ack %s with %j", packet.id, packet.data);ack.apply(this, packet.data);delete this.acks[packet.id];
        } else {
          debug("bad ack %s", packet.id);
        }
      };Socket.prototype.onconnect = function () {
        this.connected = true;this.disconnected = false;this.emit("connect");this.emitBuffered();
      };Socket.prototype.emitBuffered = function () {
        var i;for (i = 0; i < this.receiveBuffer.length; i++) {
          emit.apply(this, this.receiveBuffer[i]);
        }this.receiveBuffer = [];for (i = 0; i < this.sendBuffer.length; i++) {
          this.packet(this.sendBuffer[i]);
        }this.sendBuffer = [];
      };Socket.prototype.ondisconnect = function () {
        debug("server disconnect (%s)", this.nsp);this.destroy();this.onclose("io server disconnect");
      };Socket.prototype.destroy = function () {
        if (this.subs) {
          for (var i = 0; i < this.subs.length; i++) {
            this.subs[i].destroy();
          }this.subs = null;
        }this.io.destroy(this);
      };Socket.prototype.close = Socket.prototype.disconnect = function () {
        if (this.connected) {
          debug("performing disconnect (%s)", this.nsp);this.packet({ type: parser.DISCONNECT });
        }this.destroy();if (this.connected) {
          this.onclose("io client disconnect");
        }return this;
      };Socket.prototype.compress = function (compress) {
        this.flags = this.flags || {};this.flags.compress = compress;return this;
      };
    }, { "./on": 33, "component-bind": 37, "component-emitter": 38, debug: 39, "has-binary": 41, "socket.io-parser": 47, "to-array": 51 }], 35: [function (_dereq_, module, exports) {
      (function (global) {
        var parseuri = _dereq_("parseuri");var debug = _dereq_("debug")("socket.io-client:url");module.exports = url;function url(uri, loc) {
          var obj = uri;var loc = loc || global.location;if (null == uri) uri = loc.protocol + "//" + loc.host;if ("string" == typeof uri) {
            if ("/" == uri.charAt(0)) {
              if ("/" == uri.charAt(1)) {
                uri = loc.protocol + uri;
              } else {
                uri = loc.host + uri;
              }
            }if (!/^(https?|wss?):\/\//.test(uri)) {
              debug("protocol-less url %s", uri);if ("undefined" != typeof loc) {
                uri = loc.protocol + "//" + uri;
              } else {
                uri = "https://" + uri;
              }
            }debug("parse %s", uri);obj = parseuri(uri);
          }if (!obj.port) {
            if (/^(http|ws)$/.test(obj.protocol)) {
              obj.port = "80";
            } else if (/^(http|ws)s$/.test(obj.protocol)) {
              obj.port = "443";
            }
          }obj.path = obj.path || "/";var ipv6 = obj.host.indexOf(":") !== -1;var host = ipv6 ? "[" + obj.host + "]" : obj.host;obj.id = obj.protocol + "://" + host + ":" + obj.port;obj.href = obj.protocol + "://" + host + (loc && loc.port == obj.port ? "" : ":" + obj.port);return obj;
        }
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { debug: 39, parseuri: 45 }], 36: [function (_dereq_, module, exports) {
      module.exports = Backoff;function Backoff(opts) {
        opts = opts || {};this.ms = opts.min || 100;this.max = opts.max || 1e4;this.factor = opts.factor || 2;this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;this.attempts = 0;
      }Backoff.prototype.duration = function () {
        var ms = this.ms * Math.pow(this.factor, this.attempts++);if (this.jitter) {
          var rand = Math.random();var deviation = Math.floor(rand * this.jitter * ms);ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
        }return Math.min(ms, this.max) | 0;
      };Backoff.prototype.reset = function () {
        this.attempts = 0;
      };Backoff.prototype.setMin = function (min) {
        this.ms = min;
      };Backoff.prototype.setMax = function (max) {
        this.max = max;
      };Backoff.prototype.setJitter = function (jitter) {
        this.jitter = jitter;
      };
    }, {}], 37: [function (_dereq_, module, exports) {
      var slice = [].slice;module.exports = function (obj, fn) {
        if ("string" == typeof fn) fn = obj[fn];if ("function" != typeof fn) throw new Error("bind() requires a function");var args = slice.call(arguments, 2);return function () {
          return fn.apply(obj, args.concat(slice.call(arguments)));
        };
      };
    }, {}], 38: [function (_dereq_, module, exports) {
      module.exports = Emitter;function Emitter(obj) {
        if (obj) return mixin(obj);
      }function mixin(obj) {
        for (var key in Emitter.prototype) {
          obj[key] = Emitter.prototype[key];
        }return obj;
      }Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
        this._callbacks = this._callbacks || {};(this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);return this;
      };Emitter.prototype.once = function (event, fn) {
        function on() {
          this.off(event, on);fn.apply(this, arguments);
        }on.fn = fn;this.on(event, on);return this;
      };Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
        this._callbacks = this._callbacks || {};if (0 == arguments.length) {
          this._callbacks = {};return this;
        }var callbacks = this._callbacks["$" + event];if (!callbacks) return this;if (1 == arguments.length) {
          delete this._callbacks["$" + event];return this;
        }var cb;for (var i = 0; i < callbacks.length; i++) {
          cb = callbacks[i];if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1);break;
          }
        }return this;
      };Emitter.prototype.emit = function (event) {
        this._callbacks = this._callbacks || {};var args = [].slice.call(arguments, 1),
            callbacks = this._callbacks["$" + event];if (callbacks) {
          callbacks = callbacks.slice(0);for (var i = 0, len = callbacks.length; i < len; ++i) {
            callbacks[i].apply(this, args);
          }
        }return this;
      };Emitter.prototype.listeners = function (event) {
        this._callbacks = this._callbacks || {};return this._callbacks["$" + event] || [];
      };Emitter.prototype.hasListeners = function (event) {
        return !!this.listeners(event).length;
      };
    }, {}], 39: [function (_dereq_, module, exports) {
      arguments[4][17][0].apply(exports, arguments);
    }, { "./debug": 40, dup: 17 }], 40: [function (_dereq_, module, exports) {
      arguments[4][18][0].apply(exports, arguments);
    }, { dup: 18, ms: 44 }], 41: [function (_dereq_, module, exports) {
      (function (global) {
        var isArray = _dereq_("isarray");module.exports = hasBinary;function hasBinary(data) {
          function _hasBinary(obj) {
            if (!obj) return false;if (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
              return true;
            }if (isArray(obj)) {
              for (var i = 0; i < obj.length; i++) {
                if (_hasBinary(obj[i])) {
                  return true;
                }
              }
            } else if (obj && "object" == (typeof obj === "undefined" ? "undefined" : _typeof(obj))) {
              if (obj.toJSON && "function" == typeof obj.toJSON) {
                obj = obj.toJSON();
              }for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
                  return true;
                }
              }
            }return false;
          }return _hasBinary(data);
        }
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { isarray: 43 }], 42: [function (_dereq_, module, exports) {
      arguments[4][23][0].apply(exports, arguments);
    }, { dup: 23 }], 43: [function (_dereq_, module, exports) {
      arguments[4][24][0].apply(exports, arguments);
    }, { dup: 24 }], 44: [function (_dereq_, module, exports) {
      arguments[4][25][0].apply(exports, arguments);
    }, { dup: 25 }], 45: [function (_dereq_, module, exports) {
      arguments[4][28][0].apply(exports, arguments);
    }, { dup: 28 }], 46: [function (_dereq_, module, exports) {
      (function (global) {
        var isArray = _dereq_("isarray");var isBuf = _dereq_("./is-buffer");exports.deconstructPacket = function (packet) {
          var buffers = [];var packetData = packet.data;function _deconstructPacket(data) {
            if (!data) return data;if (isBuf(data)) {
              var placeholder = { _placeholder: true, num: buffers.length };buffers.push(data);return placeholder;
            } else if (isArray(data)) {
              var newData = new Array(data.length);for (var i = 0; i < data.length; i++) {
                newData[i] = _deconstructPacket(data[i]);
              }return newData;
            } else if ("object" == (typeof data === "undefined" ? "undefined" : _typeof(data)) && !(data instanceof Date)) {
              var newData = {};for (var key in data) {
                newData[key] = _deconstructPacket(data[key]);
              }return newData;
            }return data;
          }var pack = packet;pack.data = _deconstructPacket(packetData);pack.attachments = buffers.length;return { packet: pack, buffers: buffers };
        };exports.reconstructPacket = function (packet, buffers) {
          var curPlaceHolder = 0;function _reconstructPacket(data) {
            if (data && data._placeholder) {
              var buf = buffers[data.num];return buf;
            } else if (isArray(data)) {
              for (var i = 0; i < data.length; i++) {
                data[i] = _reconstructPacket(data[i]);
              }return data;
            } else if (data && "object" == (typeof data === "undefined" ? "undefined" : _typeof(data))) {
              for (var key in data) {
                data[key] = _reconstructPacket(data[key]);
              }return data;
            }return data;
          }packet.data = _reconstructPacket(packet.data);packet.attachments = undefined;return packet;
        };exports.removeBlobs = function (data, callback) {
          function _removeBlobs(obj, curKey, containingObject) {
            if (!obj) return obj;if (global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
              pendingBlobs++;var fileReader = new FileReader();fileReader.onload = function () {
                if (containingObject) {
                  containingObject[curKey] = this.result;
                } else {
                  bloblessData = this.result;
                }if (! --pendingBlobs) {
                  callback(bloblessData);
                }
              };fileReader.readAsArrayBuffer(obj);
            } else if (isArray(obj)) {
              for (var i = 0; i < obj.length; i++) {
                _removeBlobs(obj[i], i, obj);
              }
            } else if (obj && "object" == (typeof obj === "undefined" ? "undefined" : _typeof(obj)) && !isBuf(obj)) {
              for (var key in obj) {
                _removeBlobs(obj[key], key, obj);
              }
            }
          }var pendingBlobs = 0;var bloblessData = data;_removeBlobs(bloblessData);if (!pendingBlobs) {
            callback(bloblessData);
          }
        };
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, { "./is-buffer": 48, isarray: 43 }], 47: [function (_dereq_, module, exports) {
      var debug = _dereq_("debug")("socket.io-parser");var json = _dereq_("json3");var isArray = _dereq_("isarray");var Emitter = _dereq_("component-emitter");var binary = _dereq_("./binary");var isBuf = _dereq_("./is-buffer");exports.protocol = 4;exports.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"];exports.CONNECT = 0;exports.DISCONNECT = 1;exports.EVENT = 2;exports.ACK = 3;exports.ERROR = 4;exports.BINARY_EVENT = 5;exports.BINARY_ACK = 6;exports.Encoder = Encoder;exports.Decoder = Decoder;function Encoder() {}Encoder.prototype.encode = function (obj, callback) {
        debug("encoding packet %j", obj);if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
          encodeAsBinary(obj, callback);
        } else {
          var encoding = encodeAsString(obj);callback([encoding]);
        }
      };function encodeAsString(obj) {
        var str = "";var nsp = false;str += obj.type;if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
          str += obj.attachments;str += "-";
        }if (obj.nsp && "/" != obj.nsp) {
          nsp = true;str += obj.nsp;
        }if (null != obj.id) {
          if (nsp) {
            str += ",";nsp = false;
          }str += obj.id;
        }if (null != obj.data) {
          if (nsp) str += ",";str += json.stringify(obj.data);
        }debug("encoded %j as %s", obj, str);return str;
      }function encodeAsBinary(obj, callback) {
        function writeEncoding(bloblessData) {
          var deconstruction = binary.deconstructPacket(bloblessData);var pack = encodeAsString(deconstruction.packet);var buffers = deconstruction.buffers;buffers.unshift(pack);callback(buffers);
        }binary.removeBlobs(obj, writeEncoding);
      }function Decoder() {
        this.reconstructor = null;
      }Emitter(Decoder.prototype);Decoder.prototype.add = function (obj) {
        var packet;if ("string" == typeof obj) {
          packet = decodeString(obj);if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) {
            this.reconstructor = new BinaryReconstructor(packet);if (this.reconstructor.reconPack.attachments === 0) {
              this.emit("decoded", packet);
            }
          } else {
            this.emit("decoded", packet);
          }
        } else if (isBuf(obj) || obj.base64) {
          if (!this.reconstructor) {
            throw new Error("got binary data when not reconstructing a packet");
          } else {
            packet = this.reconstructor.takeBinaryData(obj);if (packet) {
              this.reconstructor = null;this.emit("decoded", packet);
            }
          }
        } else {
          throw new Error("Unknown type: " + obj);
        }
      };function decodeString(str) {
        var p = {};var i = 0;p.type = Number(str.charAt(0));if (null == exports.types[p.type]) return error();if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
          var buf = "";while (str.charAt(++i) != "-") {
            buf += str.charAt(i);if (i == str.length) break;
          }if (buf != Number(buf) || str.charAt(i) != "-") {
            throw new Error("Illegal attachments");
          }p.attachments = Number(buf);
        }if ("/" == str.charAt(i + 1)) {
          p.nsp = "";while (++i) {
            var c = str.charAt(i);if ("," == c) break;p.nsp += c;if (i == str.length) break;
          }
        } else {
          p.nsp = "/";
        }var next = str.charAt(i + 1);if ("" !== next && Number(next) == next) {
          p.id = "";while (++i) {
            var c = str.charAt(i);if (null == c || Number(c) != c) {
              --i;break;
            }p.id += str.charAt(i);if (i == str.length) break;
          }p.id = Number(p.id);
        }if (str.charAt(++i)) {
          try {
            p.data = json.parse(str.substr(i));
          } catch (e) {
            return error();
          }
        }debug("decoded %s as %j", str, p);return p;
      }Decoder.prototype.destroy = function () {
        if (this.reconstructor) {
          this.reconstructor.finishedReconstruction();
        }
      };function BinaryReconstructor(packet) {
        this.reconPack = packet;this.buffers = [];
      }BinaryReconstructor.prototype.takeBinaryData = function (binData) {
        this.buffers.push(binData);if (this.buffers.length == this.reconPack.attachments) {
          var packet = binary.reconstructPacket(this.reconPack, this.buffers);this.finishedReconstruction();return packet;
        }return null;
      };BinaryReconstructor.prototype.finishedReconstruction = function () {
        this.reconPack = null;this.buffers = [];
      };function error(data) {
        return { type: exports.ERROR, data: "parser error" };
      }
    }, { "./binary": 46, "./is-buffer": 48, "component-emitter": 49, debug: 39, isarray: 43, json3: 50 }], 48: [function (_dereq_, module, exports) {
      (function (global) {
        module.exports = isBuf;function isBuf(obj) {
          return global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer;
        }
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, {}], 49: [function (_dereq_, module, exports) {
      arguments[4][15][0].apply(exports, arguments);
    }, { dup: 15 }], 50: [function (_dereq_, module, exports) {
      (function (global) {
        (function () {
          var isLoader = typeof define === "function" && define.amd;var objectTypes = { "function": true, object: true };var freeExports = objectTypes[typeof exports === "undefined" ? "undefined" : _typeof(exports)] && exports && !exports.nodeType && exports;var root = objectTypes[typeof window === "undefined" ? "undefined" : _typeof(window)] && window || this,
              freeGlobal = freeExports && objectTypes[typeof module === "undefined" ? "undefined" : _typeof(module)] && module && !module.nodeType && (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global;if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
            root = freeGlobal;
          }function runInContext(context, exports) {
            context || (context = root["Object"]());exports || (exports = root["Object"]());var Number = context["Number"] || root["Number"],
                String = context["String"] || root["String"],
                Object = context["Object"] || root["Object"],
                Date = context["Date"] || root["Date"],
                SyntaxError = context["SyntaxError"] || root["SyntaxError"],
                TypeError = context["TypeError"] || root["TypeError"],
                Math = context["Math"] || root["Math"],
                nativeJSON = context["JSON"] || root["JSON"];if ((typeof nativeJSON === "undefined" ? "undefined" : _typeof(nativeJSON)) == "object" && nativeJSON) {
              exports.stringify = nativeJSON.stringify;exports.parse = nativeJSON.parse;
            }var objectProto = Object.prototype,
                getClass = objectProto.toString,
                _isProperty,
                _forEach,
                undef;var isExtended = new Date(-0xc782b5b800cec);try {
              isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 && isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
            } catch (exception) {}function has(name) {
              if (has[name] !== undef) {
                return has[name];
              }var isSupported;if (name == "bug-string-char-index") {
                isSupported = "a"[0] != "a";
              } else if (name == "json") {
                isSupported = has("json-stringify") && has("json-parse");
              } else {
                var value,
                    serialized = "{\"a\":[1,true,false,null,\"\\u0000\\b\\n\\f\\r\\t\"]}";if (name == "json-stringify") {
                  var stringify = exports.stringify,
                      stringifySupported = typeof stringify == "function" && isExtended;if (stringifySupported) {
                    (value = function value() {
                      return 1;
                    }).toJSON = value;try {
                      stringifySupported = stringify(0) === "0" && stringify(new Number()) === "0" && stringify(new String()) == '""' && stringify(getClass) === undef && stringify(undef) === undef && stringify() === undef && stringify(value) === "1" && stringify([value]) == "[1]" && stringify([undef]) == "[null]" && stringify(null) == "null" && stringify([undef, getClass, null]) == "[null,null,null]" && stringify({ a: [value, true, false, null, "\x00\b\n\f\r	"] }) == serialized && stringify(null, value) === "1" && stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" && stringify(new Date(-864e13)) == '"-271821-04-20T00:00:00.000Z"' && stringify(new Date(864e13)) == '"+275760-09-13T00:00:00.000Z"' && stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' && stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                    } catch (exception) {
                      stringifySupported = false;
                    }
                  }isSupported = stringifySupported;
                }if (name == "json-parse") {
                  var parse = exports.parse;if (typeof parse == "function") {
                    try {
                      if (parse("0") === 0 && !parse(false)) {
                        value = parse(serialized);var parseSupported = value["a"].length == 5 && value["a"][0] === 1;if (parseSupported) {
                          try {
                            parseSupported = !parse('"	"');
                          } catch (exception) {}if (parseSupported) {
                            try {
                              parseSupported = parse("01") !== 1;
                            } catch (exception) {}
                          }if (parseSupported) {
                            try {
                              parseSupported = parse("1.") !== 1;
                            } catch (exception) {}
                          }
                        }
                      }
                    } catch (exception) {
                      parseSupported = false;
                    }
                  }isSupported = parseSupported;
                }
              }return has[name] = !!isSupported;
            }if (!has("json")) {
              var functionClass = "[object Function]",
                  dateClass = "[object Date]",
                  numberClass = "[object Number]",
                  stringClass = "[object String]",
                  arrayClass = "[object Array]",
                  booleanClass = "[object Boolean]";var charIndexBuggy = has("bug-string-char-index");if (!isExtended) {
                var floor = Math.floor;var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];var getDay = function getDay(year, month) {
                  return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
                };
              }if (!(_isProperty = objectProto.hasOwnProperty)) {
                _isProperty = function isProperty(property) {
                  var members = {},
                      constructor;if ((members.__proto__ = null, members.__proto__ = { toString: 1 }, members).toString != getClass) {
                    _isProperty = function isProperty(property) {
                      var original = this.__proto__,
                          result = property in (this.__proto__ = null, this);this.__proto__ = original;return result;
                    };
                  } else {
                    constructor = members.constructor;_isProperty = function isProperty(property) {
                      var parent = (this.constructor || constructor).prototype;return property in this && !(property in parent && this[property] === parent[property]);
                    };
                  }members = null;return _isProperty.call(this, property);
                };
              }_forEach = function forEach(object, callback) {
                var size = 0,
                    Properties,
                    members,
                    property;(Properties = function Properties() {
                  this.valueOf = 0;
                }).prototype.valueOf = 0;members = new Properties();for (property in members) {
                  if (_isProperty.call(members, property)) {
                    size++;
                  }
                }Properties = members = null;if (!size) {
                  members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];_forEach = function forEach(object, callback) {
                    var isFunction = getClass.call(object) == functionClass,
                        property,
                        length;var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[_typeof(object.hasOwnProperty)] && object.hasOwnProperty || _isProperty;for (property in object) {
                      if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                        callback(property);
                      }
                    }for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property)) {}
                  };
                } else if (size == 2) {
                  _forEach = function forEach(object, callback) {
                    var members = {},
                        isFunction = getClass.call(object) == functionClass,
                        property;for (property in object) {
                      if (!(isFunction && property == "prototype") && !_isProperty.call(members, property) && (members[property] = 1) && _isProperty.call(object, property)) {
                        callback(property);
                      }
                    }
                  };
                } else {
                  _forEach = function forEach(object, callback) {
                    var isFunction = getClass.call(object) == functionClass,
                        property,
                        isConstructor;for (property in object) {
                      if (!(isFunction && property == "prototype") && _isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                        callback(property);
                      }
                    }if (isConstructor || _isProperty.call(object, property = "constructor")) {
                      callback(property);
                    }
                  };
                }return _forEach(object, callback);
              };if (!has("json-stringify")) {
                var Escapes = { 92: "\\\\", 34: '\\"', 8: "\\b", 12: "\\f", 10: "\\n", 13: "\\r", 9: "\\t" };var leadingZeroes = "000000";var toPaddedString = function toPaddedString(width, value) {
                  return (leadingZeroes + (value || 0)).slice(-width);
                };var unicodePrefix = "\\u00";var quote = function quote(value) {
                  var result = '"',
                      index = 0,
                      length = value.length,
                      useCharIndex = !charIndexBuggy || length > 10;var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);for (; index < length; index++) {
                    var charCode = value.charCodeAt(index);switch (charCode) {case 8:case 9:case 10:case 12:case 13:case 34:case 92:
                        result += Escapes[charCode];break;default:
                        if (charCode < 32) {
                          result += unicodePrefix + toPaddedString(2, charCode.toString(16));break;
                        }result += useCharIndex ? symbols[index] : value.charAt(index);}
                  }return result + '"';
                };var serialize = function serialize(property, object, callback, properties, whitespace, indentation, stack) {
                  var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;try {
                    value = object[property];
                  } catch (exception) {}if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object" && value) {
                    className = getClass.call(value);if (className == dateClass && !_isProperty.call(value, "toJSON")) {
                      if (value > -1 / 0 && value < 1 / 0) {
                        if (getDay) {
                          date = floor(value / 864e5);for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++) {}for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++) {}date = 1 + date - getDay(year, month);time = (value % 864e5 + 864e5) % 864e5;hours = floor(time / 36e5) % 24;minutes = floor(time / 6e4) % 60;seconds = floor(time / 1e3) % 60;milliseconds = time % 1e3;
                        } else {
                          year = value.getUTCFullYear();month = value.getUTCMonth();date = value.getUTCDate();hours = value.getUTCHours();minutes = value.getUTCMinutes();seconds = value.getUTCSeconds();milliseconds = value.getUTCMilliseconds();
                        }value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) + "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) + "." + toPaddedString(3, milliseconds) + "Z";
                      } else {
                        value = null;
                      }
                    } else if (typeof value.toJSON == "function" && (className != numberClass && className != stringClass && className != arrayClass || _isProperty.call(value, "toJSON"))) {
                      value = value.toJSON(property);
                    }
                  }if (callback) {
                    value = callback.call(object, property, value);
                  }if (value === null) {
                    return "null";
                  }className = getClass.call(value);if (className == booleanClass) {
                    return "" + value;
                  } else if (className == numberClass) {
                    return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                  } else if (className == stringClass) {
                    return quote("" + value);
                  }if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object") {
                    for (length = stack.length; length--;) {
                      if (stack[length] === value) {
                        throw TypeError();
                      }
                    }stack.push(value);results = [];prefix = indentation;indentation += whitespace;if (className == arrayClass) {
                      for (index = 0, length = value.length; index < length; index++) {
                        element = serialize(index, value, callback, properties, whitespace, indentation, stack);results.push(element === undef ? "null" : element);
                      }result = results.length ? whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : "[" + results.join(",") + "]" : "[]";
                    } else {
                      _forEach(properties || value, function (property) {
                        var element = serialize(property, value, callback, properties, whitespace, indentation, stack);if (element !== undef) {
                          results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                        }
                      });result = results.length ? whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : "{" + results.join(",") + "}" : "{}";
                    }stack.pop();return result;
                  }
                };exports.stringify = function (source, filter, width) {
                  var whitespace, callback, properties, className;if (objectTypes[typeof filter === "undefined" ? "undefined" : _typeof(filter)] && filter) {
                    if ((className = getClass.call(filter)) == functionClass) {
                      callback = filter;
                    } else if (className == arrayClass) {
                      properties = {};for (var index = 0, length = filter.length, value; index < length; value = filter[index++], (className = getClass.call(value), className == stringClass || className == numberClass) && (properties[value] = 1)) {}
                    }
                  }if (width) {
                    if ((className = getClass.call(width)) == numberClass) {
                      if ((width -= width % 1) > 0) {
                        for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ") {}
                      }
                    } else if (className == stringClass) {
                      whitespace = width.length <= 10 ? width : width.slice(0, 10);
                    }
                  }return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
                };
              }if (!has("json-parse")) {
                var fromCharCode = String.fromCharCode;var Unescapes = { 92: "\\", 34: '"', 47: "/", 98: "\b", 116: "	", 110: "\n", 102: "\f", 114: "\r" };var Index, Source;var abort = function abort() {
                  Index = Source = null;throw SyntaxError();
                };var lex = function lex() {
                  var source = Source,
                      length = source.length,
                      value,
                      begin,
                      position,
                      isSigned,
                      charCode;while (Index < length) {
                    charCode = source.charCodeAt(Index);switch (charCode) {case 9:case 10:case 13:case 32:
                        Index++;break;case 123:case 125:case 91:case 93:case 58:case 44:
                        value = charIndexBuggy ? source.charAt(Index) : source[Index];Index++;return value;case 34:
                        for (value = "@", Index++; Index < length;) {
                          charCode = source.charCodeAt(Index);if (charCode < 32) {
                            abort();
                          } else if (charCode == 92) {
                            charCode = source.charCodeAt(++Index);switch (charCode) {case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:
                                value += Unescapes[charCode];Index++;break;case 117:
                                begin = ++Index;for (position = Index + 4; Index < position; Index++) {
                                  charCode = source.charCodeAt(Index);if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                                    abort();
                                  }
                                }value += fromCharCode("0x" + source.slice(begin, Index));break;default:
                                abort();}
                          } else {
                            if (charCode == 34) {
                              break;
                            }charCode = source.charCodeAt(Index);begin = Index;while (charCode >= 32 && charCode != 92 && charCode != 34) {
                              charCode = source.charCodeAt(++Index);
                            }value += source.slice(begin, Index);
                          }
                        }if (source.charCodeAt(Index) == 34) {
                          Index++;return value;
                        }abort();default:
                        begin = Index;if (charCode == 45) {
                          isSigned = true;charCode = source.charCodeAt(++Index);
                        }if (charCode >= 48 && charCode <= 57) {
                          if (charCode == 48 && (charCode = source.charCodeAt(Index + 1), charCode >= 48 && charCode <= 57)) {
                            abort();
                          }isSigned = false;for (; Index < length && (charCode = source.charCodeAt(Index), charCode >= 48 && charCode <= 57); Index++) {}if (source.charCodeAt(Index) == 46) {
                            position = ++Index;for (; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++) {}if (position == Index) {
                              abort();
                            }Index = position;
                          }charCode = source.charCodeAt(Index);if (charCode == 101 || charCode == 69) {
                            charCode = source.charCodeAt(++Index);if (charCode == 43 || charCode == 45) {
                              Index++;
                            }for (position = Index; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++) {}if (position == Index) {
                              abort();
                            }Index = position;
                          }return +source.slice(begin, Index);
                        }if (isSigned) {
                          abort();
                        }if (source.slice(Index, Index + 4) == "true") {
                          Index += 4;return true;
                        } else if (source.slice(Index, Index + 5) == "false") {
                          Index += 5;return false;
                        } else if (source.slice(Index, Index + 4) == "null") {
                          Index += 4;return null;
                        }abort();}
                  }return "$";
                };var get = function get(value) {
                  var results, hasMembers;if (value == "$") {
                    abort();
                  }if (typeof value == "string") {
                    if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                      return value.slice(1);
                    }if (value == "[") {
                      results = [];for (;; hasMembers || (hasMembers = true)) {
                        value = lex();if (value == "]") {
                          break;
                        }if (hasMembers) {
                          if (value == ",") {
                            value = lex();if (value == "]") {
                              abort();
                            }
                          } else {
                            abort();
                          }
                        }if (value == ",") {
                          abort();
                        }results.push(get(value));
                      }return results;
                    } else if (value == "{") {
                      results = {};for (;; hasMembers || (hasMembers = true)) {
                        value = lex();if (value == "}") {
                          break;
                        }if (hasMembers) {
                          if (value == ",") {
                            value = lex();if (value == "}") {
                              abort();
                            }
                          } else {
                            abort();
                          }
                        }if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                          abort();
                        }results[value.slice(1)] = get(lex());
                      }return results;
                    }abort();
                  }return value;
                };var update = function update(source, property, callback) {
                  var element = walk(source, property, callback);
                  if (element === undef) {
                    delete source[property];
                  } else {
                    source[property] = element;
                  }
                };var walk = function walk(source, property, callback) {
                  var value = source[property],
                      length;if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object" && value) {
                    if (getClass.call(value) == arrayClass) {
                      for (length = value.length; length--;) {
                        update(value, length, callback);
                      }
                    } else {
                      _forEach(value, function (property) {
                        update(value, property, callback);
                      });
                    }
                  }return callback.call(source, property, value);
                };exports.parse = function (source, callback) {
                  var result, value;Index = 0;Source = "" + source;result = get(lex());if (lex() != "$") {
                    abort();
                  }Index = Source = null;return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
                };
              }
            }exports["runInContext"] = runInContext;return exports;
          }if (freeExports && !isLoader) {
            runInContext(root, freeExports);
          } else {
            var nativeJSON = root.JSON,
                previousJSON = root["JSON3"],
                isRestored = false;var JSON3 = runInContext(root, root["JSON3"] = { noConflict: function noConflict() {
                if (!isRestored) {
                  isRestored = true;root.JSON = nativeJSON;root["JSON3"] = previousJSON;nativeJSON = previousJSON = null;
                }return JSON3;
              } });root.JSON = { parse: JSON3.parse, stringify: JSON3.stringify };
          }if (isLoader) {
            define(function () {
              return JSON3;
            });
          }
        }).call(this);
      }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    }, {}], 51: [function (_dereq_, module, exports) {
      module.exports = toArray;function toArray(list, index) {
        var array = [];index = index || 0;for (var i = index || 0; i < list.length; i++) {
          array[i - index] = list[i];
        }return array;
      }
    }, {}] }, {}, [31])(31);
});
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*
 * metismenu - v2.0.2
 * A jQuery menu plugin
 * https://github.com/onokumus/metisMenu
 *
 * Made by Osman Nuri Okumus
 * Under MIT License
 */

!function (a) {
    "use strict";
    function b() {
        var a = document.createElement("mm"),
            b = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" };for (var c in b) {
            if (void 0 !== a.style[c]) return { end: b[c] };
        }return !1;
    }function c(b) {
        return this.each(function () {
            var c = a(this),
                d = c.data("mm"),
                f = a.extend({}, e.DEFAULTS, c.data(), "object" == (typeof b === "undefined" ? "undefined" : _typeof(b)) && b);d || c.data("mm", d = new e(this, f)), "string" == typeof b && d[b]();
        });
    }a.fn.emulateTransitionEnd = function (b) {
        var c = !1,
            e = this;a(this).one("mmTransitionEnd", function () {
            c = !0;
        });var f = function f() {
            c || a(e).trigger(d.end);
        };return setTimeout(f, b), this;
    };var d = b();d && (a.event.special.mmTransitionEnd = { bindType: d.end, delegateType: d.end, handle: function handle(b) {
            return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0;
        } });var e = function e(b, c) {
        this.$element = a(b), this.options = a.extend({}, e.DEFAULTS, c), this.transitioning = null, this.init();
    };e.TRANSITION_DURATION = 350, e.DEFAULTS = { toggle: !0, doubleTapToGo: !1, activeClass: "active", collapseClass: "collapse", collapseInClass: "in", collapsingClass: "collapsing" }, e.prototype.init = function () {
        var b = this,
            c = this.options.activeClass,
            d = this.options.collapseClass,
            e = this.options.collapseInClass;this.$element.find("li." + c).has("ul").children("ul").addClass(d + " " + e), this.$element.find("li").not("." + c).has("ul").children("ul").addClass(d), this.options.doubleTapToGo && this.$element.find("li." + c).has("ul").children("a").addClass("doubleTapToGo"), this.$element.find("li").has("ul").children("a").on("click.metisMenu", function (d) {
            var e = a(this),
                f = e.parent("li"),
                g = f.children("ul");return d.preventDefault(), f.hasClass(c) ? b.hide(g) : b.show(g), b.options.doubleTapToGo && b.doubleTapToGo(e) && "#" !== e.attr("href") && "" !== e.attr("href") ? (d.stopPropagation(), void (document.location = e.attr("href"))) : void 0;
        });
    }, e.prototype.doubleTapToGo = function (a) {
        var b = this.$element;return a.hasClass("doubleTapToGo") ? (a.removeClass("doubleTapToGo"), !0) : a.parent().children("ul").length ? (b.find(".doubleTapToGo").removeClass("doubleTapToGo"), a.addClass("doubleTapToGo"), !1) : void 0;
    }, e.prototype.show = function (b) {
        var c = this.options.activeClass,
            f = this.options.collapseClass,
            g = this.options.collapseInClass,
            h = this.options.collapsingClass,
            i = a(b),
            j = i.parent("li");if (!this.transitioning && !i.hasClass(g)) {
            j.addClass(c), this.options.toggle && this.hide(j.siblings().children("ul." + g)), i.removeClass(f).addClass(h).height(0), this.transitioning = 1;var k = function k() {
                i.removeClass(h).addClass(f + " " + g).height(""), this.transitioning = 0;
            };return d ? void i.one("mmTransitionEnd", a.proxy(k, this)).emulateTransitionEnd(e.TRANSITION_DURATION).height(i[0].scrollHeight) : k.call(this);
        }
    }, e.prototype.hide = function (b) {
        var c = this.options.activeClass,
            f = this.options.collapseClass,
            g = this.options.collapseInClass,
            h = this.options.collapsingClass,
            i = a(b);if (!this.transitioning && i.hasClass(g)) {
            i.parent("li").removeClass(c), i.height(i.height())[0].offsetHeight, i.addClass(h).removeClass(f).removeClass(g), this.transitioning = 1;var j = function j() {
                this.transitioning = 0, i.removeClass(h).addClass(f);
            };return d ? void i.height(0).one("mmTransitionEnd", a.proxy(j, this)).emulateTransitionEnd(e.TRANSITION_DURATION) : j.call(this);
        }
    };var f = a.fn.metisMenu;a.fn.metisMenu = c, a.fn.metisMenu.Constructor = e, a.fn.metisMenu.noConflict = function () {
        return a.fn.metisMenu = f, this;
    };
}(jQuery);

$(function () {
    $('#side-menu').metisMenu();
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind("load resize", function () {
        topOffset = 50;
        width = this.window.innerWidth > 0 ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
                $('div.navbar-collapse').removeClass('collapse');
            }

        height = (this.window.innerHeight > 0 ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", height + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function () {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});
'use strict';

/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.4.1
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2015, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  $.timeago = function (timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: 'any moment now',
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },

    inWords: function inWords(distanceMillis) {
      if (!this.settings.allowPast && !this.settings.allowFuture) {
        throw 'timeago allowPast and allowFuture settings can not both be set to false.';
      }

      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if (!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = $l.numbers && $l.numbers[number] || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) || seconds < 90 && substitute($l.minute, 1) || minutes < 45 && substitute($l.minutes, Math.round(minutes)) || minutes < 90 && substitute($l.hour, 1) || hours < 24 && substitute($l.hours, Math.round(hours)) || hours < 42 && substitute($l.day, 1) || days < 30 && substitute($l.days, Math.round(days)) || days < 45 && substitute($l.month, 1) || days < 365 && substitute($l.months, Math.round(days / 30)) || years < 1.5 && substitute($l.year, 1) || substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) {
        separator = " ";
      }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function parse(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/, ""); // remove milliseconds
      s = s.replace(/-/, "/").replace(/-/, "/");
      s = s.replace(/T/, " ").replace(/Z/, " UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/, " $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function datetime(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function isTime(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function init() {
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function update(time) {
      var parsedTime = $t.parse(time);
      $(this).data('timeago', { datetime: parsedTime });
      if ($t.settings.localeTitle) $(this).attr("title", parsedTime.toLocaleString());
      refresh.apply(this);
    },
    updateFromDOM: function updateFromDOM() {
      $(this).data('timeago', { datetime: $t.parse($t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title")) });
      refresh.apply(this);
    },
    dispose: function dispose() {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    }
  };

  $.fn.timeago = function (action, options) {
    var fn = action ? functions[action] : functions.init;
    if (!fn) {
      throw new Error("Unknown function name '" + action + "' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function () {
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    //check if it's still visible
    if (!$.contains(document.documentElement, this)) {
      //stop if it has been removed
      $(this).timeago("dispose");
      return this;
    }

    var data = prepareData(this);
    var $s = $t.settings;

    if (!isNaN(data.datetime)) {
      if ($s.cutoff == 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return new Date().getTime() - date.getTime();
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
});

//# sourceMappingURL=vendor.js.map