import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const responseSchema = new Schema({
  status: {
    type: String,
    enum: ['up', 'down'],
  },
  response: Object,
  duration: Number,

  check: {
    type: Schema.Types.ObjectId,
    ref: 'Checks',
  },
});

export default model('Responses', responseSchema);
