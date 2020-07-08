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

app.get('/api/customers',(req, res) => {
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
    let checkIfEmailExists = "SELECT * from customers WHERE email=?";
    var user = { name: req.body.name, contact: req.body.contact, email: req.body.email };
    response = validateUser(user);
    let num;


    let p1 = new Promise(function(resolve,reject){
        let q = con.query(checkIfEmailExists, [req.body.email],(err, results) => {
            if(err){
                reject(err);
            }
            else{
                resolve(results);
            }
        });
    });
    p1.then(function(results){
        // if(err) throw err;
        num=results.length;
        // console.log(num);
        // console.log(typeof(num));

        if(response.error){
            res.send(response.error.details);
        }
        else if(num===0)
        {
            console.log("for 0");
            let sql = "INSERT INTO customers SET ?";
            let query = con.query(sql, data,(err, result) => {
                if(err) throw err;
                res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
            });
        }
        else
        {
            console.log("for >0");
            res.send("Email already exists");
        }
    },function(err){
        console.log(err);
    });
});

app.put('/api/customers/:id',(req, res) => {
  let data = [req.body.name, req.body.address, req.body.contact, req.body.email, req.params.id];
  let checkIfEmailExists = "SELECT * from customers WHERE email=?";
  var user = { name: req.body.name, contact: req.body.contact, email: req.body.email };
  response = validateUser(user);
  let num;
  let q = con.query(checkIfEmailExists, [req.body.email],(err, results) => {

      if(err) throw err;
      num=results.length;
      console.log(num);
      console.log(typeof(num));
      if(response.error)
      {
          res.send(response.error.details);
      }
      else if(num===0)
      {
          console.log("for 0");
          let sql = "UPDATE customers SET name=?, address=?, contact=?, email=? WHERE email=?";
          let query = con.query(sql, data,(err, result) => {
              if(err) throw err;
              res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
          });
      }
      else
      {
          console.log("for >0");
          res.send("Email already exists");
      }
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
//validate input
//controller file
//callback hell
