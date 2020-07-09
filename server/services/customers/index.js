'use strict';

const mysql = require('mysql');
// const Joi = require('@hapi/joi');
const validate = require('../../validator/customers');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "HK77@mysql#",
//   database: "node_mysql_crud_db"
// });
var con  = mysql.createPool({
  connectionLimit : 10,
  host: "localhost",
  user: "root",
  password: "HK77@mysql#",
  database: "node_mysql_crud_db",
  multipleStatements: true
});

function getAllCustomers(req, res){

    let sql="";
    let email = req.query.search;
    let limit= parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let data=[],user;
    if(email)
    {
        user = { email: email };
        if(limit)
        {
            sql = "SELECT * FROM customers WHERE email=? LIMIT ? OFFSET ?";
            data.push(email);
            data.push(limit);
            data.push(offset);
        }
        else
        {
            sql = "SELECT * FROM customers WHERE email=?";
            data.push(email);
        }
    }
    else
    {
        if(limit)
        {
            sql = "SELECT * FROM customers LIMIT ? OFFSET ?";
            data.push(limit);
            data.push(offset);
        }
        else
        {
            sql = "SELECT * FROM customers";
        }
        // sql = "SELECT * FROM customers";
    }
    let response = validate.validateUser(user);
    console.log(sql);
    console.log(data);
    if(response.error)
    {
        res.send(response.error.details);
    }
    else
    {
        let query = con.query(sql, data, (err, results) => {
            if(err) throw err;
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
    }
}

function getCustomerWithID(req, res){

    var user = { email: req.params.id };
    let response = validate.validateUser(user);
    if(response.error){
        res.send(response.error.details);
    }
    else
    {
        let sql = "SELECT * FROM customers WHERE email=?";
        let query = con.query(sql,[
            req.params.id], function(err, results){
            if(err) throw err;
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
    }
}

function createNewUser(req, res){

    let data = {name: req.body.name, address: req.body.address, contact: req.body.contact, email: req.body.email};
    let checkIfEmailExists = "SELECT * from customers WHERE email=?";
    var user = { name: req.body.name, contact: req.body.contact, email: req.body.email };
    let response = validate.validateUser(user);
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
        res.send(err);
    });
}

function updateUser(req, res){

    let data = [req.body.name, req.body.address, req.body.contact, req.body.email, req.params.id];
    let checkIfEmailExists = "SELECT * from customers WHERE email=?";
    var user = { name: req.body.name, contact: req.body.contact, email: req.body.email };
    let response = validate.validateUser(user);
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
        num=results.length;
        // console.log(num);
        // console.log(typeof(num));

        if(response.error){
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
    },function(err){
        console.log(err);
    });
}
function deleteUser(req, res) {

    var user = { email: req.body.email };
    let response = validate.validateUser(user);
    if(response.error){
        res.send(response.error.details);
    }
    else
    {
        let sql = "DELETE FROM customers WHERE email=?";
        let query = con.query(sql, [req.params.id], (err, results) => {
            if(err) throw err;
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
    }
}
function homeRoute(req, res){
  res.send("Hello World");
}

module.exports = {
	getAllCustomers: getAllCustomers,
	getCustomerWithID: getCustomerWithID,
	createNewUser: createNewUser,
	updateUser: updateUser,
	deleteUser: deleteUser
};
