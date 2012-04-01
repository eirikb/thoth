exports.version = function(err, data, req, res, contentType) {
    if (!res.header('content-type')) res.contentType('json');

    // Remove stuff we don't need for version rendering
    if (data) delete data.id;

    if (err) {
        res.send('Error: ' + err, 500)
    } else {
        if (data) {
            res.send(data);
        } else {
            res.send({
                message: 'Error: Unknown id or version'
            },
            404);
        }
    }
};

exports.parent = function(err, data, req, res) {
    if (!res.header('content-type')) res.contentType('json');

    if (err) {
        res.send({
            message: 'Error: ' + err
        },
        500);
    } else {
        if (data) {
            res.send(data);
        } else {
            res.send({
                message: 'Error: Unknown id'
            },
            404);
        }
    }
};

