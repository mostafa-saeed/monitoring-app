import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const checkSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  fullURL: {
    type: String,
    required: true,
  },
  authentication: Object,
  timeout: {
    type: Number,
    default: 5,
  },
  interval: {
    type: Number,
    default: 10,
  },
  threshold: {
    type: Number,
    default: 1,
  },
  additionalHeaders: Object,
  ignoreSSL: {
    type: Boolean,
    default: false,
  },
  assert: Object,
  isActive: {
    type: Boolean,
    default: true,
  },
  nextCheck: Date,

  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
});

export default model('Checks', checkSchema);
