const { logger } = require("../configs");
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
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Card is invalid",
                    })
                })
                return res.json({
                    errorCode: RESPONSE_CODE.INVALID_CARD,
                    message: "Card is invalid!"
                });
            }
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Before pay!",
                    card,
                })
            })
            const { balance } = card;
            if (balance < amount) {
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Not enough money!",
                    })
                })
                return res.json({
                    errorCode: RESPONSE_CODE.NO_ENGOUH_MONEY,
                    message: "Not enough money!"
                });
            }
            const newBalance = balance - amount;
            card.balance = newBalance;
            const newCard = await card.save();
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "After pay!",
                    newCard,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Pay successfully!"
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
    topup: async (req, res, next) => {
        try {
            const body = req.body;
            const { cardNumber, cardHolder, expirationDate, ccv, amount } = body;
            const card = await CardModel.findOne({
                cardNumber,
                cardHolder,
                expirationDate,
                ccv
            });
            if (!card) {
                logger.log({
                    level: 'info',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Card is invalid",
                    })
                })
                return res.json({
                    errorCode: RESPONSE_CODE.INVALID_CARD,
                    message: "Card is invalid!"
                });
            }
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "Before topup!",
                    card,
                })
            })
            const { balance } = card;
            const newBalance = balance + amount;
            card.balance = newBalance;
            const newCard = await card.save();
            logger.log({
                level: 'info',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "After topup!",
                    newCard,
                })
            })
            res.json({
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Topup successfully!"
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
};

module.exports = PaymentController;