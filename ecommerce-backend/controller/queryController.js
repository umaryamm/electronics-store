const prisma = require("../prisma/client");

const VALID_STATUSES  = ["Unread", "In Progress", "Resolved"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// =============================
// Submit a Client Query (Public)
// =============================
exports.createQuery = async (req, res) => {
    try {
        const { clientName, clientEmail, subject, message, priority } = req.body;

        if (!clientName || !clientEmail || !subject || !message) {
            return res.status(400).json({
                message: "Name, email, subject, and message are all required."
            });
        }

        if (!isEmail(clientEmail)) {
            return res.status(400).json({ message: "A valid email address is required." });
        }

        const query = await prisma.clientQuery.create({
            data: {
                clientName:  clientName.trim(),
                clientEmail: clientEmail.trim(),
                subject:     subject.trim(),
                message:     message.trim(),
                priority:    VALID_PRIORITIES.includes(priority) ? priority : "Medium"
            }
        });

        res.status(201).json({
            message: "Your message has been sent successfully.",
            query
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Get All Client Queries (Admin)
// =============================
exports.getQueries = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const pageNum  = Math.max(parseInt(page), 1);
        const limitNum = Math.max(parseInt(limit), 1);
        const skip     = (pageNum - 1) * limitNum;

        const where = status && VALID_STATUSES.includes(status) ? { status } : {};

        const [totalQueries, queries] = await Promise.all([
            prisma.clientQuery.count({ where }),
            prisma.clientQuery.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limitNum
            })
        ]);

        res.json({
            queries,
            currentPage: pageNum,
            totalPages:  Math.ceil(totalQueries / limitNum),
            totalQueries
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Update Query Status (Admin)
// =============================
exports.updateQueryStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                message: `Status must be one of: ${VALID_STATUSES.join(", ")}`
            });
        }

        const query = await prisma.clientQuery.findUnique({ where: { id } });

        if (!query) {
            return res.status(404).json({ message: "Query not found." });
        }

        const updatedQuery = await prisma.clientQuery.update({
            where: { id },
            data: { status }
        });

        res.json({
            message: "Query status updated successfully.",
            updatedQuery
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Delete Query (Admin)
// =============================
exports.deleteQuery = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const query = await prisma.clientQuery.findUnique({ where: { id } });

        if (!query) {
            return res.status(404).json({ message: "Query not found." });
        }

        await prisma.clientQuery.delete({ where: { id } });

        res.json({ message: "Query deleted successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
