const { RESPONSE_CODE } = require("../constants");
const { CardModel } = require("../models");

const CardController = {
    create: async (req, res, next) => {
        try {
            const exist = await CardModel.findOne({ cardNumber: req.body.cardNumber }); F
            if (exist) {
                return res.json({
                    errorCode: RESPONSE_CODE.EXISTED_CARD,
                    message: "Card already exist!"
                });
            }
            const body = req.body;
            const category = await CardModel.create(body);
            res.json({
                data: category.toObject(),
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Add card successfully!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },

    get: async (req, res, next) => {
        const { cardNumber } = req.params;
        const category = await CardModel.findOne({ cardNumber }).lean();
        res.json(category);
    },

    update: async (req, res, next) => {
        try {
            const body = req.body;
            const updateFields = ["cardHolder"];
            const updateCategory = updateFields.reduce((acc, field) => {
                const value = body[field];
                acc[field] = value;
                return acc;
            }, {});
            const { cardNumber, cardHolder, expirationDate, ccv } = body;
            const updatedCategory = await CardModel.findOneAndUpdate(
                {
                    cardNumber,
                    cardHolder,
                    expirationDate,
                    ccv
                },
                updateCategory,
                { new: false }
            ).lean();
            if (!updatedCategory) {
                return res.json({
                    errorCode: RESPONSE_CODE.INVALID_CARD,
                    message: "Card is invalid!"
                });
            }
            res.json({
                data: updatedCategory,
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Update card successfully!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }

    },

    delete: async (req, res, next) => {
        try {
            console.log(req.body);
            let { cardNumber, cardHolder, expirationDate, ccv } = req.body;
            const resonse = await CardModel.updateOne(
                {
                    cardNumber,
                    cardHolder,
                    expirationDate,
                    ccv
                },
                { isDeleted: true }
            ).lean();
            console.log(resonse);
            if (resonse.nModified === 0) {
                return res.json({
                    errorCode: RESPONSE_CODE.INVALID_CARD,
                    message: "Card is invalid!"
                });
            }
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Delete card successfully!"
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

module.exports = CardController