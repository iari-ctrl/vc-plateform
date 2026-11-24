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
      function jsxs2(t, p, k) {
        return R.createElement.apply(R, [t, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx2;
      module.exports.jsxs = jsxs2;
      module.exports.jsxDEV = function(t, p, k, s) {
        return (s ? jsxs2 : jsx2)(t, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // .design-sync/previews/Graticule.tsx
  var Graticule_exports = {};
  __export(Graticule_exports, {
    BandeDOuverture: () => BandeDOuverture,
    FondDeSection: () => FondDeSection,
    SurFondSombre: () => SurFondSombre
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

  // .design-sync/previews/Graticule.tsx
  var import_jsx_runtime = __toESM(require_react_shim());
  var FondDeSection = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative isolate h-56 overflow-hidden rounded-xl border border-outline-variant bg-surface", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Graticule, { className: "pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-20" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "eyebrow", children: "Carte des parcours" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "mt-2 font-headline text-headline-md font-semibold", children: "Atlas des parcours" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mt-2 max-w-sm text-sm text-surface-variant", children: "Vingt-quatre trajectoires, reliées par leurs prérequis et leurs recouvrements de contenu." })
    ] })
  ] });
  var SurFondSombre = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dark relative isolate h-56 overflow-hidden rounded-xl bg-background text-foreground", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Graticule, { className: "pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-60", hue: "var(--primary)" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "eyebrow", children: "Panneau nocturne" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "mt-2 font-headline text-headline-md font-semibold", children: "Se repérer" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mt-2 max-w-sm text-sm text-surface-variant", children: "Le même filet, teinté par l'accent, sous un panneau du thème sombre." })
    ] })
  ] });
  var BandeDOuverture = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative isolate h-64 overflow-hidden rounded-xl border border-outline-variant bg-surface", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ds_exports.Graticule, { className: "pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 w-full opacity-25" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex h-full flex-col items-center justify-center px-8 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "eyebrow", children: "Maison Sapience VC" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "mt-3 font-headline text-display-sm font-semibold", children: "Décortiquer un écosystème" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mt-3 max-w-md text-sm text-surface-variant", children: "Le filet s'arrête à mi-hauteur et laisse le bas de la bande au contenu." })
    ] })
  ] });
  return __toCommonJS(Graticule_exports);
})();
