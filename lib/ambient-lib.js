var request = require('request');

var hostname = 'http://54.65.206.59';
var hostname_dev = 'http://192.168.33.10';
var channel = {
    channelId: null,
    writeKey: null,
    readKey: null,
    userKey: null,
    dev: false
};

exports.connect = function(values) {
    channel.channelId = arguments[0];
    channel.writeKey = arguments[1];
    channel.readkey = arguments[2];
    channel.userKey = arguments[3];
    if ((typeof arguments[4] !== 'undefined') && arguments[4] == 1) {
        channel.dev = true;
    }

    return (typeof channel.channelId !== 'undefined');
}

exports.send = function(data, cb) {
    var d = (data instanceof Array) ? data : [data];
    options = {
        url: ((channel.dev) ? hostname_dev : hostname) + '/api/v2/channels/' + channel.channelId + '/dataarray',
        headers: {'Content-Type': 'application/json'},
        body: {writeKey: channel.writeKey, data: d},
        json: true
    };
    request.post(options, function(err, res, body) {
        if (typeof cb == 'function') {
            cb(err, res, body);
        }
    });
}

exports.bulk_send = function(dataarray, cb) {
    options = {
        url: ((channel.dev) ? hostname_dev : hostname) + '/api/v2/channels/' + channel.channelId + '/dataarray',
        headers: {'Content-Type': 'application/json'},
        body: {writeKey: channel.writeKey, data: dataarray},
        json: true
    };

    request.post(options, function(err, res, body) {
        if (typeof cb == 'function') {
            cb(err, res, body);
        }
    });
}
