const Post = require('../models/post')

const { validationResult } = require('express-validator')


exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        if (!posts) {
            return res.status(200).json({ message: "There are no posts" })
        }
        res.status(200).json({ message: "Posts", posts: posts })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

exports.getOnePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
        res.status(200).json({ message: "post geted", post })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}


exports.createPost = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array()[0].msg);
            return res.status(422).json({ message: errors.array()[0].msg })
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
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}


exports.deletePost = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Wrong user" })
        }

        await post.deleteOne()

        res.status(200).json({ message: "Post deleted" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Wrong user" })
        }

        const { title, content } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(id, { title, content } , { returnDocument: "after", runValidators: true })

        res.status(200).json({ message: "Updated post", updatedPost })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}