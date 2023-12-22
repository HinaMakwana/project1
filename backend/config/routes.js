/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

	//userController routes
	'POST /user/signup' : 'User.UserController.signUp',
	'POST /user/login' : 'User.UserController.login',
	'POST /user/logout' : 'User.UserController.logout',
	'GET /listAll' : 'User.UserController.getCategories',
	'GET /listSubCategories' : 'User.UserController.getSubCategories',
	'GET /listProducts/:id' : 'User.UserController.listProduct',
	'POST /forgetPass' : 'User.UserController.forgetPassword',
	'PATCH /resetPass' : 'User.UserController.resetPassword',
	'PATCH /changePass' : 'User.UserController.changePassword',

	//ProfileController routes
	'POST /set/profile' : 'User.ProfileController.setUpProfile',
	'DELETE /remove/pic' : 'User.ProfileController.removeProfilePhoto',
	'GET /profile' : "User.ProfileController.profile",
	'PATCH /change/profilePic' : 'User.ProfileController.changeProfilePic',
	'GET /' : "User.ProfileController.test",
	'PATCH /update/profile' : "User.ProfileController.updateProfile",
	'PATCH /add/address' : "User.ProfileController.addAddress",

	//AdminController routes
	'POST /admin/signup' : 'Admin.AdminController.signUp',
	'POST /admin/login' : 'Admin.AdminController.login',
	'POST /admin/logout' : 'Admin.AdminController.logout',
	'GET /searchUser' : 'Admin.AdminController.searchUser',
	'GET /adminProfile' : 'Admin.AdminController.getProfile',
	'POST /forgetPassword' : 'Admin.AdminController.forgetPassword',
	'PATCH /resetPassword' : 'Admin.AdminController.resetPassword',
	'PATCH /changePassword' : 'Admin.AdminController.changePassword',
	'GET /listAll/users' : 'Admin.AdminController.listAllUsers',

	//CategoryController routes
	'POST /add' : 'Admin.CategoryController.addCategory',
	'PATCH /edit' : 'Admin.CategoryController.editCategory',
	'DELETE /delete/:id' : 'Admin.CategoryController.deleteCategory',
	'GET /listCategories' : 'Admin.CategoryController.listAllCategory',

	//SubCategoryController routes
	'POST /add/subCategory' : 'Admin.SubCategoryController.addSubCategory',
	'PATCH /edit/subCategory' : 'Admin.SubCategoryController.editSubCategory',
	'DELETE /delete/subCategory/:id' : 'Admin.SubCategoryController.deleteSubCategory',
	'GET /list/:id' : 'Admin.SubCategoryController.listAllSubCategory',

	//ProductController routes
	'POST /addProduct' : 'Admin.ProductController.addProduct',
	'PATCH /edit/product' : 'Admin.ProductController.editProduct',
	'DELETE /delete/product/:productId' : 'Admin.ProductController.deleteProduct',
	'PATCH /changeStatus' : 'Admin.ProductController.changeStatus',
	'GET /listProducts' : 'Admin.ProductController.listAll',
	'GET /download' : 'Admin.ProductController.downloadFile',
	'POST /addBulk' : 'Admin.ProductController.addBulkData',

	//CartController routes
	'POST /add/cart' : 'User.CartController.addTocart',
	'DELETE /remove/cart' : 'User.CartController.removeToCart',
	'GET /cart' : 'User.CartController.listCarts',
	'GET /oneCart/:id' : 'User.CartController.listCart',
	'PATCH /update-cart' : 'User.CartController.updateQuantity',

	//OrderController routes
	'GET /order' : 'User.OrderController.createOrder',
	'POST /get-order' : 'User.OrderController.getOrder',
	'PATCH /cancel-order/:id' : 'User.OrderController.cancelOrder',

	//DashboardController routes
	'GET /get-all-count' : 'Admin.DashboardController.getAllData',
	'GET /get-orders-datewise' : 'Admin.DashboardController.getOrdersDateWise',
};
