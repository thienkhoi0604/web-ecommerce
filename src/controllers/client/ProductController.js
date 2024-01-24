const mongoose = require('mongoose');
const Product = require('../../models/ProductModel');
const { Response } = require('../../commons');

const ProductController = {
    async index(req, res, next) {
        res.render('client/product', Response({ res, data: {} }));
    },
    async search(req, res, next) {

    },
    async get(req, res, next) {

    }
}

module.exports = ProductController;