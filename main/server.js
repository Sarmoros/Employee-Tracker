const express = require('express');
const mysql = require('mysql2');
const routes = require('./routes'); // Import your routes

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connects to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'department_db'
});

// Log database connection status
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the department_db database.');
  }
});

// Use your routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
