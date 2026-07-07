const prisma = require("../prisma/client");

// =============================
// Get Reviews for a Product
// =============================
exports.getProductReviews = async (req, res) => {
    try {
        const productId = Number(req.params.productId);

        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const reviews = await prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, name: true }
                }
            }
        });

        res.json({
            productId,
            averageRating: product.averageRating,
            reviewCount:   product.reviewCount,
            reviews
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Create Review (Verified Purchase)
// =============================
exports.createReview = async (req, res) => {
    try {
        const userId    = req.user.userId;
        const productId = Number(req.params.productId);
        const { rating, title, comment } = req.body;

        // Validate product exists
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Validate fields
        if (!rating || !title || !comment) {
            return res.status(400).json({ message: "Rating, title and comment are required." });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        // Check verified purchase — user must have ordered this product
        const purchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId,
                    status: { not: "cancelled" }
                }
            }
        });

        if (!purchased) {
            return res.status(403).json({
                message: "You can only review products you have purchased."
            });
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findFirst({
            where: { productId, userId }
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this product."
            });
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                productId,
                userId,
                rating:  Number(rating),
                title:   title.trim(),
                comment: comment.trim()
            }
        });

        // Recalculate averageRating and reviewCount on product
        const stats = await prisma.review.aggregate({
            where: { productId },
            _avg:   { rating: true },
            _count: { rating: true }
        });

        await prisma.product.update({
            where: { id: productId },
            data: {
                averageRating: parseFloat(stats._avg.rating.toFixed(1)),
                reviewCount:   stats._count.rating
            }
        });

        res.status(201).json({
            message: "Review submitted successfully.",
            review
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Update Review (own review only)
// =============================
exports.updateReview = async (req, res) => {
    try {
        const userId   = req.user.userId;
        const id       = Number(req.params.id);
        const { rating, title, comment } = req.body;

        const review = await prisma.review.findUnique({ where: { id } });

        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "Forbidden." });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: {
                rating:  rating  ? Number(rating)  : review.rating,
                title:   title   ? title.trim()    : review.title,
                comment: comment ? comment.trim()  : review.comment
            }
        });

        // Recalculate averageRating
        const stats = await prisma.review.aggregate({
            where: { productId: review.productId },
            _avg:   { rating: true },
            _count: { rating: true }
        });

        await prisma.product.update({
            where: { id: review.productId },
            data: {
                averageRating: parseFloat(stats._avg.rating.toFixed(1)),
                reviewCount:   stats._count.rating
            }
        });

        res.json({
            message: "Review updated successfully.",
            updatedReview
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Delete Review (own review or admin)
// =============================
exports.deleteReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const role   = req.user.role;
        const id     = Number(req.params.id);

        const review = await prisma.review.findUnique({ where: { id } });

        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }

        if (review.userId !== userId && role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden." });
        }

        await prisma.review.delete({ where: { id } });

        // Recalculate averageRating after deletion
        const stats = await prisma.review.aggregate({
            where: { productId: review.productId },
            _avg:   { rating: true },
            _count: { rating: true }
        });

        await prisma.product.update({
            where: { id: review.productId },
            data: {
                averageRating: stats._avg.rating
                    ? parseFloat(stats._avg.rating.toFixed(1))
                    : 0,
                reviewCount: stats._count.rating
            }
        });

        res.json({ message: "Review deleted successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};