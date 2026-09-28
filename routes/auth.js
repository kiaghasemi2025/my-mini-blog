const express = require('express')
const authController = require('../controllers/auth')
const {body} = require('express-validator')

const Router = express.Router();

Router.post('/signup',
     [
        body('email', 'Please enter a valid email').isEmail() ,
        body('name','The entered name must be between 2 and 20 characters long').isLength({min:2,max:20}) ,
        body('password','The password must consist of at least 6 characters').isLength({min:6})
     ] 
     , authController.postSignup)

Router.post('/login',
   [
      body('email', 'Invalid Email or Password').isEmail() ,
      body('password' , 'Invalid Email or Password').isLength({min:6})
   ] ,
   authController.postLogin)

module.exports = Router