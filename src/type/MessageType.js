/* @flow */
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import UserType from './UserType';
import { User, Conversation } from '../model';

import ConversationType from './ConversationType';

const MessageType = new GraphQLObjectType({
  name: 'Message',
  description: 'a message in a conversation',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: message => message._id,
    },
    text: {
      type: GraphQLString,
      resolve: message => message.text,
    },
    messageCount: {
      type: GraphQLInt,
      resolve: message => message.messageCount,
    },
    user: {
      type: UserType,
      resolve: async message => {
        return User.findOne({
          _id: message.user,
        });
      },
    },
    conversation: {
      type: ConversationType,
      resolve: async message => {
        return Conversation.findOne({
          _id: message.conversation,
        });
      },
    },
  }),
});

export default MessageType;
