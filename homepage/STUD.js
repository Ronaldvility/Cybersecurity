const sidebar = document.getElementById('sidebar');
const logo = document.getElementById('logo');
const mainContent = document.getElementById('main-content');
const modulesSection = document.getElementById('modules-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const pdfViewer = document.getElementById('pdf-viewer');
const pdfEmbed = document.getElementById('pdf-embed');
const modulesBtn = document.getElementById('modules-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const quizBtn = document.getElementById('quiz-btn');
const resultsBtn = document.getElementById('results-btn');
const backButton = document.getElementById('back-btn'); // Back button
const quizSection = document.getElementById('quiz-section'); // Quiz section

logo.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
        mainContent.style.marginLeft = "50px";
    } else {
        mainContent.style.marginLeft = "250px";
    }
});

// Function to hide all sections
function hideAllSections() {
    modulesSection.style.display = 'none';
    leaderboardSection.style.display = 'none';
    quizSection.style.display = 'none';
    pdfViewer.style.display = 'none';
}

// Show Modules Section when "Modules" is clicked
modulesBtn.addEventListener('click', () => {
    hideAllSections();
    modulesSection.style.display = 'grid'; // Show modules section
});

// Show Leaderboard Section when "Leaderboards" is clicked
leaderboardBtn.addEventListener('click', () => {
    hideAllSections();
    leaderboardSection.style.display = 'block'; // Show leaderboard section
});

// Show Quiz Section when "Quiz" is clicked
quizBtn.addEventListener('click', () => {
    hideAllSections();
    quizSection.style.display = 'grid'; // Show quiz section
});

// Show Results Section when "Results" is clicked
resultsBtn.addEventListener('click', () => {
    hideAllSections();
    // Results section code here (if needed)
});

// Function to open PDF based on the module clicked
const moduleBoxes = document.querySelectorAll('.module-box');
moduleBoxes.forEach((box) => {
    box.addEventListener('click', () => {
        const moduleNumber = box.getAttribute('data-module');
        const pdfUrl = `../modules/module${moduleNumber}.pdf`; // Adjusted path to access the PDFs from the modules folder

        pdfEmbed.src = pdfUrl;
        pdfViewer.style.display = 'block';
        modulesSection.style.display = 'none'; // Hide modules section when PDF is opened
    });
});

// Back button functionality for PDF viewer
backButton.addEventListener('click', () => {
    pdfViewer.style.display = 'none'; // Hide PDF viewer
    modulesSection.style.display = 'grid'; // Show modules section again
});

// Quiz Boxes functionality
const quizBoxes = document.querySelectorAll('.quiz-box');
quizBoxes.forEach((box) => {
    box.addEventListener('click', () => {
        const quizNumber = box.getAttribute('data-quiz');
        window.location.href = `quiz${quizNumber}.html`;  // Redirect to the corresponding quiz HTML file
    });
});

document.getElementById('results-btn').addEventListener('click', function () {
    // Toggle the display of the results section
    const resultsSection = document.getElementById('results-section');
    const modulesSection = document.getElementById('modules-section');
    const quizSection = document.getElementById('quiz-section');
    const leaderboardSection = document.getElementById('leaderboard-section');
    
    // Hide other sections
    modulesSection.style.display = 'none';
    quizSection.style.display = 'none';
    leaderboardSection.style.display = 'none';

    // Show the results section
    if (resultsSection.style.display === 'none') {
        resultsSection.style.display = 'block';
    } else {
        resultsSection.style.display = 'none';
    }
});
// Show Leaderboard Section when "Leaderboards" is clicked
leaderboardBtn.addEventListener('click', () => {
    hideAllSections();
    leaderboardSection.style.display = 'block'; // Show leaderboard section

    // Fetch leaderboard data
    fetch('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Received leaderboard data:', data); // Log the received data

        // Clear existing leaderboard data
        const leaderboardTableBody = document.getElementById('leaderboard-table-body');
        leaderboardTableBody.innerHTML = '';

        // Populate leaderboard table with received data
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            const rankTd = document.createElement('td');
            const studentNoTd = document.createElement('td');
            const totalPointsTd = document.createElement('td');

            rankTd.textContent = index + 1; // Rank starts from 1
            studentNoTd.textContent = row.student_no;
            totalPointsTd.textContent = row.total_points;

            tr.appendChild(rankTd);
            tr.appendChild(studentNoTd);
            tr.appendChild(totalPointsTd);

            leaderboardTableBody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Error fetching leaderboard data:', error);
    });
});