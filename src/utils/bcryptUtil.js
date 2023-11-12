const bcrypt = require("bcrypt");

const BcryptUtil = {
    hash(value) {
        const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS);
        return bcrypt.hashSync(value, salt);
    },
    compare(text, textHash) {
        return bcrypt.compareSync(text, textHash);
    },
}

module.exports = BcryptUtil;