const { logger } = require("../configs");
const { RESPONSE_CODE } = require("../constants");
const { CardModel } = require("../models");

const issuers = ["VISA", "MASTER", "JCB", "AMEX"];

const CardController = {
    create: async (req, res, next) => {
        try {
            const existCard = await CardModel.findOne({ cardNumber: req.body.cardNumber }).lean();
            if (existCard) {
                delete existCard.balance;
                delete existCard.createdBy;
                delete existCard._id;
                logger.log({
                    level: 'error',
                    message: JSON.stringify({
                        path: req.path,
                        body: req.body,
                        message: "Card already exist!",
                        existCard
                    })
                })
                return res.json({
                    data: existCard,
                    errorCode: RESPONSE_CODE.SUCCESS,
                    message: "Add card successfully!"
                });
            }
            const body = req.body;
            body.issuer = issuers[Math.floor(Math.random() * issuers.length)];
            body.createdBy = body.partnerId;
            body.balance = Math.floor(Math.random() * 90000000);
            const cardModel = await CardModel.create(body);
            const card = cardModel.toObject();
            logger.log({
                level: 'error',
                message: JSON.stringify({
                    path: req.path,
                    body: req.body,
                    message: "New card created!",
                    card
                })
            })
            delete card.balance;
            delete card.createdBy;
            delete card._id;
            res.json({
                data: card,
                errorCode: RESPONSE_CODE.SUCCESS,
                message: "Add card successfully!"
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
}

module.exports = CardController