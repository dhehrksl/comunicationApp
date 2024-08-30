const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/mydatabase');

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(bodyParser.json());

app.get('/api/items', (req, res) => {
  res.json([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
