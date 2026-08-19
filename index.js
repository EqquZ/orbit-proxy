const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());

const TARGET = 'https://coojozzifpnybfltqavc.supabase.co';

const proxy = createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  ws: true,
  secure: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Host', 'coojozzifpnybfltqavc.supabase.co');
    proxyReq.setHeader('Origin', TARGET);
  },
  onProxyReqWs: (proxyReq, req, socket, options, head) => {
    proxyReq.setHeader('Host', 'coojozzifpnybfltqavc.supabase.co');
    proxyReq.setHeader('Origin', TARGET);
  }
});

app.use('/', proxy);

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});

server.on('upgrade', (req, socket, head) => {
  proxy.upgrade(req, socket, head);
});
