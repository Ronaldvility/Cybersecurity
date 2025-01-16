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

// Route to get leaderboard data for a specific quiz
app.get('/leaderboard/:quizNo', async (req, res) => {
    const { quizNo } = req.params;

    // Ensure quizNo is between 1 and 12
    if (quizNo < 1 || quizNo > 12) {
        return res.status(400).json({ message: 'Quiz number must be between 1 and 12' });
    }

    // PostgreSQL query to get leaderboard data for the specified quiz
    const query = `
        SELECT student_name, quiz_result, quiz_rating
        FROM quizzes
        WHERE quiz_no = $1
        ORDER BY quiz_result DESC;
    `;
    const values = [quizNo];

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `No data found for quiz ${quizNo}` });
        }

        // Send the leaderboard data as a response, excluding quiz_no
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ message: 'Error fetching leaderboard data' });
    }
});

// Start the server
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
});

// Endpoint to get leaderboard data
app.get('/leaderboard', async (req, res) => {
    try {
        // Query the database and order by quiz_result (highest first)
        const result = await pool.query(`
            SELECT student_name, student_no, quiz_result, quiz_rating
            FROM quizzes
            ORDER BY quiz_result DESC, quiz_rating DESC
        `);
        
        // Send the leaderboard data as a JSON response
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        res.status(500).send('Internal Server Error');
    }
});
