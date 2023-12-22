/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let { resCode, UUID } = sails.config.constants;
let Msg = sails.config.getMessage;
module.exports = {

	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @description list all users by admin
	 * @route (GET /)
	 */
	getAllData : async (req,res) => {
		let lang = req.getLocale();
		try {
			let { startDate, endDate} = req.query;

			const userCount = await User.count({
				where: {
					isDeleted: false,
					and: [
						{ createdAt: { '>=' : startDate}},
						{ createdAt: { '<=' : endDate}}
					]
				}
			})
			const totalOrder = await Order.count({
				where: {
					and: [
						{ createdAt: { '>=': startDate}},
						{ createdAt: { '<=' : endDate}}
					]
				}
			})
			const totalProduct = await Product.count({
				where: {
					isDeleted: false,
					and: [
						{ createdAt: {'>=': startDate}},
						{ createdAt: {'<=': endDate}}
					]
				}
			})
			if(userCount, totalOrder, totalProduct) {
				return res.status(resCode.OK).json({
					customerCount: customerCount,
					userCount: userCount,
					totalOrder: totalOrder,
					totalProduct: totalProduct
				})
			} else {
				return res.status(resCode.BAD_REQUEST).json({
					status: resCode.BAD_REQUEST,
					message: Msg("NoResult", lang)
				})
			}
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				status: resCode.SERVER_ERROR,
				message: Msg("Error",lang) + error
			});
		}
	},
	/**
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @description list all users by admin
	 * @route (GET /)
	 */
	getOrdersDateWise : async (req,res) => {
		const lang = req.getLocale()
		try {
			const { startDate, endDate} = req.query;
			const query = `
				SELECT COUNT(*) as count, TO_CHAR(to_timestamp("createdAt" / 1000),'YYYY-MM-DD') as date FROM "order"
				WHERE "createdAt" >= ${startDate} and "createdAt" <= ${endDate}
				GROUP BY "date"
			`
			const data = await sails.sendNativeQuery(query);

			return res.status(resCode.OK).json({
				data: data.rows
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				status: resCode.SERVER_ERROR,
				message: Msg("Error",lang) + error
			})
		}
	}

};
