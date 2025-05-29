import mongoose from 'mongoose';

const connectdb = () => {
  mongoose
    .connect(process.env.MongoDB_URL)
    .then(() => {
      console.log('Mongo Db is connected');
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectdb;
