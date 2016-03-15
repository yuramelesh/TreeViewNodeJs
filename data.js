/**
 * Connecting to DataBase
 */

var mysql = require('mysql');

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

function add(n, e, p) {

    var newCompany = {name: n, earnings: e, parent: p};
    connection.query('INSERT INTO companies SET ?', newCompany, function (err, result) {
        console.log(err);
        console.log(result);
    });
}

/**
 * Updating selected company information
 */

var updateName = 'UPDATE companies SET name = ? WHERE id=?';
var updateEarnings = 'UPDATE companies SET earnings = ? WHERE id=?';
var updateParent = 'UPDATE companies SET parent = ? WHERE id=?';

function update(id, name, earnings, parent) {
    if (name !== '') {
        connection.query(updateName, [name, id], function (err, res) {
            if (err) throw err;
            else {
                console.log('Name changed');
            }
        });
    }

    if (earnings !== '') {
        connection.query(updateEarnings, [earnings, id], function (err, res) {
            if (err) throw err;
            else {
                console.log('Earnings changed');
            }
        });
    }

    if (parent !== '') {
        connection.query(updateParent, [parent, id], function (err, res) {
            if (err) throw err;
            else {
                console.log('Parent changed');
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
            update(obj.id, obj.name, obj.earnings, 0);
        });
    });
}

exports.mysqlconnection = connection;
exports.add = add;
exports.update = update;
exports.remove = remove;