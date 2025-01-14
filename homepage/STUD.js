const sidebar = document.getElementById('sidebar');
const logo = document.getElementById('logo');
const mainContent = document.getElementById('main-content');
const modulesSection = document.getElementById('modules-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const pdfViewer = document.getElementById('pdf-viewer');
const pdfEmbed = document.getElementById('pdf-embed');
const modulesBtn = document.getElementById('modules-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const backButton = document.getElementById('back-btn'); // Back button
const quizSection = document.getElementById('quiz-section'); // Quiz section
const quizBoxes = document.querySelectorAll('.quiz-box'); // Quiz boxes

// Mock data for the leaderboard
const leaderboardData = [
    { name: 'Alice', score: 95, rating: 'Excellent' },
    { name: 'Bob', score: 90, rating: 'Very Good' },
    { name: 'Charlie', score: 85, rating: 'Good' },
    { name: 'Diana', score: 80, rating: 'Fair' },
    { name: 'Eve', score: 75, rating: 'Average' },
];

logo.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
        mainContent.style.marginLeft = "50px";
    } else {
        mainContent.style.marginLeft = "250px";
    }
});

// Show Modules Section when "Modules" is clicked
modulesBtn.addEventListener('click', () => {
    modulesSection.style.display = modulesSection.style.display === 'none' ? 'grid' : 'none';
    leaderboardSection.style.display = 'none'; // Hide leaderboard when showing modules
    pdfViewer.style.display = 'none'; // Hide PDF viewer when showing modules
    quizSection.style.display = 'none'; // Hide quiz section when showing modules
});

// Show Leaderboard Section when "Leaderboards" is clicked
leaderboardBtn.addEventListener('click', () => {
    leaderboardSection.style.display = leaderboardSection.style.display === 'none' ? 'block' : 'none';
    modulesSection.style.display = 'none'; // Hide modules when showing leaderboard
    pdfViewer.style.display = 'none'; // Hide PDF viewer when showing leaderboard
    quizSection.style.display = 'none'; // Hide quiz section when showing leaderboard

    // Populate leaderboard table
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = ''; // Clear previous rows

    leaderboardData.sort((a, b) => b.score - a.score).forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.rating}</td>
        `;
        leaderboardBody.appendChild(row);
    });
});

// Function to open PDF based on the module clicked
const moduleBoxes = document.querySelectorAll('.module-box');

moduleBoxes.forEach((box) => {
    box.addEventListener('click', () => {
        const moduleNumber = box.getAttribute('data-module');
        const pdfUrl = `../modules/module${moduleNumber}.pdf`; // Adjusted path to access the PDFs from the modules folder

        pdfEmbed.src = pdfUrl;
        pdfViewer.style.display = 'block';
        modulesSection.style.display = 'none'; // Hide module section when PDF is opened
        leaderboardSection.style.display = 'none'; // Hide leaderboard when PDF is opened
        quizSection.style.display = 'none'; // Ensure quiz section is hidden
    });
});

// Back button functionality
backButton.addEventListener('click', () => {
    pdfViewer.style.display = 'none'; // Hide PDF viewer
    modulesSection.style.display = 'grid'; // Show modules section again
    leaderboardSection.style.display = 'none'; // Ensure leaderboard is hidden
    quizSection.style.display = 'none'; // Ensure quiz section is hidden
});

// Show Quiz Section when "Quiz" is clicked
const quizBtn = document.getElementById('quiz-btn');
quizBtn.addEventListener('click', () => {
    quizSection.style.display = quizSection.style.display === 'none' ? 'grid' : 'none';
    modulesSection.style.display = 'none'; // Hide modules when showing quizzes
    leaderboardSection.style.display = 'none'; // Hide leaderboard when showing quizzes
    pdfViewer.style.display = 'none'; 
});

// Function to handle quiz box click - opening quiz HTML files
quizBoxes.forEach((box) => {
    box.addEventListener('click', () => {
        const quizNumber = box.getAttribute('data-quiz');
        window.location.href = `quiz${quizNumber}.html`;  // Redirect to the corresponding quiz HTML file
    });
});
