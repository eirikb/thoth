var express = require('express'),
dynamo = require('dynamo');

var app = module.exports = express.createServer(),
access = require(__dirname + '/access.json'),
db = dynamo.createClient(access);

port = process.env.PORT || 3000;

app.configure(function() {
    app.set('view options', {
        layout: false
    });
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

var table = db.get('thoth');

table.fetch(function(err) {
    if (!err) console.log('Ready');
});

function get(id, version, cb) {
    if (arguments.length === 2) cb = version;
    else id = id + '/' + version;

    if (!cb) cb = function(){};

    table.get({
        key: id
    }).fetch(cb);
}

function getJSON(id, version, cb) {
    if (arguments.length === 2) cb = version;
    else id = id + '/' + version;

    if (!cb) cb = function(){};

    get(id, function(err, data) {
        if (err) {
            cb(err);
        } else {
            try {
                data = JSON.parse(data.data);
                cb(null, data);
            } catch(e) {
                cb(e);
            }
        }
    });
}

function create(id, data, cb) {
    if (!cb) cb = function(){};

    try {
        data = JSON.stringify(data);
        table.put({
            id: id,
            data: data
        }).save(cb);
    } catch(e) {
        cb(e);
    }
}

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/read/:id/:version', function(req, res) {
    var id = req.params.id,
    version = req.params.version;

    if (id && version) {
        getJSON(id, version, function(err, data) {
            if (data) {
                if (err) res.send('Error: ' + err)
                else res.send(data);
            } else {
                res.send('Error: Unknown id or version: ' + id + ', ' + version);
            }
        });
    } else {
        res.render('index');
    }
});

app.get('/read/:id', function(req, res) {
    var id = req.params.id;

    if (id) {
        get(id, function(err, data) {
            if (data) {
                if (err) res.send('Error: ' + err)
                else res.send(data.data);
            } else {
                res.send('Error: Unknown id: ' + id);
            }
        });
    } else {
        res.render('index');
    }
});

app.post('/create', function(req, res) {
    var b = req.body,
    id = guid(),
    data = {
        versions: 1,
        created: Date.now()
    };

    if (b.data) {
        create(id, data, function(err) {
            if (err) {
                res.send('Error: ' + err);
            } else {
                id = id + '/1';
                create(id, b.data, function(err) {
                    if (err) res.send('Error: ' + err);
                    else res.send(id);
                });
            }
        });
    } else {
        res.send('Error: Please provide data parameter (curl -d "data=meh")');
    }
});

app.post('/create/:id', function(req, res) {
    var b = req.body;

    if (b.data) {
        getJSON(req.params.id, function(err, data) {
            if (err) {
                res.send('Error:' + err);
            } else if (!data) {
                res.send('Error: id not found, call /create to generate one');
            } else {
                data.versions++;

                // Update parent
                create(req.params.id, data);

                create(req.params.id + '/' + data.versions, b.data, function(err) {
                    if (err) res.send('Error:' + err);
                    res.send(req.params.id + '/' + data.versions);
                });
            }
        });
    } else {
        res.send('Error: Please provide data parameter (curl -d "data=meh")');
    }
});

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
    return S4() + S4() + S4() + S4();
}

app.listen(port);

