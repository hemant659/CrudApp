// 'use strict';

const validate = require('../../validator/customers/validator.js');
const service = require('../../services/customers/service.js');
const sender='+12015818912';
<<<<<<< HEAD
let message = "Guten Abend!";
function getCustomerWithID(req, res){

        let sql = "SELECT * FROM customers WHERE email=?";
        let query = con.query(sql,[
            req.params.id], function(err, results){
            if(err) throw err;
            res.json({"status": 200, "error": null, "response": results});
        });
}

function updateUser(req, res){

    let data = [req.body.name, req.body.address, req.body.contact, req.body.email, req.params.id];
    let checkIfEmailExists = "SELECT * from customers WHERE email=?";
    let num;
    service.checkIfEmailExists(req.body.email).then(function(results){
        num=results.length;
        if(num===0){
            console.log("for 0");
            let sql = "UPDATE customers SET name=?, address=?, contact=?, email=? WHERE email=?";
            let query = con.query(sql, data,(err, result) => {
                if(err) throw err;
                res.json({"status": 200, "error": null, "response": result});
            });
        }
        else{
            console.log("for >0");
            res.send("Email already exists");
        }
    },function(err){
        console.log(err);
    });
}
function deleteUser(req, res) {
        let sql = "DELETE FROM customers WHERE email=?";
        let query = con.query(sql, [req.params.email], (err, results) => {
            if(err) throw err;
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
}
=======
>>>>>>> first commit on develop

function signUpLogin(req,res){
        data=req.body;
        let code = initiateOTP(data.contact);
        data.otp = code;
        data.isOTPverified = 0;
        data.case=req.query.case;
        service.checkIfContactExists(data.contact)
        .then((result) => afterOTP(result,data))
        .then(function(response){
            console.log("response = "+response);
            if(response===0)
                res.send("Bad request");
            else
                res.send("OTP generated");
        })
        .catch(function(reason){
            res.send(reason);
        });
}
function afterOTP(result,data){
        console.log("Insise after OTP");
        console.log("Data recieved is = "+data.contact+" "+data.otp);
        let num=result.length;
        let res=0;
        if(data.case==="signup"){
            res=service.createNewUser(data);
        }
        if(data.case==="login"&&num>0){
            res=service.updateOTPafterLoginAttempt(data);
        }
        return res;
}
function verifyOTP(req,res){

    console.log("inside verifyOTP");
    let userInput = parseInt(req.query.input);
    data = req.body;
    service.getOTPforContact(data)
    .then(function(result){
        if(result===userInput){
            data.isOTPverified=1;
            service.updateOnOTPVerification(data);
            res.send("OTP verified");
        }
        else{
            data.isOTPverified=0;
            service.updateOnOTPVerification(data);
            res.send("OTP not verified");
        }
    })
    .catch(err => res.send(err));
}

function initiateOTP(reciepent){
    console.log("Inside initiateOTP");
    let code = Math.floor((Math.random() * 1000000) + 1);
    while(code<=100000){
        code=code*10;
    }
    console.log("code = "+code);
    service.sendOTP(sender,"+91"+reciepent,code);
    return code;
}

function getAllCustomers(req, res){

    let sql="SELECT * FROM customers";
    let email = req.query.search;
    let limit= parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let data=[];
    let whereClause = " WHERE";
    if(email){
        whereClause += " email=? "
        sql=sql+whereClause;
        data.push(email);
    }
    if(limit){
        sql=sql+" LIMIT ? ";
        data.push(limit);
    }
    if(offset){
        sql=sql+" OFFSET ?";
        data.push(offset);
    }

    console.log(sql);
    console.log(req.query);
    let query = con.query(sql, data, (err, results) => {
        if(err) throw err;
        res.json({"status": 200, "error": null, "response": results});
    });
}

function getCustomerWithID(req, res){

        let sql = "SELECT * FROM customers WHERE email=?";
        let query = con.query(sql,[
            req.params.id], function(err, results){
            if(err) throw err;
            res.json({"status": 200, "error": null, "response": results});
        });
}

function updateUser(req, res){

    let data = [req.body.name, req.body.address, req.body.contact, req.body.email, req.params.id];
    let checkIfEmailExists = "SELECT * from customers WHERE email=?";
    let num;
    service.checkIfEmailExists(req.body.email).then(function(results){
        num=results.length;
        if(num===0){
            console.log("for 0");
            let sql = "UPDATE customers SET name=?, address=?, contact=?, email=? WHERE email=?";
            let query = con.query(sql, data,(err, result) => {
                if(err) throw err;
                res.json({"status": 200, "error": null, "response": result});
            });
        }
        else{
            console.log("for >0");
            res.send("Email already exists");
        }
    },function(err){
        console.log(err);
    });
}

function deleteUser(req, res) {
        let sql = "DELETE FROM customers WHERE email=?";
        let query = con.query(sql, [req.params.email], (err, results) => {
            if(err) throw err;
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        });
}

module.exports = {
	getAllCustomers: getAllCustomers,
	getCustomerWithID: getCustomerWithID,
	updateUser: updateUser,
	deleteUser: deleteUser,
    signUpLogin: signUpLogin,
    verifyOTP: verifyOTP
};