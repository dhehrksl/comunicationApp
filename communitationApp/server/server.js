const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3309;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'userdatabase',
  port: 3307
});


db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL');
});


app.post('/data', (req, res) => {
  const { userEmail, userPassWord } = req.body;
  const sql = 'INSERT INTO userdata (userEmail, userPassWord) VALUES (?, ?)';
  db.query(sql, [userEmail, userPassWord], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: '인터넷 오류' });
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
