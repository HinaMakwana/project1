/**
 * Cart.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let Validator = require('validatorjs');
module.exports = {
  attributes: {
    //one way association
    user: {
      model: 'user'
    },
    //one way association
    product: {
      model: 'product'
    },
    quantity: {
      type: "number",
      defaultsTo: 1,
      columnType: "int"
    },
    totalPrice: {
      type: 'number',
      columnType: 'float'
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    }
  },
  ValidateBeforeCreate : (data) => {
    let rules = {
      quantity: 'integer',
      user: 'required',
      product: 'required'
    }
    let validate = new Validator(data,rules)
    let result = {};
    if(validate.passes()){
      sails.log.info('validate success');
      result['hasError'] = false
      return data;
    }
    if(validate.fails()) {
      result['hasError'] = true
      result['error'] = validate.errors.all()
    }
    return result;
  }
};
