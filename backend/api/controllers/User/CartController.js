/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let { resCode, UUID, status } = sails.config.constants;
let Msg = sails.config.getMessage;

module.exports = {
  /**
	 * @param {Request} req
	 * @param {Response} res
	 * @description add to cart
	 * @route (POST /add/cart)
	 */
	addToCart : async (req,res) => {
		let lang = req.getLocale();
		try {
			let user = req.me.id;
			let {
				product,
				quantity
			} = req.body;
			let result = await Cart.ValidateBeforeCreate({product,user,quantity})
			if(result.hasError) {
				return res.status(resCode.BAD_REQUEST).json({
					message: Msg("ValidationError",lang)
				})
			}

			let findProduct = await Product.findOne({
				id: product,
				isDeleted: false,
				status: status.A
			})
			if(!findProduct) {
				return res.status(resCode.NOT_FOUND).json({
					message: Msg("ProductNotFound",lang)
				})
			}
			let totalPrice;
			if(quantity) {
				totalPrice = findProduct.price * quantity
			} else {
				totalPrice = findProduct.price
			}
			let addCart = await Cart.create({
				id: UUID(),
				product,
				user,
				quantity,
				totalPrice
			}).fetch();
			return res.status(resCode.CREATED).json({
				data: addCart
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
	 * @description remove from cart
	 * @route (DELETE /remove/cart)
	 */
	removeToCart : async (req,res) => {
		let lang = req.getLocale();
		try {
			let { id } = req.me;
			let { cartId } = req.body;

			let findCart = await Cart.findOne({
				id: cartId,
				isDeleted: false
			})
			if(!findCart) {
				return res.status(resCode.NOT_FOUND).json({
					message: Msg("CartNotFound",lang)
				})
			}
			if(findCart.user !== id) {
				return res.status(resCode.UNAUTHORIZED).json({
					message: Msg("Unauthorized",lang)
				})
			}
			await Cart.updateOne({
				id: cartId,
				isDeleted: false
			})
			.set({
				isDeleted: true
			})
			return res.status(resCode.OK).json({
				message: Msg("CartDeleted",lang)
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
	 * @description list all cart of user
	 * @route (GET /cart)
	 */
	listCarts : async (req,res) => {
		let lang = req.getLocale();
		try {
			let { id } = req.me;

			let carts = await Cart.find({
				user: id,
				isDeleted: false
			})
			let totalAmount = await Cart.sum('totalPrice')
			.where({
				user: id,
				isDeleted: false
			})
			if(!carts[0]) {
				return res.status(resCode.OK).json({
					data: 'Not added any product'
				})
			}
			return res.status(resCode.OK).json({
				data: carts,
				totalAmount: totalAmount
			})
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message: Msg("Error",lang)
			})
		}
	}
};
