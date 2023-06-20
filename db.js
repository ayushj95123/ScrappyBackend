const mongoose = require('mongoose');

const connectDB = async (dbUrl) => {
  console.log("Trrying connection with the database")
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error while disconnecting from MongoDB:', error);
  }
};

module.exports = { connectDB, closeDB };

