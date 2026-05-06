const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])
dns.setDefaultResultOrder('ipv4first')

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('../models/Product')

dotenv.config()

const products = [
    // Coffee
    { name: 'Flat White', category: 'Coffee', price: 4.50, description: 'Double ristretto with velvety steamed milk', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777675654/FlatWhiteCoffee_hxdeor.webp', inStock: true },
    { name: 'Caramel Latte', category: 'Coffee', price: 5.00, description: 'Espresso, steamed milk and caramel syrup', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777675640/CaramelLatee_kn4kf6.jpg', inStock: true },
    { name: 'Cold Brew', category: 'Coffee', price: 4.75, description: '12-hour slow-steeped cold brew coffee', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777675645/ColdBrew_oz2mab.jpg', inStock: true },
    { name: 'Cappuccino', category: 'Coffee', price: 4.25, description: 'Espresso with thick steamed milk foam', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777675630/Cappuccino_rmceqk.webp', inStock: true },
    { name: 'Americano', category: 'Coffee', price: 3.75, description: 'Espresso shots with hot water', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777675613/Americano_mn5ziv.webp', inStock: true },
    { name: 'Espresso', category: 'Coffee', price: 3.00, description: 'Pure single or double shot espresso', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777675649/Espresso_sq9kg2.webp', inStock: false },

    // Tea
    { name: 'Karak Chai', category: 'Tea', price: 3.50, description: 'Classic bergamot black tea', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777673565/KarakChai_bqgnax.webp', inStock: true },
    { name: 'Green Tea', category: 'Tea', price: 3.25, description: 'Organic Japanese green tea', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777675163/GreenTea_kysmcb.webp', inStock: true },

    // Sandwiches
    { name: 'Chicken Sandwich', category: 'Sandwich', price: 7.50, description: 'Grilled chicken, lettuce, aioli', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777677076/ChickenSandwich_hhnk0t.jpg', inStock: true },
    { name: 'Veggie Wrap', category: 'Sandwich', price: 6.50, description: 'Hummus, roasted veg, spinach', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777676955/VeggieWrap_c17day.jpg', inStock: false },
    { name: 'BLT Sandwich', category: 'Sandwich', price: 7.00, description: 'Bacon, lettuce, tomato, mayo', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777677125/BLT-Sandwich_obfbrv.webp', inStock: true },

    // Salads
    { name: 'Caesar Salad', category: 'Salad', price: 8.00, description: 'Romaine, parmesan, croutons', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777677649/Caesar_Salad_drlb0x.webp', inStock: true },
    { name: 'Greek Salad', category: 'Salad', price: 7.50, description: 'Feta, olives, cucumber, tomato', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777677631/Greek_Salad_zex2eo.webp', inStock: true },
    { name: 'Garden Salad', category: 'Salad', price: 6.50, description: 'Mixed greens, seasonal vegetables', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777677639/Garden_Salad_k76mt8.webp', inStock: true },

    // Pastries
    { name: 'Croissant', category: 'Pastry', price: 3.50, description: 'Butter croissant, baked fresh daily', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777677320/Croissant_habxby.webp', inStock: true },
    { name: 'Banana Bread', category: 'Pastry', price: 3.75, description: 'Moist homemade banana bread', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777677305/BananaBread_yzvlbs.webp', inStock: true },
    { name: 'Blueberry Muffin', category: 'Pastry', price: 3.25, description: 'Bursting with fresh blueberries', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777677311/BlueberryMuffin_niyg8r.webp', inStock: true },
    { name: 'Cinnamon Roll', category: 'Pastry', price: 4.00, description: 'Soft roll with cream cheese glaze', image: 'https://res.cloudinary.com/dealdygig/image/upload/v1777677317/CinnamonRoll_bkfndt.jpg', inStock: true },
]

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected for seeding...')

        // clear existing products first
        await Product.deleteMany()
        console.log('Existing products cleared ✅')

        // insert all 20 products
        await Product.insertMany(products)
        console.log('20 products seeded successfully ✅')

        process.exit()
    } catch (error) {
        console.error('Seed error:', error.message)
        process.exit(1)
    }
}

seedDB()