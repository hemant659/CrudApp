const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const Joi = require('@hapi/joi');

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
function validateUser(user){
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        contact: Joi.string()
            .pattern(new RegExp('^[0-9]{7,11}$')),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    return schema.validate(user);
}
// schema.validate({ name: 'abc', contact: '578934848sd' });
// var user = { name: 'alex123', contact: '5786677', email: "alexgmail.com" };
// response = validateUser(user)
//
// if(response.error)
// {
//     // console.log(response.error.details);
//     // console.log("not validated");
// }
// else
// {
//     console.log("Validated Data");
// }

app.get('/api/customers',(req, res) => {
    console.log("bad request");
  let sql = "SELECT * FROM customers";
  let query = con.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.get('/api/customers/:id',(req, res) => {

    // let sql = "SELECT * FROM customers WHERE email="+"'"+req.params.id+"'";
    let sql = "SELECT * FROM customers WHERE email=?";
    let query = con.query(sql,[
        req.params.id], function(err, results){
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

app.post('/api/customers',(req, res) => {
  let data = {name: req.body.name, address: req.body.address, contact: req.body.contact, email: req.body.email};
  // let sql =
  let sql = "INSERT INTO customers SET ?";
  let query = con.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.put('/api/customers/:id',(req, res) => {
  // let sql = "UPDATE customers SET name='"+req.body.name+"', address='"+req.body.address+"', contact='"+req.body.contact+"', email='"+req.body.email+"' WHERE email='"+req.params.id+"'";
  let sql = "UPDATE customers SET name=?, address=?, contact=?, email=? WHERE email=?";
  let query = con.query(sql, [req.body.name,req.body.address,req.body.contact,req.body.email,req.params.id] ,
      function(err, results){
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.delete('/api/customers/:id',(req, res) => {
  let sql = "DELETE FROM customers WHERE email=?";
  let query = con.query(sql, [req.params.id], (err, results) => {
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
//check if email already exists
//email validation
//concatenation of email
//database connection in different file
