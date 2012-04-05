var thoth = require('../thoth.js'),
render = require('./render.js');

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
    return S4() + S4() + S4() + S4();
}

function create(parent, body, req, res) {
    thoth.create(parent, function(err) {
        var data;
        if (err) {
            res.send({
                message: 'Error: ' + err
            },
            500);
        } else {
            data = {
                id: parent.id + '/' + parent.versions,
                version: parent.versions,
                timestamp: Date.now(),
                data: body.data
            };
            thoth.create(data, function(err) {
                // Redirect to show-page if posted from thoth.io
                if (body.fromPage) res.redirect('/show/' + data.id);
                else render.parent(err, parent, req, res);
            });
        }
    });
}

exports.id = function(req, res) {
    var body = req.body,
    id = guid(),
    data = {
        id: id,
        versions: 1,
        timestamp: Date.now()
    };

    res.contentType('json');

    if (body && body.data) {
        create(data, body, req, res);
    } else {
        res.send('Error: Please provide data parameter (curl -d "data=meh")');
    }
};

exports.version = function(req, res) {
    var body = req.body,
    id = req.params.id;

    res.contentType('json');

    if (body && body.data) {
        thoth.get(id, function(err, data) {
            if (err) {
                res.send('Error:' + err);
            } else if (!data) {
                res.send({
                    message: 'Error: id not found'
                },
                404);
            } else {
                // Update parent
                data.versions++;
                thoth.create(data);

                create(data, body, req, res);
            }
        });
    } else {
        res.send('Error: Please provide data parameter (curl -d "data=meh")');
    }
};

