
/**
 * Dashboard script for displaying exercise progress and statistics.
 * Handles chart rendering, table updates, and exercise selection.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const exerciseSelector = document.getElementById('exercise-selector');
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressTableSection = document.getElementById('progress-table-section');
  
    let allData = [];
    let progressChart;
  
    /**
     * Fetches progress data from the API and initializes dashboard.
     * @returns {Promise<void>}
     */
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/progress');
        const data = await res.json();
        allData = data;
        populateExerciseOptions(data);
        updateDashboard();
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
  
    /**
     * Populates the exercise selector dropdown with available exercises.
     * @param {Array} data - Array of exercise data objects.
     */
    const populateExerciseOptions = (data) => {
      data.forEach(({ exercise }) => {
        const option = document.createElement('option');
        option.value = exercise;
        option.textContent = exercise;
        exerciseSelector.appendChild(option);
      });
    };
  
    /**
     * Updates dashboard statistics and UI based on selected exercise.
     */
    const updateDashboard = () => {
      const selectedExercise = exerciseSelector.value;
      const filtered = selectedExercise
        ? allData.filter(item => item.exercise === selectedExercise)
        : allData;
  
      const relevantRecords = filtered.flatMap(e => e.records);
  
      const now = new Date();
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(now.getDate() - 14);
  
      const currentWeekData = relevantRecords.filter(item => new Date(item.date) >= oneWeekAgo);
      const previousWeekData = relevantRecords.filter(item => new Date(item.date) >= twoWeeksAgo && new Date(item.date) < oneWeekAgo);
  
      // === Statistics ===
      document.getElementById('entries-count').textContent = currentWeekData.length;
      document.getElementById('entries-diff').textContent = `+${currentWeekData.length - previousWeekData.length} from last week`;
      document.getElementById('entries-progress').style.width = `${Math.min(currentWeekData.length * 10, 100)}%`;
      document.getElementById('entries-percentage').textContent = `${Math.min(currentWeekData.length * 10, 100)}%`;
  
      const totalWeight = currentWeekData.reduce((sum, r) => sum + r.reps * r.weight, 0);
      const prevWeight = previousWeekData.reduce((sum, r) => sum + r.reps * r.weight, 0);
      const diffWeight = totalWeight - prevWeight;
      document.getElementById('total-weight').textContent = Math.round(totalWeight);
      document.getElementById('weight-diff').textContent = `${diffWeight >= 0 ? '+' : ''}${Math.round(diffWeight)} from last week`;
      document.getElementById('weight-progress').style.width = `${Math.min(Math.round(totalWeight / 100), 100)}%`;
      document.getElementById('weight-percentage').textContent = `${Math.min(Math.round(totalWeight / 100), 100)}%`;
  
      const totalReps = currentWeekData.reduce((sum, r) => sum + r.reps, 0);
      const prevReps = previousWeekData.reduce((sum, r) => sum + r.reps, 0);
      const diffReps = totalReps - prevReps;
      document.getElementById('total-reps').textContent = totalReps;
      document.getElementById('reps-diff').textContent = `${diffReps >= 0 ? '+' : ''}${diffReps} from last week`;
      document.getElementById('reps-progress').style.width = `${Math.min(Math.round(totalReps / 5), 100)}%`;
      document.getElementById('reps-percentage').textContent = `${Math.min(Math.round(totalReps / 5), 100)}%`;
  
      renderChart(filtered);
      renderProgressTable(filtered);
    };
  
    /**
     * Renders the progress chart for the selected exercise(s).
     * @param {Array} filtered - Filtered exercise data.
     */
    const renderChart = (filtered) => {
      const chartLabels = new Set();
      const datasets = [];
  
      filtered.forEach(({ exercise, records }) => {
        const dataPoints = [];
  
        records.forEach(r => {
          const d = new Date(r.date);
          const dateStr = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`;
          chartLabels.add(dateStr);
          dataPoints.push({ x: dateStr, y: r.weight });
        });
  
        datasets.push({
          label: exercise,
          data: dataPoints,
          borderColor: getRandomColor(),
          fill: false,
          tension: 0.3
        });
      });
  
      if (progressChart) progressChart.destroy();
  
      progressChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [...chartLabels].sort(),
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    };
  
    /**
     * Renders the progress table for the selected exercise(s).
     * @param {Array} filtered - Filtered exercise data.
     */
    const renderProgressTable = (filtered) => {
      progressTableSection.innerHTML = '';
  
      filtered.forEach(({ exercise, records, improvement }) => {
        const section = document.createElement('div');
        section.classList.add('mb-6');
  
        const title = document.createElement('h4');
        title.className = 'font-semibold text-gray-700 mb-2';
        title.textContent = `${exercise} (Improvement: ${improvement} kg)`;
        section.appendChild(title);
  
        const table = document.createElement('table');
        table.className = 'min-w-full text-sm text-gray-700 border';
        table.innerHTML = `
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 text-left">Date</th>
              <th class="p-2 text-left">Repetitions</th>
              <th class="p-2 text-left">Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(r => `
              <tr class="border-t">
                <td class="p-2">${new Date(r.date).toLocaleDateString('en-US')}</td>
                <td class="p-2">${r.reps}</td>
                <td class="p-2">${r.weight}</td>
              </tr>
            `).join('')}
          </tbody>
        `;
  
        section.appendChild(table);
        progressTableSection.appendChild(section);
      });
    };
  
    /**
     * Generates a random RGB color string.
     * @returns {string} RGB color string.
     */
    const getRandomColor = () => {
      const r = () => Math.floor(Math.random() * 256);
      return `rgb(${r()},${r()},${r()})`;
    };
  
    exerciseSelector.addEventListener('change', updateDashboard);
    fetchData();
  });
  