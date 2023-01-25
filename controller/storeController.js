const User = require("../model/User");


const addProductToCart = async (req, res) => {
    const { product } = req.body;
    const { id, title, price, thumbnail } = product;
    const userId = req.user.id

    // Product already add 
    const productAlreadyAdd = await User.findOne({ _id: userId, "cart.id": product.id });
    if (productAlreadyAdd) return res.status(401).json({ msg: "", error: "This product is already in the cart" })


    // Add product
    try {
        const productAdded = await User.updateOne({ _id: userId }, { $addToSet: { cart: { id, title, price, thumbnail, subtotal: price } } });
        res.status(201).json({ msg: "Product added to cart" });
    } catch (error) {
        res.json({ msg: "", error })
    }

}

const loadAllProduct = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });

    try {
        res.status(200).json({ msg: user.cart, error: "" })
    } catch (error) {
        res.status(400).json({ msg: "", error })
    }
}

const updateCart = async (req, res) => {
    const { cart } = req.body;
    const userId = req.user.id;

    try {
        await User.updateOne({ _id: userId }, { $set: { "cart": cart } });
        res.status(201).json({ msg: cart, error: "" })
    } catch (error) {
        res.status(401).json({ msg: "", error })
    }
}

module.exports = { addProductToCart, loadAllProduct, updateCart }