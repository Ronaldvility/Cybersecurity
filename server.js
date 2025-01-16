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

// Route to fetch results for a specific quiz
app.post('/api/results', (req, res) => {
    const quizNo = parseInt(req.body.quiz_no);  // Ensure quiz_no is an integer

    console.log('Received quiz_no:', quizNo); // Log for debugging

    // Query to fetch data from the quizzes table
    const query = `
        SELECT student_name, student_no, quiz_result, quiz_rating
        FROM quizzes
        WHERE quiz_no = $1;
    `;
    
    pool.query(query, [quizNo], (err, result) => {
        if (err) {
            console.error('Error executing query', err.stack);  // Log the error
            return res.status(500).send('Error fetching data');
        }

        console.log('Query result:', result.rows); // Log the fetched data
        if (result.rows.length === 0) {
            console.log('No results found for quiz_no:', quizNo);
            return res.status(404).send('No results found for this quiz number');
        }

        res.json(result.rows);  // Send the data back as JSON
    });
});

// Route to fetch leaderboard data
app.post('/api/leaderboard', async (req, res) => {
    const query = `
        SELECT student_no, SUM(quiz_result) AS total_points
        FROM quizzes
        GROUP BY student_no
        ORDER BY total_points DESC
        LIMIT 10;
    `;

    try {
        const result = await pool.query(query);
        console.log('Leaderboard data:', result.rows); // Log the fetched data
        res.json(result.rows);  // Send the data back as JSON
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ message: 'Error fetching leaderboard data' });
    }
});

// Start the server
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
});
