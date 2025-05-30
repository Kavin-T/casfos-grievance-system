/*
 * dbConnect.js
 *
 * Purpose:
 * This script provides a function to establish a connection to a MongoDB database using Mongoose.
 * It is designed to be imported and used in other parts of a Node.js application to initialize
 * the database connection.
 *
 * Features:
 * - Connects to a MongoDB database using a URI stored in the MONGO_URI environment variable.
 * - Handles successful connection with a confirmation log.
 * - Catches and logs connection errors, exiting the process with a failure code if the connection fails.
 * - Exports the connection function for use in other modules.
 *
 * Usage:
 * Import this module in your application (e.g., `const dbConnect = require('./dbConnect');`) and
 * call `dbConnect()` to establish the database connection. Ensure the MONGO_URI environment variable
 * is set in a .env file or environment configuration before running the application.
 *
 * Dependencies:
 * - Mongoose: A MongoDB object modeling tool for Node.js.
 * - Environment variable: MONGO_URI (MongoDB connection string).
 */

const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    // Attempt to connect to MongoDB using MONGO_URI
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Success DB Connected");
  } catch (err) {
    console.log(err);
    // Exit process with failure code on error
    process.exit(1);
  }
};
module.exports = dbConnect;
