var request = require('request'),
should = require('should');

// Create and start the actual server
var server = require('../app.js');

var host = 'localhost',
port = 3000,
url = 'http://' + host + ':' + port + '/';

function post(path, data, cb) {
    if (arguments.length === 2) {
        cb = data;
        data = path;
        path = '';
    }
    request.post({
        url: url + path,
        json: {
            data: data
        }
    },
    function(e, r, d) {
        cb(d);
    });
}

function get(path, cb) {
    request(url + path, function(e, r, d) {
        cb(d);
    });
}

describe('thoth', function() {
    var id = '';

    it('POST / {data: "test"}', function(done) {
        post('test', function(d) {
            d.should.have.property('id');
            d.should.have.property('timestamp');
            d.should.have.property('versions', 1);
            id = d.id;
            done();
        });
    });

    it('GET /:id', function(done) {
        get(id, function(d) {
            var data = JSON.parse(d);
            data.should.have.property('id', id);
            data.should.have.property('versions', 1);
            done();
        });
    });

    it('GET /:id/1', function(done) {
        get(id + '/1', function(d) {
            var data = JSON.parse(d);
            data.should.have.property('version', 1);
            data.should.have.property('data', 'test');
            data.should.have.property('timestamp');
            done();
        });
    });

    it('GET /:id/1.data', function(done) {
        get(id + '/1.data', function(d) {
            d.should.equal('test');
            done();
        });
    });

    it('POST /:id', function(done) {
        post(id, 'test2', function(d) {
            d.should.have.property('id');
            d.should.have.property('timestamp');
            d.should.have.property('versions', 2);
            done();
        });
    });

    it('POST /:id * 5', function(done) {
        var count = 0,
        max = 5,
        c = function() {
            post(id, 'test' + (3 + count), function(d) {
                count++;
                if (count === max) done();
                else c();
            });
        };
        c();
    });

    it('GET /:id', function(done) {
        get(id, function(d) {
            var data = JSON.parse(d);
            data.should.have.property('versions', 7);
            done();
        });
    });

    it('GET /-1', function(done) {
        get(id + '/-1', function(d) {
            var data = JSON.parse(d);
            data.should.have.property('version', 7);
            data.should.have.property('data', 'test7');
            done();
        });
    });

    it('GET /-3.data', function(done) {
        get(id + '/-3.data', function(d) {
            d.should.equal('test5');
            done();
        });
    });

    it('GET /1:4', function(done) {
        get(id + '/1:4', function(range) {
            range = JSON.parse(range);
            range.should.be.an.instanceof(Array);
            for (var i = 0; i < 4; i++) {
                range[i].should.have.property('version', i + 1);
            }
            done();
        });
    });
});

