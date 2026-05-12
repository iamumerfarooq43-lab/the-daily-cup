const { Resend } = require('resend')

const orderConfirmationTemplate = (order, user) => `
<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">

    <div style="background: #1c1917; padding: 32px; text-align: center;">
        <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">☕ The Daily Cup</h1>
        <p style="color: #a8a29e; margin: 8px 0 0; font-size: 13px;">Artisan Coffee & Fresh Pastries</p>
    </div>

    <div style="padding: 32px;">
        <h2 style="color: #1c1917; margin: 0 0 8px;">Order Confirmed! 🎉</h2>
        <p style="color: #57534e; font-size: 14px;">
            Hi ${user.fullName}, your order has been placed successfully.
        </p>

        <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Order Number</p>
            <p style="margin: 8px 0 0; font-size: 24px; font-weight: 700; color: #78350f;">${order.orderNumber}</p>
        </div>

        <h3 style="color: #1c1917; font-size: 14px; margin: 24px 0 12px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
            ${order.items.map(item => `
                <tr style="border-bottom: 1px solid #f5f5f4;">
                    <td style="padding: 10px 0; font-size: 13px; color: #1c1917;">${item.name}</td>
                    <td style="padding: 10px 0; font-size: 13px; color: #78716c; text-align: center;">× ${item.quantity}</td>
                    <td style="padding: 10px 0; font-size: 13px; color: #1c1917; text-align: right; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `).join('')}
        </table>

        <div style="border-top: 2px solid #1c1917; margin-top: 16px; padding-top: 16px;">
            <p style="margin: 0; font-weight: 700; color: #1c1917;">
                Total <span style="color: #b45309; font-size: 18px; float: right;">$${order.totalAmount.toFixed(2)}</span>
            </p>
        </div>

        <div style="background: #f5f5f4; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #78716c; text-transform: uppercase;">Delivery Details</p>
            <p style="margin: 0; font-size: 13px; color: #1c1917;">📍 ${order.deliveryAddress}</p>
            <p style="margin: 8px 0 0; font-size: 13px; color: #1c1917;">🚴 Estimated: 25-35 minutes</p>
            <p style="margin: 8px 0 0; font-size: 13px; color: #1c1917;">💳 Payment: ${order.paymentMethod}</p>
        </div>

        <p style="color: #78716c; font-size: 13px; line-height: 1.6;">
            Track your order in real-time on the
            <a href="https://the-daily-cup.vercel.app/orders" style="color: #b45309;">Orders page</a>.
        </p>
    </div>

    <div style="background: #f5f5f4; padding: 20px; text-align: center; border-top: 1px solid #e7e5e4;">
        <p style="margin: 0; font-size: 12px; color: #a8a29e;">© 2024 The Daily Cup · Lahore, Pakistan</p>
        <p style="margin: 6px 0 0; font-size: 12px; color: #a8a29e;">Made with ☕ and love</p>
    </div>
</div>
`

const sendOrderConfirmation = async (order, user) => {
    console.log('🔑 RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'loaded' : 'MISSING')

    // ✅ Initialize inside function so env var is always loaded
    // const resend = new Resend(process.env.RESEND_API_KEY)
    const resend = new Resend('re_ZeYL8aTY_NDZVH8CdHVrqzWyqapHsedVV')

    const { data, error } = await resend.emails.send({
        from: 'The Daily Cup <onboarding@resend.dev>',
        to: user.email,
        subject: `Order Confirmed! ${order.orderNumber} — The Daily Cup`,
        html: orderConfirmationTemplate(order, user),
    })

    if (error) throw new Error(error.message)
    return data
}

module.exports = { sendOrderConfirmation }