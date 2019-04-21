### Installation

```bash
npm i adonis-lucid-optional-queries --save
```

### Registering provider

Make sure to register the provider inside start/app.js

```javascript
const providers = [
  "adonis-lucid-optional-queries/providers/OptionalQueriesProvider"
]
```

### Usage

First add the trait to the model.

```javascript
const Model = use("Model")

class User extends Model {
  static boot() {
    super.boot()

    this.addTrait("@provider:Lucid/OptionalQueries")
  }
}
```

Finally use the method as follows

```javascript
const User = use("App/Models/User")

User.query()
    .where('active', true)
    .where('group', request.input('group'))
    .optional(query => query
        .where('name', request.input('name'))
        .where('city', request.input('city'))
        .where('zip', request.input('zip'))
        .where('birthday', request.input('birthday'))
    )
    .fetch()
```

In the above query it will add `active` and `group` to the WHERE condition at all times. 

For everything within the `optional` closure it will only add the condition if the values are not falsy.

That means if `name` and `city` are filled in the request, but not `zip` and `birthday`, the WHERE condition would be for example:

```sql
select * from users where `active` = true and `group` = 1 and `name` = 'Lukas' and `city` = 'Tokyo';
```

> What is considered falsy is: undefined, null, [], ''

> What is not considered falsy: false, 0, '0'