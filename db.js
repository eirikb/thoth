var dynamo = require('dynamo');

var access = require(__dirname + '/access.json'),
db = dynamo.createClient(access),
table = db.get('thoth'),
self = this;

table.fetch(function(err) {
    if (!err) console.log('Ready');
});

exports.get = function(id, cb) {
    console.log('Reading', id);

    table.get({
        key: id
    }).fetch(cb);
};

// TODO: Use batch
exports.range = function(id, from, to, cb) {
    console.log(arguments);
    var pos = from,
    versions = [],
    fetch = function() {
        self.get(id + '/' + pos, function(err, data) {
            versions.push(data);
            pos++;
            if (pos !== to) fetch();
            else cb(null, versions);
        });
    };
    fetch();

    /*
    db.get(function() {
        this.get('thoth', ids);
    }).fetch(function() {
        console.log(arguments);
    });
    */
}

exports.create = function(data, cb) {
    if (!cb) cb = function() {};

    console.log('Creating', data);

    table.put(data).save(cb);
};

