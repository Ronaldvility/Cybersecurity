const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// PostgreSQL client setup
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sna', // Change this to your actual database name
  password: 'adonis69', // Your actual password
  port: 5432
});

// Connect to PostgreSQL
client.connect();

// Middleware to parse JSON requests
app.use(cors());  // Enable CORS
app.use(bodyParser.json());  // Parse JSON body

// Route to save quiz results to the database
app.post('/submit', async (req, res) => {
  const { name, student_number, score, rate } = req.body;

  // Validate inputs
  if (!name || !student_number || !score || !rate) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  const query = 'INSERT INTO results (name, student_number, score, rate) VALUES ($1, $2, $3, $4)';
  const values = [name, student_number, score, rate];

  try {
    await client.query(query, values);
    res.status(200).json({ message: 'Quiz results saved successfully' });
  } catch (error) {
    console.error('Error inserting data into database:', error);
    res.status(500).json({ message: 'Error saving quiz results' });
  }
});

// Route to fetch all quiz results from the database
app.get('/results', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM results');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: 'Error fetching quiz results' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
