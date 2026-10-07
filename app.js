const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const errorHandler = require('./middlewares/error-hadler')
require('dotenv').config()

const authRouter = require('./routes/auth')
const postRouter = require('./routes/posts')

const app = express();

app.use(helmet())
app.use(cors({
    origin:'*' // TODO: restrict to my frontend's URL once it exists, e.g. 'http://localhost:30000'
}))
app.use(express.json())
app.use('/auth',authRouter)
app.use('/post',postRouter)

app.use(errorHandler)

const Uri = process.env.MONGODB_URI;
const Port = process.env.PORT;

mongoose.connect(`${Uri}`).then(result => {
    app.listen(Port, () => {
        console.log(`Server is Listening on port ${Port}`);
    })
})
.catch(err => console.log('mongo db fails to connect' , err.message))
