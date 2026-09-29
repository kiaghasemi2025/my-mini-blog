const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const authRouter = require('./routes/auth')
const postRouter = require('./routes/posts')

const app = express();

app.use(express.json())
app.use('/auth',authRouter)
app.use('/post',postRouter)

const Uri = process.env.MONGODB_URI;
const Port = process.env.PORT;

mongoose.connect(`${Uri}`).then(result => {
    app.listen(Port, () => {
        console.log(`Server is Listening on port ${Port}`);
    })
})
.catch(err => console.log('mongo db fails to connect' , err.message))
