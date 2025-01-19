// Ensure you include the PDF.js library in your HTML
// <script src="https://mozilla.github.io/pdf.js/build/pdf.js"></script>

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
const aboutBtn = document.getElementById('about-btn');
const aboutSection = document.getElementById('about-section');
const resultsSection = document.getElementById('results-section');
const progressBar = document.getElementById('progress-bar');
const pdfContainer = document.getElementById('pdf-container');
const moduleBoxes = document.querySelectorAll('.module-box');
const quizBoxes = document.querySelectorAll('.quiz-box');
let pdfDoc = null;

// Toggle Sidebar Collapse
logo.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? "50px" : "250px";
});

// Function to hide all sections
function hideAllSections() {
    modulesSection.style.display = 'none';
    leaderboardSection.style.display = 'none';
    quizSection.style.display = 'none';
    pdfViewer.style.display = 'none';
    aboutSection.style.display = 'none';
    resultsSection.style.display = 'none';
}

// Show About Section
aboutBtn.addEventListener('click', () => {
    if (aboutSection.style.display === 'block') {
        aboutSection.style.display = 'none';
    } else {
        hideAllSections();
        aboutSection.style.display = 'block';
    }
});

// Show Modules Section
modulesBtn.addEventListener('click', () => {
    if (modulesSection.style.display === 'grid') {
        modulesSection.style.display = 'none';
    } else {
        hideAllSections();
        modulesSection.style.display = 'grid';
    }
});

// Show Leaderboard Section
leaderboardBtn.addEventListener('click', () => {
    if (leaderboardSection.style.display === 'block') {
        leaderboardSection.style.display = 'none';
    } else {
        hideAllSections();
        leaderboardSection.style.display = 'block';

        // Fetch leaderboard data
        fetch('http://localhost:3000/api/leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Received leaderboard data:', data);
            const leaderboardTableBody = document.getElementById('leaderboard-table-body');
            leaderboardTableBody.innerHTML = ''; // Clear old data

            // Populate leaderboard table
            data.forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row.student_no}</td>
                    <td>${row.total_points}</td>
                `;
                leaderboardTableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
        });
    }
});

// Show Quiz Section
quizBtn.addEventListener('click', () => {
    if (quizSection.style.display === 'grid') {
        quizSection.style.display = 'none';
    } else {
        hideAllSections();
        quizSection.style.display = 'grid';
    }
});

// Show Results Section
resultsBtn.addEventListener('click', () => {
    if (resultsSection.style.display === 'block') {
        resultsSection.style.display = 'none';
    } else {
        hideAllSections();
        resultsSection.style.display = 'block';
    }
});

// Open PDF on module click
async function renderPDF(pdfUrl) {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        pdfDoc = await loadingTask.promise;

        pdfContainer.innerHTML = ''; // Clear old content
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1 });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;
            pdfContainer.appendChild(canvas);
        }

        // Progress bar update
        pdfContainer.addEventListener('scroll', () => {
            const scrollTop = pdfContainer.scrollTop;
            const scrollHeight = pdfContainer.scrollHeight;
            const clientHeight = pdfContainer.clientHeight;
            const scrolledPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
            progressBar.style.width = `${scrolledPercentage}%`;
        });
    } catch (error) {
        console.error('Error rendering PDF:', error);
    }
}

moduleBoxes.forEach((box) => {
    box.addEventListener('click', async () => {
        const moduleNumber = box.getAttribute('data-module');
        const pdfUrl = `../modules/module${moduleNumber}.pdf`; // Adjust path as needed

        try {
            pdfViewer.style.display = 'block';
            modulesSection.style.display = 'none';
            progressBar.style.width = '0%'; // Reset progress bar
            await renderPDF(pdfUrl);
        } catch (error) {
            console.error('Error opening module PDF:', error);
        }
    });
});

// Back button for PDF viewer
backButton.addEventListener('click', () => {
    pdfViewer.style.display = 'none';
    modulesSection.style.display = 'grid';
    progressBar.style.width = '0%'; // Reset progress bar
});

// Quiz Boxes functionality
quizBoxes.forEach((box) => {
    box.addEventListener('click', () => {
        const quizNumber = box.getAttribute('data-quiz');
        window.location.href = `quiz${quizNumber}.html`; // Redirect to corresponding quiz
    });
});

// Progress bar update with percentage
pdfContainer.addEventListener('scroll', () => {
    const scrollTop = pdfContainer.scrollTop;
    const scrollHeight = pdfContainer.scrollHeight;
    const clientHeight = pdfContainer.clientHeight;

    // Calculate the percentage scrolled
    const scrolledPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

    // Update the progress bar width
    progressBar.style.width = `${scrolledPercentage}%`;

    // Update the percentage text
    const progressText = document.getElementById('progress-text');
    progressText.textContent = `${Math.round(scrolledPercentage)}%`;
});
// Progress bar update with percentage
pdfContainer.addEventListener('scroll', () => {
    const scrollTop = pdfContainer.scrollTop;
    const scrollHeight = pdfContainer.scrollHeight;
    const clientHeight = pdfContainer.clientHeight;

    // Calculate the percentage scrolled
    const scrolledPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

    // Update the progress bar width
    progressBar.style.width = `${scrolledPercentage}%`;

    // Update the percentage text
    const progressText = document.getElementById('progress-text');
    progressText.textContent = `${Math.round(scrolledPercentage)}%`;

    // Show congratulations message when 100% is reached
    if (scrolledPercentage >= 100) {
        document.getElementById('congrats-modal').style.display = 'block';
    }
});

// Close the modal when the "Close" button is clicked
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('congrats-modal').style.display = 'none';
});
