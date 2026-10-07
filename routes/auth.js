const express = require('express')
const authController = require('../controllers/auth')
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit')
const authLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max:10,
   message: {message:'To many attempts , please try again later'}
})

const Router = express.Router();

Router.post('/signup',
   authLimiter,
   [
      body('email', 'Please enter a valid email').isEmail(),
      body('name', 'The entered name must be between 2 and 20 characters long').isLength({ min: 2, max: 20 }),
      body('password', 'The password must consist of at least 6 characters').isLength({ min: 6 })
   ]
   , authController.postSignup)

Router.post('/login',
   authLimiter,
   [
      body('email', 'Invalid Email or Password').isEmail(),
      body('password', 'Invalid Email or Password').isLength({ min: 6 })
   ], authController.postLogin)

module.exports = Router