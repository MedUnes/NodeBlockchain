// Import credentials
const keys = require("./keys");

// Import MySQL.js module
const mysql = require("mysql");

// Create mysql connection
const connection = mysql.createConnection(keys.mysql);

//Connect to the server using credentials
connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}

	console.log('connected as id ' + connection.threadId);
});
module.exports = connection;