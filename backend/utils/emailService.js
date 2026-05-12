const { Resend } = require('resend');

const orderConfirmationTemplate = (order, user) => `
<div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">

    <div style="background: #1c1917; padding: 32px; text-align: center;">
        <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">☕ The Daily Cup</h1>
        <p style="color: #a8a29e; margin: 8px 0 0; font-size: 13px;">
            Artisan Coffee & Fresh Pastries
        </p>
    </div>

    <div style="padding: 32px;">
        <h2 style="color: #1c1917;">Order Confirmed! 🎉</h2>

        <p style="color: #57534e; font-size: 14px;">
            Hi ${user.fullName}, your order has been placed successfully.
        </p>

        <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #92400e;">
                Order Number
            </p>

            <p style="margin: 8px 0 0; font-size: 24px; font-weight: bold;">
                ${order.orderNumber}
            </p>
        </div>

        <h3>Order Summary</h3>

        <table style="width: 100%; border-collapse: collapse;">
            ${order.items.map(item => `
                <tr>
                    <td style="padding: 10px 0;">
                        ${item.name}
                    </td>

                    <td style="text-align: center;">
                        × ${item.quantity}
                    </td>

                    <td style="text-align: right;">
                        $${(item.price * item.quantity).toFixed(2)}
                    </td>
                </tr>
            `).join('')}
        </table>

        <div style="border-top: 2px solid #1c1917; margin-top: 16px; padding-top: 16px;">
            <p style="font-weight: bold;">
                Total
                <span style="float: right;">
                    $${order.totalAmount.toFixed(2)}
                </span>
            </p>
        </div>

        <div style="background: #f5f5f4; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <p>📍 ${order.deliveryAddress}</p>
            <p>🚴 Estimated: 25-35 minutes</p>
            <p>💳 Payment: ${order.paymentMethod}</p>
        </div>
    </div>
</div>
`;

const sendOrderConfirmation = async (order, user) => {

    try {

        console.log('🔑 RESEND_API_KEY:',
            process.env.RESEND_API_KEY ? 'Loaded' : 'Missing'
        );

        console.log('📧 Sending email to:', user.email);

        // Initialize Resend
        const resend = new Resend('re_ZeYL8aTY_NDZVH8CdHVrqzWyqapHsedVV')

        const { data, error } = await resend.emails.send({

            from: 'The Daily Cup <onboarding@resend.dev>',

            // TEST EMAIL
            to: 'iamumerfarooq43@gmail.com',

            subject: `Order Confirmed! ${order.orderNumber} — The Daily Cup`,

            html: orderConfirmationTemplate(order, user),
        });

        if (error) {
            console.log('❌ Resend Error:', error);
            throw new Error(error.message);
        }

        console.log('✅ Email Sent Successfully:', data);

        return data;

    } catch (err) {

        console.error('❌ Email Service Error:', err.message);

        throw err;
    }
};

module.exports = { sendOrderConfirmation };