const User = require('../models/user')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

exports.postSignup = async (req, res, next) => {
    try {

        const error = validationResult(req);
        if (!error.isEmpty()) {
        console.log(error.array());
           return  res.status(422).json({error:error.array()[0].msg})
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
        const {password:_  , ...userWithoutPassword} = result.toObject();
        res.status(201).json({ message: 'signup-successfull', user: userWithoutPassword })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}

