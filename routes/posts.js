const { Router } = require('express')
const postController = require('../controllers/posts')
const authenticatedToken = require('../middlewares/is-auth')
const { body } = require('express-validator')
const router = Router();

// title content authour
router.post('/create', authenticatedToken, [
    body('title', 'Please insert something').isLength({ min: 1 }),
    body('content', 'Please insert something').isLength({ min: 1 })
], postController.createPost)


module.exports = router