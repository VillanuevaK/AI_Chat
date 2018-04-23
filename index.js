'use strict';

require('dotenv').config();//import evironment variables (APIAI token/session ID)

const express = require('express'); //import express module and keep it in variable
const app = express(); //essentially, object of type express is created

const server = app.listen(process.env.PORT || 4000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

var socket = require('socket.io');
var io = socket(server);
io.on('connection', (socket)=>{
  console.log('A user connected');
});

const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
const apiai = require('apiai')(APIAI_TOKEN);//initialize APIAI

/*
app (of type express) mounts (method use) what is in parameter (middleware)
in the specified path (html, css)
static is the built in middle ware function that serves static files (html and css)
*/
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => { //call back function once connected to server
  res.sendFile(__dirname + '/views/index.html');//similar to express.static
});

io.on('connection', function(socket){ //on connection activate function(socket)
  socket.on('chat message', (text) => {//on 'chat message' activate foo(text)
    //Get a reply from API.AI

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });//get sessionId from sending text to apiai then return sessionId

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText); //When getting a response back from AI, emit the AItext
    });

    apiaiReq.on('error', (error)=>{
      console.log(error);
    });

    apiaiReq.end();

  });
});
