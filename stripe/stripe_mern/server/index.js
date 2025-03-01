import express from "express";
import cors from "cors";
import colors from "colors";
import * as dotenv from "dotenv";
import paymentRouter from "./routes/pamentRoutes.js";
dotenv.config();


const app = express();
  
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const itemsToPurchase = new Map([
    [1, { price: 100, quantity: 1, name: "Item-1" }],
    [2, { price: 200, quantity: 2, name: "Item-2" }],
    [3, { price: 300, quantity: 3, name: "Item-3" }],
]);



app.listen(5000, () => {
    console.log("Server has started on port 5000".green);
});

app.use("/api/payments", paymentRouter);