'use strict'

const assert = require('chai').assert
const createLucid = require('./helpers/CreateLucid')
const createProvider = require('./helpers/createProvider')
const createUserModel = require('./helpers/CreateUserModel')

function getWhereCondition(query) {
  query = query.toString().replace('select * from `users`', '').trim()
  if (query.startsWith('where')) {
    query = query.substr(6)
  }

  return query.trim()
}

let User
describe('optional queries', function () {
  before(async () => {
    const { ioc } = createProvider()
    const lucid = createLucid(ioc)

    User = createUserModel(lucid)
  })

  it('can use `optional` together with `where`', () => {
    const query = User.query()
      .where('active', 1)
      .optional(query => query
        .where('id', 1)
      )
      .where('status', 1)
  
    assert.equal(getWhereCondition(query), "`active` = 1 and `id` = 1 and `status` = 1")
  })
  
  describe('ignore', () => {
    it('ignores empty object in optional where condition', () => {
      const query = User.query()
      .optional(query => query
        .whereIn('tags', [])
      )
    
      assert.equal(getWhereCondition(query), "")
    })
    
    it('ignores empty string in optional where condition', () => {
      const query = User.query()
      .optional(query => query
        .where('test', '')
      )
    
      assert.equal(getWhereCondition(query), "")
    })

    it('ignores boolean false in optional where condition', () => {
      const query = User.query()
      .optional(query => query
        .where('test', false)
      )
    
      assert.equal(getWhereCondition(query), "")
    })
    
    it('ignores null and undefined in optional where condition', () => {
      const query = User.query()
      .optional(query => query
        .where('test', undefined)
        .where('test2', null)
      )
    
      assert.equal(getWhereCondition(query), "")
    })
  })
  
  describe('does not ignore', () => {
    it('does not ignore 0 in optional where condition', () => {
      const query = User.query()
      .optional(query => query
        .where('test', 0)
      )
    
      assert.equal(getWhereCondition(query), "`test` = 0")
    })
  })
})