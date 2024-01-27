const db = require("./mongo")
const passport = require("./passport")
const logger = require("./winston")

module.exports = {
    db,
    logger,
    passport
}