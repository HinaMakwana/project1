/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let { resCode, UUID } = sails.config.constants;
let Msg = sails.config.getMessage;
module.exports = {

	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @description create new admin
	 * @route (POST /admin/signup)
	 */
	signUp : async (req,res) => {
		let lang = req.getLocale();
		try {
			let {
				name,
				email,
				password
			} =req.body;

			let result = Admin.ValidationBeforeCreate({
				name,
				email,
				password
			})
			if(result.hasError) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("ValidationError",lang),
					error: result.error
				})
			}

			let checkEmail = await Admin.findOne({
				email: email,
			})
			if(checkEmail) {
				return res.status(resCode.CONFLICT).json({
					message: Msg("EmailExist",lang)
				})
			}

			let hashPass = await bcrypt.hash(password,10);
			if(!hashPass) {
				return res.status(resCode.BAD_REQUEST).json({
					error : Msg("Error",lang)
				})
			}

			let data = {
				id: UUID(),
				name,
				email,
				password: hashPass
			}
			let createAdmin = await Admin.create(data).fetch();
			return res.status(resCode.CREATED).json({
				message: Msg("AdminCreated",lang),
				data: createAdmin
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
	 * @description login for admin
	 * @route (POST /admin/login)
	 */
	login : async (req,res) => {
		let lang = req.getLocale();
		try {
			let {
				email,
				password
			} = req.body;
			let checkEmail = await Admin.findOne({
				email:email
			})
			if(!checkEmail) {
				return res.status(resCode.NOT_FOUND).json({
					status: resCode.NOT_FOUND,
					message: Msg("EmailNotFound",lang)
				})
			}

			let comparePass = await bcrypt.compare(password,checkEmail.password);
			if(!comparePass) {
				return res.status(resCode.BAD_REQUEST).json({
					status: resCode.BAD_REQUEST,
					message: Msg("InvalidPass",lang)
				})
			}

			let token = jwt.sign({
				id: checkEmail.id,
				email: email
			},
			process.env.JWT_KEY,
			{
				expiresIn: '8h'
			})
			await Admin.updateOne({ email : email}).set({ token: token})
			return res.status(resCode.OK).json({
				status: resCode.OK,
				message: Msg("LoginSuccess",lang),
				token: token
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
	 * @description logout for admin
	 * @route (POST /admin/logout)
	 */
	logout : async (req,res) => {
		let lang = req.getLocale();
		try {
			let {id} = req.me;
			let checkAdmin = await Admin.findOne({id:id});
			if(!checkAdmin) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("InvalidId",lang)
				})
			}
			await Admin.updateOne({ id: id}).set({ token: null});
			return res.status(resCode.OK).json({
				message: Msg("Logout",lang)
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message: Msg("Error",lang) + error
			})
		}
	},
	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @description Get admin profile
	 * @route (GET /adminProfile)
	 */
	getProfile : async (req,res) => {
		let lang = req.getLocale();
		try {
			let { id } = req.me;

			let checkAdmin = await Admin.findOne({
				id: id
			})
			checkAdmin = _.omit(checkAdmin,
				"token",
				"password",
				"updatedAt",
				"createdAt"
			)
			if(!checkAdmin) {
				return res.status(resCode.BAD_REQUEST).json({
					status: resCode.BAD_REQUEST,
					message: Msg("InvalidId",lang)
				})
			}
			return res.status(resCode.OK).json({
				status: resCode.OK,
				data: checkAdmin
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message: Msg("Error",lang)
			})
		}
	},
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @description search user
	 * @route (GET /searchUser)
	 */
	searchUser : async (req,res) => {
		let lang = req.getLocale();
		try {
			let {name} = req.query;
			let query = `
				SELECT
					"id",
					"firstName",
					"lastName",
					"username",
					"email",
					"Profile picture",
					"isDeleted"
				FROM "user"
				WHERE LOWER("firstName") LIKE '%' || LOWER('${name}') || '%'
				AND "isDeleted" = false
			`
			let data = await sails.sendNativeQuery(query);
			if(data.rows.length === 0) {
				return res.status(resCode.OK).json({
					message: Msg("NoResult",lang)
				})
			}
			return res.send(data)
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message: Msg("Error",lang) + error
			})
		}
	},
	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @description forget password api
	 * @route (POST /forgetPassword)
	 */
	forgetPassword: async (req,res) => {
		let lang = req.getLocale();
		try {
			let { email } = req.body;

			let checkEmail = await Admin.findOne({
				email: email,
			})
			if(!checkEmail) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("EmailNotFound",lang)
				})
			}
			let token = sails.config.constants.UUID();
			let expireTime = Math.floor(Date.now() / 1000) + 120;

			let updateData = await Admin.updateOne({
				email: email,
			})
			.set({
				forgetPassToken: token,
				forgetTokenExpire: expireTime
			})
			return res.status(resCode.OK).json({
				data: updateData
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message: Msg("Error",lang)
			})
		}
	},
	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @description reset password api
	 * @route (PATCH /resetPassword)
	 */
	resetPassword: async (req,res) => {
		let lang = req.getLocale();
		try {
			let { token, password } = req.body;
			let checkToken = await Admin.findOne({
				forgetPassToken: token,
			})
			if(!checkToken) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("InvalidToken",lang)
				})
			}
			if(checkToken.forgetTokenExpire <= Date.now()) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("TokenExpired",lang)
				})
			}
			let hashPass = await bcrypt.hash(password,10)
			await Admin.updateOne({
				forgetPassToken: token,
			})
			.set({
				password: hashPass,
				forgetPassToken: null,
				forgetTokenExpire: null
			})
			return res.status(resCode.OK).json({
				message: Msg("PasswordUpdated",lang)
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message : Msg("Error",lang) + error
			})
		}
	},
	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @description change password api
	 * @route (PATCH /changePassword)
	 */
	changePassword: async (req,res) => {
		let lang = req.getLocale();
		try {
			let {
				oldPassword,
				newPassword
			} = req.body;
			let { id } = req.me;

			let findUser = await Admin.findOne({
				id: id,
			})
			let verifyPass = await bcrypt.compare(oldPassword,findUser.password);
			if(!verifyPass) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("InvalidPassword",lang)
				})
			}
			if(oldPassword === newPassword) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("ConflictPass",lang)
				})
			}

			let hashPass = await bcrypt.hash(newPassword,10);
			await Admin.updateOne({
				id: id,
			})
			.set({
				password: hashPass
			})
			return res.status(resCode.OK).json({
				message: Msg("PasswordUpdated",lang)
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message: Msg("Error",lang)
			})
		}
	},
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @description list all users by admin
	 * @route (GET /listAll/users)
	 */
	listAllUsers: async (req,res) => {
		const lang = req.getLocale();
		try {
			let users = await User.find({
				isDeleted: false
			})
			return res.status(resCode.OK).json({
				status: resCode.OK,
				data: users
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				status: resCode.SERVER_ERROR,
				message: Msg("Error",lang)
			})
		}
	}

};
