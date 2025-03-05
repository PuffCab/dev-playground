import stripe from "../config/StripeConfig.js";
import { itemsToPurchase } from "../data/store.js";

const getPaymentIntent = async (req, res) => {
    console.log("req.body", req.body);
    try {
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "paypal", "bancontact", "giropay", "klarna", "p24", "sepa_debit", "sofort"],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/paymentMern/success`,
            cancel_url: `${process.env.CLIENT_URL}/paymentMern/cancel`,
            line_items: req.body.items.map((item) => {   
                const ourItem = itemsToPurchase.get(item.id);   
                return {
                    price_data: {
                        currency: "eur",
                        product_data: { name: ourItem.name },
                        
                        unit_amount: ourItem.price,
                    },
                    quantity: ourItem.quantity,
                };
            })
        });
        res.status(200).json({
            message: "Payment intent created",
            stripeSession,
        });
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({
            message: "Error creating payment intent",
            error: error.message,
        });
    }
}

export { getPaymentIntent };