/**
 * Product.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let {status} = sails.config.constants;
let validationRule = sails.config.constants.validationRule.Product;
let Validator = require('validatorjs');

module.exports = {

  attributes: {

    name : {
      type: "string",
      minLength: 3,
      required: true,
      columnType: "varchar(128)"
    },
    categoryId : {
      model: 'category'
    },
    subCategoryId : {
      model: 'subCategory'
    },
    description : {
      type: "string",
      columnType: "varchar(255)",
      allowNull: true,
    },
    quantity : {
      type: "number",
      defaultsTo: 1,
      columnType: "int"
    },
    price : {
      type: "number",
      required: true,
      columnType: "float"
    },
    brandName : {
      type: "string",
      allowNull: true,
      columnType: "varchar"
    },
    imageUrl : {
      type: "string",
      allowNull: true,
      columnType: "varchar(255)"
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    },
    status: {
      type: 'string',
      isIn: [status.A,status.I],
      defaultsTo: status.A
    }

  },
  ValidationBeforeCreate : (data) => {
    let requiredRules = Object.keys(validationRule).filter((key)=> {
      if(Object.keys(data).indexOf(key)>= 0) {
        return key;
      }
    })
    let rules = {};
    requiredRules.forEach((val)=> {
      rules[val] = validationRule[val]
    })
    let validate = new Validator(data,rules)
    let result = {}
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
