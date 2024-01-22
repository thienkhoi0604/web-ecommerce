const { RESPONSE_CODE } = require("../constants");
const { CardModel } = require("../models");

const PaymentController = {
    pay: async (req, res, next) => {
        try {
            console.log(req.body);
            const body = req.body;
            const { cardNumber, cardHolder, expirationDate, ccv, amount } = body;
            const card = await CardModel.findOne({
                cardNumber,
                cardHolder,
                expirationDate,
                ccv
            });
            if (!card) {
                return res.json({
                    errorCode: RESPONSE_CODE.INVALID_CARD,
                    message: "Card is invalid!"
                });
            }
            console.log(card.toJSON());
            const { balance } = card;
            if (balance < amount) {
                return res.json({
                    errorCode: RESPONSE_CODE.NO_ENGOUH_MONEY,
                    message: "Not enough money!"
                });
            }
            const newBalance = balance - amount;
            card.balance = newBalance;
            const newCard = await card.save();
            console.log(newCard.toJSON());
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Pay successfully!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
    topup: async (req, res, next) => {
        try {
            console.log(req.body);
            const body = req.body;
            const { cardNumber, cardHolder, expirationDate, ccv, amount } = body;
            const card = await CardModel.findOne({
                cardNumber,
                cardHolder,
                expirationDate,
                ccv
            });
            if (!card) {
                return res.json({
                    errorCode: RESPONSE_CODE.INVALID_CARD,
                    message: "Card is invalid!"
                });
            }
            console.log(card.toJSON());
            const { balance } = card;
            const newBalance = balance + amount;
            card.balance = newBalance;
            const newCard = await card.save();
            console.log(newCard.toJSON());
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Topup successfully!"
            });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: RESPONSE_CODE.ERROR,
                message: e.message
            });
        }
    },
};

module.exports = PaymentController;