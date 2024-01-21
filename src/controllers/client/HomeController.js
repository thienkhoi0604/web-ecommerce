const { Response } = require("../../commons");
const { LAYOUT } = require("../../constants");
const Product = require("../../models/ProductModel")

const HomeController = {
    async index(req, res, next) {
        try {
            // Lấy danh sách tất cả sản phẩm
            const products = await Product.find().lean();

            // Lấy danh sách 4 sản phẩm mới nhất
            const latestProducts = await Product.find().sort({ updateAt: -1 }).limit(4).lean();

            res.render("client/home", Response({ res, data: { products, latestProducts } }));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = HomeController;