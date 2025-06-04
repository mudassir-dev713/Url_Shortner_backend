const mongoose = require('mongoose');

const connectdb = () => {
  return mongoose.connect('mongodb://localhost:27017/url', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

module.exports = connectdb;
