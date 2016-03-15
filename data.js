/**
 * Connecting to DataBase
 */

var mysql = require('mysql');

//var connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: '78561245',
//    database: 'servernode'
//});

var connection = mysql.createConnection({
    host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
    user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
    password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
    port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
    database : process.env.OPENSHIFT_APP_NAME
});

/**
 * Adding new company
 */

function adding(n, e, p) {

    var newCompany = {name: n, earnings: e, parent: p};
    connection.query('INSERT INTO companies SET ?', newCompany, function (err, result) {
        //console.log(err);
        //console.log(result);
    });
}

/**
 * Updating selected company information
 */

var updateName = 'UPDATE companies SET name = ? WHERE id=?';
var updateEarnings = 'UPDATE companies SET earnings = ? WHERE id=?';
var updateParent = 'UPDATE companies SET parent = ? WHERE id=?';

function updating(id, name, earnings, parent) {
    if (name !== '') {
        connection.query(updateName, [name, id], function (err, res) {
            if (err) throw err;
            else {
            }
        });
    }

    if (earnings !== '') {
        connection.query(updateEarnings, [earnings, id], function (err, res) {
            if (err) throw err;
            else {
            }
        });
    }

    if (parent !== '') {
        connection.query(updateParent, [parent, id], function (err, res) {
            if (err) throw err;
            else {
            }
        });
    }
}

/**
 * Delete selected company
 */

function remove(id) {
    connection.query('DELETE FROM companies WHERE id=' + id, function (err, result) {
    });

    connection.query('SELECT * FROM companies WHERE parent=' + id, function (err, result) {
        result.forEach(function(obj){
            updating(obj.id, obj.name, obj.earnings, 0);
        });
    });
}

exports.mysqlconnection = connection;
exports.adding = adding;
exports.updating = updating;
exports.remove = remove;