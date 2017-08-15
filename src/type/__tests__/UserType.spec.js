/* @flow */
import { graphql } from 'graphql';
import { schema } from '../../schema';
import {
  User,
  Conversation,
} from '../../model';
import {
  getContext,
  setupTest,
  sanitizeTestObject,
} from '../../../test/helper';

beforeEach(async () => await setupTest());

it('should get an user', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
    password: '123',
  });
  await user.save();

  //language=GraphQL
  const query = `
    query Q {
      user(id: "${user._id.toString()}") {
        _id
        name
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ user });

  const result = await graphql(schema, query, rootValue, context);

  expect(sanitizeTestObject(result)).toMatchSnapshot();
});

it('should get an user', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
    password: '123',
  });
  await user.save();

  const conversation = new Conversation({
    name: 'ok',
    users: [
      user,
    ],
    owner: user,
    active: true,
  });
  await conversation.save();

  //language=GraphQL
  const query = `
    query Q {
      user(id: "${user._id.toString()}") {
        _id
        name
        conversations {
          _id
          name
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ user });

  const result = await graphql(schema, query, rootValue, context);

  expect(sanitizeTestObject(result)).toMatchSnapshot();
});


