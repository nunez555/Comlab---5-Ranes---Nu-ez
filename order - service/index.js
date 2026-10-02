const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3001';
const PAYMENT_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3003';
const NOTIFICATION_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3004';

let orders = [];
let orderId = 1;

app.get('/', (req, res) => {
  res.json({ service: 'Order Service', orders });
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.post('/orders', async (req, res) => {
  try {
    const { itemId, quantity, customerName } = req.body;

    // Check inventory
    const invRes = await axios.get(`${INVENTORY_URL}/items/${itemId}`);
    const item = invRes.data;

    if (item.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Decrease stock
    await axios.post(`${INVENTORY_URL}/decrease`, { id: itemId, quantity });

    // Create payment
    const paymentRes = await axios.post(`${PAYMENT_URL}/pay`, {
      amount: item.price * quantity,
      customerName
    });

    const order = {
      id: orderId++,
      itemId,
      itemName: item.name,
      quantity,
      total: item.price * quantity,
      customerName,
      paymentId: paymentRes.data.paymentId,
      status: 'completed',
      createdAt: new Date()
    };

    orders.push(order);

    // Send notification
    await axios.post(`${NOTIFICATION_URL}/send`, {
      message: `Order #${order.id} confirmed for ${customerName}. Total: ₱${order.total}`
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});