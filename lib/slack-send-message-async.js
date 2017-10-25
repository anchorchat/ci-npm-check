'use strict';

const slackSendMessageAsync = (webhook, message) => (
  new Promise((resolve, reject) => {
    const callback = (err, header, statusCode, body) => (
      err ? reject(err) : resolve({ header, statusCode, body })
    );

    return webhook.send(message, callback);
  })
);

module.exports = slackSendMessageAsync;
