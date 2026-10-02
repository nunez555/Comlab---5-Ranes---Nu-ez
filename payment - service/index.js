const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;

let payments = [];
let paymentId = 1;

app.get('/', (req, res) => {
  res.json({ service: 'Payment Service', payments });
});

app.post('/pay', (req, res) => {
  const { amount, customerName } = req.body;

  const payment = {
    paymentId: paymentId++,
    amount,
    customerName,
    status: 'success',
    paidAt: new Date()
  };

  payments.push(payment);
  res.status(201).json(payment);
});

app.get('/payments', (req, res) => {
  res.json(payments);
});

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});