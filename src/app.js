/* @flow */
import Koa from 'koa';
import Router from 'koa-router';
import graphqlHTTP from 'koa-graphql';
import convert from 'koa-convert';
import { getUser} from './auth';

import { schema } from './schema';

const app = new Koa();

app.keys = 'semcomp';

const router = new Router();

router.all(
  '/graphql',
  convert(
    graphqlHTTP(async (req, ctx) => {
      const { user } = await getUser(req.header.authorization);

      // const user = await User.findOne({_id: '5992ef7c5c82203d3f1adfae'});

      return {
        graphiql: true,
        schema,
        context: {
         user
        },
        extensions: ({ document, variables, operationName, result }) => {
          // console.log(print(document));
          // console.log(variables);
          // console.log(result);
        },
        formatError: error => {
          console.log(error.message);
          console.log(error.locations);
          console.log(error.stack);

          // log to server

          return {
            message: error.message,
            locations: error.locations,
            stack: error.stack,
          };
        },
      };
    }),
  ),
);

app.use(router.routes()).use(router.allowedMethods());

export default app;
