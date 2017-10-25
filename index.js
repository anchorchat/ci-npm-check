require('dotenv').config({ silent: true });
const { IncomingWebhook } = require('@slack/client');
const npmCheck = require('npm-check');
const _ = require('lodash');
const parseCurrentState = require('./lib/parse-current-state');
const slackSendMessageAsync = require('./lib/slack-send-message-async');

// Make sure all required env variables are set
require('./lib/required-env.js')([
  'SLACK_WEBHOOK_URL',
  'JOB_NAME'
]);

async function run() {
  const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  const options = {};

  const packages = await npmCheck(options)
    .then(parseCurrentState);

  const message = {
    text: process.env.JOB_NAME,
    attachments: _.map(packages, pkg => ({
      fallback: pkg.moduleName,
      color: 'danger',
      fields: [{
        title: pkg.moduleName,
        value: `${pkg.installed} !== ${pkg.latest}`
      }]
    }))
  };

  await slackSendMessageAsync(webhook, message);
}

run().catch(error => console.error(error)); // eslint-disable-line no-console
