const { Response } = require("../../commons");
const { USER_ROLE, RESPONSE_CODE } = require("../../constants");
const { UserModel, CategoryModel } = require("../../models");
const moment = require('moment');

const CategoryController = {
    async index(req, res, next) {
        const results = await Promise.all([
            UserModel.find({ role: USER_ROLE.ADMIN })
                .sort({ updatedAt: -1, createdAt: -1 })
                .lean(),
            CategoryModel.find({}).lean()
        ]);
        res.render("admin/categories", Response({ res, data: { users: results[0], categories: results[1] } }))
    },
    async add(req, res, next) {
        try {
            const _user = req.locals._user;
            const body = req.body;
            body.createdBy = _user?._id;
            const category = await CategoryModel.create(body);
            res.json({
                data: category.toObject(),
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Add categories successfully!"
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
        const equalFields = ["isDeleted", "createdBy", "updatedBy", "deletedBy", "parentId"];
        for (let key in req.query) {
            const value = req.query[key];
            if (equalFields.includes(key) && !!value) {
                query.$or.push({ [key]: value })
            } else if (!!value) {
                query.$or.push({
                    [key]: new RegExp(value, "i")
                })
            }
        }
        if (query.$or.length <= 0) {
            delete query.$or;
        }
        const results = await Promise.all([
            CategoryModel.find(query).skip((page - 1) * limit).limit(limit).sort({ updatedAt: -1, createdAt: -1 }).lean(),
            CategoryModel.find(query).countDocuments().lean()
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
        const category = await CategoryModel.findById(id)
            .populate("parentObj")
            .populate("createdByObj")
            .populate("updatedByObj")
            .populate("deletedByObj")
            .lean();
        res.json(category);
    },
    async update(req, res, next) {
        try {
            const _user = req.locals._user;
            const body = req.body;
            const updateFields = ["name", "description", "isDeleted", "parentId"];
            const updateCategory = updateFields.reduce((acc, field) => {
                const value = body[field];
                acc[field] = value;
                return acc;
            }, {});
            updateCategory.updatedBy = _user?._id;
            const { id } = body;
            const updatedCategory = await CategoryModel.findByIdAndUpdate(id, updateCategory, { new: false }).lean();
            res.json({
                data: updatedCategory,
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Update category successfully!"
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
            const resonse = await CategoryModel.updateMany({ _id: { $in: ids } }, { isDeleted: true, deletedBy: _user?._id }).lean();
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Delete categories successfully!"
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

module.exports = CategoryController;