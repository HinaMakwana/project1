/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let {resCode,UUID} = sails.config.constants;
let Msg = sails.config.getMessage;
const path = require("path");
const fs = require('node:fs');

module.exports = {

	/**
   *
   * @param {Request} req
   * @param {Response} res
   * @description add category by admin only
   * @route (POST /add)
   */
	addCategory : async (req,res) => {
		let lang = req.getLocale();
		try {
			let { name } = req.body;

			let checkCategory = await Category.findOne({
				name: name,
				isDeleted: false
			})
			let checkSubCategory = await SubCategory.findOne({
				name: name,
				isDeleted: false
			})
			if(checkCategory || checkSubCategory) {
				return res.status(resCode.CONFLICT).json({
					message: Msg("CategoryConflict",lang)
				})
			}

			let dirname = path.join(process.env.BASE_URL, "categoryImage");
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }
			let categoryImage = await sails.helpers.uploadImage("image",req,dirname);

			let data = await Category.create({
				id: UUID(),
				name: name,
				Image: categoryImage.data.url
			}).fetch()
			return res.status(resCode.CREATED).json({
				message: Msg("CategoryCreated",lang),
				data: data
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
   * @description edit category status active/inactive by admin only
   * @route (PATCH /edit)
   */
	editCategory: async (req,res) => {
		let lang = req.getLocale();
		try {
			let {
				categoryId,
				status
			} = req.body;

			let checkCategory = await Category.findOne({
				id: categoryId,
				isDeleted: false
			})
			if(!checkCategory) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("InvalidCategory",lang)
				})
			}

			let findCategory = await Product.findOne({
				categoryId:  categoryId,
				isDeleted: false
			})
			if(findCategory) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("NotEditable",lang)
				})
			}
			let updateStatus = await Category.updateOne({
				id: categoryId,
				isDeleted: false
			})
			.set({
				status: status
			})
			return res.status(resCode.OK).json({
				message: Msg("CategoryUpdated",lang),
				data: updateStatus
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
   * @description delete category by admin only if category is empty
   * @route (DELETE /delete/:id)
   */
	deleteCategory: async (req,res) => {
		let lang = req.getLocale();
		try {
			let { id } = req.params;

			let findCategory = await Category.findOne({
				id: id,
				isDeleted: false
			})
			if(!findCategory) {
				return res.status(resCode.NOT_FOUND).json({
					status: resCode.NOT_FOUND,
					message: Msg("InvalidCategory",lang)
				})
			}

			let checkCategory = await Product.find({
				categoryId: id,
				isDeleted: false
			})
			if(checkCategory[0]) {
				return res.status(resCode.BAD_REQUEST).json({
					status: resCode.BAD_REQUEST,
					message: Msg("NotDeleted",lang)
				})
			}
			await Category.updateOne({
				id: id,
				isDeleted: false
			})
			.set({isDeleted: true});
			return res.status(resCode.OK).json({
				status: resCode.OK,
				message: Msg("Deleted",lang)
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				status: resCode.SERVER_ERROR,
				message: Msg("Error",lang) + error
			})
		}
	},
	/**
   *
   * @param {Request} req
   * @param {Response} res
   * @description list all categories
   * @route (GET /list)
   */
	listAllCategory : async (req,res) => {
		let lang = req.getLocale();
		try {
			let categories = await Category.find({ isDeleted: false})
			return res.status(resCode.OK).json({
				data: categories
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
   * @description search categories
   * @route (GET /search)
   */
	searchCategory : async (req,res) => {
		let lang = req.getLocale();
		try {
			let {title} = req.query;
			let query = `
				SELECT
					"id",
					"categoryName",
					"Image",
					"Number of Products",
					"isDeleted",
					"status"
				FROM category
				WHERE LOWER("categoryName") LIKE '%' || LOWER('${title}') || '%'
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

};