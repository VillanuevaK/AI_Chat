'use strict';
const socket = io();//connect('http://localhost:4000');//socket for the front end

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

//import whatever works
//SpeechRecognition is what converts sound to text, then after un index.js we must convert text to words
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
// document.querySelector('button').addEventListener('click', () => {
//   console.log('Recording has begun');
//   recognition.start();
// });//start recording when button is pressed and converts sound into text


var btn = document.getElementById('send');
btn.addEventListener('click', function(){
  console.log('Recording has begun');
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
  console.log('Result has been detected.')

  let last = e.results.length - 1; //last letter in string
  let text = e.results[last][0].transcript; //these indices give text we want is stored

  outputYou.textContent = text; //record what you said
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);//emit text to server (Node.js)
});

recognition.addEventListener('speechend', ()=>{
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {//convert AI text back into speech
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();//utterance is an obj of the class
  utterance.text = text;
  synth.speak(utterance);
  // SpeechSynthesis.speak();
}

socket.on('bot reply', function(replyText){
  synthVoice(replyText); //get AI text from index.js and use function above

  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});
