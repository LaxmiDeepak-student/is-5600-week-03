const http = require('http');
const url = require('url');
const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const app = express();
const chatEmitter = new EventEmitter();

// Serve static files from the public folder
app.use(express.static(__dirname + '/public'));

// Responds with plain text
function respondText(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hi');
}

// Responds with JSON
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

// Responds with a 404 not found
function respondNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

// Responds with the input string in various formats
function respondEcho(req, res) {
  const { input = '' } = req.query;

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

// Serves up the chat.html file
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

// Responds to chat messages
function respondChat(req, res) {
  const { message } = req.query;

  chatEmitter.emit('message', message);
  res.end();
}

// Responds to server-sent events (SSE)
function respondSSE(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const onMessage = (msg) => {
    res.write(`data: ${msg}\n\n`);
  };

  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.removeListener('message', onMessage);
  });
}

// Define routes
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
