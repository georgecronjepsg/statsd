const axios = require('axios');

const storageUrl = 'https://sendgridtracking.azurewebsites.net/api/statsd-logger?code=L/zFLtj178n8mQIUaWzwt4vlGGGWvHEZZh0Lgf4QZ0AAJg6cPJwkGw==';

function LoggerBackend(startupTime, config, emitter) {
    console.log('NEW LOGGER BACKEND');
    var self = this;
    this.lastFlush = startupTime;
    this.lastException = startupTime;
    this.config = config.console || {};

    emitter.on('flush', function(timestamp, metrics) { self.flush(timestamp, metrics); });
    emitter.on('status', function(callback) { self.status(callback); });
}

LoggerBackend.prototype.flush = function (timestamp, metrics) {
    // console.log('Timestamp: ', timestamp);
    // console.log('MY METRIC metrics: ', metrics);
    axios.post(storageUrl, JSON.stringify(metrics))
    .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res);
    })
    .catch((error) => {
        console.log('THERE WAS AN ERROR', error.toJSON());
      console.error(error);
    });
};

LoggerBackend.prototype.status = function (write) {
    console.log('Writing', write);
};

exports.init = function(startupTime, config, events) {
    var instance = new LoggerBackend(startupTime, config, events);
    return true;
}
