/**
 * Admin.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let validationRule = sails.config.constants.validationRule.Admin;
let Validator = require('validatorjs');

module.exports = {

  attributes: {

    name : {
      type: 'string',
      minLength: 3,
      required: true,
      columnType: 'varchar(128)'
    },
    email : {
      type: 'string',
      isEmail: true,
      required: true,
      columnType: 'varchar(255)'
    },
    password : {
      type: 'string',
      columnType: 'varchar',
      required: true
    },
    token : {
      type: 'string',
      allowNull: true
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
    let validate = new Validator(data,rules);
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
