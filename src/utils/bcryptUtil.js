const bcrypt = require("bcrypt");

const BcryptUtil = {
    hash(value) {
        const salt = bcrypt.genSaltSync(Number.parseInt(process.env.SALT_ROUNDS) || 10);
        return bcrypt.hashSync(value, salt);
    },
    compare(text, textHash) {
        return bcrypt.compareSync(text, textHash);
    },
}

module.exports = BcryptUtil;