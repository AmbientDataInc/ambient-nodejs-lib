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
    channel.readKey = arguments[2];
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

exports.read = function(options, cb) {
    var url = ((channel.dev) ? hostname_dev : hostname) + '/api/v2/channels/' + channel.channelId + '/data';
    var _o = [];
    if (channel.readKey != null) {
        _o.push('readKey=' + channel.readKey);
    }
    if (typeof options.date !== 'undefined') {
        _o.push('date=' + options.date);
    } else {
        if (typeof options.start !== 'undefined' && typeof options.end !== 'undefined') {
            _o.push('start=' + options.start);
            _o.push('end=' + options.end);
        } else {
            if (typeof options.n !== 'undefined') {
                _o.push('n=' + options.n);
                if (typeof options.skip !== 'undefined') {
                    _o.push('skip=' + options.skip);
                }
            }
        }
    }
    if (_o.length > 0) {
        url = url + '?' + _o.join('&');
    }
    var params = {
        url: url,
        json: true
    };
    request.get(params, function(err, res, data) {
        if (typeof cb == 'function') {
            if (Array.isArray(data)) {
                data.reverse();
            }
            cb(err, res, data);
        }
    });
}
