/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let Msg = sails.config.getMessage;
let {resCode, status} = sails.config.constants;
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

module.exports = {
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @description register new user
	 * @route (POST /user/signup)
	 */
	signUp : async (req,res) => {
		let lang = req.getLocale();
		try {
			let {
				firstName,
				lastName,
				email,
				password,
				confirmPassword
			} = req.body;

			let result = await User.ValidationBeforeCreate({
				firstName,
				lastName,
				email,
				password,
				confirmPassword
			})
			if(result.hasError) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("ValidationError",lang),
					error :result.error
				})
			}

			let checkEmail = await User.findOne({
				email: email,
				isDeleted :false
			})
			if(checkEmail) {
				return res.status(resCode.CONFLICT).json({
					message: Msg("EmailExist",lang)
				})
			}

			if(password !== confirmPassword) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("PasswordNotMatch",lang)
				})
			}

			let hashPass = await bcrypt.hash(password,10);
			let id = sails.config.constants.UUID();
			let token = sails.config.constants.UUID();

			let userData = {
				id: id,
				firstName,
				lastName,
				email,
				signupToken: token,
				password: hashPass
			}
			let createUser = await User.create(userData).fetch();
			if(createUser) {
				await sails.helpers.stripe.customer.create.with({
					firstName,
					lastName,
					email
				});
			}
			await sails.helpers.sendEmail(email,firstName);
			return res.status(resCode.CREATED).json({
				message: Msg("Registered",lang),
				data: createUser
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
	 * @description Login user and generate authToken
	 * @route (POST /user/login)
	 */
	login : async (req,res) => {
		let lang = req.getLocale();
		try {
			let {
				email,
				password
			} = req.body;

			let checkEmail = await User.findOne({
				email: email,
				isDeleted: false,
				status: status.A
			})
			if(!checkEmail) {
				return res.status(resCode.NOT_FOUND).json({
					message: Msg("EmailNotFound",lang)
				})
			}

			let checkPass = await bcrypt.compare(password,checkEmail.password)
			if(!checkPass) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("InvalidPass",lang)
				})
			}

			let token = jwt.sign({
				email: checkEmail.email,
				id: checkEmail.id
			},
			process.env.JWT_KEY,
			{
				expiresIn: '8h'
			});
			let updateData = await User.updateOne({
				id: checkEmail.id,
				isDeleted: false,
				status: status.A
			})
			.set({
				authToken: token
			})
			return res.status(resCode.OK).json({
				message: Msg("LoginSuccess",lang),
				data: updateData
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
	 * @description Logout user and null token
	 * @route (POST /user/logout)
	 */
	logout : async (req,res) => {
		let lang = req.getLocale();
		try {
			let { id } = req.me;

			let checkUser = await User.findOne({
				id: id,
				isDeleted: false,
				status: status.A
			})
			if(!checkUser) {
				return res.status(resCode.NOT_FOUND).json({
					message: Msg("UserNotFound",lang)
				})
			}
			await User.updateOne({
				id: id,
				isDeleted: false,
				status: status.A
			})
			.set({
				authToken: null
			})
			return res.status(resCode.OK).json({
				message: Msg("Logout",lang)
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
	 * @description list all categories
	 * @route (GET /listAll)
	 */
	getCategories : async (req,res) => {
		let lang = req.getLocale();
		try {
			let categories = await Category.find({
				isDeleted: false,
				status : status.A
			})
			if(!categories[0]) {
				return res.status(NOT_FOUND).json({
					message: Msg("InvalidCategory",lang)
				})
			}
			return res.status(resCode.OK).json({
				data: categories
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
	 * @description list all subCategories
	 * @route (GET /listSubCategories)
	 */
	getSubCategories : async (req,res) => {
		let lang = req.getLocale();
		try {
			let subCategories = await SubCategory.find({
				isDeleted: false,
				status: status.A
			})
			if(!subCategories[0]) {
				return res.status(NOT_FOUND).json({
					message: Msg("InvalidCategory",lang)
				})
			}
			return res.status(resCode.OK).json({
				data: subCategories
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
	 * @description list all products category wise
	 * @route (GET /listProducts)
	 */
	listProduct : async (req,res) => {
		let lang = req.getLocale();
		try {
			let { id } = req.params;

			let findCategory = await Category.findOne({
				id: id,
				isDeleted: false,
				status: status.A
			})
			if(!findCategory) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("InvalidCategory",lang)
				})
			}
			let findProducts = await Product.find({
				categoryId: id,
				isDeleted: false,
				status: status.A
			})
			if(!findProducts[0]){
				return res.status(resCode.OK).json({
					message: Msg("NoProduct",lang)
				})
			}
			return res.status(resCode.OK).json({
				data: findProducts
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
	 * @description forget password api
	 * @route (POST /forgetPass)
	 */
	forgetPassword: async (req,res) => {
		let lang = req.getLocale();
		try {
			let { email } = req.body;

			let checkEmail = await User.findOne({
				email: email,
				isDeleted: false,
				status: status.A
			})
			if(!checkEmail) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("EmailNotFound",lang)
				})
			}
			let token = sails.config.constants.UUID();
			let expireTime = Math.floor(Date.now() / 1000) + 120;

			let updateData = await User.updateOne({
				email: email,
				isDeleted: false
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
	 * @route (PATCH /resetPass)
	 */
	resetPassword: async (req,res) => {
		let lang = req.getLocale();
		try {
			let { token, password } = req.body;
			let checkToken = await User.findOne({
				forgetPassToken: token,
				isDeleted: false,
				status: status.A
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
			await User.updateOne({
				forgetPassToken: token,
				isDeleted: false,
				status: status.A
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
	 * @route (PATCH /changePass)
	 */
	changePassword: async (req,res) => {
		let lang = req.getLocale();
		try {
			let {
				oldPassword,
				newPassword
			} = req.body;
			let { id } = req.me;

			let findUser = await User.findOne({
				id: id,
				isDeleted: false,
				status: status.A
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
			await User.updateOne({
				id: id,
				isDeleted: false,
				status: status.A
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
	}
};
