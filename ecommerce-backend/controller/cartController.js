// controller/cartController.js

const prisma = require("../prisma/client");

// =============================
// Get Current User's Cart
// =============================
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // If user has no cart yet, return an empty shape instead of null
        if (!cart) {
            return res.json({
                id: null,
                items: [],
                totalItems: 0,
                subtotal: 0
            });
        }

        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.items.reduce(
            (sum, item) => sum + item.quantity * item.product.price,
            0
        );

        res.json({
            id: cart.id,
            items: cart.items,
            totalItems,
            subtotal
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Add Item to Cart
// =============================
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId is required." });
        }

        const product = await prisma.product.findUnique({
            where: { id: Number(productId) }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Find or create the user's cart
        let cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        // Check if item already exists in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: Number(productId)
            }
        });

        const currentQty = existingItem ? existingItem.quantity : 0;
        const newQty = currentQty + 1;

        if (newQty > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} units available in stock.`
            });
        }

        let cartItem;

        if (existingItem) {
            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQty }
            });
        } else {
            cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: Number(productId),
                    quantity: 1
                }
            });
        }

        res.status(200).json({
            message: "Item added to cart.",
            cartItem
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Update Cart Item Quantity
// =============================
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const itemId = Number(req.params.itemId);
        const { quantity } = req.body;

        if (quantity == null || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1."
            });
        }

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
                product: true
            }
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found." });
        }

        // Make sure this cart item actually belongs to the requesting user
        if (cartItem.cart.userId !== userId) {
            return res.status(403).json({ message: "Forbidden." });
        }

        if (quantity > cartItem.product.stock) {
            return res.status(400).json({
                message: `Only ${cartItem.product.stock} units available in stock.`
            });
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        });

        res.json({
            message: "Cart item updated.",
            updatedItem
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Remove Item from Cart
// =============================
exports.removeCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const itemId = Number(req.params.itemId);

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found." });
        }

        if (cartItem.cart.userId !== userId) {
            return res.status(403).json({ message: "Forbidden." });
        }

        await prisma.cartItem.delete({ where: { id: itemId } });

        res.json({ message: "Item removed from cart." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Clear Entire Cart
// =============================
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            return res.json({ message: "Cart is already empty." });
        }

        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

        res.json({ message: "Cart cleared." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};