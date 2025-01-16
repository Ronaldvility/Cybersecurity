// Global variable to track retry status
let retryUsed = false;

// Function to calculate and display the score
function checkAnswers() {
    const name = document.getElementById('name').value;
    const studentNumber = document.getElementById('studentNumber').value;
    const quizNo = document.getElementById('quiz_no').value;
    const quizName = document.getElementById('quiz_name').value;

    if (!name || !studentNumber) {
        alert('Please fill in your name and student number before proceeding.');
        return;
    }

    const answers = [];
    for (let i = 1; i <= 10; i++) {
        const selectedAnswer = document.querySelector(`input[name="q${i}"]:checked`);
        if (selectedAnswer) {
            answers.push({
                question: i,
                answer: selectedAnswer.value
            });
        } else {
            answers.push({
                question: i,
                answer: 'no_answer'
            });
        }
    }

    // Calculate quiz result
    let score = 0;
    answers.forEach(ans => {
        if (ans.answer === 'correct') {
            score += 1;
        }
    });

    const quizResult = score;
    const quizRating = (score / 10) * 100;

    // Display the score
    document.getElementById('score').textContent = `Score: ${quizResult}`;
    document.getElementById('rate').textContent = `Rate: ${quizRating}%`;

    // Lock answers to prevent further changes
    const allAnswers = document.querySelectorAll('input[type="radio"]');
    allAnswers.forEach(input => {
        input.disabled = true;
    });

    // Show the submit button
    document.getElementById('submitBtn').classList.remove('hidden');

    // Store the quiz data in a global object for submission later
    window.quizData = {
        quiz_no: quizNo,
        quiz_name: quizName,
        student_name: name,
        student_no: studentNumber,
        quiz_result: quizResult,
        quiz_rating: quizRating
    };
}

// Function to allow retrying the quiz only once
function retryQuiz() {
    if (retryUsed) {
        alert('You can only retry the quiz once.');
        return;
    }

    // Reset all inputs
    const allAnswers = document.querySelectorAll('input[type="radio"]');
    allAnswers.forEach(input => {
        input.checked = false;
        input.disabled = false;
    });

    // Clear score and rating
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('rate').textContent = 'Rate: 0%';

    // Hide submit button and retry message
    document.getElementById('submitBtn').classList.add('hidden');
    document.getElementById('retryMessage').classList.add('hidden');

    retryUsed = true;
}

// Function to handle form submission and send the data to the server
function submitQuizData() {
    if (!window.quizData) {
        alert('Please check your answers before submitting.');
        return;
    }

    // Send the data to the server via POST
    fetch('http://localhost:3000/submit-quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(window.quizData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert('Quiz data submitted successfully');
        console.log(data);

        // Redirect to the main page after submission
        window.location.href = 'homepage/MainPageSTUD.html'; // Update with your actual main HTML file path
    })
    .catch(error => {
        alert(`Error submitting quiz data: ${error.message}`);
        console.error(error);
    });
}

// Event listener for "Check Score" button
document.getElementById('checkBtn').addEventListener('click', function(event) {
    event.preventDefault();
    checkAnswers();
    // Hide the retry button if already used
    if (retryUsed) {
        document.getElementById('retryBtn').classList.add('hidden');
    } else {
        document.getElementById('retryBtn').classList.remove('hidden');
        document.getElementById('retryMessage').classList.remove('hidden');
    }
});

// Event listener for "Retry" button
document.getElementById('retryBtn').addEventListener('click', function(event) {
    event.preventDefault();
    retryQuiz();
});

// Event listener for "Submit" button
document.getElementById('submitBtn').addEventListener('click', function(event) {
    event.preventDefault();
    submitQuizData();
});
