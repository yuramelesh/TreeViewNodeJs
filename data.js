var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'mysql://$OPENSHIFT_MYSQL_DB_HOST:$OPENSHIFT_MYSQL_DB_PORT/',
    user: 'adminDHS8W36',
    password: '8vNnESg31wm4',
    database: 'servernode'
});

//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: '78561245',
//    database: 'servernode'
//});

function add(n, e, p) {

    var newCompany = {name: n, earnings: e, parent: p};
    var query = connection.query('INSERT INTO companies SET ?', newCompany, function (err, result) {
        console.log(err);
        console.log(result);
    });
}

exports.add = add;