const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const AppError = require('../middlewares/AppError')
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;
const jwtExpires = process.env.JWT_EXPIRES_IN;

exports.postSignup = async (req, res, next) => {
    try {

        const error = validationResult(req);
        if (!error.isEmpty()) {
            console.log(error.array());
            return next(new AppError(error.array()[0].msg, 422))
        }

        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        })

        const result = await user.save()
        const { password: _, ...userWithoutPassword } = result.toObject();
        res.status(201).json({ message: 'signup-successfull', user: userWithoutPassword })

    } catch (error) {
        if (error.code === 11000) {
            return next(new AppError('Email already in use',409))
        }
        next(error)
    }
}

exports.postLogin = async (req, res, next) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            console.log(error.array());
            return next(new AppError(error.array()[0].msg, 422))
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email: email })
        if (!user) {
            return next(new AppError('Invalid email or password', 401))
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return next(new AppError('Invalid email or password', 401))

        }

        const { password: _, ...userWithoutPassword } = user.toObject();

        const token = jwt.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: jwtExpires }
        )
        res.status(200).json({ token: token, user: userWithoutPassword })

    } catch (error) {
        next(error)
    }
}