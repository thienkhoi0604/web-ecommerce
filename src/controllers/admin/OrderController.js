const { Response } = require("../../commons");
const { logger } = require("../../configs");
const { LAYOUT, USER_ROLE, RESPONSE_CODE } = require("../../constants");
const { OrderModel } = require("../../models");

const OrderController = {
    async index(req, res, next) {
        const results = await Promise.all([
            OrderModel.find({})
                .sort({ updatedAt: -1, createdAt: -1 })
                .lean(),
        ]);
        res.render("admin/order", Response({ res, data: { users: results[0] } }))
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
        const equalFields = ["isDeleted", "createdBy", "updatedBy", "deletedBy", "status", "totalPrice"];
        for (let key in req.query) {
            const value = req.query[key];
            if (equalFields.includes(key) && !!value) {
                query.$or.push({ [key]: value })
            } else if (!!value) {
                query.$or.push({ [key]: new RegExp(value, "i") })
            }
        }
        if (query.$or.length <= 0) {
            delete query.$or;
        }
        const results = await Promise.all([
            OrderModel.find(query).skip((page - 1) * limit).limit(limit).sort({ updatedAt: -1, createdAt: -1 }).lean(),
            OrderModel.find(query).countDocuments().lean()
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
        const order = await OrderModel.findById(id)
            .populate("createdByObj")
            .populate("updatedByObj")
            .populate("deletedByObj")
            .populate({
                path: "cartObjs",
                populate: {
                    path: "productObj"
                }
            })
            .lean();
        res.json(order);
    },
    async update(req, res, next) {
        try {
            const _user = res.locals._user;
            const body = req.body;
            const updateFields = ["fullname", "phoneNumber", "isDeleted", "status", "totalPrice", "address"];
            const updateUser = updateFields.reduce((acc, field) => {
                const value = body[field];
                acc[field] = value;
                return acc;
            }, {});
            updateUser.updatedBy = _user?._id;
            const { id } = body;
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Before update order!",
                    updateUser,
                    id,
                })
            })
            const updatedUser = await OrderModel.findByIdAndUpdate(id, updateUser, { new: false }).lean();
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "After update order!",
                    updatedUser,
                })
            })
            res.json({
                data: updatedUser,
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Update order successfully!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: e.message,
                    stack: e.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    async delete(req, res, next) {
        const _user = res.locals._user;
        let { ids } = req.body;
        if (typeof ids === "string") {
            ids = [ids];
        }
        try {
            const resonse = await OrderModel.updateMany({ _id: { $in: ids } }, { isDeleted: true, deletedBy: _user?._id }).lean();
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    resonse,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Delete ordersF successfully!"
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: e.message,
                    stack: e.stack,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    }
}

module.exports = OrderController;