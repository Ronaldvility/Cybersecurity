// Function to calculate and display the score
function checkAnswers() {
    const name = document.getElementById('name').value;
    const studentNumber = document.getElementById('studentNumber').value;
    const quizNo = document.getElementById('quiz_no').value;
    const quizName = document.getElementById('quiz_name').value;

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

    // Display the score and show submit button
    document.getElementById('score').textContent = `Score: ${quizResult}`;
    document.getElementById('rate').textContent = `Rate: ${quizRating}%`;
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

// Function to handle form submission and send the data to the server
function submitQuizData() {
    if (!window.quizData) {
        alert('Please check your answers before submitting.');
        return;
    }

    // Send the data to the server via POST
    fetch('/submit-quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(window.quizData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Quiz data submitted successfully');
        console.log(data);
    })
    .catch(error => {
        alert('Error submitting quiz data');
        console.error(error);
    });
}

// Trigger check answers on "Check Score" button click
document.getElementById('checkBtn').addEventListener('click', function(event) {
    event.preventDefault();
    checkAnswers();
});

// Trigger form submission on "Submit" button click
document.getElementById('submitBtn').addEventListener('click', function(event) {
    event.preventDefault();
    submitQuizData();
});
