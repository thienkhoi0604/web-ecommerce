const Response = ({ res, data = {} }) => {
    return {
        ...res.locals,
        ...data,
    }
}

module.exports = {
    Response
}