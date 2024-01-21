const moment = require("moment")


const Helpers = {
    dateToDDMMYYHHmm: (date) => {
        return moment(date).format('DD/MM/YY HH:mm');
    },
    json: object => JSON.stringify(object),
    ifCond: function (v1, v2, options) {
        return v1 == v2 ? options.fn(this) : options.inverse(this);
    },
}

module.exports = {
    Helpers
}