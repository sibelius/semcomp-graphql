/* @flow */
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from 'graphql';
import {
  User,
} from './model';
import Conversation from './model/Conversation';

import MutationType from './MutationType';
import UserType from './type/UserType';
import ConversationType from './type/ConversationType';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    hello: {
      type: GraphQLString,
      args: {
        name: {
          type: GraphQLString,
          description: 'person name',
        },
      },
      description: 'my first program on graphql',
      resolve: (root, args, context) => args.name ? `hello ${args.name}` : 'hello stranger',
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (root, args, context) => {
        return User.findOne({
          _id: args.id,
        });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_,  args, context) => {
        return User.find({});
      },
    },
    conversations: {
      type: new GraphQLList(ConversationType),
      resolve: async (_, args, context) => {
        return Conversation.find({});
      },
    },
  }),
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
