let score = 0;
let userName = '';
let studentNumber = '';
let retryAttempt = false;

function checkAnswers() {
    // Get the name and student number from the input fields
    userName = document.getElementById('name').value.trim();
    studentNumber = document.getElementById('studentNumber').value.trim();

    if (!userName || !studentNumber) {
        alert("Please enter both your name and student number!");
        return;
    }

    const questions = document.querySelectorAll('.question');
    score = 0;

    questions.forEach(question => {
        const answers = question.querySelectorAll('input[type="radio"]');
        answers.forEach(answer => {
            if (answer.checked) {
                if (answer.value === 'correct') {
                    score++;
                    answer.parentElement.classList.add('correct');
                } else {
                    answer.parentElement.classList.add('wrong');
                }
            }
        });
    });

    const totalQuestions = questions.length;
    const scoreElement = document.getElementById('score');
    const rateElement = document.getElementById('rate');

    // Display score
    scoreElement.textContent = `Score: ${score} / ${totalQuestions}`;
    
    // Display rate as percentage
    const percentage = (score / totalQuestions) * 100;
    rateElement.textContent = `Rate: ${percentage}%`;

    // Show Submit and Retry button after checking score
    document.getElementById('submitBtn').classList.remove('hidden');
    document.getElementById('retryBtn').classList.remove('hidden');
    document.getElementById('checkBtn').classList.add('hidden');
}

function submitScore() {
    const percentage = (score / 5) * 100; // Assuming 5 questions, adjust based on the number of questions
    let passFailMessage = '';

    // Determine pass/fail message
    if (percentage > 75) {
        passFailMessage = 'You Passed!';
    } else {
        passFailMessage = 'You Failed!';
    }

    // Display the congratulatory message
    const congratsMessage = document.getElementById('congratsMessage');
    const congratsText = document.getElementById('congratsText');
    congratsText.textContent = `Congratulations, ${userName} (Student Number: ${studentNumber})! You scored ${score}/5 with a rate of ${percentage}% - ${passFailMessage}`;
    congratsMessage.style.display = 'block';

    // Highlight the correct answers
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        const answers = question.querySelectorAll('input[type="radio"]');
        answers.forEach(answer => {
            // If the answer is correct, add the 'correct' class to the parent label
            if (answer.value === 'correct') {
                answer.parentElement.classList.add('correct');
            }
        });
    });

    // Submit quiz results to the backend (PostgreSQL)
    const quizData = {
        name: userName,
        student_number: studentNumber,
        score: score,
        rate: percentage
    };

    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Quiz results submitted successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error submitting quiz results');
    });
}

function closeCongrats() {
    // Hide congratulatory message popup
    document.getElementById('congratsMessage').style.display = 'none';
}

function retryQuiz() {
    if (retryAttempt) {
        alert("You can only retry once!");
        return;
    }
    retryAttempt = true;

    const answers = document.querySelectorAll('input[type="radio"]');
    answers.forEach(answer => {
        answer.checked = false;
        answer.parentElement.classList.remove('correct', 'wrong');
    });

    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('rate').textContent = 'Rate: 0%';

    // Hide congratulatory message and Show Check Score button again
    document.getElementById('congratsMessage').style.display = 'none';
    document.getElementById('submitBtn').classList.add('hidden');
    document.getElementById('retryBtn').classList.add('hidden');
    document.getElementById('checkBtn').classList.remove('hidden');

    // Ensure Submit button is always clickable and show
    document.getElementById('submitBtn').disabled = false;
}

////working code