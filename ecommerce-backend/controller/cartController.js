// controller/cartController.js
const prisma = require("../prisma/client");

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true, project: true }
                }
            }
        });

        if (!cart) {
            return res.json({ id: null, items: [], totalItems: 0, subtotal: 0 });
        }

        // Defensive filter: drop any orphaned items (see schema note on onDelete: SetNull)
        const validItems = cart.items.filter((item) =>
            item.itemType === "PRODUCT" ? item.product !== null : item.project !== null
        );

        const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = validItems.reduce((sum, item) => {
            const price = item.itemType === "PROJECT" ? item.project.price : item.product.price;
            return sum + item.quantity * price;
        }, 0);

        res.json({ id: cart.id, items: validItems, totalItems, subtotal });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, projectId } = req.body;

        if (!productId && !projectId) {
            return res.status(400).json({ message: "productId or projectId is required." });
        }
        if (productId && projectId) {
            return res.status(400).json({ message: "Provide only one of productId or projectId." });
        }

        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) cart = await prisma.cart.create({ data: { userId } });

        if (productId) {
            const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
            if (!product) return res.status(404).json({ message: "Product not found." });

            const existingItem = await prisma.cartItem.findFirst({
                where: { cartId: cart.id, productId: Number(productId), itemType: "PRODUCT" }
            });
            const newQty = (existingItem?.quantity || 0) + 1;
            if (newQty > product.stock) {
                return res.status(400).json({ message: `Only ${product.stock} units available in stock.` });
            }

            const cartItem = existingItem
                ? await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity: newQty } })
                : await prisma.cartItem.create({
                    data: { cartId: cart.id, itemType: "PRODUCT", productId: Number(productId), quantity: 1 }
                  });

            return res.status(200).json({ message: "Item added to cart.", cartItem });
        }

        const project = await prisma.project.findUnique({ where: { id: Number(projectId) } });
        if (!project) return res.status(404).json({ message: "Project not found." });

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, projectId: Number(projectId), itemType: "PROJECT" }
        });
        if (existingItem) {
            return res.status(400).json({ message: "This project is already in your cart." });
        }

        const cartItem = await prisma.cartItem.create({
            data: { cartId: cart.id, itemType: "PROJECT", projectId: Number(projectId), quantity: 1 }
        });

        res.status(200).json({ message: "Project added to cart.", cartItem });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const itemId = Number(req.params.itemId);
        const { quantity } = req.body;

        if (quantity == null || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1." });
        }

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true, product: true, project: true }
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found." });
        }
        if (cartItem.cart.userId !== userId) {
            return res.status(403).json({ message: "Forbidden." });
        }

        if (cartItem.itemType === "PROJECT") {
            return res.status(400).json({ message: "Project quantity is fixed at 1." });
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

        res.json({ message: "Cart item updated.", updatedItem });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const itemId = Number(req.params.itemId);

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });

        if (!cartItem) return res.status(404).json({ message: "Cart item not found." });
        if (cartItem.cart.userId !== userId) return res.status(403).json({ message: "Forbidden." });

        await prisma.cartItem.delete({ where: { id: itemId } });
        res.json({ message: "Item removed from cart." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) return res.json({ message: "Cart is already empty." });

        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        res.json({ message: "Cart cleared." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};