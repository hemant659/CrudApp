'use strict';

const mysql = require('mysql');

function makeDBconn(){
	var con = mysql.createConnection({
 		host: "localhost",
 		user: "root",
 		password: "HK77@mysql#",
 		database: "node_mysql_crud_db"
	});
	return con;
}

module.exports = {
	makeDBconn: makeDBconn
};
