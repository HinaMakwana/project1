const { cloudinary } = sails.config.constants;

module.exports = {


  friendlyName: 'Remove image',


  description: '',


  inputs: {
    imageName: {
      type: 'string'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    await cloudinary.uploader.destroy(inputs.imageName, (err, result) => {
      if (err) {
        console.log("error", err);
        return err
      }
      if (result) {
        console.log("result", result);
        return result
      }
    });

  }


};
