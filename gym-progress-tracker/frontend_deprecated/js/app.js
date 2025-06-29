const API_URL = process.env.API_URL;

const progressList = document.getElementById('progressList');

/**
 * Fetches progress data from the backend API and displays it.
 * @returns {Promise<void>}
 */
const fetchProgress = async () => {
    console.log("Fetching...");
    try {
        const response = await fetch(`${API_URL}/api/progress`);
        console.log('Fetch Response Status:', response.status); // Debug log

        if (response.ok) {
            const progressData = await response.json();
            console.log('Fetched Progress Data:', progressData); // Debug log
            displayProgress(progressData);
        } else {
            console.error('Failed to fetch progress:', await response.json());
        }
    } catch (err) {
        console.error('Error fetching progress:', err);
    }
};

/**
 * Displays the progress data in the DOM.
 * @param {Array} progressData - Array of progress objects containing exercise, records, and improvement.
 */
const displayProgress = (progressData) => {
    const progressList = document.getElementById('progress-items');
    progressList.innerHTML = '';

    progressData.forEach(({ exercise, records, improvement }) => {
        // Create a container for each exercise
        const exerciseSection = document.createElement('div');
        exerciseSection.classList.add('exercise-section');

        // Add a header with the exercise name and improvement
        const header = document.createElement('h3');
        header.textContent = `${exercise} (Improvement: ${improvement} kg)`;
        exerciseSection.appendChild(header);

        // Create a table for progress records
        const table = document.createElement('table');
        table.classList.add('progress-table');

        // Add table headers
        const tableHeader = document.createElement('thead');
        tableHeader.innerHTML = `
            <tr>
                <th>Date</th>
                <th>Reps</th>
                <th>Weight (kg)</th>
            </tr>
        `;
        table.appendChild(tableHeader);

        // Add table rows for each record
        const tableBody = document.createElement('tbody');
        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.reps}</td>
                <td>${record.weight}</td>
            `;
            tableBody.appendChild(row);
        });
        table.appendChild(tableBody);

        exerciseSection.appendChild(table);
        progressList.appendChild(exerciseSection);
    });
};
const progressForm = document.getElementById('add-progress');

/**
 * Handles the submission of the add-progress form and sends data to the backend.
 * @param {Event} e - The form submission event.
 * @returns {Promise<void>}
 */
progressForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const date = document.getElementById('date').value;
    const exercise = document.getElementById('exercise').value;
    const reps = parseInt(document.getElementById('reps').value, 10);
    const weight = parseInt(document.getElementById('weight').value, 10);

    console.log('Form Data:', { date, exercise, reps, weight });

    try {
        // Send data to the backend
        const response = await fetch(`${API_URL}/api/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, exercise, reps, weight }),
        });

        console.log('Response Status:', response.status);

        if (response.ok) {
            console.log('Progress added successfully');
            progressForm.reset();
            fetchProgress();
        } else {
            const errorData = await response.json();
            console.error('Failed to add progress:', errorData);
        }
    } catch (err) {
        console.error('Error adding progress:', err);
    }
});

// Fetch progress on page load
//fetchProgress();
