let stripe = require('stripe')(process.env.STRIPE_PRIVATE);
module.exports = {

  friendlyName: 'Create',


  description: 'Create customer.',


  inputs: {
    firstName : {
      type: 'string'
    },
    lastName : {
      type: 'string'
    },
    email : {
      type: 'string'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },
    
  },


  fn: async function (inputs) {
    let {firstName,lastName,email} = inputs;
    let name = firstName.concat(' ',lastName);
    let customer = await stripe.customers.create({
      name: name,
      email: inputs.email
    })
    await Customer.create({
      id: customer.id,
      name: name,
      email: email
    })
  }
};
