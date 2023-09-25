const { cloudinary, imageType } = sails.config.constants;

module.exports = {
  friendlyName: "Upload image",

  description: "",

  inputs: {
    name: {
      type: "string",
    },
    req: {
      type: "ref",
    },
    dirname: {
      type: "string"
    }
  },

  exits: {
    success: {
      description: "All done.",
    },
    err: {
      description: "Not uploaded",
    },
  },

  fn: async function (inputs) {
    let url = {};
    let req1 = inputs.req;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
    return new Promise(async (resolve, reject) => {
      await req1.file(inputs.name).upload(
        {
          adapter: require("skipper-disk"),
          maxBytes: 10000000,
          saveAs: function (file, cb) {
            cb(null, file.filename);
          },
          dirname: inputs.dirname,
        },
        async (err, uploadedFiles) => {
          if (err) {
            console.log(err);
            url["hasError"] = true;
            url["error"] = err;
            return resolve(url)
          }
          if (uploadedFiles.length === 0) {
            url["hasError"] = true;
            url["error"] = "you must to choose picture to upload"
            return resolve(url);
          }
          let fileType = uploadedFiles[0].type;
          if (!imageType.includes(fileType.toString())) {
            url["hasError"] = true;
            url["error"] = "Image type is not valid, entered only jpg, jpeg, png, avif pictures"
            return resolve(url);
          }
          await cloudinary.uploader.upload(
            uploadedFiles[0].fd,
            (error, result) => {
              if (error) {
                url["hasError"] = true;
                url["error"] = error;
                return resolve(url);
              }
              if (result) {
                url["hasError"] = false;
                url["data"] = result;
                return resolve(url);
              }
            }
          );
        }
      );
    });
  },
};
