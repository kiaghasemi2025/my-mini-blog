const { Router } = require('express')

const postController = require('../controllers/posts')

const authenticatedToken = require('../middlewares/is-auth')

const { body } = require('express-validator')

const router = Router();

router.get('/', postController.getPosts)

router.get('/:id', postController.getOnePost)

router.post(
    '/create',
    authenticatedToken,
    [
        body('title', 'Please insert something').isLength({ min: 1 }),
        body('content', 'Please insert something').isLength({ min: 1 })
    ],
    postController.createPost
)


router.delete('/:id', authenticatedToken, postController.deletePost)

router.patch(
    '/:id',
    authenticatedToken,
    [
        body('title', 'Please insert something').isLength({ min: 1 }),
        body('content', 'Please insert something').isLength({ min: 1 })
    ],
    postController.updatePost
)

module.exports = router