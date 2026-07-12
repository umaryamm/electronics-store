const prisma = require("../prisma/client");

// =============================
// GET DASHBOARD STATS (Admin)
// Returns live counts pulled straight from the database so the admin
// dashboard cards reflect real store data instead of hardcoded numbers.
// =============================
exports.getDashboardStats = async (req, res) => {
    try {
        const now = new Date();

        // Start of the current calendar month (local server time).
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 24 hours ago.
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [
            totalProducts,
            totalProjectsCount,
            totalBlogsCount,
            totalOrdersThisMonth,
            newOrders24h,
            clientQueriesPending
        ] = await Promise.all([
            prisma.product.count(),
            prisma.project.count(),
            prisma.blogPost.count(),
            prisma.order.count({
                where: { createdAt: { gte: startOfMonth } }
            }),
            prisma.order.count({
                where: { createdAt: { gte: last24h } }
            }),
            // "Pending" = anything that still needs an agent's attention,
            // i.e. everything that isn't Resolved.
            prisma.clientQuery.count({
                where: { status: { not: "Resolved" } }
            })
        ]);

        res.json({
            totalProducts,
            totalProjectsCount,
            totalBlogsCount,
            totalOrdersThisMonth,
            newOrders24h,
            clientQueriesPending
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
