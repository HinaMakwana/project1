

module.exports = async (req,res,next) => {
	let lang = req.headers.lang;
	if(lang) {
		req.setLocale(lang);
	} else {
		req.setLocale('en');
	}
	return next();
}