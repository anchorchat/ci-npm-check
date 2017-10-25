'use strict';

const _ = require('lodash');

const parseCurrentState = currentState => (
  _.compact(_.map(currentState.get('packages'), (pkg) => {
    const { latest, installed } = pkg;
    if (latest !== installed) {
      return {
        fallback: pkg.moduleName,
        color: 'danger',
        fields: [{
          title: pkg.moduleName,
          value: `${pkg.installed} !== ${pkg.latest}`
        }]
      };
    }

    return false;
  }))
);

module.exports = parseCurrentState;
