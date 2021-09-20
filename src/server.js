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

const sockets = [];

wss.on('connection', (socket) => {
  sockets.push(socket);
  socket['nickname'] = 'Anon';
  console.log('Connected to Browser ✅');
  socket.on('close', onSocketClose);
  socket.on('message', (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case 'new_message':
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
      case 'nickname':
        console.log(message.payload);
        socket['nickname'] = message.payload;
    }
  });
});

server.listen(3000, handleListen);
