document.addEventListener('DOMContentLoaded', function() {
    const quizNo = document.getElementById('quiz_no').value;  // Get the quiz_no from hidden input
    const tableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];  // Table body to insert rows

    console.log('Sending quiz_no:', quizNo); // Log for debugging

    // Prepare the data for POST request
    const data = {
        quiz_no: parseInt(quizNo) // Convert quiz_no to an integer
    };

    // Send the POST request to fetch the quiz results
    fetch('http://localhost:3000/api/results', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('Received response:', response);  // Log the response status
        if (!response.ok) {
            throw new Error('Failed to fetch results');
        }
        return response.json();
    })
    .then(data => {
        console.log('Received data:', data); // Log the received data
    
        // Check if data is not empty before adding to the table
        if (data.length > 0) {
            // Loop through the results and create table rows
            data.forEach(row => {
                console.log('Processing row:', row); // Log each row
                const tr = document.createElement('tr');
                const studentNameTd = document.createElement('td');
                const studentNoTd = document.createElement('td');
                const quizResultTd = document.createElement('td');
                const quizRatingTd = document.createElement('td');
    
                studentNameTd.textContent = row.student_name;
                studentNoTd.textContent = row.student_no;
                quizResultTd.textContent = `${row.quiz_result}/10`; // Append /10 to quiz_result
                quizRatingTd.textContent = `${row.quiz_rating}%`; // Append % to quiz_rating
    
                tr.appendChild(studentNameTd);
                tr.appendChild(studentNoTd);
                tr.appendChild(quizResultTd);
                tr.appendChild(quizRatingTd);
    
                tableBody.appendChild(tr);
            });
        } else {
            console.log('No data found for this quiz');
        }
    })
    .catch(error => {
        console.error('Error fetching results:', error);
    });
});

