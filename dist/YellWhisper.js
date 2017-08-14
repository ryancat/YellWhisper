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

  // getMetaModel: (component) => {
  //   let resultMetaModel = null

  //   utils.traverseComponent(YellWhisper._appMetaModel, (comp, containerObj) => {
  //     if (comp !== component) {
  //       return false
  //     }

  //     resultMetaModel = containerObj
  //     return true
  //   })

  //   return resultMetaModel
  // },

  // getParentComponent: (component) => {
  //   let componentMeta = utils.getMetaModel(component)
  //   if (componentMeta && componentMeta.parent) {
  //     return componentMeta.parent.component
  //   }

  //   return null
  // },

  getParentComponent: function getParentComponent(component) {
    var componentParentId = component._parentId;
    if (componentParentId) {
      return YellWhisper._appMetaModelMap[componentParentId].component;
    }

    return null;
  },

  // getSiblingComponents: (component) => {
  //   let componentMeta = utils.getMetaModel(component)
  //   if (componentMeta && componentMeta.parent) {
  //     let parentMeta = componentMeta.parent

  //     if (parentMeta) {
  //       return utils.getChildrenComponents(parentMeta.component).filter((siblingComponent) => siblingComponent !== component)
  //     }
  //   }

  //   return null
  // },

  getSiblingComponents: function getSiblingComponents(component) {
    var componentSiblingIds = component._siblingIds;
    if (YellWhisper.utils.isArray(componentSiblingIds)) {
      return componentSiblingIds.map(function (id) {
        return YellWhisper._appMetaModelMap[id].component;
      });
    }

    return null;
  },

  // getChildrenComponents: (component) => {
  //   let componentMeta = utils.getMetaModel(component)
  //   if (componentMeta && componentMeta.children) {
  //     return componentMeta.children.map((childMeta) => childMeta.component)
  //   }

  //   return null
  // },

  getChildrenComponents: function getChildrenComponents(component) {
    var componentChildrenIds = component._childrenIds;
    if (YellWhisper.utils.isArray(componentChildrenIds)) {
      return componentChildrenIds.map(function (id) {
        return YellWhisper._appMetaModelMap[id].component;
      });
    }

    return null;
  },

  isHtmlElement: function isHtmlElement(htmlElementToCheck) {
    return htmlElementToCheck instanceof HTMLElement;
  },

  isString: function isString(stringToCheck) {
    return typeof stringToCheck === 'string';
  },

  isArray: function isArray(arrayToCheck) {
    return Array.isArray(arrayToCheck);
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

    // Start to read message
    window.requestAnimationFrame(this._tryReadMessage.bind(this));
  }

  _createClass(YellWhisperComponent, [{
    key: 'yell',
    value: function yell() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      message.type = YellWhisper.messageType.YELL;
      message.meta = message.meta || {};

      if (YellWhisper.debug) {
        utils.log(this.constructor.name + ' yells: ' + message.info + ', ' + message.data);
      }

      var meta = message.meta;

      // Yell to sibling components
      // TODO: Should sibling hear?
      // let siblingComponents = utils.getSiblingComponents(this)

      // if (utils.isArray(siblingComponents)) {
      //   meta.trace = meta.trace || []
      //   meta.trace.push(this)
      //   // siblingComponents.forEach((siblingComponent) => {
      //   //   siblingComponent._willHear(info, data, meta)
      //   // })

      //   siblingComponents.forEach((siblingComponent) => {
      //     siblingComponent._addMessage(message)
      //   })
      // }

      // Yell to parent
      var parentComponent = utils.getParentComponent(this);
      if (parentComponent) {
        meta.trace = meta.trace || [];
        meta.trace.push(this);

        // parentComponent._willHear(info, data, meta)
        parentComponent._addMessage(message);
      }
    }
  }, {
    key: 'whisper',
    value: function whisper() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      message.type = YellWhisper.messageType.WHISPER;
      message.meta = message.meta || {};

      if (YellWhisper.debug) {
        utils.log(this.constructor.name + ' whispers: ' + message.info + ', ' + message.data);
      }

      var meta = message.meta,
          childrenComponents = utils.getChildrenComponents(this);

      if (utils.isArray(childrenComponents)) {
        meta.trace = meta.trace || [];
        meta.trace.push(this);
        childrenComponents.forEach(function (childComponent) {
          // childComponent._willHear(info, data, meta)
          // childComponent.whisper(info, data)
          childComponent._addMessage(message);
        });
      }
    }

    // overwrite
    // hear function should be used when component needs to listen to any
    // messages

  }, {
    key: 'hear',
    value: function hear() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      utils.log(this.constructor.name + ' hears: ' + message.info + ', ' + message.meta);
    }

    /**
     * Try to read message when possible
     */

  }, {
    key: '_tryReadMessage',
    value: function _tryReadMessage() {
      var message = this._readMessage();

      if (message) {
        this._willHear(message);
      }

      window.requestAnimationFrame(this._tryReadMessage.bind(this));
    }
  }, {
    key: '_willHear',
    value: function _willHear(message) {
      // Make sure component hears the message
      this.hear(message);
      this._tryRender();

      // Make sure we yell or whisper accordingly
      if (message.type === YellWhisper.messageType.YELL) {
        // let parentComponent = utils.getParentComponent(this)
        // if (parentComponent) {
        //   parentComponent.yell(message)
        // }

        this.yell(message);
      }

      if (message.type === YellWhisper.messageType.WHISPER) {
        // let childrenComponents = utils.getChildrenComponents(this)
        // if (utils.isArray(childrenComponents)) {
        //   childrenComponents.forEach((childComponent) => childComponent.whisper(message))
        // }

        this.whisper(message);
      }
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

    /**
     * Set the hash id for component
     */

  }, {
    key: '_setId',
    value: function _setId(id) {
      this._id = id;
    }

    /**
     * Set the parent hash id
     */

  }, {
    key: '_setParentId',
    value: function _setParentId(id) {
      this._parentId = id;
    }

    /**
     * Set the sibling hash ids
     */

  }, {
    key: '_setSiblingIds',
    value: function _setSiblingIds() {
      var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      this._siblingIds = ids;
    }

    /**
     * Add id to children ids
     */

  }, {
    key: '_addChildId',
    value: function _addChildId(id) {
      this._childrenIds = this._childrenIds || [];
      this._childrenIds.push(id);
    }
  }, {
    key: '_addMessage',
    value: function _addMessage(message) {
      if (message) {
        this._messageQueue.push(message);
      }
    }
  }, {
    key: '_readMessage',
    value: function _readMessage() {
      return this._messageQueue.pop();
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
  _componentCounter: 0,

  messageType: {
    YELL: 'YELL',
    WHISPER: 'WHISPER'
  },

  registeredComponents: {},
  /**
   * The meta model tree which contains meta model
   */
  _appMetaModel: {},
  /**
   * The meta model map which maps key to meta model
   */
  _appMetaModelMap: {},
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
    var metaModel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : YellWhisper._appMetaModel;

    var componentModel = viewModel.component,
        component = void 0;

    if (componentModel) {
      var componentName = componentModel.name,
          componentClass = YellWhisper.registeredComponents[componentName];

      if (componentClass) {

        if (!metaModel.component) {
          component = new componentClass(componentModel.props, container);
          metaModel.component = component;
          metaModel.componentName = componentName;
          metaModel.id = ++YellWhisper._componentCounter;
          YellWhisper._appMetaModelMap[metaModel.id] = metaModel;

          component._setId(metaModel.id);
          component._messageQueue = [];
        } else {
          component = metaModel.component;
          // TODO: function setModel need to be implemented
          component.setModel(componentModel.props, container);
        }

        // Make sure we always update parent id, in case parent changes
        if (metaModel.parent) {
          var parentMetaModel = metaModel.parent,
              parentComponent = parentMetaModel.component;

          component._setParentId(parentMetaModel.id);
          component._setSiblingIds(parentMetaModel.children.map(function (childMeta) {
            return childMeta.id;
          }).filter(function (id) {
            return id !== metaModel.id;
          }));

          if (parentComponent) {
            parentComponent._addChildId(metaModel.id);
          }
        }
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