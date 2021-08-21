import mongoose from 'mongoose';
import ResponseStatuses from '../responseStatuses.enum.js';

const { Schema, model } = mongoose;

const responseSchema = new Schema({
  status: {
    type: String,
    enum: Object.values(ResponseStatuses),
  },
  response: Object,
  duration: Number,

  check: {
    type: Schema.Types.ObjectId,
    ref: 'Checks',
  },
});

export default model('Responses', responseSchema);
