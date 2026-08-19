const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());

app.use('/', createProxyMiddleware({
  target: 'https://coojozzifpnybfltqavc.supabase.co',
  changeOrigin: true,
  ws: true,
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('host', 'coojozzifpnybfltqavc.supabase.co');
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
