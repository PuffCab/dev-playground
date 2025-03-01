import express from "express";
import { getPaymentIntent } from "../controller/paymentsController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment-intent",getPaymentIntent);

export default paymentRouter;