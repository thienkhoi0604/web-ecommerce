const mongoose = require('mongoose');
const db = {
    async connect() {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("Connect database successfully.");
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = db;