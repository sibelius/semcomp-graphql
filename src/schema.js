/* @flow */
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean, GraphQLNonNull, GraphQLID,
  GraphQLList,
} from 'graphql';
import User from './model/User';

import MutationType from './MutationType';

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
        user.email
      },
    },
    active: {
      type: GraphQLBoolean,
      resolve: user => user.active,
    },
  }),
});

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
      resolve: (root, args, context) => {
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
  }),
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
