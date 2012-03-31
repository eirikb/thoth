thoth = (function() {
    var self = {};

    var host = 'http://eirikb.no:3000/',
    FooXHR =  PPX.buildClientConstructor(host + 'server.html'),
    req = new FooXHR();

    //var formData = new FormData();
    //formData.append("data", "Groucho");
    self.read = function(id, cb) {
        req.open('GET', host + 'read/' + id);
        if (cb) {
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    if (req.status == 200) cb(null, req.responseText);
                    else cb(null, req.responseText);
                }
            };
        }
        req.send(null);
    };

    self.create = function(id, data, cb) {
        if (arguments.length < 3) {
            cb = data;
            data = id;
            id = '';
        } 
        //if (arguments.length === 2) cb = null;
        if (arguments.length === 3) id = '/' + id;

        console.log(id, data)

        req.open('POST', host + 'create' + id);
        if (cb) {
            req.onreadystatechange = function() {
                console.log(7, req, arguments);
                if (req.readyState == 4) {
                    if (req.status == 200) cb(null, req.responseText);
                    else cb(null, req.responseText);
                }
            };
        }
        req.send(data);
    };

    return self;
})();
return thoth;
