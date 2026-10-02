const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Simple in-memory inventory
let inventory = [
  { id: 1, name: 'Laptop', stock: 10, price: 45000 },
  { id: 2, name: 'Mouse', stock: 50, price: 500 },
  { id: 3, name: 'Keyboard', stock: 30, price: 1200 }
];

app.get('/', (req, res) => {
  res.json({ service: 'Inventory Service', items: inventory });
});

app.get('/items', (req, res) => {
  res.json(inventory);
});

app.get('/items/:id', (req, res) => {
  const item = inventory.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

app.post('/decrease', (req, res) => {
  const { id, quantity } = req.body;
  const item = inventory.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (item.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });
  
  item.stock -= quantity;
  res.json({ message: 'Stock decreased', item });
});

app.listen(PORT, () => {
  console.log(`Inventory Service running on port ${PORT}`);
});