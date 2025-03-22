const progressList = document.getElementById('progressList');

const fetchProgress = async () => {
  console.log("Fetching...");
  try {
    const response = await fetch('http://localhost:5000/api/progress');
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

const displayProgress = (progressData) => {
  const progressList = document.getElementById('progress-items');
  progressList.innerHTML = ''; // Clear existing content

  progressData.forEach(({ exercise, records }) => {
    records.forEach(record => {
      const row = document.createElement('tr');
      row.classList.add('border-b', 'border-gray-200', 'hover:bg-gray-50');

      const formattedDate = new Date(record.date).toLocaleDateString('de-DE');

      row.innerHTML = `
        <td class="py-3 px-6">${formattedDate}</td>
        <td class="py-3 px-6">${exercise}</td>
        <td class="py-3 px-6">${record.reps}</td>
        <td class="py-3 px-6">${record.weight}</td>
        <td class="py-3 px-6 text-gray-400 italic">–</td>
      `;

      progressList.appendChild(row);
    });
  });
};

const progressForm = document.getElementById('add-progress');

progressForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  // Get form data
  const date = document.getElementById('date').value;
  const exercise = document.getElementById('exercise').value;
  const reps = parseInt(document.getElementById('reps').value, 10);
  const weight = parseInt(document.getElementById('weight').value, 10);

  console.log('Form Data:', { date, exercise, reps, weight }); // Debug log

  try {
    // Send data to the backend
    const response = await fetch('http://localhost:5000/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, exercise, reps, weight }),
    });

    console.log('Response Status:', response.status); // Debug log

    if (response.ok) {
      console.log('Progress added successfully'); // Debug log
      progressForm.reset(); // Clear the form inputs
      fetchProgress(); // Refresh the progress list
    } else {
      const errorData = await response.json();
      console.error('Failed to add progress:', errorData);
    }
  } catch (err) {
    console.error('Error adding progress:', err);
  }
});

// Fetch progress on page load
fetchProgress();
