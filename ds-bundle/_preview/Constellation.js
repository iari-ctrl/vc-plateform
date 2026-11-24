var __dsPreview = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // ds-raw:__ds_raw__
  var require_ds_raw = __commonJS({
    "ds-raw:__ds_raw__"(exports, module) {
      init_define_import_meta_env();
      module.exports = window.VCPX;
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function np(p, k) {
        var o = {};
        for (var x in p) if (x !== "children") o[x] = p[x];
        if (k !== void 0) o.key = k;
        return o;
      }
      function jsx2(t, p, k) {
        var c = p && p.children;
        return c === void 0 ? R.createElement(t, np(p, k)) : R.createElement(t, np(p, k), c);
      }
      function jsxs(t, p, k) {
        return R.createElement.apply(R, [t, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx2;
      module.exports.jsxs = jsxs;
      module.exports.jsxDEV = function(t, p, k, s) {
        return (s ? jsxs : jsx2)(t, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // .design-sync/previews/Constellation.tsx
  var Constellation_exports = {};
  __export(Constellation_exports, {
    ChampFourni: () => ChampFourni,
    ChampParDefaut: () => ChampParDefaut,
    Teinte: () => Teinte
  });
  init_define_import_meta_env();

  // ds-shim:ds
  var ds_exports = {};
  __export(ds_exports, {
    default: () => ds_default
  });
  init_define_import_meta_env();
  __reExport(ds_exports, __toESM(require_ds_raw()));
  var g = window.VCPX;
  var ds_default = "default" in g ? g.default : g;

  // .design-sync/previews/Constellation.tsx
  var import_jsx_runtime = __toESM(require_react_shim());
  var Nuit = ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dark relative h-56 overflow-hidden rounded-xl bg-background text-foreground", children });
  var ChampParDefaut = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nuit, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Constellation, { className: "pointer-events-none absolute inset-0" }) });
  var ChampFourni = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nuit, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    ds_exports.Constellation,
    {
      className: "pointer-events-none absolute inset-0",
      stars: [
        { x: 10, y: 20, r: 1.8 },
        { x: 24, y: 12, r: 1.2 },
        { x: 36, y: 28, r: 2.2 },
        { x: 52, y: 16, r: 1.4 },
        { x: 68, y: 32, r: 1.8 },
        { x: 80, y: 18, r: 1.2 },
        { x: 92, y: 42, r: 2 },
        { x: 62, y: 50, r: 1.3 },
        { x: 42, y: 56, r: 1.6 },
        { x: 18, y: 48, r: 1.3 },
        { x: 6, y: 64, r: 1.7 },
        { x: 31, y: 74, r: 1.2 },
        { x: 56, y: 76, r: 1.9 },
        { x: 76, y: 66, r: 1.3 }
      ]
    }
  ) });
  var Teinte = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nuit, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Constellation, { className: "pointer-events-none absolute inset-0", hue: "var(--tertiary)" }) });
  return __toCommonJS(Constellation_exports);
})();
