/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let {gender,status} = sails.config.constants;
let validationRule = sails.config.constants.validationRule.User;
let Validator = require('validatorjs');
module.exports = {

  attributes: {

   firstName : {
    type: 'string',
    required: true,
    columnType: 'varchar(128)',
    minLength: 3
   },
   lastName : {
    type: 'string',
    required: true,
    columnType: 'varchar(128)',
    minLength:3
   },
   username : {
    type: 'string',
    columnType: 'varchar(255)',
    minLength: 5,
   },
   email : {
    type: 'string',
    required: true,
    isEmail: true,
    columnType: 'varchar(255)'
   },
   password : {
    type: 'string',
    required: true,
    columnType: 'varchar(255)',
   },
   countryCode: {
    type: 'string',
    allowNull: true,
    columnType: 'varchar'
   },
   phoneNo : {
    type: 'number',
    allowNull: true,
    columnType: 'float'
   },
   birthDay : {
    type: 'string',
    allowNull: true
   },
   gender : {
    type: 'string',
    isIn: [gender.male,gender.female],
    allowNull: true
   },
   streetNo : {
    type: 'number',
    allowNull: true,
    columnName: 'Street/Building number',
    columnType: 'int'
   },
   address : {
    type: 'string',
    allowNull: true,
    columnType: 'varchar(255)'
   },
   city : {
    type: 'string',
    allowNull: true,
    columnType: 'varchar(128)'
   },
   state : {
    type: 'string',
    allowNull: true,
    columnType: 'varchar(128)'
   },
   zipCode : {
    type: 'number',
    allowNull: true,
    columnType: 'float'
   },
   isDeleted : {
    type: 'boolean',
    defaultsTo: false
   },
   status : {
    type: 'string',
    isIn: [status.A,status.I],
    defaultsTo: status.A
   },
   profilePic : {
    type: 'string',
    allowNull: true,
    columnType: 'varchar(255)',
    columnName: 'Profile picture'
   },
   authToken : {
    type: 'string',
    allowNull: true,
    columnType: 'varchar(255)'
   },
   forgetPassToken : {
    type: 'string',
    allowNull: true,
    columnType: 'varchar',
    columnName: 'forgetPasswordToken'
   },
   forgetTokenExpire : {
    type: 'number',
    allowNull: true,
    columnName: 'forgetPasswordTokenExpiryTime'
   },
   signupToken : {
    type: 'string',
    allowNull: true
   },
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
