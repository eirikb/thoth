var db = require('../db.js');

function show(id, version, req, res) {
    if (id) {
        db.get(id, function(err, parent) {
            if (parent) {
                var model = {
                    error: false
                };
                if (!err && ! parent) err = 'Unkown id: ' + id;
                if (!err && parent) {
                    db.get(id + '/' + version, function(err, item) {
                        if (err) {
                            model.error = err;
                            res.render('show', model);
                        } else if (!item) {
                            model.error = 'Unkown version: ' + version;
                            res.render('show', model);
                        } else {
                            parent.versions = parseInt(parent.versions, 10);
                            parent.timestamp = new Date(parent.timestamp);
                            if (item.timestamp) item.timestamp = new Date(item.timestamp);
                            model.parent = parent;
                            model.thoth = item;
                            model.version = parseInt(version, 10);
                            res.render('show', model);
                        }
                    });
                } else {
                    model.error = err;
                    res.render('show', model);
                }
            } else {
                res.render('show', {
                    error: 'Unkown id'
                });
            }
        });
    }
}

exports.version = function(req, res, next) {
    show(req.params.id, req.params.version, req, res);
};

exports.id = function(req, res) {
    var id = req.params.id;

    db.get(id, function(err, parent) {
        if (parent) res.redirect('/show/' + id + '/' + parent.versions);
        else res.redirect('/show/' + id + '/herp');
    });
};

