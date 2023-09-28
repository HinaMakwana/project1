/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,
  "User/UserController": {
    "*": "getLanguage",
    logout: "isLoggedIn",
    changePassword: "isLoggedIn",
  },
  "User/ProfileController": {
    "*": "getLanguage",
    removeProfilePhoto: "isLoggedIn",
    changeProfilePic: "isLoggedIn",
    profile: "isLoggedIn",
    updateProfile: "isLoggedIn",
    addAddress: "isLoggedIn",
  },
  "User/CartController": {
    "*": "getLanguage",
    "*": "isLoggedIn",
  },
  "Admin/AdminController": {
    "*": "getLanguage",
    logout: "isAdmin",
    getProfile: "isAdmin",
  },
  "Admin/CategoryController": {
    "*": "getLanguage",
    "*": "isAdmin",
  },
  "Admin/SubCategoryController": {
    "*": "getLanguage",
    "*": "isAdmin",
  },
  "Admin/ProductController": {
    "*": "getLanguage",
    "*": "isAdmin",
  },
};
