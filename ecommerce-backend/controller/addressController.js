// controller/addressController.js

const prisma = require("../prisma/client");

// =============================
// Get All Addresses for User
// =============================
exports.getAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;

        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { type: "asc" }
        });

        res.json(addresses);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Get Address by Type
// =============================
exports.getAddressByType = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type } = req.params;

        if (!["shipping", "billing"].includes(type)) {
            return res.status(400).json({
                message: "Type must be 'shipping' or 'billing'."
            });
        }

        const address = await prisma.address.findUnique({
            where: {
                userId_type: { userId, type }
            }
        });

        if (!address) {
            return res.status(404).json({
                message: `No ${type} address found.`
            });
        }

        res.json(address);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Save Address (Create or Update)
// =============================
exports.saveAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, fullName, street, city, phone } = req.body;

        if (!type || !fullName || !street || !city || !phone) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (!["shipping", "billing"].includes(type)) {
            return res.status(400).json({
                message: "Type must be 'shipping' or 'billing'."
            });
        }

        const address = await prisma.address.upsert({
            where: {
                userId_type: { userId, type }
            },
            update: {
                fullName: fullName.trim(),
                street: street.trim(),
                city: city.trim(),
                phone: phone.trim()
            },
            create: {
                userId,
                type,
                fullName: fullName.trim(),
                street: street.trim(),
                city: city.trim(),
                phone: phone.trim()
            }
        });

        res.status(200).json({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} address saved successfully.`,
            address
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Delete Address by Type
// =============================
exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type } = req.params;

        if (!["shipping", "billing"].includes(type)) {
            return res.status(400).json({
                message: "Type must be 'shipping' or 'billing'."
            });
        }

        const address = await prisma.address.findUnique({
            where: {
                userId_type: { userId, type }
            }
        });

        if (!address) {
            return res.status(404).json({
                message: `No ${type} address found.`
            });
        }

        await prisma.address.delete({
            where: {
                userId_type: { userId, type }
            }
        });

        res.json({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} address deleted successfully.`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};