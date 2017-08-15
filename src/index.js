/* @flow */
import 'babel-polyfill';
import app from './app';
import connectDatabase from './database';

const PORT = 5400;

(async () => {
  try {
    const info = await connectDatabase();
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  } catch (error) {
    console.error('Unable to connect to database');
    process.exit(1);
  }

  await app.listen(PORT);
  console.log(`Server started on port ${PORT}`);
})();
