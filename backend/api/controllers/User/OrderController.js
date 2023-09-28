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
	}
};
