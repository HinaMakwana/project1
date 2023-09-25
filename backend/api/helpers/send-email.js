const nodemailer = require('nodemailer');

module.exports = {


  friendlyName: 'Send mail',


  description: '',


  inputs: {
    email : {
      type : 'string'
    },
    firstName : {
      type : 'string'
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const mail = 'zignutsTechnoLab@zignuts.com';
    let result = {};
    let transport = await nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: { user: process.env.USER1, pass: process.env.PASSWORD }
    });
    let message  = {
      from : mail,
      to : `${inputs.email}`,
      subject : "Welcome message",
      // text : "Hello",
      html : `Welcome ${inputs.firstName}`
    }
    result = await transport.sendMail(message)
    return result
  }
}
