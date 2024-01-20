const moment = require("moment")


const Helpers = {
    dateToDDMMYYHHmm: (date) => {
        return moment(date).format('DD/MM/YY HH:mm');
    },
    json: object => JSON.stringify(object),
}

module.exports = {
    Helpers
}