import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const ConvertBufferToStringFormat = (data) => {
  const dataThatConvertedWithJsonStringify = JSON.stringify(data);
  const { data: dataThatConvertedWithJsonParse } = JSON.parse(
    dataThatConvertedWithJsonStringify
  );
  const bufferOriginal = Buffer.from(dataThatConvertedWithJsonParse);
  const result = bufferOriginal.toString('utf8');
  return result;
};

function onSocketClose() {
  console.log('Disconnected from Browser ❌');
}

function onSocketMessage(message) {
  const translatedMessageData = ConvertBufferToStringFormat(message);
  console.log(translatedMessageData);
}

wss.on('connection', (socket) => {
  console.log('Connected to Browser ✅');
  socket.on('close', onSocketClose);
  socket.on('message', onSocketMessage);
  socket.send('hello!!');
});

server.listen(3000, handleListen);
