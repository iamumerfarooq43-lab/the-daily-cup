require('dotenv').config();

const dns = require('dns')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// routes
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')

// fix DNS resolution on some networks
dns.setServers(['8.8.8.8', '8.8.4.4'])
dns.setDefaultResultOrder('ipv4first')

// load .env variables
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}
// connect to MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// debug — log every incoming request
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`)
        next()
    })
}



app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/tickets', require('./routes/tickets'))

// health check
app.get('/', (req, res) => {
    res.json({ message: 'The Daily Cup API is running ✅' })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})