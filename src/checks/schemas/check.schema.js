import mongoose from 'mongoose';
import ResponseStatuses from '../../responses/responseStatuses.enum.js';

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
  tags: {
    type: [String],
    default: [],
  },
  webhook: String,

  nextCheck: Date,
  status: {
    type: String,
    enum: Object.values(ResponseStatuses),
    default: ResponseStatuses.DOWN,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
});

export default model('Checks', checkSchema);
