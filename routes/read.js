var thoth = require('../thoth.js'),
render = require('./render.js');

function get(id, req, res, isParent) {
    var attr = req.params.attr;

    thoth.get(id, function(err, data) {
        if (attr) {
            res.header('content-type', 'text/plain');
            render.version(err, data[attr], req, res);
        } else {
            if (isParent) render.parent(err, data, req, res);
            else render.version(err, data, req, res);
        }
    });
}

exports.thoth = function(req, res) {
    var id = req.params.id,
    version = parseInt(req.params.version, 10);

    if (!isNaN(version)) {
        if (version > 0) {
            id = id + '/' + version;
            get(id, req, res);
        } else {
            thoth.get(id, function(err, data) {
                var versions;
                if (data) {
                    versions = parseInt(data.versions, 10);
                    if (!isNaN(versions)) version = versions + 1 + version;
                    id = id + '/' + version;
                }
                get(id, req, res);
            });
        }
    } else {
        get(id, req, res, true);
    }
};

exports.range = function(req, res) {
    var from, to, id = req.params.id,
    i1 = parseInt(req.params.from, 10),
    i2 = parseInt(req.params.to, 10);

    from = Math.min(i1, i2);
    to = Math.max(i1, i2) + 1;

    thoth.range(id, from, to, function(err, data) {
        render.version(err, data, req, res);
    });
};

