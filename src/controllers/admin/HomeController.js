const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");
const { OrderModel } = require("../../models");

const HomeController = {
    async index(req, res, next) {
        const status = ['Review', 'Proccess', 'Shipped', 'Cancel'];
        const statusOrderAggregate = [
            {
                $match: {
                    status: { $in: status }
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]
        const currentYear = new Date().getFullYear();
        const mounths = Array.from({ length: 12 }, (_, i) => `${i + 1}/${currentYear}`);
        const monthlyOrderAggregate = [
            {
                $project: {
                    month: { $month: "$updatedAt" },
                    year: { $year: "$updatedAt" },
                    totalPrice: 1
                }
            },
            {
                $match: {
                    year: currentYear
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
        const result = await Promise.all([
            OrderModel.aggregate(statusOrderAggregate),
            OrderModel.aggregate(monthlyOrderAggregate)
        ])
        const statusOrders = result[0].reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});
        const monthlyOrders = result[1].reduce((acc, item) => {
            acc[`${item._id.month}/${item._id.year}`] = item.totalPrices;
            return acc;
        }, {});
        res.render("admin/home", Response({
            res, data: {
                statusOrders,
                monthlyOrders: mounths.reduce((acc, curr) => {
                    acc[curr] = monthlyOrders[curr] || 0;
                    return acc;
                }, {})
            }
        }));
    }
}

module.exports = HomeController;