var dynamo = db = require('dynamo');
/*

var access = require(__dirname + '/access.json'),
db = dynamo.createClient(access);

var table = db.get('thoth');

table.fetch(function(err) {
    if (!err) console.log('Ready');
});

table.put({
    id: "123",
    name: "eirikb"
}).save(function() {
    console.log(arguments);
});
*/

/*
table.fetch(function(err, table) {
    if (err) return console.error(err)

    console.log("This table has %s items and was created at %s", table.ItemCount, table.CreationDateTime)
})

table.get({
    key: '123'
}).fetch(function() {
    console.log(arguments)
});
*/

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
    return S4() + S4() + S4() + S4;
}

