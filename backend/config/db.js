const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true, //allow users to fall back to the old parser if they find a bug in the new parser
      useUnifiedTopology: true, //Set to true to opt in to using the MongoDB driver's new connection management engine.
    });
    console.log(`MongoDB Connected:${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error:${error.message}`);
    process.exit();
  }
};
module.exports = connectDB;
