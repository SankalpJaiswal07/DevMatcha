const mongoose = require("mongoose");
const database = process.env.DATABASE;

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_CLUSTER_API_URL + database);
};

module.exports = connectDB;
