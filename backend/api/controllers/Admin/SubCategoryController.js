/**
 * SubCategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let { resCode, UUID, status } = sails.config.constants;
let Msg = sails.config.getMessage;
const path = require("path");
const fs = require('node:fs');
module.exports = {

	/**
   *
   * @param {Request} req
   * @param {Response} res
   * @description add subCategory by admin only
   * @route (POST /add/subCategory)
   */
	addSubCategory : async (req,res) => {
		let lang = req.getLocale();
		try {
			let { name, categoryId } = req.body;

			let checkId = await Category.findOne({
				id: categoryId,
				isDeleted: false,
				status: status.A
			})
			if(!checkId) {
				return res.status(resCode.BAD_REQUEST).json({
					status: resCode.BAD_REQUEST,
					message: Msg("InvalidCategory",lang)
				})
			}
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
					status: resCode.CONFLICT,
					message: Msg("CategoryConflict",lang)
				})
			}

			let dirname = path.join(process.env.BASE_URL,"categoryImage","subCategoryImage");
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }
			let categoryImage = await sails.helpers.uploadImage("image",req,dirname);
			let data = await SubCategory.create({
				id: UUID(),
				name: name,
				Image: categoryImage.data.url,
				category: categoryId
			}).fetch()
			return res.status(resCode.CREATED).json({
				status: resCode.CREATED,
				message: Msg("CategoryCreated",lang),
				data: data
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
   * @description add subCategory by admin only
   * @route (PATCH /edit/subCategory)
   */
	editSubCategory : async (req,res) => {
		let lang = req.getLocale();
		try {
			let { status,id } = req.body;

			let findSubCategory = await SubCategory.findOne({
				id: id,
				isDeleted: false
			});
			if(!findSubCategory) {
				return res.status(resCode.NOT_FOUND).json({
					status: resCode.NOT_FOUND,
					message: Msg("InvalidCategory",lang)
				})
			};

			let checkCategory = await Product.findOne({
				subCategoryId: id,
				isDeleted: false
			})
			if(checkCategory) {
				return res.status(resCode.BAD_REQUEST).json({
					status: resCode.BAD_REQUEST,
					message: Msg("NotEditable",lang)
				})
			};

			let updateCategory = await SubCategory.updateOne({
				id: id,
				isDeleted: false,
			})
			.set({
				status: status
			})
			return res.status(resCode.OK).json({
				status: resCode.OK,
				message: Msg("CategoryUpdated",lang),
				data: updateCategory
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				data: resCode.SERVER_ERROR,
				message: Msg("Error",lang)  + error
			})
		}
	},
	/**
   *
   * @param {Request} req
   * @param {Response} res
   * @description delete subCategory by admin only if subCategory is empty
   * @route (DELETE /delete/subCategory/:id)
   */
	deleteSubCategory: async (req,res) => {
		let lang = req.getLocale();
		try {
			let { id } = req.params;

			let findCategory = await SubCategory.findOne({
				id: id,
				isDeleted: false
			})
			if(!findCategory) {
				return res.status(resCode.NOT_FOUND).json({
					status: resCode.NOT_FOUND,
					message: Msg("InvalidCategory",lang)
				})
			}

			let checkCategory = await Product.findOne({
				subCategoryId: id,
				isDeleted: false
			})
			if(checkCategory) {
				return res.status(resCode.BAD_REQUEST).json({
					status: resCode.BAD_REQUEST,
					message: Msg("NotDeleted",lang)
				})
			}
			await SubCategory.updateOne({
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
				message: Msg("Error",lang)
			})
		}
	},
	/**
   *
   * @param {Request} req
   * @param {Response} res
   * @description list all subCategories
   * @route (GET /list/:id)
   */
	listAllSubCategory : async (req,res) => {
		let lang = req.getLocale();
		try {
			let {id} = req.params;

			let checkCategory = await  Category.findOne({
				id: id,
				isDeleted: false,
				status: status.A
			})
			if(!checkCategory) {
				return res.status(resCode.NOT_FOUND).json({
					message: Msg("InvalidCategory",lang),
					status: resCode.NOT_FOUND
				})
			}
			let data = await SubCategory.find({ isDeleted: false, category: id })
			return res.status(resCode.OK).json({
				data: data,
				status: resCode.OK
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message: Msg("Error",lang),
				status: resCode.SERVER_ERROR
			})
		}
	},
	/**
   *
   * @param {Request} req
   * @param {Response} res
   * @description search subCategories
   * @route (GET /searchSubCategory)
   */
	searchSubCategory : async (req,res) => {
		let lang = req.getLocale();
		try {
			let {title} = req.query;
			let query = `
				SELECT
					"s"."id",
					"subCategoryName" AS "name",
					"s"."Image",
					"s"."Number of Products" AS "No_Products",
					"s"."isDeleted",
					"s"."status",
					"category",
					"categoryName"
				FROM subCategory as s
				INNER JOIN category as c
				ON "s"."category" = "c"."id"
				WHERE LOWER("s"."subCategoryName") LIKE '%' || LOWER('${title}') || '%'
				AND "s"."isDeleted" = false
			`
			let data = await sails.sendNativeQuery(query);
			if(data.rows.length === 0) {
				return res.status(resCode.OK).json({
					message: Msg("NoResult",lang)
				})
			}
			return res.status(resCode.OK).json({
				status: resCode.OK,
				data: data
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message: Msg("Error",lang) + error
			})
		}
	}
};
