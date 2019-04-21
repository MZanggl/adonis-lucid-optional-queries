const { ServiceProvider } = require('@adonisjs/fold')

class OptionalQueriesProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Addons/OptionalQueries', () => {
      const OptionalQueries = require('../src/Traits/OptionalQueries')

      return new OptionalQueries()
    })

    this.app.alias('Adonis/Addons/OptionalQueries', 'Lucid/OptionalQueries')
  }
}

module.exports = OptionalQueriesProvider