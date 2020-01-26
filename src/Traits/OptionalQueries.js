'use strict'

class OptionalQueries {
  register (Model) {
    const handler = this.createHandler()

    Model.queryMacro('optional', function(callback) {
      const proxy = new Proxy(this, handler)

      callback(proxy)

      return this
    })
  }

  createHandler() {
    return {
      get: (target, prop, receiver) => {
        if (!target[prop]) {
          return undefined
        }

        return (...values) => {
          if (this.isFalsy(prop, values)) {
            return receiver
          }

          return target[prop](...values)
        }
      }
    }
  }

  isFalsy(prop, values) {
    return values.some(value => {
      if (value === null || value === undefined) {
        return true
      }
  
      if (typeof value === 'object' && Object.keys(value).length < 1) {
        return true
      }
  
      if (value === '') {
        return true
      }

      if (value === false) {
        return true
      }
  
      return false
    })
  }
}

module.exports = OptionalQueries
