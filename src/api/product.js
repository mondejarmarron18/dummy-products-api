const handleAsync = require('../utilities/toHandleAsync');
const Product = require('../models/Product');

/**
 * !PATH: /api/v1/products
 * returns all the available products
 */
const getAllProducts = handleAsync(async (req, res, next) => {

    const numOfProducts = await Product
        .find({})
        .count();

    const productsArray = await Product
        .find({})
        .select('-product_reviews -product_description')
        .limit(req.searchLimit)
        .skip(req.searchSkip);

    const response = {
        success: true,
        datatype: 'ALL PRODUCTS',
        numOfResults: productsArray.length,
        lastPage: Math.ceil(numOfProducts / req.searchLimit),
        page: req.searchPage,
        data: productsArray
    }

    response.page > response.lastPage
        ? response.data = `You've reached the last page`
        : null

    res.json(response)
})


/**
 * !PATH: /api/v1/products/toprated
 * returns all the top rated products
 */
const getAllTopRated = handleAsync(async (req, res, next) => {

    const numOfProducts = await Product
        .find({ product_ratings: { $gte: 4, $lte: 5 } })
        .count();

    const allTopRatedProducts = await Product
        .find({ product_ratings: { $gte: 4, $lte: 5 } })
        .sort({ product_ratings: 'descending' })
        .select('-product_reviews -product_description')
        .limit(req.searchLimit)
        .skip(req.searchSkip);

    const response = {
        success: true,
        datatype: "ALL TOP RATED PRODUCTS. Starting from the highest rating",
        numOfResults: allTopRatedProducts.length,
        lastPage: Math.ceil(numOfProducts / req.searchLimit),
        page: req.searchPage,
        data: allTopRatedProducts
    }

    response.page > response.lastPage
        ? response.data = `You've reached the last page`
        : null

    res.json(response)
})


/**
 * !PATH: /api/v1/products/topsales
 * returns all the top sales products
 */
const getAllTopSales = handleAsync(async (req, res, next) => {

    const numOfProducts = await Product
        .find({ product_sales: { $gte: 1000 } })
        .count();

    const allTopSalesProducts = await Product
        .find({ product_sales: { $gte: 1000 } })
        .sort({ product_sales: 'descending' })
        .select('-product_reviews -product_description')
        .limit(req.searchLimit)
        .skip(req.searchSkip);

    const response = {
        success: true,
        datatype: "ALL TOP SALES PRODUCTS. Starting from the highest sales",
        numOfResults: allTopSalesProducts.length,
        lastPage: Math.ceil(numOfProducts / req.searchLimit),
        page: req.searchPage,
        data: allTopSalesProducts
    }

    response.page > response.lastPage
        ? response.data = `You've reached the last page`
        : null

    res.json(response)
})


/**
 * !PATH: /api/v1/products/:prodId
 * returns information about a product
 */
const getAProduct = handleAsync(async (req, res, next) => {
    const foundProduct = await Product
        .findById(req.params.prodId)
        .populate("product_reviews")
        .exec()

    if (!foundProduct)
        throw new res.withError('Product not found', 404)

    res.json({
        success: true,
        datatype: 'A PRODUCT',
        data: foundProduct
    })
})

module.exports = {
    getAllProducts,
    getAllTopRated,
    getAllTopSales,
    getAProduct
}