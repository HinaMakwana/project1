/**
 * ProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let Msg = sails.config.getMessage;
let { resCode } = sails.config.constants;
const path = require("path");
const fs = require("node:fs");
const { allowedNodeEnvironmentFlags } = require("process");
const User = require("../../models/User");

module.exports = {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description set user profile after signup
   * @route (POST /set/profile)
   */
  setUpProfile: async (req, res) => {
    let lang = req.getLocale();
    try {
      let { username, gender, dob, token } = req.body;
      let result = await User.ValidationBeforeCreate({
        username,
        gender,
      });
      if (result.hasError) {
        return res.status(resCode.BAD_REQUEST).json({
          error: result.error,
        });
      }
      let checkToken = await User.findOne({
        signupToken: token,
        isDeleted: false,
      });
      if (!checkToken) {
        return res.status(resCode.NOT_FOUND).json({
          message: Msg("InvalidToken", lang),
        });
      }

      let dirname = path.join(process.env.BASE_URL, "profile");
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }
      let imageUrl = await sails.helpers.uploadImage("image", req, dirname);
      let checkUsername = await User.findOne({
        username: username,
        isDeleted: false,
      });
      if (checkUsername) {
        return res.status(resCode.CONFLICT).json({
          message: Msg("UsernameExist", lang),
        });
      }

      let data = {
        username,
        gender,
        birthDay: dob,
        profilePic: imageUrl.data.url,
        signupToken: null,
      };
      let updateProfile = await User.updateOne({
        signupToken: token,
        isDeleted: false,
      }).set(data);
      return res.status(resCode.OK).json({
        message: Msg("ProfileUpdated", lang),
        data: updateProfile,
      });
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang),
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description change profile picture
   * @route (POST /change/profilePic)
   */
  changeProfilePic: async (req, res) => {
    let lang = req.getLocale();
    try {
      let { id } = req.me;

      let checkUser = await User.findOne({
        id: id,
        isDeleted: false,
      });
      if (checkUser.profilePic) {
        let imageName = checkUser.profilePic.split("/");
        imageName = imageName[imageName.length - 1];
        imageName = imageName.split(".")[0];

        await sails.helpers.removeImage(imageName);
      }
      let dirname = path.join(process.env.BASE_URL, "profile");
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }
      let imageUrl = await sails.helpers.uploadImage("image", req, dirname);

      await User.updateOne({ id: id }).set({ profilePic: imageUrl.data.url });
      return res.status(resCode.OK).json({
        message: Msg("ProfilePhotoUpdated", lang),
      });
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang) + error,
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description remove profile picture in database and also cludinary
   * @route (POST /remove/profile)
   */
  removeProfilePhoto: async (req, res) => {
    const lang = req.getLocale();
    const userId = req.me.id;
    try {
      let user = await User.findOne({
        id: userId,
        isDeleted: false,
      });
      if (user.profilePic === null) {
        return res.status(resCode.BAD_REQUEST).json({
          status: resCode.BAD_REQUEST,
          message: Msg("PhotoAlreadydeleted", lang),
        });
      }
      let deletePhoto = await User.updateOne({
        id: userId,
        isDeleted: false,
      }).set({ profilePic: null });
      // let imageName = user.profilePic.split('/')[7].split('.')[0];
      let imageName = user.profilePic.split("/");
      imageName = imageName[imageName.length - 1];
      imageName = imageName.split(".")[0];
      console.log(imageName);
      await sails.helpers.removeImage(imageName);
      if (deletePhoto) {
        return res.status(resCode.OK).json({
          status: resCode.OK,
          message: Msg("ProfleDeleted", lang),
        });
      }
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        status: resCode.SERVER_ERROR,
        message: Msg("Error", lang) + error,
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description profile of user
   * @route (get /profile)
   */
  profile: async (req, res) => {
    let lang = req.getLocale();
    try {
      let userId = req.me.id;
      let user = await User.findOne({
        id: userId,
        isDeleted: false,
      }).populateAll();
      if (!user) {
        return res.status(resCode.NOT_FOUND).json({
          message: Msg("UserNotFound", lang),
        });
      }
      return res.status(resCode.OK).json({
        data: user,
      });
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang) + error
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description update user profile
   * @route (PATCH /update/profile)
   * @returns
   */
  updateProfile : async (req,res) => {
    let lang = req.getLocale();
    try {
      let {
        firstName,
        lastName,
        username,
        countryCode,
        phoneNo,
      } = req.body;
      let { id } = req.me;

      let result = await User.ValidationBeforeCreate({
        firstName,
        lastName,
        username,
        countryCode,
        phoneNo
      })
      if(result.hasError) {
        return res.status(resCode.BAD_REQUEST).json({
          message: Msg("ValidationError",lang)
        })
      }

      let checkUsername = await User.findOne({
        id: id,
        isDeleted: false
      })
      if(checkUsername) {
        return res.status(resCode.BAD_REQUEST).json({
          message: Msg("UsernameExist",lang)
        })
      }
      let updateProfile = await User.updateOne({
        id: id,
        isDeleted: false
      })
      .set({
        firstName,
        lastName,
        username,
        countryCode,
        phoneNo
      })
      return res.status(resCode.OK).json({
        message: Msg("ProfileUpdated",lang),
        data: updateProfile
      })
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error",lang) + error
      })
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description Add address of user
   * @route (PATCH /add/address)
   * @returns
   */
  addAddress : async (req,res) => {
    let lang = req.getLocale();
    try {
      let {
        streetNo,
        address,
        city,
        state,
        zipCode
      } = req.body;
      let { id } = req.me;

      let result = await User.ValidationBeforeCreate({
        streetNo,
        address,
        city,
        state,
        zipCode
      })
      if(result.hasError) {
        return res.status(resCode.BAD_REQUEST).json({
          message: Msg("ValidationError",lang)
        })
      }

      let updateAddress = await User.updateOne({
        id: id,
        isDeleted: false
      })
      .set(
        streetNo,
        address,
        city,
        state,
        zipCode
      )
      return res.status(resCode.OK).json({
        message: Msg("ProfileUpdated",lang),
        data: updateAddress
      })
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error",lang) + error
      })
    }
  },
  test : async (req,res) => {
    try {
      let query = `
        select sum(p.price) AS Price,
        p.name as productName,
        c.*
        from category as c,
        product as p
        group by "c"."createdAt",
        "c"."updatedAt",
        "c"."id",
        "p"."name"
      `
      let data = await sails.sendNativeQuery(query)
      return res.send(data);
    } catch (error) {
      return res.status(500).json({
        message: 'error' + error
      })
    }
  }
};
