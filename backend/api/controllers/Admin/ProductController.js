/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let Msg = sails.config.getMessage;
let { resCode, UUID, status } = sails.config.constants;
let fs = require("node:fs");
const path = require("path");
const csvtojson = require("csvtojson");

module.exports = {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description add product by admin
   * @route (POST /add/product)
   */
  addProduct: async (req, res) => {
    let lang = req.getLocale();
    try {
      let {
        name,
        categoryId,
        subCategoryId,
        description,
        quantity,
        price,
        brandName
      } = req.body;
      console.log(req.body,'body');
      let result = await Product.ValidationBeforeCreate({
        name,
        categoryId,
        subCategoryId,
        description,
        quantity,
        price,
        brandName
      });
      if (result.hasError) {
        return res.status(resCode.BAD_REQUEST).json({
          message: Msg("ValidationError", lang),
          status: resCode.BAD_REQUEST,
          error: result.error
        });
      }

      let checkProduct = await Product.findOne({
        name: name,
        isDeleted: false,
      });
      if (checkProduct) {
        return res.status(resCode.CONFLICT).json({
          message: Msg("ProductAvailable", lang),
          status: resCode.CONFLICT,
        });
      }

      let checkCategory = await Category.findOne({
        id: categoryId,
        isDeleted: false,
        status: status.A
      });
      if (!checkCategory) {
        return res.status(resCode.BAD_REQUEST).json({
          message: Msg("InvalidCategory", lang),
          status: resCode.BAD_REQUEST,
        });
      }
      let checkSubCategory;
      if (subCategoryId) {
        checkSubCategory = await SubCategory.findOne({
          id: subCategoryId,
          category: categoryId,
          isDeleted: false,
          status: status.A
        });
        if (!checkSubCategory) {
          return res.status(resCode.BAD_REQUEST).json({
            message: Msg("SubCategoryInvalid", lang),
            status: resCode.BAD_REQUEST,
          });
        }
      }
      let dirname = path.join(process.env.BASE_URL, "productImage");
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }
      let imageUrl = await sails.helpers.uploadImage("image", req, dirname);

      let data = {
        id: UUID(),
        name,
        categoryId,
        subCategoryId,
        description,
        quantity,
        price,
        imageUrl: imageUrl.data.url,
      };
      let addProduct = await Product.create(data).fetch();
      await Category.updateOne({ id: categoryId, isDeleted: false }).set({
        No_Products: checkCategory.No_Products + 1,
      });
      if (subCategoryId) {
        await SubCategory.updateOne({
          id: subCategoryId,
          isDeleted: false,
        }).set({
          No_Products: checkSubCategory.No_Products + 1,
        });
      }
      return res.status(resCode.CREATED).json({
        status: resCode.CREATED,
        message: Msg("ProductCreated", lang),
        data: addProduct,
      });
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang) + error,
        status: resCode.SERVER_ERROR,
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description edit product by admin
   * @route (PATCH /edit/product)
   */
  editProduct: async (req, res) => {
    let lang = req.getLocale();
    try {
      let { description, quantity, price, productId } = req.body;

      let findProduct = await Product.findOne({
        id: productId,
        isDeleted: false,
      });
      if (!findProduct) {
        return res.status(resCode.BAD_REQUEST).json({
          message: Msg("ProductNotFound", lang),
          status: resCode.BAD_REQUEST
        });
      }

      let updateData = await Product.updateOne({
        id: productId,
        isDeleted: false,
      }).set({
        description: description,
        quantity: quantity,
        price: price,
      });
      return res.status(resCode.OK).json({
        message: Msg("ProductUpdated", lang),
        data: updateData,
        status: resCode.OK
      });
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang) + error,
        status: resCode.SERVER_ERROR
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description delete product by admin
   * @route (DELETE /delete/product/:productId)
   */
  deleteProduct: async (req, res) => {
    let lang = req.getLocale();
    try {
      let { productId } = req.params;
      let findProduct = await Product.findOne({
        id: productId,
        isDeleted: false,
      });
      if (!findProduct) {
        return res.status(resCode.BAD_REQUEST).json({
          status: resCode.BAD_REQUEST,
          message: Msg("ProductNotFound", lang),
        });
      }

      let deleteProduct = await Product.updateOne({
        id: productId,
        isDeleted: false,
      }).set({ isDeleted: true });
      return res.status(resCode.OK).json({
        status: resCode.OK,
        message: Msg("ProductDeleted", lang),
        data: deleteProduct,
      });
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        status: resCode.SERVER_ERROR,
        message: Msg("Error", lang) + error
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description change product status Active/Inactive by admin
   * @route (PATCH /changeStatus)
   */
  changeStatus: async (req, res) => {
    let lang = req.getLocale();
    try {
      // let { id } = req.params;
      let { status,id } = req.body;
      let findProduct = await Product.findOne({
        id: id,
        isDeleted: false
      });
      if (!findProduct) {
        return res.status(resCode.BAD_REQUEST).json({
          message: Msg("ProductNotFound", lang),
          status: resCode.BAD_REQUEST
        });
      }

      let changeStatus = await Product.updateOne({
        id: id,
        isDeleted: false,
      }).set({
        status: status,
      });
      return res.status(resCode.OK).json({
        data: changeStatus,
        status: resCode.OK
      });
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang) + error,
        status: resCode.SERVER_ERROR
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description list all products
   * @route (GET /list)
   */
  listAll: async (req, res) => {
    let lang = req.getLocale();
    try {
      let data = await Product.find({ isDeleted: false });
      return res.status(resCode.OK).json({
        data: data,
      });
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang),
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description search product
   * @route (GET /searchProduct)
   */
  searchProduct: async (req, res) => {
    let lang = req.getLocale();
    try {
      let { name } = req.query;
      let query = `
				SELECT
					"p"."id",
					"name",
					"description",
					"quantity",
					"price",
					"brandName",
					"imageUrl",
					"p"."isDeleted",
          "p"."status",
					"categoryId",
					"subCategoryId",
					"categoryName",
					"subCategoryName"
				FROM	product as p
				INNER JOIN category as c
				ON "p"."categoryId" = "c"."id"
				LEFT JOIN subCategory as s
				ON "p"."subCategoryId" = "s"."id"
				WHERE LOWER("name") LIKE '%' || LOWER('${name}') || '%'
				AND "p"."isDeleted" = false
			`;
      let data = await sails.sendNativeQuery(query);
      if (data.rows.length === 0) {
        return res.status(resCode.OK).json({
          message: Msg("NoResult", lang),
        });
      }
      return res.status(resCode.OK).json({
        status: resCode.OK,
        data: data
      })
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang) + error,
      });
    }
  },
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description when admin  run this api sample_product.csv file is download in system
   * @route (GET /download)
   */
  downloadFile: async (req, res) => {
    try {
      const filename = "/Users/ztlab133/Desktop/e-commerce/sample_product.csv";

      // Set the appropriate headers for the download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename='sample_product.csv'`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      // Create a read stream from the file and pipe it to the response
      const fileStream = fs.createReadStream(filename);

      // Handle errors and send the file
      fileStream.on("error", (error) => {
        sails.log.error(error);
        res.status(resCode.SERVER_ERROR).json({
          message: Msg("Error", lang),
        });
      });
      fileStream.pipe(res);
    } catch (error) {
      res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang) + error,
      });
    }
  },
  /**
   * @param {Request} req
   * @param {Response} res
   * @description Admin can add bulk products using uplaod csv file
   * @route (POST /addBulk)
   */
  addBulkData: async (req, res) => {
    let lang = req.getLocale();
    try {
      await req.file("csvData").upload(
        {
          adapter: require("skipper-disk"),
          maxBytes: 10000000,
          saveAs: function (file, cb) {
            cb(null, file.filename);
          },
          dirname: "csvFile",
        },
        async (err, uploadedFiles) => {
          if (err) {
            return res.status(resCode.BAD_REQUEST).json({
              error: err,
            });
          }
          if (uploadedFiles.length === 0) {
            return res.status(resCode.BAD_REQUEST).json({
              message: Msg("NotUploadFile", lang),
            });
          }
          let fileType = uploadedFiles[0].type;
          if (fileType !== "text/csv") {
            return res.status(resCode.BAD_REQUEST).json({
              message: Msg("InvalidFileType", lang),
            });
          }
          let data = await csvtojson().fromFile(uploadedFiles[0].fd);
          for (const validate of data) {
            let result = await Product.ValidationBeforeCreate(validate);
            console.log(result);
            if (result.hasError) {
              return res.status(resCode.BAD_REQUEST).json({
                message: Msg("ValidationError", lang),
                error: result.error,
              });
            }
            let checkProduct = await Product.findOne({
              name: validate.name,
              isDeleted: false,
            });
            if (checkProduct) {
              return res.status(resCode.CONFLICT).json({
                message: Msg("ProductAvailable", lang),
              });
            }
            validate.id = UUID();
          }
          console.log(data);
          let createProducts = await Product.createEach(data).fetch();
          return res.status(resCode.CREATED).json({
            message: Msg("ProductCreated", lang),
            data: createProducts,
          });
        }
      );
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        message: Msg("Error", lang) + error,
      });
    }
  },
};
