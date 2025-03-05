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





app.listen(5000, () => {
    console.log("Server has started on port 5000".green);
});

app.use("/api/payments", paymentRouter);