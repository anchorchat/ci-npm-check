'use strict';

module.exports = (requiredEnv) => {
  const unsetEnv = requiredEnv.filter(env => !(typeof process.env[env] !== 'undefined'));

  if (unsetEnv.length) {
    throw new Error(`Required ENV variables are not set: [${unsetEnv.join(', ')}]`);
  }
};
