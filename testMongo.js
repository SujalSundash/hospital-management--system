const mongoose = require('mongoose');
require('dotenv').config();

console.log('MONGO_URI:', process.env.MONGO_URI); // check env is loaded

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => {
    console.error('MongoDB Connection Error ❌', err);
    process.exit(1);
  });