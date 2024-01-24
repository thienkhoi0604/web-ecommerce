const { Response } = require("../../commons");
const { LAYOUT, USER_ROLE, RESPONSE_CODE } = require("../../constants");
const { UserModel, ProductModel, CategoryModel } = require("../../models");

const ProductController = {
    async index(req, res, next) {
        const results = await Promise.all([
            UserModel.find({ role: USER_ROLE.ADMIN })
                .sort({ updatedAt: -1, createdAt: -1 })
                .lean(),
            CategoryModel.find({})
                .sort({ updatedAt: -1, createdAt: -1 })
                .lean()
        ]);
        res.render("admin/products", Response({ res, data: { users: results[0], categories: results[1] } }))
    },
    async add(req, res, next) {
        try {
            const _user = req.locals._user;
            const body = req.body;
            body.createdBy = _user?._id;
            console.log(body);
            // const product = await ProductModel.create(body);
            res.json({
                data: product.toObject(),
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Add product successfully!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async search(req, res, next) {
        const page = Number.parseInt(req.query.page) || 1;
        delete req.query.page;
        const limit = Number.parseInt(req.query.limit) || 10;
        delete req.query.limit;
        const query = {
            $or: [
            ]
        }
        if (!!req.query.createdAt) {
            const dates = req.query.createdAt.split("-");
            const fromeDate = moment(dates[0], "DD/MM/YYYY").startOf("day").toDate();
            const toDate = moment(dates[1], "DD/MM/YYYY").endOf("day").toDate();
            query.$or.push({
                createdAt: {
                    $gte: fromeDate,
                    $lte: toDate
                }
            })
            delete req.query.createdAt;
        }
        if (!!req.query.updatedAt) {
            const dates = req.query.updatedAt.split("-");
            const fromeDate = moment(dates[0], "DD/MM/YYYY").startOf("day").toDate();
            const toDate = moment(dates[1], "DD/MM/YYYY").endOf("day").toDate();
            query.$or.push({
                updatedAt: {
                    $gte: fromeDate,
                    $lte: toDate
                }
            })
            delete req.query.updatedAt;
        }
        const numberFields = ["originalPrice", "discountPrice", "stock", "ratings", "soldOut"];
        const equalFields = ["isDeleted", "categoryId", "createdBy", "updatedBy", "deletedBy"];
        for (let key in req.query) {
            const value = req.query[key];
            if (numberFields.includes(key) && !isNaN(value)) {
                query.$or.push({ [key]: value })
            } else if (equalFields.includes(key) && !!value) {
                query.$or.push({ [key]: value })
            } else if (!!value) {
                query.$or.push({ [key]: new RegExp(req.query[key], "i") })
            }
        }
        if (query.$or.length <= 0) {
            delete query.$or;
        }
        const results = await Promise.all([
            ProductModel.find(query).skip((page - 1) * limit).limit(limit).sort({ updatedAt: -1, createdAt: -1 }).lean(),
            ProductModel.find(query).countDocuments().lean()
        ]);
        const pagination = {
            page,
            limit,
            total: results[1],
            totalPage: Math.ceil(results[1] / limit),
            data: results[0]
        }
        res.json(pagination);
    },
    async get(req, res, next) {
        const { id } = req.params;
        const product = await ProductModel.findById(id)
            .populate("createdByObj")
            .populate("updatedByObj")
            .populate("deletedByObj")
            .populate("categoryObj")
            .lean();
        res.json(product);
    },
    async update(req, res, next) {
        try {
            const _user = req.locals._user;
            const body = req.body;
            const updateFields = [
                "name",
                "description",
                "categoryId",
                "originalPrice",
                "discountPrice",
                "tags",
                "stock",
                "ratings",
                "soldOut",
                "isDeleted"
            ];
            const updateProduct = updateFields.reduce((acc, field) => {
                const value = body[field];
                acc[field] = value;
                return acc;
            }, {});
            updateProduct.updatedBy = _user?._id;
            const { id } = body;
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateProduct, { new: false }).lean();
            res.json({
                data: updatedProduct,
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Update product successfully!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async delete(req, res, next) {
        const _user = req.locals._user;
        let { ids } = req.body;
        if (typeof ids === "string") {
            ids = [ids];
        }
        try {
            const resonse = await ProductModel.updateMany({ _id: { $in: ids } }, { isDeleted: true, deletedBy: _user?._id }).lean();
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Delete products successfully!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    }
}

module.exports = ProductController;