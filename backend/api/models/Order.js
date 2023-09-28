/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let { orderStatus } = sails.config.constants;
module.exports = {
  attributes: {
    //one way association
    user: {
      model: "user",
    },
    totalAmount: {
      type: "number",
      columnType: "float",
    },
    address: {
      type: "string",
      required: true,
      columnType: "varchar(255)",
    },
    countryCode: {
      type: "string",
      allowNull: true,
      columnType: "varchar",
    },
    phoneNo: {
      type: "number",
      allowNull: true,
      columnType: "float",
    },
    orderDate: {
      type: "ref",
      defaultsTo: new Date().toLocaleString(),
    },
    orderStatus: {
      type: "string",
      isIn: [orderStatus.pending, orderStatus.delivered, orderStatus.cancel],
      defaultsTo: orderStatus.pending
    },
  },
};
