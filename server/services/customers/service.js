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
			url: 'https://c6026a4fec57.ngrok.io/voice',
         	to: '+918299323368',
		 	from: '+12015818912'
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

function queryIfEmailExists(){
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
	// return p1;
};
makeDBconn();
startMongoDBConn();

module.exports = {
	makeDBconn: makeDBconn,
	startMongoDBConn: startMongoDBConn,
	scheduleSMS: scheduleSMS,
	makeCall: makeCall,
	queryIfEmailExists: queryIfEmailExists,
	sendOTP: sendOTP
};
