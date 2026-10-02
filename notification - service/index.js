const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3004;

let notifications = [];

app.get('/', (req, res) => {
  res.json({ service: 'Notification Service', notifications });
});

app.post('/send', (req, res) => {
  const { message } = req.body;
  const notif = {
    id: notifications.length + 1,
    message,
    sentAt: new Date()
  };
  notifications.push(notif);
  console.log('Notification sent:', message);
  res.status(201).json(notif);
});

app.get('/notifications', (req, res) => {
  res.json(notifications);
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});