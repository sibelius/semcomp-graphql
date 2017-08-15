/* @flow */
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  name: {
    type: String,
    description: 'conversation name',
    required: true,
  },
  users: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
  owner: {
    type: ObjectId,
    ref: 'User',
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  collection: 'conversation',
});

export default mongoose.model('Conversation', Schema);
