const addToCartModel = require("../../models/cartProduct")

exports.addToCartController = async (req, res) => {
    try {
        const { productId } = req?.body
        const currentUser = req.userId

        const isProductAvailable = await addToCartModel.findOne({ productId })

        console.log("isProductAvailabl   ", isProductAvailable)

        if (isProductAvailable) {
            return res.json({
                message: "Already exits in Add to cart",
                success: false,
                error: true
            })
        }

        const payload = {
            productId: productId,
            quantity: 1,
            userId: currentUser,
        }

        const newAddToCart = new addToCartModel(payload)
        const saveProduct = await newAddToCart.save()


        return res.json({
            data: saveProduct,
            message: "Product Added in Cart",
            success: true,
            error: false
        })


    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}

exports.cartViewProduct = async (req, res) => {
    try {
        const currentUser = req.userId

        const allProduct = await addToCartModel.find({
            userId: currentUser
        }).populate("productId")

        res.json({
            data: allProduct,
            success: true,
            error: false
        })

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

exports.countCartProducts = async (req, res) => {
    try {
        const userId = req.userId

        const count = await addToCartModel.countDocuments({
            userId: userId
        })

        res.json({
            data: {
                count: count
            },
            message: "ok",
            error: false,
            success: true
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error: false,
            success: false,
        })
    }
}

exports.deleteCartProduct = async (req, res) => {
    try {
        const currentUserId = req.userId
        const addToCartProductId = req.body._id

        const deleteProduct = await addToCartModel.deleteOne({ _id: addToCartProductId })

        res.json({
            message: "Product Deleted From Cart",
            error: false,
            success: true,
            data: deleteProduct
        })

    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}

exports.updateCartProduct = async (req, res) => {
    try {
        const currentUserId = req.userId
        const addToCartProductId = req?.body?._id

        const qty = req.body.quantity

        const updateProduct = await addToCartModel.updateOne({ _id: addToCartProductId }, {
            ...(qty && { quantity: qty })
        })

        res.json({
            message: "Product Updated",
            data: updateProduct,
            error: false,
            success: true
        })

    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}
