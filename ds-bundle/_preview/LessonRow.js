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

  // .design-sync/previews/LessonRow.tsx
  var LessonRow_exports = {};
  __export(LessonRow_exports, {
    AVenir: () => AVenir,
    Minimal: () => Minimal,
    Sommaire: () => Sommaire
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

  // .design-sync/previews/LessonRow.tsx
  var import_jsx_runtime = __toESM(require_react_shim());
  var Sommaire = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-3xl divide-y divide-outline-variant", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      ds_exports.LessonRow,
      {
        slug: "ce-que-finance-vraiment-un-vc",
        order: 1,
        kicker: "Fondations",
        title: "Ce que finance vraiment un VC",
        readMin: 9,
        summary: "Le capital-risque ne finance pas une idée mais une trajectoire de croissance sous contrainte de sortie.",
        done: true
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      ds_exports.LessonRow,
      {
        slug: "construire-une-these-d-investissement",
        order: 2,
        kicker: "Méthode",
        title: "Construire une thèse d'investissement",
        readMin: 14,
        practiceMin: 25,
        summary: "Une thèse se formule comme une proposition réfutable, pas comme une préférence sectorielle.",
        reading: true
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      ds_exports.LessonRow,
      {
        slug: "lire-une-cap-table",
        order: 3,
        kicker: "Outils",
        title: "Lire une cap table",
        readMin: 11,
        summary: "Repérer la dilution, les préférences et ce que le tableau ne dit pas."
      }
    )
  ] });
  var AVenir = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-3xl", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    ds_exports.LessonRow,
    {
      slug: "negocier-un-term-sheet",
      order: 4,
      kicker: "Négociation",
      title: "Négocier un term sheet",
      readMin: 16,
      summary: "Les clauses qui décident réellement du partage de la valeur.",
      upcoming: true
    }
  ) });
  var Minimal = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-3xl", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    ds_exports.LessonRow,
    {
      slug: "le-vocabulaire-du-capital-risque",
      order: 1,
      kicker: "Glossaire",
      title: "Le vocabulaire du capital-risque",
      readMin: 6
    }
  ) });
  return __toCommonJS(LessonRow_exports);
})();
