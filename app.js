var express = require('express'),
routes = require('./routes');

var app = module.exports = express.createServer(),
port = process.env.PORT || 3000;

// http://stackoverflow.com/a/7069902
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
}

app.configure(function() {
    app.set('view options', {
        layout: false
    });
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use('/static', express.static(__dirname + '/public'));
    app.use(app.router);
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

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/show/:id/:version', routes.show.version);

app.get('/show/:id', routes.show.id);

app.get('/:id/:from\::to', routes.read.range);

app.get('/:id/:version.:attr', routes.read.thoth);

app.get('/:id/:version', routes.read.thoth);

app.get('/:id', routes.read.thoth);

app.post('/', routes.create.id);

app.post('/:id', routes.create.version);

app.get('/server.html', function(req, res) {
    res.render('server');
});

app.listen(port);

