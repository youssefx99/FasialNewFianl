const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { connectToDB } = require("./utils/connect");
const userRoute = require("./router/userRoute");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
connectToDB();

// Serve static frontend files from "client" directory
app.use(express.static(path.join(__dirname, "client")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://fasial-new-fianl.vercel.app"],
    credentials: true, 
  })
);

// API Routes
app.use("/api/", userRoute);

// ✅ Serve React frontend for all non-API routes
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
    res.sendFile(path.join(__dirname, "client", "index.html"));
  } else {
    res.status(404).json({ success: false, message: "Not Found" });
  }
});

// Start Server
const PORT = process.env.PORT || 3080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
