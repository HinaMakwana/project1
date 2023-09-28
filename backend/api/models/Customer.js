/**
 * Customer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email : {
      type: 'string',
      required: true,
      isEmail: true,
      columnType: 'varchar(255)'
     },
     name : {
      type: 'string',
      allowNull: true,
      columnType: 'varchar(128)'
     },
     city : {
      type: 'string',
      allowNull: true,
      columnType: 'varchar(128)'
     },
     country : {
      type: 'string',
      allowNull: true,
      columnType: 'varchar(128)'
     },
     line1 : {
      type: 'string',
      allowNull: true,
      columnType: 'varchar(255)'
     },
     line2 : {
      type: 'string',
      allowNull: true,
      columnType: 'varchar(255)'
     },
     state : {
      type: 'string',
      allowNull: true,
      columnType: 'varchar(128)'
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
     balance : {
      type: "number",
      defaultsTo: 0,
      columnType: 'float'
     }
  },

};
