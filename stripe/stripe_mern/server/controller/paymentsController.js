import stripe from "../config/StripeConfig.js";

const getPaymentIntent = async (req, res) => {

    try {
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "paypal"],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
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