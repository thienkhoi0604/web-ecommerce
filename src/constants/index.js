const LAYOUT = {
    ADMIN: "admin",
    CLIENT: "client",
}
const RESPONSE_CODE = {
    SUCCESS: 0,
    ERROR: 1,
    NO_PERMISSION: 2,
    EXISTED_CARD: 3,
    INVALID_CARD: 4,
    INVALID_TOKEN: 5,
    NO_ENGOUH_MONEY: 6,
    REDIRECT: 7,
}

const USER_ROLE = {
    ADMIN: "admin",
    USER: "user"
}

module.exports = {
    LAYOUT,
    USER_ROLE,
    RESPONSE_CODE
}