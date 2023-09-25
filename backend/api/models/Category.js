/**
 * Category.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let { status } = sails.config.constants;
module.exports = {

  attributes: {

    name: {
      type: 'string',
      minLength: 3,
      required: true,
      columnType: 'varchar(255)',
      columnName: 'categoryName'
    },
    Image: {
      type: 'string',
      allowNull : true
    },
    No_Products: {
      type: 'number',
      defaultsTo: 0,
      columnType: 'int',
      columnName: 'Number of Products'
    },
    status: {
      type: 'string',
      isIn : [status.A, status.I],
      defaultsTo: status.A
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    },
    //one-to-many association
    subCategories : {
      collection: 'subCategory',
      via: 'category'
    },
    //one-to-many association
    products : {
      collection : 'product',
      via: 'categoryId'
    }
  },

};
