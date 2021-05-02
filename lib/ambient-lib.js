'use strict'

class Ambient {
    constructor(channelId, writeKey, readKey) {
        this.host = 'https://ambidata.io';
        this.channelId = channelId;
        this.writeKey = (typeof writeKey !== 'undefined') ? writeKey : null;
        this.readKey = (typeof readKey !== 'undefined') ? readKey : null;
    }
    send(data, callback, timeout = 30000) {
        var _url = this.host + '/api/v2/channels/' + this.channelId + '/urldataarray';
        axios({
            method: 'POST',
            url: _url,
            data: Qs.stringify({writeKey: this.writeKey, data: (data instanceof Array) ? data : [data]}),
            timeout: timeout
        })
        .then(function(response) {
            if (typeof callback == 'function') {
                callback(response);
            }
        })
        .catch(function(error) {
            console.log({error: error});
        });
    }
    read(options, callback, timeout = 30000) {
        var _url = this.host + '/api/v2/channels/' + this.channelId + '/data';
        var _o = [];
        if (this.readKey != null) {
            _o.push('readKey=' + this.readKey);
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
            _url = _url + '?' + _o.join('&');
        }
        axios.get(_url, {timeout: timeout})
        .then(function(response) {
            if (typeof callback == 'function') {
                callback(response);
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    }
}
