// Environment configuration
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');

// Constants
const PORT = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;
const Customer = require('./models/customer');
const customer = require("./models/customer");

// Express application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.set("strictQuery", false);

async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
}

// Server start function
async function startServer() {
  await connectToDatabase(dbURI);
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to my test API!");
});

// Get all customers
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (e) {
    res.status(500).json({ Error: e.message });
  }
});

/****************************************************************************************
req. 
    params are used to get data from the URL after the colon
    body is used to get data from the request body (POST requests)
****************************************************************************************/

// Get a single customer
app.get("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    console.log(customer);

    // If the customer is not found 
    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ Error: error.message });
}
});

// Add a new customer
app.post("/api/customers", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ customer });
    console.log("Customer saved successfully", customer);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
});

// Start the server
startServer();