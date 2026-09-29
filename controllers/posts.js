const Post = require('../models/post')
const {validationResult} = require('express-validator')

exports.createPost = async (req,res,next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array()[0].msg); 
           return res.status(422).json({message:errors.array()[0].msg})
        }

        const {title , content} = req.body ;
        const post = new Post({
            title:title,
            content:content,
            author:req.user.userId
        })

        const result = await post.save()
        res.status(201).json({message:'Post created' , post:result})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}