const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
// Setup server port
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "HK77@mysql#",
  database: "node_mysql_crud_db"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO customers (name, address, contact, email) VALUES ('Alex', 'Highway 37', '9348858757', 'alex@gmail.com')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});
// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
