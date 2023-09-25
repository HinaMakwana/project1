let { resCode } = sails.config.constants;
let Msg = sails.config.getMessage;
let jwt = require('jsonwebtoken');
module.exports = async (req,res,next) => {
	let lang = req.getLocale();
	try {
		let token = req.headers.authorization;
		if(!token) {
			return res.status(resCode.BAD_REQUEST).json({
				message: Msg("TokenEmpty",lang)
			})
		}
		token = token.split(" ")[1];
		let checkToken = await Admin.findOne({
			token: token,
		});
		if(!checkToken) {
			return res.status(resCode.BAD_REQUEST).json({
				message: Msg("InvalidToken",lang)
			})
		}
		let decoded = jwt.verify(token, process.env.JWT_KEY);
		if (token === checkToken.token) {
			req.me = decoded;
			return next();
		} else {
			return res.status(resCode.BAD_REQUEST).json({
				message: Msg("InvalidToken",lang)
			})
		}
	} catch (error) {
		return res.status(resCode.SERVER_ERROR).json({
			message: Msg("",lang) + error
		})
	}
}