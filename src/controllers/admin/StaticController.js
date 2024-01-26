const moment = require("moment");
const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");
const { OrderModel } = require("../../models");

const StaticController = {
    async index(req, res, next) {
        res.render("admin/statics", Response({ res, data: {} }))
    },
    async statics(req, res, next) {
        try {
            const { dateRange } = req.query;
            const [startDate, endDate] = dateRange.split("-");
            const fromDate = !!startDate ? moment(startDate, "DD/MM/YYYY").startOf("day") : moment().startOf("year").startOf("day");
            const toDate = !!endDate ? moment(endDate, "DD/MM/YYYY").endOf("day") : moment().endOf("year").endOf("day");
            const status = ['Review', 'Proccess', 'Shipped', 'Cancel'];
            const statusOrdersAggregate = [
                {
                    $match: {
                        status: { $in: status },
                        updatedAt: {
                            $gte: fromDate.toDate(),
                            $lte: toDate.toDate()
                        }
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]
            const mounths = [];
            for (let i = fromDate.year(); i <= toDate.year(); i++) {
                for (let j = 1; j <= 12; j++) {
                    if (i === fromDate.year() && j < fromDate.month()) continue;
                    if (i === toDate.year() && j > toDate.month()) continue;
                    mounths.push(`${i}/${j}`);
                }
            }
            const monthlyOrdersAggregate = [
                {
                    $match: {
                        updatedAt: {
                            $gte: fromDate.toDate(),
                            $lte: toDate.toDate()
                        }
                    }
                },
                {
                    $project: {
                        month: { $month: "$updatedAt" },
                        year: { $year: "$updatedAt" },
                        totalPrice: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            year: "$year",
                            month: "$month"
                        },
                        count: { $sum: 1 },
                        totalPrices: { $sum: "$totalPrice" }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                    }
                }
            ]
            const usersAggregate = [
                {
                    $match: {
                        createdAt: {
                            $gte: fromDate.toDate(),
                            $lte: toDate.toDate()
                        }
                    }
                },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    }
                },
                {
                    $group: {
                        _id: {
                            year: "$year",
                            month: "$month"
                        },
                        count: { $sum: 1 },
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                    }
                }
            ]
            const result = await Promise.all([
                OrderModel.aggregate(statusOrdersAggregate),
                OrderModel.aggregate(monthlyOrdersAggregate),
                OrderModel.aggregate(usersAggregate)
            ])
            const statusOrders = result[0].reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {});
            const monthlyOrders = result[1].reduce((acc, item) => {
                acc[`${item._id.year}/${item._id.month}`] = item.totalPrices;
                return acc;
            }, {});
            const monthlyUsers = result[2].reduce((acc, item) => {
                acc[`${item._id.year}/${item._id.month}`] = item.count;
                return acc;
            }, {});
            res.json({
                data: {
                    statusOrders,
                    monthlyOrders: mounths.reduce((acc, curr) => {
                        acc[curr] = monthlyOrders[curr] || 0;
                        return acc;
                    }, {}),
                    monthlyUsers: mounths.reduce((acc, item) => {
                        acc[item] = monthlyUsers[item] || 0;
                        return acc;
                    }, {})
                },
                errorCode: 0,
                message: "Success!"
            })
        } catch (error) {
            console.log(error);
            res.json({
                errorCode: 1,
                message: error.message
            })
        }
    }
}

module.exports = StaticController;