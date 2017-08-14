const logElement = document.getElementById('log')

const utils = {
  log: (message) => {
    let messageElement = document.createElement('div')
    messageElement.innerHTML = `${Date.now()}: ${message}`
    logElement.insertBefore(messageElement, logElement.firstElementChild)
  },

  traverseComponent: (metaModel, callback) => {
    let key
    let stack = [metaModel]

    while(stack.length) {
      let model = stack.pop()
      for (key in model) {
        let value = model[key]
        if (key !== 'component') {
          if (key !== 'parent' && typeof value === 'object') {
            stack.push(value)
          }
          continue
        }

        if (callback(value, model)) {
          return
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

  getParentComponent: (component) => {
    const componentParentId = component._parentId
    if (componentParentId) {
      return YellWhisper._appMetaModelMap[componentParentId].component
    }

    return null
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

  getSiblingComponents: (component) => {
    const componentSiblingIds = component._siblingIds
    if (YellWhisper.utils.isArray(componentSiblingIds)) {
      return componentSiblingIds.map((id) => YellWhisper._appMetaModelMap[id].component)
    }

    return null
  },

  // getChildrenComponents: (component) => {
  //   let componentMeta = utils.getMetaModel(component)
  //   if (componentMeta && componentMeta.children) {
  //     return componentMeta.children.map((childMeta) => childMeta.component)
  //   }

  //   return null
  // },

  getChildrenComponents: (component) => {
    const componentChildrenIds = component._childrenIds
    if (YellWhisper.utils.isArray(componentChildrenIds)) {
      return componentChildrenIds.map((id) => YellWhisper._appMetaModelMap[id].component)
    }

    return null
  },

  isHtmlElement: (htmlElementToCheck) => {
    return htmlElementToCheck instanceof HTMLElement
  },

  isString: (stringToCheck) => {
    return (typeof stringToCheck) === 'string'
  },

  isArray: (arrayToCheck) => {
    return Array.isArray(arrayToCheck)
  }

  // isFunctionType: (functionToCheck) => {
  //   return functionToCheck && Object.prototype.toString.call(functionToCheck) === '[object Function]'
  // }
}

class YellWhisperComponent {
  constructor (props = {}, container) {
    this.props = props
    this.container = container

    // Add element wrapper into container
    this.element = document.createElement('div')
    this.element.classList.add('yellWisperComponent')
    this.container.appendChild(this.element)

    // We may need to have children container if component has children
    this.childrenContainer = null

    // Try to render the first time
    this._tryRender()

    // Start to read message
    window.requestAnimationFrame(this._tryReadMessage.bind(this))
  }

  yell (message = {}) {
    message.type = YellWhisper.messageType.YELL
    message.meta = message.meta || {}


    if (YellWhisper.debug) {
      utils.log(`${this.constructor.name} yells: ${message.info}, ${message.data}`)
    }

    let meta = message.meta

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
    let parentComponent = utils.getParentComponent(this)
    if (parentComponent) {
      meta.trace = meta.trace || []
      meta.trace.push(this)

      // parentComponent._willHear(info, data, meta)
      parentComponent._addMessage(message)
    }
  }

  whisper (message = {}) {
    message.type = YellWhisper.messageType.WHISPER
    message.meta = message.meta || {}

    if (YellWhisper.debug) {
      utils.log(`${this.constructor.name} whispers: ${message.info}, ${message.data}`)
    }

    let meta = message.meta,
        childrenComponents = utils.getChildrenComponents(this)

    if (utils.isArray(childrenComponents)) {
      meta.trace = meta.trace || []
      meta.trace.push(this)
      childrenComponents.forEach((childComponent) => {
        // childComponent._willHear(info, data, meta)
        // childComponent.whisper(info, data)
        childComponent._addMessage(message)
      })
    }
  }

  // overwrite
  // hear function should be used when component needs to listen to any
  // messages
  hear (message = {}) {
    utils.log(`${this.constructor.name} hears: ${message.info}, ${message.meta}`)
  }

  /**
   * Try to read message when possible
   */
  _tryReadMessage () {
    let message = this._readMessage()

    if (message) {
      this._willHear(message)
    }

    window.requestAnimationFrame(this._tryReadMessage.bind(this))
  }

  _willHear (message) {
    // Make sure component hears the message
    this.hear(message)
    this._tryRender()

    // Make sure we yell or whisper accordingly
    if (message.type === YellWhisper.messageType.YELL) {
      // let parentComponent = utils.getParentComponent(this)
      // if (parentComponent) {
      //   parentComponent.yell(message)
      // }

      this.yell(message)
    }

    if (message.type === YellWhisper.messageType.WHISPER) {
      // let childrenComponents = utils.getChildrenComponents(this)
      // if (utils.isArray(childrenComponents)) {
      //   childrenComponents.forEach((childComponent) => childComponent.whisper(message))
      // }

      this.whisper(message)
    }
  }

  _tryRender () {
    if (this.shouldComponentRender()) {
      // TODO: use virtual dom for better render performance
      let renderResult = this.render()

      if (utils.isString(renderResult)) {
        this.element.innerHTML = renderResult
      }
      else if (utils.isHtmlElement(renderResult)) {
        this.element.innerHTML = ''
        this.element.appendChild(renderResult)
      }
    }
  }

  // overwrite
  // render function should return DOM element or the inner HTML string for
  // the current component. It has to be in a single root element
  render () {
    return ''
  }

  /**
   * Set the hash id for component
   */
  _setId (id) {
    this._id = id
  }

  /**
   * Set the parent hash id
   */
  _setParentId (id) {
    this._parentId = id
  }

  /**
   * Set the sibling hash ids
   */
  _setSiblingIds (ids = []) {
    this._siblingIds = ids
  }

  /**
   * Add id to children ids
   */
  _addChildId (id) {
    this._childrenIds = this._childrenIds || []
    this._childrenIds.push(id)
  }

  _addMessage (message) {
    if (message) {
      this._messageQueue.push(message)
    }
  }

  _readMessage () {
    return this._messageQueue.pop()
  }

  createChildrenContainer () {
    let childrenContainer = document.createElement('div')
    childrenContainer.classList.add('yellWhisperChildrenContainer')
    this.element.appendChild(childrenContainer)

    return childrenContainer
  }

  // Overwrite
  shouldComponentRender () {
    return true
  }
}

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
  registerComponent: (componentName, component) => {
    YellWhisper.registeredComponents[componentName] = component
  },
  /**
   * Decorate the given view model inside container
   */
  decorate: (viewModel, container, metaModel = YellWhisper._appMetaModel) => {
    let componentModel = viewModel.component,
        component

    if (componentModel) {
      const componentName = componentModel.name,
            componentClass = YellWhisper.registeredComponents[componentName]

      if (componentClass) {

        if (!metaModel.component) {
          component = new componentClass(componentModel.props, container)
          metaModel.component = component
          metaModel.componentName = componentName
          metaModel.id = ++YellWhisper._componentCounter
          YellWhisper._appMetaModelMap[metaModel.id] = metaModel

          component._setId(metaModel.id)
          component._messageQueue = []
        }
        else {
          component = metaModel.component
          // TODO: function setModel need to be implemented
          component.setModel(componentModel.props, container)
        }

        // Make sure we always update parent id, in case parent changes
        if (metaModel.parent) {
          let parentMetaModel = metaModel.parent,
              parentComponent = parentMetaModel.component

          component._setParentId(parentMetaModel.id)
          component._setSiblingIds(
            parentMetaModel.children
            .map((childMeta) => childMeta.id)
            .filter((id) => id !== metaModel.id ))

          if (parentComponent) {
            parentComponent._addChildId(metaModel.id)
          }
        }

      }

    }

    if (componentModel.children) {
      let childrenContainer = component.childrenContainer || component.createChildrenContainer()
      metaModel.children = []
      componentModel.children.forEach((childModel) => {
        let childMetaModel = {
          parent: metaModel
        }
        metaModel.children.push(childMetaModel)
        YellWhisper.decorate(childModel, childrenContainer, childMetaModel)
      })
    }
  }
}
