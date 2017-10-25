'use strict';

const _ = require('lodash');

const parseCurrentState = currentState => (
  _.compact(
    _.map(currentState.get('packages'), (pkg) => {
      const { latest, installed } = pkg;

      return (latest !== installed) ? pkg : false;
    })
  )
);

module.exports = parseCurrentState;
