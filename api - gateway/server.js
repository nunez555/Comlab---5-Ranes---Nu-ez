const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Proxy routes
app.use('/inventory', createProxyMiddleware({
  target: process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/inventory': '' }
}));

app.use('/orders', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL || 'http://order-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/orders': '' }
}));

app.use('/payments', createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3003',
  changeOrigin: true,
  pathRewrite: { '^/payments': '' }
}));

app.use('/notifications', createProxyMiddleware({
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3004',
  changeOrigin: true,
  pathRewrite: { '^/notifications': '' }
}));

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway is running', services: ['inventory', 'orders', 'payments', 'notifications'] });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});