import Stripe from "stripe";
import * as dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 
export default stripe;