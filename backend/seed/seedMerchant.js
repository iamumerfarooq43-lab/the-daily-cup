const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const MONGO_URI = 'mongodb+srv://UmerFarooq:Lahore123@thecoffeecup.8gxiozk.mongodb.net/theCoffeecup?retryWrites=true&w=majority'

const seed = async () => {
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    await User.deleteOne({ email: 'merchant@dailycup.com' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('merchant123', salt)

    await User.create({
        fullName: 'Merchant Admin',
        email: 'merchant@dailycup.com',
        password: hashedPassword,
        role: 'merchant',
    })

    console.log('✅ Merchant user created successfully')
    console.log('   Email:    merchant@dailycup.com')
    console.log('   Password: merchant123')
    console.log('   Role:     merchant')

    await mongoose.disconnect()
    process.exit(0)
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
})