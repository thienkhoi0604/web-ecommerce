const { CategoryModel } = require("../models");

const categoryService = {
    getNestedAll: async () => {
        const categories = await CategoryModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    parentId: null
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "parentId",
                    as: "childObjs"
                }
            }
        ]);
        return categories;
    },
}

module.exports = categoryService;