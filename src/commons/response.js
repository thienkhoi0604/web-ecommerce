const Response = ({ res, data }) => {
    const { layout } = res.locals;
    return {
        layout,
        ...data,
    }
}

module.exports = {
    Response
}