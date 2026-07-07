const prisma = require("../prisma/client");

// =============================
// Get All Blog Posts (Public)
// =============================
exports.getBlogPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNum  = Math.max(parseInt(page), 1);
        const limitNum = Math.max(parseInt(limit), 1);
        const skip     = (pageNum - 1) * limitNum;

        const [totalPosts, posts] = await Promise.all([
            prisma.blogPost.count(),
            prisma.blogPost.findMany({
                orderBy: { createdAt: "desc" },
                skip,
                take: limitNum,
                select: {
                    id:        true,
                    title:     true,
                    imageUrl:  true,
                    createdAt: true
                }
            })
        ]);

        res.json({
            posts,
            currentPage: pageNum,
            totalPages:  Math.ceil(totalPosts / limitNum),
            totalPosts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Get Single Blog Post (Public)
// =============================
exports.getBlogPostById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const post = await prisma.blogPost.findUnique({ where: { id } });

        if (!post) {
            return res.status(404).json({ message: "Blog post not found." });
        }

        res.json(post);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Create Blog Post (Admin)
// =============================
exports.createBlogPost = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required."
            });
        }

        if (imageUrl && !imageUrl.startsWith("http")) {
            return res.status(400).json({
                message: "A valid image URL is required."
            });
        }

        const post = await prisma.blogPost.create({
            data: {
                title:    title.trim(),
                content:  content.trim(),
                imageUrl: imageUrl || null
            }
        });

        res.status(201).json({
            message: "Blog post created successfully.",
            post
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Update Blog Post (Admin)
// =============================
exports.updateBlogPost = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, content, imageUrl } = req.body;

        const post = await prisma.blogPost.findUnique({ where: { id } });

        if (!post) {
            return res.status(404).json({ message: "Blog post not found." });
        }

        if (imageUrl && !imageUrl.startsWith("http")) {
            return res.status(400).json({
                message: "A valid image URL is required."
            });
        }

        const updatedPost = await prisma.blogPost.update({
            where: { id },
            data: {
                title:    title   ? title.trim()   : post.title,
                content:  content ? content.trim() : post.content,
                imageUrl: imageUrl !== undefined   ? imageUrl : post.imageUrl
            }
        });

        res.json({
            message: "Blog post updated successfully.",
            updatedPost
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// =============================
// Delete Blog Post (Admin)
// =============================
exports.deleteBlogPost = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const post = await prisma.blogPost.findUnique({ where: { id } });

        if (!post) {
            return res.status(404).json({ message: "Blog post not found." });
        }

        await prisma.blogPost.delete({ where: { id } });

        res.json({ message: "Blog post deleted successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};