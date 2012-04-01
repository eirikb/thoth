var thoth = require('../thoth.js'),
render = require('./render.js');

exports.thoth = function(req, res) {
    var id = req.params.id,
    version = req.params.version,
    attr = req.params.attr;

    if (version) id = id + '/' + version;

    thoth.get(id, function(err, data) {
        if (attr) {
            res.header('content-type', 'text/plain');
            render.version(err, data[attr], req, res);
        } else {
            if (version) render.version(err, data, req, res);
            else render.parent(err, data, req, res);
        }
    });
};

