import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: String,
  emailNotification: {
    type: Boolean,
    default: true,
  },
});

export default model('Users', userSchema);
