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

con.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "INSERT INTO customers (name, address, contact, email) VALUES ('Alex', 'Highway 37', '9348858757', 'alex@gmail.com')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
// });

app.get('/api/customers',(req, res) => {
  let sql = "SELECT * FROM customers";
  let query = con.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.get('/api/customers/:id',(req, res) => {

  let sql = "SELECT * FROM customers WHERE email="+"'"+req.params.id+"'";
  let query = con.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.post('/api/customers',(req, res) => {
  let data = {name: req.body.name, address: req.body.address, contact: req.body.contact, email: req.body.email};
  let sql = "INSERT INTO customers SET ?";
  let query = con.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.put('/api/customers/:id',(req, res) => {
  let sql = "UPDATE customers SET name='"+req.body.name+"', address='"+req.body.address+"', contact='"+req.body.contact+"', email='"+req.body.email+"' WHERE email='"+req.params.id+"'";
  let query = con.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.delete('/api/customers/:id',(req, res) => {
  let sql = "DELETE FROM customers WHERE email="+"'"+req.params.id+"'";
  let query = con.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
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
