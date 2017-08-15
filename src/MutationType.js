// @flow

import { GraphQLObjectType } from 'graphql';

import RegisterEmail from './RegisterEmailMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
		// auth
    RegisterEmail,
  }),
});
