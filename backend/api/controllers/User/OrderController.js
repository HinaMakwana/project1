/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let { resCode, UUID, status } = sails.config.constants;
let Msg = sails.config.getMessage;
const stripe = require('stripe')(process.env.STRIPE_PRIVATE);

module.exports = {

	createOrder : async (req,res) => {
		let lang = req.getLocale();
		try {
			// let { products } = req.body;
			const session = await stripe.checkout.sessions.create({
				success_url: 'http://localhost:1337',
				line_items: [
					{price: 'price_1NGfF1SA6TQqRKUZrOZQsrqu', quantity: 2},
				],
				mode: 'payment',
			});
			return res.redirect(session.url);
		} catch (error) {
			return res.status(resCode.SERVER_ERROR).json({
				message: Msg("Error",lang)
			})
		}
	},
	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @description get order
	 * @route (POST /order)
	 */
	getOrder : async (req,res) => {
		try {
			const { id } = req.me;

			const { address, countryCode, phoneNo } = req.body;

			let findProductsInCart = await Cart.find({
				where : {
					isDeleted: false,
					user: id
				},
				select: ['id','quantity','totalPrice']
			}).populate('product')
			let totalPrice = 0;
			for(let oneData of findProductsInCart) {
				totalPrice = totalPrice + oneData.totalPrice;
				oneData.product = _.pick(oneData.product, 'name','iamgeUrl','price','description');
				delete oneData.totalPrice;
			}
			const orderData = {
				id: UUID(),
				address,
				countryCode,
				phoneNo,
				totalAmount: totalPrice,
				user: id
			}
			const createOrder = await Order.create(orderData).fetch();
			createOrder.products = findProductsInCart;
			return res.status(200).json({
				message: 'ok',
				data: createOrder
			})
		} catch (error) {
			return res.status(500).json({
				message: 'server error',
				error: error
			})
		}
	},
	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @description cancel order
	 * @route (POST /cancel-order/:id)
	 */
	cancelOrder : async (req,res) => {
		try {
			const { id } = req.me;
			const { id : orderId } = req.params;

			const findOrder = await Order.findOne({ id: orderId});
			
			if(findOrder.orderStatus === 'Pending') {
				const cancelOrder = await Order.updateOne({
					id: orderId,
					user: id
				}).set({ orderStatus: 'Cancel'})
				if(cancelOrder) {
					return res.status(200).json({
						message: 'order cancelled'
					})
				}
			}
			 else {
				return res.status(400).json({
					message: 'something went wrong'
				})
			}
		} catch (error) {
			return res.status(500).json({
				message: 'server error',
				error: error
			})
		}
	}
};
