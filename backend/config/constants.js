let gender = {
  male: "male",
  female: "female",
};

let { v4: uuidv4 } = require("uuid");

let resCode = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT: 409,
  OK: 200,
  CREATED: 201,
};

const cloudinary = require("cloudinary").v2;

const imageType = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
  "image/avif",
];

const status = {
	A : "Active",
	I : "Inactive"
}

const validationRule = {
  User: {
    firstName: "string|required|min:3",
    lastName: "string|required|min:3",
    email: "string|required|email",
    password: [
			"string",
			"required",
			"regex:/^[a-zA-Z0-9!@#$%^&*]{8,16}$/"
		],
    confirmPassword: "same:password",
		username: "string|min:5",
		countryCode: "string",
		phoneNo: [
			{
				required_with: "countryCode"
			}
		],
		birthDay: "string",
		gender: [
			"string",
			{
				in : [gender.female,gender.male]
			}
		],
		streetNo: [
			"integer",
			{
				required_with: ["address","city","state","zipCode"]
			}
		],
		address: [
			"string",
			{
				required_with: ["streetNo","city","state","zipCode"]
			}
		],
		city: [
			"string",
			{
				required_with: ["streetNo","address","state","zipCode"]
			}
		],
		state: [
			"string",
			{
				required_with: ["streetNo","address","city","zipCode"]
			}
		],
		zipCode: [
			"integer",
			{
				required_with: ["streetNo","address","city","state"]
			}
		],

  },
	Admin: {
		name: "string|min:3|required",
		email: "string|email|required",
		password: [
			"string",
			"required",
			"regex:/^[a-zA-Z0-9!@#$%^&*]{8,16}$/"
		]
	},
	Category: {
		name: "string|min:3|required"
	},
	SubCategory: {
		name: "string|min:3|required"
	},
	Product: {
		name: "string|min:3|required",
		categoryId: "string|required",
		subCategoryId: "string",
		description: "string",
		quantity: "integer",
		brandName:"string|min:3",
		price: "required",
		imageUrl: "string"
	}

};

const template = {
	Welcometemplate : `
		<b>Welcome</b> 
	`
}

module.exports.constants = {
  gender,
  UUID: uuidv4,
  resCode,
  cloudinary,
  imageType,
	validationRule,
	status
};
