const Post = require('../models/post')
const AppError = require('../middlewares/AppError')

const { validationResult } = require('express-validator')


exports.getPosts = async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        if (page < 1) page = 1;
        if (limit < 1) limit = 10;

        const totalPosts = await Post.countDocuments();
        const posts = await Post.find().skip((page - 1) * limit).limit(limit);

        res.status(200).json({
            message: "Posts",
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts
        })
    } catch (error) {
        next(error)
    }
}

exports.getOnePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id)
        if (!post) {
            return next(new AppError('Post not found', 404))
        }
        res.status(200).json({ message: "post geted", post })
    } catch (error) {
        if (error.name === 'CastError') {
            return next(new AppError('Invalid post Id', 400))
        }
        next(error)
    }
}

exports.createPost = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError(errors.array()[0].msg, 422))
        }

        const { title, content } = req.body;
        const post = new Post({
            title: title,
            content: content,
            author: req.user.userId
        })

        const result = await post.save()
        res.status(201).json({ message: 'Post created', post: result })

    } catch (error) {
        next(error)
    }
}

exports.deletePost = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.id)
        if (!post) {
            return next(new AppError("Post not found", 404))
        }
        if (post.author.toString() !== req.user.userId) {
            return next(new AppError("Wrong user", 403))
        }

        await post.deleteOne()

        res.status(200).json({ message: "Post deleted" })

    } catch (error) {
        if (error.name === 'CastError') {
            return next(new AppError('Invalid post Id', 400))
        }
        next(error)
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id)
        if (!post) {
            return next(new AppError("Post not found", 404))
        }
        if (post.author.toString() !== req.user.userId) {
            return next(new AppError("Wrong user", 403))
        }

        const { title, content } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(id, { title, content }, { returnDocument: "after", runValidators: true })

        res.status(200).json({ message: "Updated post", updatedPost })

    } catch (error) {
        if (error.name === 'CastError') {
            return next(new AppError('Invalid post Id', 400))
        }
        next(error)
    }
}