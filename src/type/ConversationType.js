/* @flow */
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import UserType from './UserType';
import { User, Message } from '../model';

import MessageType from './MessageType';

const ConversationType = new GraphQLObjectType({
  name: 'Conversation',
  description: 'a conversation among users',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: conversation => conversation._id,
    },
    name: {
      type: GraphQLString,
      resolve: conversation => conversation.name,
    },
    active: {
      type: GraphQLBoolean,
      resolve: conversation => conversation.active,
    },
    messageCount: {
      type: GraphQLInt,
      resolve: conversation => conversation.messageCount,
    },
    owner: {
      type: UserType,
      resolve: async conversation => {
        return await User.findOne({
          _id: conversation.owner,
        });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async conversation => {
        return await User.find({
          _id: {
            $in: conversation.users,
          },
        });
      },
    },
    messages: {
      type: new GraphQLList(MessageType),
      resolve: async conversation => {
        const messages = await Message.find({
          conversation: conversation._id.toString(),
        });

        console.log('messages: ', messages);

        return messages;
      },
    },
  }),
});

export default ConversationType;
