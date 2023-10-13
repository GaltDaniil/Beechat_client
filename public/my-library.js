(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory(require('react'), require('react-dom'));
    else if (typeof define === 'function' && define.amd) define(['react', 'react-dom'], factory);
    else if (typeof exports === 'object')
        exports['MyLibrary'] = factory(require('react'), require('react-dom'));
    else root['MyLibrary'] = factory(root['react'], root['react-dom']);
})(self, (__WEBPACK_EXTERNAL_MODULE_react__, __WEBPACK_EXTERNAL_MODULE_react_dom__) => {
    return (() => {
        'use strict';
        var __webpack_modules__ = {
            './src/MyReactComponent.js': (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__,
            ) => {
                eval(
                    '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst React = __webpack_require__(/*! react */ "react");\nclass MyReactComponent extends React.Component {\n  render() {\n    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "\\u041F\\u0440\\u0438\\u0432\\u0435\\u0442, \\u044D\\u0442\\u043E React \\u043A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442!"), /*#__PURE__*/React.createElement("p", null, "\\u042D\\u0442\\u043E \\u0434\\u043E\\u0431\\u0430\\u0432\\u043B\\u0435\\u043D\\u043D\\u044B\\u0439 \\u043A\\u043E\\u043D\\u0442\\u0435\\u043D\\u0442."));\n  }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyReactComponent);\n\n//# sourceURL=webpack://MyLibrary/./src/MyReactComponent.js?',
                );
            },

            './src/index.js': (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__,
            ) => {
                eval(
                    '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   renderMyComponent: () => (/* binding */ renderMyComponent)\n/* harmony export */ });\nconst React = __webpack_require__(/*! react */ "react");\nconst ReactDOM = __webpack_require__(/*! react-dom */ "react-dom");\nconst MyReactComponent = __webpack_require__(/*! ./MyReactComponent */ "./src/MyReactComponent.js");\nfunction renderMyComponent() {\n  const container = document.createElement(\'div\');\n  document.body.appendChild(container);\n  ReactDOM.render( /*#__PURE__*/React.createElement(MyReactComponent, null), container);\n}\nrenderMyComponent();\n\n\n//# sourceURL=webpack://MyLibrary/./src/index.js?',
                );
            },

            react: (module) => {
                module.exports = __WEBPACK_EXTERNAL_MODULE_react__;
            },

            'react-dom': (module) => {
                module.exports = __WEBPACK_EXTERNAL_MODULE_react_dom__;
            },
        };

        var __webpack_module_cache__ = {};

        function __webpack_require__(moduleId) {
            var cachedModule = __webpack_module_cache__[moduleId];
            if (cachedModule !== undefined) {
                return cachedModule.exports;
            }

            var module = (__webpack_module_cache__[moduleId] = {
                exports: {},
            });

            __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

            return module.exports;
        }

        (() => {
            __webpack_require__.d = (exports, definition) => {
                for (var key in definition) {
                    if (
                        __webpack_require__.o(definition, key) &&
                        !__webpack_require__.o(exports, key)
                    ) {
                        Object.defineProperty(exports, key, {
                            enumerable: true,
                            get: definition[key],
                        });
                    }
                }
            };
        })();

        (() => {
            __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
        })();

        (() => {
            __webpack_require__.r = (exports) => {
                if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                    Object.defineProperty(exports, Symbol.toStringTag, {
                        value: 'Module',
                    });
                }
                Object.defineProperty(exports, '__esModule', { value: true });
            };
        })();

        var __webpack_exports__ = __webpack_require__('./src/index.js');

        return __webpack_exports__;
    })();
});
