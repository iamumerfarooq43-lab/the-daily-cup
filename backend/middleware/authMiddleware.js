const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.log('JWT ERROR:', error.message)

            return res.status(401).json({
                message: 'Not authorized, token failed.',
                error: error.message
            })
        }
    } else {
        return res.status(401).json({
            message: 'Not authorized, no token.'
        })
    }
}

const merchantOnly = (req, res, next) => {
    if (req.user && req.user.role === 'merchant') {
        next()
    } else {
        res.status(403).json({ message: 'Access denied. Merchants only.' })
    }
}

module.exports = { protect, merchantOnly }