const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const VALID_PAYMENT_METHODS = ["COD", "Bank Transfer"];

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { shippingAddressId, shippingMethod, shippingCost, paymentMethod } = req.body;

        // Validate payment method up front — this also gates the tax logic below
        if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method." });
        }

        // Get user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty." });
        }

        // Validate address
        const address = await prisma.address.findUnique({
            where: { id: Number(shippingAddressId) }
        });

        if (!address || address.userId !== userId) {
            return res.status(404).json({ message: "Address not found." });
        }

        // Stock check BEFORE touching anything — fail fast with a clear message
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${item.product.name} only has ${item.product.stock} left in stock.`
                });
            }
        }

        // Calculate subtotal from DB (never trust frontend)
        let subtotal = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                priceAtOrder: product.price
            });
        }

        // Calculate tax (4% for COD, 0% for bank transfer)
        const taxAmount = paymentMethod === "COD" ? (subtotal + shippingCost) * 0.04 : 0;

        // Calculate total
        const total = subtotal + shippingCost + taxAmount;

        const addressData = JSON.stringify({
            fullName: address.fullName,
            street: address.street,
            city: address.city,
            phone: address.phone
        });

        // Everything below must succeed together, or none of it should persist.
        const order = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({
                data: {
                    userId,
                    shippingAddress: addressData,
                    billingAddress: addressData,
                    shippingMethod,
                    shippingCost,
                    subtotal,
                    taxAmount,
                    total,
                    paymentMethod,
                    status: "pending",
                    items: {
                        create: orderItems
                    }
                },
                include: { items: true }
            });

            // Decrement stock for each product
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // Clear cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            return createdOrder;
        });

        res.status(201).json({
            message: "Order created successfully.",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// =============================
// GET MY ORDERS (Customer)
// =============================
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" }
        });

        res.json({
            message: "Orders fetched successfully.",
            orders
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// GET MY ORDER BY ID (Customer)
// =============================
exports.getMyOrderById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { items: { include: { product: true } } }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized to view this order." });
        }

        res.json({
            message: "Order fetched successfully.",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// GET ALL ORDERS (Admin)
// =============================
exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const where = status ? { status } : {};
        const skip = (page - 1) * limit;

        const orders = await prisma.order.findMany({
            where,
            include: { 
                items: { include: { product: true } },
                user: { select: { id: true, name: true, email: true, phone: true } }
            },
            orderBy: { createdAt: "desc" },
            skip: Number(skip),
            take: Number(limit)
        });

        const totalOrders = await prisma.order.count({ where });

        res.json({
            message: "All orders fetched successfully.",
            orders,
            totalOrders,
            currentPage: Number(page),
            totalPages: Math.ceil(totalOrders / limit)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// GET ORDER BY ID (Admin)
// =============================
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { 
                items: { include: { product: true } },
                user: { select: { id: true, name: true, email: true, phone: true } }
            }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.json({
            message: "Order fetched successfully.",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// UPDATE ORDER STATUS (Admin)
// =============================
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const order = await prisma.order.update({
            where: { id: Number(id) },
            data: { status },
            include: { items: true }
        });

        res.json({
            message: "Order status updated successfully.",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// UPDATE TRACKING NUMBER (Admin)
// =============================
exports.updateTrackingNumber = async (req, res) => {
    try {
        const { id } = req.params;
        const { trackingNumber } = req.body;

        if (!trackingNumber) {
            return res.status(400).json({ message: "Tracking number is required." });
        }

        const order = await prisma.order.update({
            where: { id: Number(id) },
            data: { trackingNumber },
            include: { items: true }
        });

        res.json({
            message: "Tracking number updated successfully.",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// DELETE ORDER (Admin)
// =============================
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.order.delete({
            where: { id: Number(id) }
        });

        res.json({
            message: "Order deleted successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};