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

  getMetaModel: (component) => {
    let resultMetaModel = null

    utils.traverseComponent(YellWhisper.appMetaModel, (comp, containerObj) => {
      if (comp !== component) {
        return false
      }

      resultMetaModel = containerObj
      return true
    })

    return resultMetaModel
  },

  getParentComponent: (component) => {
    let componentMeta = utils.getMetaModel(component)
    if (componentMeta && componentMeta.parent) {
      return componentMeta.parent.component
    }

    return null
  },

  getSiblingComponents: (component) => {
    let componentMeta = utils.getMetaModel(component)
    if (componentMeta && componentMeta.parent) {
      let parentMeta = componentMeta.parent

      if (parentMeta) {
        return utils.getChildrenComponents(parentMeta.component).filter((siblingComponent) => siblingComponent !== component)
      }
    }

    return null
  },

  getChildrenComponents: (component) => {
    let componentMeta = utils.getMetaModel(component)
    if (componentMeta && componentMeta.children) {
      return componentMeta.children.map((childMeta) => childMeta.component)
    }

    return null
  },

  isHtmlElement: (htmlElementToCheck) => {
    return htmlElementToCheck instanceof HTMLElement
  },

  isString: (stringToCheck) => {
    return (typeof stringToCheck) === 'string'
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
  }

  yell (message = '', data, meta = {}) {
    if (YellWhisper.debug) {
      utils.log(`${this.constructor.name} yells: ${message}, ${data}`)
    }

    let siblingComponents = utils.getSiblingComponents(this)
    if (siblingComponents) {
      meta.trace = meta.trace || []
      meta.trace.push(this)
      siblingComponents.forEach((siblingComponent) => {
        siblingComponent._willHear(message, data, meta)
      })
    }

    let parentComponent = utils.getParentComponent(this)
    if (parentComponent) {
      meta.trace = meta.trace || []
      meta.trace.push(this)
      parentComponent._willHear(message, data, meta)
      parentComponent.yell(message, data)
    }
  }

  whisper (message = '', data, meta = {}) {
    utils.log(`${this.constructor.name} whispers: ${message}, ${data}`)
    let childrenComponents = utils.getChildrenComponents(this)
    if (childrenComponents) {
      meta.trace = meta.trace || []
      meta.trace.push(this)
      childrenComponents.forEach((childComponent) => {
        childComponent._willHear(message, data, meta)
        childComponent.whisper(message, data)
      })
    }
  }

  // overwrite
  // hear function should be used when component needs to listen to any
  // messages
  hear (message = '', data, meta = {}) {
    utils.log(`${this.constructor.name} hears: ${message}, ${meta}`)
  }

  _willHear (message = '', data, meta = {}) {
    // Make sure component hears the message
    this.hear(message, data, meta)
    this._tryRender()
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
  registeredComponents: {},
  /**
   * The meta model which contains only component tree
   */
  appMetaModel: {},
  /**
   * Register component so that it's available for init
   */
  registerComponent: (componentName, component) => {
    YellWhisper.registeredComponents[componentName] = component
  },
  /**
   * Decorate the given view model inside container
   */
  decorate: (viewModel, container, metaModel = YellWhisper.appMetaModel) => {
    let componentModel = viewModel.component,
        component

    if (componentModel) {
      const componentName = componentModel.name,
            componentClass = YellWhisper.registeredComponents[componentName]

      if (componentClass) {
        component = new componentClass(componentModel.props, container)
        metaModel.component = component
        metaModel.componentName = componentName
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
