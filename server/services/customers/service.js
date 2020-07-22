// 'use strict';

const mysql = require('mysql');
const Agenda = require('agenda');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const mongoConnectionString = 'mongodb://127.0.0.1/agenda';
const agenda = new Agenda({db: {address: mongoConnectionString}});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);
const sender='+12015818912';

function makeDBconn(){
	con = mysql.createConnection({
 		host: "localhost",
 		user: "root",
 		password: "HK77@mysql#",
 		database: "node_mysql_crud_db"
	});
	// return con;
}

function startMongoDBConn() {
	MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
		assert.equal(null, err);
		console.log("Connected successfully to server");
		const db = client.db(dbName);
		// client.close();
	});
}

function sendMessage(reciepent){client.messages
    .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+12015818912',
        to: '+918299323368'
		// to: reciepent
    })
    .then(function(message){
		console.log("Tried sending message");
		console.log(message.sid);
	});
}

function scheduleSMS(reciepent){

	console.log(reciepent);
    agenda.define('message a user', async job => {
    	await sendMessage(reciepent);
    });
	abc();

}
async function abc() { // IIFE to give access to async/await
	console.log("inside abc()");
	await agenda.start();
	console.log("agenda started");
	await agenda.every('30 seconds', 'message a user');
}

function makeCall(reciepent) {
	client.calls
    	.create({
			url: 'http://fe9396f11a92.ngrok.io/voice/:contact',
         	to: reciepent,
		 	from: sender
       	})
      	.then(call => console.log(call))
	  	.catch(err => console.log(err));
}

function sendOTP(sender,reciepent,code){
	console.log("sender = "+sender+" reciepent = "+reciepent);
    client.messages.create({
        body: "Your 6 digit OTP is :- "+code,
        from: sender,
        to: reciepent
    })
    .then(function(message){
		console.log(message.sid);
	})
	.catch(err => console.log(err));
}
function checkIfEmailExists(contact){
	console.log("Inside checkIfEmailExists");
	let sql = "SELECT * from customers WHERE email=?";
    var p1 = function(resolve,reject){
        let q = con.query(sql, [contact],(err, results) => {
            if(err){
				console.log(err);
                reject(err);
            }
            else{
				console.log("result for checkIfContactExists"+results);
                resolve(results);
            }
        });
        return;
    }
    return new Promise(p1);
}

function checkIfContactExists(contact){
	console.log("Inside checkIfContactExists");
	let sql = "SELECT * from customers WHERE contact=?";
    var p1 = function(resolve,reject){
        let q = con.query(sql, [contact],(err, results) => {
            if(err){
				console.log(err);
                reject(err);
            }
            else{
				console.log("result for checkIfContactExists"+results);
                resolve(results);
            }
        });
        return;
    }
    return new Promise(p1);
}

function createNewUser(data){
		console.log("Inside create user");
        let sql = "INSERT INTO customers VALUES (?,?,?,?,?,?)";
		// console.log(data.name,data.address,data.contact,data.email,data.otp,data.isOTPverified);
        let query = con.query(sql, [data.name,data.address,data.contact,data.email,data.otp,data.isOTPverified],(err, result) => {
            if(err) {
                return err;
            }
             let res = JSON.stringify({"status": 200, "error": null, "response": result});
             console.log("response = "+res);
             return res;
        });
}

function updateOTPafterLoginAttempt(data){
		console.log("Inside updateOTPafterLoginAttempt");
    	let sql = "UPDATE customers SET otp=?, isOTPVerified=? WHERE contact=?";
        let q = con.query(sql, [data.otp,data.isOTPverified,data.contact],(err, result) => {
            if(err){
                return (err);
            }
            else{
				let res = JSON.stringify({"status": 200, "error": null, "response": result});
                console.log("response = "+res);
                return (result);
            }
        });
}
function getOTPforContact(data){
	console.log("Inside getOTPforContact");
	let sql = "SELECT otp FROM customers WHERE contact=?";
    var p1 = function(resolve,reject){
        let q = con.query(sql, [data.contact],(err, results) => {
            if(err){
                console.log(err);
				reject(err);
            }
            else{
				var obj=[],otp;
				for (const [key, value] of Object.entries(results)) {
						// console.log(`${key}: ${value}`);
						obj=value;
				}
				for (const [key, value] of Object.entries(obj)) {
						// console.log(`${key}: ${value}`);
						otp=value;
						console.log("otp = "+otp);
				}
				resolve(otp);
            }
        });
        return;
    }
    return new Promise(p1);
}
function updateOnOTPVerification(data){
	console.log("Inside updateOnOTPVerification");
	let sql = "UPDATE customers SET isOTPVerified=? WHERE contact=?";
	let q = con.query(sql, [data.isOTPverified,data.contact],(err, result) => {
		if(err){
			return (err);
		}
		else{
			let res = JSON.stringify({"status": 200, "error": null, "response": result});
			console.log("response = "+res);
			return (result);
		}
	});
}
makeDBconn();
startMongoDBConn();

module.exports = {
	makeDBconn: makeDBconn,
	startMongoDBConn: startMongoDBConn,
	scheduleSMS: scheduleSMS,
	makeCall: makeCall,
	checkIfEmailExists: checkIfEmailExists,
	sendOTP: sendOTP,
	createNewUser: createNewUser,
	checkIfContactExists: checkIfContactExists,
	updateOnOTPVerification: updateOnOTPVerification,
	updateOTPafterLoginAttempt: updateOTPafterLoginAttempt,
	getOTPforContact: getOTPforContact
};
