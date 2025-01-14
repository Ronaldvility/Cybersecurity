const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); // Add this line

// Initialize PostgreSQL pool
const pool = new Pool({
    user: 'postgres', // Replace with your database user
    host: 'localhost',
    database: 'postgres', // Replace with your database name
    password: '12345', // Replace with your password
    port: 5432,
});

const app = express();

// Use CORS to allow cross-origin requests
app.use(cors()); // Add this line to allow requests from any origin

app.use(bodyParser.json()); // To parse JSON bodies

// Route to handle quiz data submission
app.post('/submit-quiz', async (req, res) => {
    const { quiz_no, quiz_name, student_name, student_no, quiz_result, quiz_rating } = req.body;

    // PostgreSQL query to insert quiz data into the table
    const query = `
        INSERT INTO quizzes (quiz_no, quiz_name, student_name, student_no, quiz_result, quiz_rating)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
    `;
    const values = [quiz_no, quiz_name, student_name, student_no, quiz_result, quiz_rating];

    try {
        const result = await pool.query(query, values);
        console.log('Inserted data with id:', result.rows[0].id);
        res.json({ message: 'Quiz data submitted successfully', id: result.rows[0].id });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Error submitting quiz data' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
