// 'use strict';

const validate = require('../../validator/customers/validator.js');
const service = require('../../services/customers/service.js');
const sender='+12015818912';

function getAllCustomers(req, res){

    let sql="";
    let email = req.query.search;
    let limit= parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let data=[];
    let response = validate.validateGetAll(req.query);
    if(response.error){
        res.send(response.error.details);
    }
    else
    {
        if(email)
        {
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
        }
        console.log(sql);
        console.log(data);
        let query = con.query(sql, data, (err, results) => {
            if(err) throw err;
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
    }

}

function getCustomerWithID(req, res){

    // var user = { email: req.params.id };
    let response = validate.validateGetWithID(req.params);
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


function updateUser(req, res){

    let data = [req.body.name, req.body.address, req.body.contact, req.body.email, req.params.id];
    let checkIfEmailExists = "SELECT * from customers WHERE email=?";
    // var user = { name: req.body.name, contact: req.body.contact, email: req.body.email };
    let response = validate.validateUpate(req.body);
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

    // var user = { email: req.body.email };
    let response = validate.validateDelete(req.body);
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
function createNewUser(req,code){

    var p1 = function(resolve,reject){
        let data = {name: req.body.name, address: req.body.address, contact: req.body.contact, email: req.body.email, otp: code};
        let sql = "INSERT INTO customers SET ?";
        let query = con.query(sql, data,(err, result) => {
            if(err) {
                reject(err);
            }
             let res = JSON.stringify({"status": 200, "error": null, "response": result});
             console.log("response = "+res);
             resolve(res);
        });
        return;
    }
    return new Promise(p1);
}

function signUpLogin(req,res){
    // console.log(req.body);
    let sql = "SELECT * from customers WHERE contact=?";
    let response = validate.validateCreate(req.body);
    let num;
    if(response.error){
        res.send(response.error.details);
    }
    else{
        checkIfContactExists(sql,req).then(function(results){
            num=results.length;
            if(num===0){
                initiateOTP(req.body.contact);
                res.send("OTP sent to sign up");
            }
            else
            {
                initiateOTP(req.body.contact);
                res.send("OTP sent to login into your account");
            }
        })
        .catch(function(reason){
            res.send(reason);
        });
    }
}

function checkIfContactExists(sql,req){
    var p1 = function(resolve,reject){
        let q = con.query(sql, [req.body.contact],(err, results) => {
            if(err){
                reject(err);
                // console.log(err);
            }
            else{
                resolve(results);
                // console.log(results);
            }
        });
        return;
    }
    return new Promise(p1);
}

function updateOTPafterLoginSuccess(otp,contact){
    let sql = "UPDATE customers SET otp=? WHERE contact=?";
    var p1 = function(resolve,reject){
        let q = con.query(sql, [otp,contact],(err, results) => {
            if(err){
                reject(err);
            }
            else{
                resolve(results);
            }
        });
        return;
    }
    return new Promise(p1);
}

function verifyOTP(req,res){

    console.log("inside verifyOTP");
    let userInput = parseInt(req.query.input);
    let realOTP = parseInt(req.query.code);
    let useCase = req.query.case;
    if(useCase==="signUp"){
        if(userInput===realOTP){
            let user = req.body;
            console.log("req = "+req.body);
            console.log("userInput = "+userInput);
            createNewUser(req,userInput)
            .then(function(result){
                res.send(result);
            })
            .catch(err => res.send(err));
        }
        else{
            res.send("You entered incorrect OTP, Please try again!");
        }
    }
    else if(useCase==="login"){
        if(userInput===realOTP){
            updateOTPafterLoginSuccess(userInput,req.body.contact)
            .then(result => res.send(result))
            .catch(err => res.send(error));
        }
        else{
            res.send("You entered incorrect OTP, Please try again!");
        }
    }
}

function getOTPforContact(sql,req){
    var p1 = function(resolve,reject){
        let q = con.query(sql, [req.body.contact],(err, results) => {
            if(err){
                reject(err);
                // console.log(err);
            }
            else{
                resolve(results);
                // console.log(results);
            }
        });
        return;
    }
    return new Promise(p1);
}
function initiateOTP(reciepent){
    let code = Math.floor((Math.random() * 1000000) + 1);
    console.log("code = "+code);
    service.sendOTP(sender,"+91"+reciepent,code);
    // return code;
}

function OTPsuccess(){

}


module.exports = {
	getAllCustomers: getAllCustomers,
	getCustomerWithID: getCustomerWithID,
	createNewUser: createNewUser,
	updateUser: updateUser,
	deleteUser: deleteUser,
    signUpLogin: signUpLogin,
    verifyOTP: verifyOTP
};
