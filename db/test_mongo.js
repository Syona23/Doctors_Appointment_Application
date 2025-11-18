const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017/appointmentsDB';

console.log('Testing MongoDB connection to', uri);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5s
}).then(() => {
  console.log('Connected to MongoDB successfully');
  return mongoose.disconnect();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exitCode = 1;
});
