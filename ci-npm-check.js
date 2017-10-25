require('dotenv').config({ silent: true });
const { IncomingWebhook } = require('@slack/client');
const npmCheck = require('npm-check');
const _ = require('lodash');

// Make sure all required env variables are set
require('./lib/required-env.js')([
  'SLACK_WEBHOOK_URL',
  'JOB_NAME'
]);

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

const slackSendMessage = (webhook, message) => (
  new Promise((resolve, reject) => {
    const callback = (err, header, statusCode, body) => (
      err ? reject(err) : resolve({ header, statusCode, body })
    );

    return webhook.send(message, callback);
  })
);

(async () => {
  const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  const options = {};

  const attachments = await npmCheck(options)
    .then(parseCurrentState);

  const message = {
    text: process.env.JOB_NAME,
    attachments
  };

  await slackSendMessage(webhook, message);
})();
