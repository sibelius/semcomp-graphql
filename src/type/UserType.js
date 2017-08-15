/* @flow */
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';
import {
  Conversation,
} from '../model';
import ConversationType from './ConversationType';

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'an user',
  fields: () => ({
    _id: {
      type: GraphQLString,
      resolve: user => user._id,
    },
    name: {
      type: GraphQLString,
      resolve: user => user.name,
    },
    email: {
      type: GraphQLString,
      resolve: (user, args, context) => {
        if (!context.user || user._id.toString() !== context.user._id.toString()) {
          return null;
        }

        return user.email;
      },
    },
    active: {
      type: GraphQLBoolean,
      resolve: user => user.active,
    },

    conversations: {
      type: new GraphQLList(ConversationType),
      resolve: (user, args, context) => {
        return Conversation.find({
          owner: user._id,
        });
      },
    },
  }),
});

export default UserType;
