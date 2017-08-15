// @flow
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

process.env.NODE_ENV = 'test';

const test = 'mongodb://localhost/semcomp-test';

const config = {
  db: {
    test,
  },
  connection: null,
};

function connect() {
  return new Promise((resolve, reject) => {
    if (config.connection) {
      return resolve();
    }

    const mongoUri = test;

    mongoose.Promise = Promise;

    const options = {
      server: {
        auto_reconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
      },
    };

    mongoose.connect(mongoUri, options);

    config.connection = mongoose.connection;

    config.connection
      .once('open', resolve)
      .on('error', (e) => {
        if (e.message.code === 'ETIMEDOUT') {
          console.log(e);

          mongoose.connect(mongoUri, options);
        }

        console.log(e);
        reject(e);
      });
  });
}

function clearDatabase() {
  return new Promise(resolve => {
    let cont = 0;
    let max = Object.keys(mongoose.connection.collections).length;
    for (const i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {
        cont++;
        if(cont >= max) {
          resolve();
        }
      });
    }
  });
}

export function getContext(context: Object) {
  return {
    ...context,
    req: {},
  };
}

export async function setupTest() {
  await connect();
  await clearDatabase();
}

const sanitizeValue = (value, field, keys) => {
  // If this current field is specified on the `keys` array, we simply redefine it
  // so it stays the same on the snapshot
  if (keys.indexOf(field) !== -1) {
    return `FROZEN-${field.toUpperCase()}`;
  }

  // Check if value is boolean
  if (typeof value === 'boolean') {
    return value;
  }

  // If value is empty, return `EMPTY` value so it's easier to debug
  if (!value && value !== 0) {
    return 'EMPTY';
  }

  // Check if it's not an array and can be transformed into a string
  if (!Array.isArray(value) && typeof value.toString === 'function') {
    // Remove any non-alphanumeric character from value
    const cleanValue = value.toString().replace(/[^a-z0-9]/gi, '');

    // Check if it's a valid `ObjectId`, if so, replace it with a static value
    if (ObjectId.isValid(cleanValue) && value.toString().indexOf(cleanValue) !== -1) {
      return value.toString().replace(cleanValue, 'ObjectId');
    }
  }

  // if it's an array, sanitize the field
  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item, null, keys));
  }

  // If it's an object, we call sanitizeTestObject function again to handle nested fields
  if (typeof value === 'object') {
    return sanitizeTestObject(value, keys);
  }

  return value;
};

/**
 * Sanitize a test object removing the mentions of a `ObjectId`
 * @param payload {object} The object to be sanitized
 * @param keys {[string]} Array of keys to redefine the value on the payload
 * @param ignore {[string]} Array of keys to ignore
 * @returns {object} The sanitized object
 */
export const sanitizeTestObject = (payload, keys = ['id'], ignore = []) => {
  return Object.keys(payload).reduce(
    (sanitizedObj, field) => {
      if (ignore.indexOf(field) !== -1) {
        return sanitizedObj;
      }

      const value = payload[field];
      const sanitizedValue = sanitizeValue(value, field, keys);

      return {
        ...sanitizedObj,
        [field]: sanitizedValue,
      };
    },
    {},
  );
};
