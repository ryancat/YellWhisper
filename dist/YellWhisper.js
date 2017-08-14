/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!****************************!*\
  !*** ./src/YellWhisper.js ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logElement = document.getElementById('log');

var utils = {
  log: function log(message) {
    var messageElement = document.createElement('div');
    messageElement.innerHTML = Date.now() + ': ' + message;
    logElement.insertBefore(messageElement, logElement.firstElementChild);
  },

  traverseComponent: function traverseComponent(metaModel, callback) {
    var key = void 0;
    var stack = [metaModel];

    while (stack.length) {
      var model = stack.pop();
      for (key in model) {
        var value = model[key];
        if (key !== 'component') {
          if (key !== 'parent' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            stack.push(value);
          }
          continue;
        }

        if (callback(value, model)) {
          return;
        }
      }
    }
  },

  getMetaModel: function getMetaModel(component) {
    var resultMetaModel = null;

    utils.traverseComponent(YellWhisper.appMetaModel, function (comp, containerObj) {
      if (comp !== component) {
        return false;
      }

      resultMetaModel = containerObj;
      return true;
    });

    return resultMetaModel;
  },

  getParentComponent: function getParentComponent(component) {
    var componentMeta = utils.getMetaModel(component);
    if (componentMeta && componentMeta.parent) {
      return componentMeta.parent.component;
    }

    return null;
  },

  getSiblingComponents: function getSiblingComponents(component) {
    var componentMeta = utils.getMetaModel(component);
    if (componentMeta && componentMeta.parent) {
      var parentMeta = componentMeta.parent;

      if (parentMeta) {
        return utils.getChildrenComponents(parentMeta.component).filter(function (siblingComponent) {
          return siblingComponent !== component;
        });
      }
    }

    return null;
  },

  getChildrenComponents: function getChildrenComponents(component) {
    var componentMeta = utils.getMetaModel(component);
    if (componentMeta && componentMeta.children) {
      return componentMeta.children.map(function (childMeta) {
        return childMeta.component;
      });
    }

    return null;
  },

  isHtmlElement: function isHtmlElement(htmlElementToCheck) {
    return htmlElementToCheck instanceof HTMLElement;
  },

  isString: function isString(stringToCheck) {
    return typeof stringToCheck === 'string';
  }

  // isFunctionType: (functionToCheck) => {
  //   return functionToCheck && Object.prototype.toString.call(functionToCheck) === '[object Function]'
  // }
};

var YellWhisperComponent = function () {
  function YellWhisperComponent() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var container = arguments[1];

    _classCallCheck(this, YellWhisperComponent);

    this.props = props;
    this.container = container;

    // Add element wrapper into container
    this.element = document.createElement('div');
    this.element.classList.add('yellWisperComponent');
    this.container.appendChild(this.element);

    // We may need to have children container if component has children
    this.childrenContainer = null;

    // Try to render the first time
    this._tryRender();
  }

  _createClass(YellWhisperComponent, [{
    key: 'yell',
    value: function yell() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var data = arguments[1];
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (YellWhisper.debug) {
        utils.log(this.constructor.name + ' yells: ' + message + ', ' + data);
      }

      var siblingComponents = utils.getSiblingComponents(this);
      if (siblingComponents) {
        meta.trace = meta.trace || [];
        meta.trace.push(this);
        siblingComponents.forEach(function (siblingComponent) {
          siblingComponent._willHear(message, data, meta);
        });
      }

      var parentComponent = utils.getParentComponent(this);
      if (parentComponent) {
        meta.trace = meta.trace || [];
        meta.trace.push(this);
        parentComponent._willHear(message, data, meta);
        parentComponent.yell(message, data);
      }
    }
  }, {
    key: 'whisper',
    value: function whisper() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var data = arguments[1];
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      utils.log(this.constructor.name + ' whispers: ' + message + ', ' + data);
      var childrenComponents = utils.getChildrenComponents(this);
      if (childrenComponents) {
        meta.trace = meta.trace || [];
        meta.trace.push(this);
        childrenComponents.forEach(function (childComponent) {
          childComponent._willHear(message, data, meta);
          childComponent.whisper(message, data);
        });
      }
    }

    // overwrite
    // hear function should be used when component needs to listen to any
    // messages

  }, {
    key: 'hear',
    value: function hear() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var data = arguments[1];
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      utils.log(this.constructor.name + ' hears: ' + message + ', ' + meta);
    }
  }, {
    key: '_willHear',
    value: function _willHear() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var data = arguments[1];
      var meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // Make sure component hears the message
      this.hear(message, data, meta);
      this._tryRender();
    }
  }, {
    key: '_tryRender',
    value: function _tryRender() {
      if (this.shouldComponentRender()) {
        // TODO: use virtual dom for better render performance
        var renderResult = this.render();

        if (utils.isString(renderResult)) {
          this.element.innerHTML = renderResult;
        } else if (utils.isHtmlElement(renderResult)) {
          this.element.innerHTML = '';
          this.element.appendChild(renderResult);
        }
      }
    }

    // overwrite
    // render function should return DOM element or the inner HTML string for
    // the current component. It has to be in a single root element

  }, {
    key: 'render',
    value: function render() {
      return '';
    }
  }, {
    key: 'createChildrenContainer',
    value: function createChildrenContainer() {
      var childrenContainer = document.createElement('div');
      childrenContainer.classList.add('yellWhisperChildrenContainer');
      this.element.appendChild(childrenContainer);

      return childrenContainer;
    }

    // Overwrite

  }, {
    key: 'shouldComponentRender',
    value: function shouldComponentRender() {
      return true;
    }
  }]);

  return YellWhisperComponent;
}();

window.YellWhisper = {
  debug: true,
  utils: utils,
  Component: YellWhisperComponent,
  registeredComponents: {},
  /**
   * The meta model which contains only component tree
   */
  appMetaModel: {},
  /**
   * Register component so that it's available for init
   */
  registerComponent: function registerComponent(componentName, component) {
    YellWhisper.registeredComponents[componentName] = component;
  },
  /**
   * Decorate the given view model inside container
   */
  decorate: function decorate(viewModel, container) {
    var metaModel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : YellWhisper.appMetaModel;

    var componentModel = viewModel.component,
        component = void 0;

    if (componentModel) {
      var componentName = componentModel.name,
          componentClass = YellWhisper.registeredComponents[componentName];

      if (componentClass) {
        component = new componentClass(componentModel.props, container);
        metaModel.component = component;
        metaModel.componentName = componentName;
      }
    }

    if (componentModel.children) {
      var childrenContainer = component.childrenContainer || component.createChildrenContainer();
      metaModel.children = [];
      componentModel.children.forEach(function (childModel) {
        var childMetaModel = {
          parent: metaModel
        };
        metaModel.children.push(childMetaModel);
        YellWhisper.decorate(childModel, childrenContainer, childMetaModel);
      });
    }
  }
};

/***/ })
/******/ ]);
//# sourceMappingURL=YellWhisper.js.map