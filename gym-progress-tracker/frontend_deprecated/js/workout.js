const API_URL = process.env.API_URL;



/**
 * Checks if the user is authenticated on DOMContentLoaded.
 * Redirects to login page if no token is found.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Redirect to login page if no token is present
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Workout form handler
  const workoutForm = document.getElementById('workoutForm');

  workoutForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    // Collect form data
    const formData = {
      name: document.getElementById('name').value,
      description: document.getElementById('description').value,
      difficulty_level: document.getElementById('difficulty_level').value,
      target_audience: document.getElementById('target_audience').value,
      goal: document.getElementById('goal').value,
      estimated_duration_minutes: parseInt(document.getElementById('estimated_duration_minutes').value),
      is_featured: document.getElementById('is_featured').checked
    };

    try {
      /**
       * Sends a POST request to add a new workout.
       * @param {Object} formData - The workout data to add.
       * @returns {Promise<void>}
       */
      const response = await fetch(API_URL + '/api/workouts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        alert('Workout erfolgreich hinzugefügt!');
        workoutForm.reset(); // Reset form
      } else {
        // Show error message
        alert(`Fehler: ${data.error || 'Unbekannter Fehler aufgetreten'}`);
      }
    } catch (error) {
      console.error('Error adding workout:', error);
      alert('Error adding workout. Please try again later.');
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Tab functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update tab buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active', 'border-indigo-500', 'text-indigo-600');
        btn.classList.add('border-transparent', 'text-gray-500');
      });
      this.classList.add('active', 'border-indigo-500', 'text-indigo-600');
      this.classList.remove('border-transparent', 'text-gray-500');

      // Update tab contents
      const targetId = this.id.replace('tab-', 'tab-content-');
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });
      document.getElementById(targetId).classList.remove('hidden');

      // Load workouts when switching to view tab
      if (this.id === 'tab-view') {
        loadWorkouts();
      }

      // Load workouts for edit when switching to edit tab
      if (this.id === 'tab-edit') {
        loadWorkoutsForEdit();
      }
    });
  });

  /**
   * Loads the list of workouts and displays them in the UI.
   * Fetches workouts from the API and updates the DOM.
   */
  function loadWorkouts() {
    const workoutsList = document.getElementById('workoutsList');

    // API call to load workouts
    fetch(API_URL + '/api/workouts/get', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const workouts = data.workouts.rows;

        if (workouts.length === 0) {
          workoutsList.innerHTML = '<p>Keine Workouts gefunden. Erstellen Sie ein neues Workout!</p>';
          return;
        }

        workoutsList.innerHTML = '';
        workouts.forEach(workout => {
          const shortDescription = workout.description ? workout.description.slice(0, 100) + '...' : 'Keine Beschreibung';

          workoutsList.innerHTML += `
          <div class="border rounded-lg p-4 hover:bg-gray-50">
            <h3 class="font-bold text-lg">${workout.name}</h3>
            <p class="text-gray-600">${shortDescription}</p>
            <div class="flex mt-3">
              <span class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mr-2">${workout.difficulty_level}</span>
              <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${workout.goal}</span>
            </div>
            <div class="mt-4 flex space-x-2">
              <button class="view-workout-btn px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                      data-id="${workout.template_id}">Ansehen</button>
              <button class="edit-workout-btn px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      data-id="${workout.template_id}">Bearbeiten</button>
              <button class="delete-workout-btn px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      data-id="${workout.template_id}">Löschen</button>
            </div>
          </div>
        `;
        });

        // Add event listeners for workout actions
        addWorkoutActionListeners();
      })
      .catch(error => {
        console.error('Error loading workouts:', error);
        workoutsList.innerHTML = '<p>Error loading workouts. Please try again later.</p>';
      });
  }

  /**
   * Loads workouts for the edit dropdown menu.
   * Populates the dropdown and sets up change event.
   */
  function loadWorkoutsForEdit() {
    const workoutSelect = document.getElementById('workout-select');

    // API call to load workouts for dropdown
    fetch(API_URL + '/api/workouts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        // Populate dropdown with workouts
        workoutSelect.innerHTML = '<option value="">Bitte Workout wählen</option>';
        data.forEach(workout => {
          workoutSelect.innerHTML += `<option value="${workout.id}">${workout.name}</option>`;
        });
      })
      .catch(error => {
        console.error('Fehler beim Laden der Workouts:', error);
      });

    // Event listener for dropdown menu
    workoutSelect.addEventListener('change', function() {
      const selectedWorkoutId = this.value;
      if (selectedWorkoutId) {
        loadWorkoutForEdit(selectedWorkoutId);
      } else {
        document.getElementById('editWorkoutForm').classList.add('hidden');
      }
    });
  }

  /**
   * Loads a specific workout for editing.
   * @param {string} workoutId - The ID of the workout to load.
   */
  function loadWorkoutForEdit(workoutId) {
    // API call to load a specific workout
    fetch(`{API_URL}/api/workouts/${workoutId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(workout => {
        const form = document.getElementById('editWorkoutForm');

        // Fill the form with workout data (implement form fields as needed)

        form.classList.remove('hidden');
      })
      .catch(error => {
        console.error('Fehler beim Laden des Workouts:', error);
      });
  }

  /**
   * Adds event listeners for workout action buttons (view, edit, delete).
   */
  function addWorkoutActionListeners() {
    // Event listeners for view buttons
    document.querySelectorAll('.view-workout-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const workoutId = this.getAttribute('data-id');
        viewWorkoutDetails(workoutId);
      });
    });

    // Event listeners for edit buttons
    document.querySelectorAll('.edit-workout-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const workoutId = this.getAttribute('data-id');
        // Tab zum Bearbeiten wechseln und das entsprechende Workout laden
        document.getElementById('tab-edit').click();
        document.getElementById('workout-select').value = workoutId;
        loadWorkoutForEdit(workoutId);
      });
    });

    // Event listeners for delete buttons
    document.querySelectorAll('.delete-workout-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this workout?')) {
          const workoutId = this.getAttribute('data-id');
          deleteWorkout(workoutId);
        }
      });
    });
  }

  /**
   * Deletes a workout by its ID.
   * @param {string} workoutId - The ID of the workout to delete.
   */
  function deleteWorkout(workoutId) {
    // API call to delete a workout
    fetch(`{API_URL}/api/workouts/${workoutId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (response.ok) {
          // Remove workout from the list and update
          loadWorkouts();
        } else {
          throw new Error('Error deleting workout');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error deleting workout. Please try again later.');
      });
  }
});

/**
 * Checks authentication and redirects to login if no token is found.
 */
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    // No token found, redirect to login
    window.location.href = '/frontend/sites/login.html';
  }
}

/**
 * Fetches and displays workout details in a modal.
 * @param {string} workoutId - The ID of the workout to view.
 */
function viewWorkoutDetails(workoutId) {
  // Fetch workout details from the API
  fetch(`${API_URL}/api/workouts/${workoutId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(workout => {
      // Open modal with workout details
      openWorkoutModal(workout);
    })
    .catch(error => {
      console.error('Error loading workout details:', error);
      alert('Error loading workout details. Please try again later.');
    });
}

/**
 * Opens a modal displaying workout details.
 * @param {Object} workout - The workout object to display.
 */
function openWorkoutModal(workout) {
  // Create modal element if it doesn't exist
  let modal = document.getElementById('workout-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'workout-modal';
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    document.body.appendChild(modal);
  }

  // Modal content
  modal.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">${workout.name}</h2>
        <button id="close-modal" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="font-semibold">Description:</h3>
          <p>${workout.description || 'No description available'}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold">Difficulty Level:</h3>
            <p>${workout.difficulty_level}</p>
          </div>
          <div>
            <h3 class="font-semibold">Goal:</h3>
            <p>${workout.goal}</p>
          </div>
          <div>
            <h3 class="font-semibold">Target Audience:</h3>
            <p>${workout.target_audience}</p>
          </div>
          <div>
            <h3 class="font-semibold">Duration:</h3>
            <p>${workout.estimated_duration_minutes} minutes</p>
          </div>
        </div>

        <!-- Additional workout details can be displayed here -->

        <div class="mt-6 flex justify-end">
          <button id="edit-from-modal" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mr-2">
            Edit
          </button>
          <button id="close-modal-btn" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  // Event listeners for modal buttons
  document.getElementById('close-modal').addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('edit-from-modal').addEventListener('click', () => {
    modal.remove();
    // You can call the edit function here if needed
    // editWorkout(workout.template_id);
  });
}
