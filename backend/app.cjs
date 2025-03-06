const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { replacer, reviver } = require('./bigint-serialization.cjs');

const blockchainRoutes = require("./routes/blockchainRoutes.cjs");
const blockchainController = require("./controllers/digitalSignatureController.cjs");

const app = express();

// Better error logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configure Express to handle BigInt serialization
app.use((req, res, next) => {
  res.json = function (obj) {
    const sanitized = JSON.parse(JSON.stringify(obj, replacer));
    this.setHeader("Content-Type", "application/json");
    this.send(JSON.stringify(sanitized));
  };
  next();
});

// Parse JSON with BigInt handling
app.use(express.json({ 
  reviver,
  limit: '10mb' // Increased limit for larger payloads
}));

// Configure CORS to be more permissive during development
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow both localhost and 127.0.0.1
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials
  exposedHeaders: ['X-Success-Message']
}));

app.use(bodyParser.json({
  limit: '10mb' // Match the express.json limit
}));

// Direct route definition for the verify endpoint
app.post("/api/blockchain/verify-signature", (req, res) => {
  console.log("Received verification request");
  // Add extra debugging
  try {
    blockchainController.verifyDigitalSignature(req, res);
  } catch (error) {
    console.error("Error in signature verification:", error);
    res.status(500).json({ success: false, message: "Internal server error during verification" });
  }
});

// Your existing routes
app.post("/api/blockchain/get-blocks", blockchainController.getBlocks);
app.use("/api/blockchain", blockchainRoutes);
app.post("/api/blockchain/update-block", blockchainController.updateBlock);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404s
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/blockchain/`);
  console.log("Current working directory:", process.cwd());
});