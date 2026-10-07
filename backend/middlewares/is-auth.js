const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {
    const authHeader = req.get('Authorization')
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:"Authentication token required"})
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message:"Invalid or expired token!"
        })
    }
}