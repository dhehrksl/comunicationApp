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
    const { userEmail, userPassWord, userName } = req.body;
  
    console.log('Received data:', { userEmail, userPassWord, userName });
  
    const sql = 'INSERT INTO userdata (userEmail, userPassWord, userName) VALUES (?, ?, ?)';
    db.query(sql, [userEmail, userPassWord, userName], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data' });
        return;
      }
      res.status(201).json({ id: results.insertId });
    });
  });
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
