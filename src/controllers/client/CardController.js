const { Response } = require("../../commons");
const { LAYOUT, RESPONSE_CODE } = require("../../constants");
const { CardModel } = require("../../models");

const CardController = {
    async search(req, res, next) {
        const _user = res.locals._user;
        const page = Number.parseInt(req.query.page) || 1;
        delete req.query.page;
        const limit = Number.parseInt(req.query.limit) || 5;
        delete req.query.limit;
        const query = {
            userId: _user?._id || null,
            isDeleted: false
        }
        const results = await Promise.all([
            CardModel.find(query).skip((page - 1) * limit).limit(limit).sort({ updatedAt: -1, createdAt: -1 }).lean(),
            CardModel.find(query).countDocuments().lean()
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
    async add(req, res, next) {
        try {
            const _user = res.locals._user;
            const { cardNumber, cardHolder, expirationDate, ccv } = req.body;
            const url = `${process.env.PAYMENT_SERVICE_URL}/cards`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.PAYMENT_SERVICE_SECRET}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cardNumber,
                    cardHolder,
                    expirationDate,
                    ccv,
                    partnerId: process.env.PAYMENT_SERVICE_PARTNER_ID
                })
            }).then(res => res.json());
            if (response.errorCode !== RESPONSE_CODE.SUCCESS) {
                return res.json({
                    errorCode: response.errorCode,
                    message: response.message
                });
            }
            const card = response.data;
            card.createdBy = _user._id;
            card.userId = _user._id;
            const newCard = await CardModel.create(card);
            console.log(newCard);
            return res.json({
                errorCode: response.errorCode,
                message: response.message
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }

    },
    async get(req, res, next) {
        const _id = req.params._id;
        const card = await CardModel.findOne({ _id }).lean();
        res.json(card);
    },
    async delete(req, res, next) {
        const _user = res.locals._user;
        let { ids } = req.body;
        if (typeof ids === "string") {
            ids = [ids];
        }
        try {
            const resonse = await CardModel.updateMany({ _id: { $in: ids } }, { isDeleted: true, deletedBy: _user?._id }).lean();
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Delete cards successfully!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
}

module.exports = CardController;