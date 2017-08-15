/* @flow */
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  text: {
    type: String,
    description: 'message text',
    required: true,
  },
  user: {
    type: ObjectId,
    ref: 'User',
  },
  conversation: {
    type: ObjectId,
    ref: 'Conversation',
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  collection: 'message',
});

export default mongoose.model('Message', Schema);
