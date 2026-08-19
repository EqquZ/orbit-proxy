const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

const app = express();

// Разрешаем все CORS-запросы
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: '*'
}));

// Настройка прокси для Supabase REST и Auth
const proxyOptions = {
  target: 'https://coojozzifpnybfltqavc.supabase.co',
  changeOrigin: true,
  ws: true,
  secure: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('host', 'coojozzifpnybfltqavc.supabase.co');
  },
  onProxyReqWs: (proxyReq, req, socket, options, head) => {
    proxyReq.setHeader('host', 'coojozzifpnybfltqavc.supabase.co');
    proxyReq.setHeader('origin', 'https://coojozzifpnybfltqavc.supabase.co');
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    if (res && res.writeHead) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy routing error');
    }
  }
};

const proxy = createProxyMiddleware(proxyOptions);

app.use('/', proxy);

const server = http.createServer(app);

// Принудительная передача WebSocket соединения
server.on('upgrade', (req, socket, head) => {
  proxy.upgrade(req, socket, head);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Orbit Proxy with WebSocket support running on port ${PORT}`);
});
