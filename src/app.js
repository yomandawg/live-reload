const { createServer: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const fs = require('fs');

/**
 * OPTIONS
 */
const hostname = '127.0.0.1';
const port = 3000;

const timeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
};

const watchPath = 'public/index.js';

/**
 * HTTP
 */
const httpServer = new HttpServer();

httpServer.on('request', (req, res) => {
  const { url } = req;

  let contentType = 'text/html';
  let filePath = 'public/index.html';

  switch (url) {
    case '/index.js':
      contentType = 'text/javascript';
      filePath = 'public/index.js';
      break;
    case '/index.html':
    default:
      break;
  }

  res.writeHead(200, { 'Content-Type': contentType });

  const fileData = fs.readFileSync(filePath);
  res.write(fileData);

  res.end();
});

/**
 * SOCKET
 */
const socketServer = new SocketServer(httpServer);

socketServer.on('connection', (socket) => {
  const socketId = socket.id;
  console.log('[YOMAN::server::socket] connect', socketId);

  let fsTimeout;
  const fsWatcher = fs.watch(watchPath, (event, filename) => {
    if (filename && event === 'change') {
      if (fsTimeout) {
        return;
      }
      fsTimeout = setTimeout(() => {
        fsTimeout = false;
      }, 100);

      const dateTime = Intl.DateTimeFormat('en-US', timeFormatOptions).format(
        Date.now()
      );
      console.log('[YOMAN::server::fs] update', dateTime);
      socket.emit('update', { dateTime });
    }
  });

  socket.on('disconnect', () => {
    fsWatcher.close();
    console.log('[YOMAN::server::socket] disconnect', socketId);
  });
});

/**
 * SETUP
 */
httpServer.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
