const API_URL = 'http://localhost:5000'

// Prüfen, ob der Benutzer authentifiziert ist
document.addEventListener('DOMContentLoaded', function() {
  // Token aus localStorage holen
  const token = localStorage.getItem('token');

  // Falls kein Token vorhanden ist, zur Login-Seite umleiten
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Workout-Formular-Handler
  const workoutForm = document.getElementById('workoutForm');

  workoutForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Formular-Daten sammeln
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
      // API-Aufruf, um das Workout hinzuzufügen
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
        // Erfolgsmeldung anzeigen
        alert('Workout erfolgreich hinzugefügt!');
        workoutForm.reset(); // Formular zurücksetzen
      } else {
        // Fehlermeldung anzeigen
        alert(`Fehler: ${data.error || 'Unbekannter Fehler aufgetreten'}`);
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Workouts:', error);
      alert('Fehler beim Hinzufügen des Workouts. Bitte versuche es später erneut.');
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Tab-Funktionalität
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Tab-Buttons aktualisieren
      tabButtons.forEach(btn => {
        btn.classList.remove('active', 'border-indigo-500', 'text-indigo-600');
        btn.classList.add('border-transparent', 'text-gray-500');
      });
      this.classList.add('active', 'border-indigo-500', 'text-indigo-600');
      this.classList.remove('border-transparent', 'text-gray-500');

      // Tab-Inhalte aktualisieren
      const targetId = this.id.replace('tab-', 'tab-content-');
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });
      document.getElementById(targetId).classList.remove('hidden');

      // Bei Wechsel zum Anzeigen-Tab die Workouts laden
      if (this.id === 'tab-view') {
        loadWorkouts();
      }

      // Bei Wechsel zum Bearbeiten-Tab die Workout-Liste laden
      if (this.id === 'tab-edit') {
        loadWorkoutsForEdit();
      }
    });
  });

  // Funktionen zum Laden der Workouts
  function loadWorkouts() {
    const workoutsList = document.getElementById('workoutsList');

    // API-Aufruf zum Laden der Workouts
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

        // Event-Listener für die Workout-Aktionen
        addWorkoutActionListeners();
      })
      .catch(error => {
        console.error('Fehler beim Laden der Workouts:', error);
        workoutsList.innerHTML = '<p>Fehler beim Laden der Workouts. Bitte versuchen Sie es später erneut.</p>';
      });
  }

  function loadWorkoutsForEdit() {
    const workoutSelect = document.getElementById('workout-select');

    // API-Aufruf zum Laden der Workouts für das Dropdown-Menü
    fetch(API_URL + '/api/workouts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        // Dropdown-Menü mit Workouts füllen
        workoutSelect.innerHTML = '<option value="">Bitte Workout wählen</option>';
        data.forEach(workout => {
          workoutSelect.innerHTML += `<option value="${workout.id}">${workout.name}</option>`;
        });
      })
      .catch(error => {
        console.error('Fehler beim Laden der Workouts:', error);
      });

    // Event-Listener für das Dropdown-Menü
    workoutSelect.addEventListener('change', function() {
      const selectedWorkoutId = this.value;
      if (selectedWorkoutId) {
        loadWorkoutForEdit(selectedWorkoutId);
      } else {
        document.getElementById('editWorkoutForm').classList.add('hidden');
      }
    });
  }

  function loadWorkoutForEdit(workoutId) {
    // API-Aufruf zum Laden eines bestimmten Workouts
    fetch(`{API_URL}/api/workouts/${workoutId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(workout => {
        const form = document.getElementById('editWorkoutForm');

        // Formular mit den Workout-Daten füllen
        // Hier müssen Sie die entsprechenden Formularfelder anlegen und befüllen

        form.classList.remove('hidden');
      })
      .catch(error => {
        console.error('Fehler beim Laden des Workouts:', error);
      });
  }

  function addWorkoutActionListeners() {
    // Event-Listener für die Ansehen-Buttons
    document.querySelectorAll('.view-workout-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const workoutId = this.getAttribute('data-id');
        viewWorkoutDetails(workoutId);
      });
    });

    // Event-Listener für die Bearbeiten-Buttons
    document.querySelectorAll('.edit-workout-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const workoutId = this.getAttribute('data-id');
        // Tab zum Bearbeiten wechseln und das entsprechende Workout laden
        document.getElementById('tab-edit').click();
        document.getElementById('workout-select').value = workoutId;
        loadWorkoutForEdit(workoutId);
      });
    });

    // Event-Listener für die Löschen-Buttons
    document.querySelectorAll('.delete-workout-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (confirm('Sind Sie sicher, dass Sie dieses Workout löschen möchten?')) {
          const workoutId = this.getAttribute('data-id');
          deleteWorkout(workoutId);
        }
      });
    });
  }

  function deleteWorkout(workoutId) {
    // API-Aufruf zum Löschen eines Workouts
    fetch(`{API_URL}/api/workouts/${workoutId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (response.ok) {
          // Workout aus der Liste entfernen und Liste aktualisieren
          loadWorkouts();
        } else {
          throw new Error('Fehler beim Löschen des Workouts');
        }
      })
      .catch(error => {
        console.error('Fehler:', error);
        alert('Fehler beim Löschen des Workouts. Bitte versuchen Sie es später erneut.');
      });
  }
});

function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Kein Token gefunden, Umleitung zum Login
    window.location.href = '/frontend/sites/login.html';
  }
}

function viewWorkoutDetails(workoutId) {
  // Workout-Details von der API abrufen
  fetch(`${API_URL}/api/workouts/${workoutId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(workout => {
      // Modal mit den Workout-Details öffnen
      openWorkoutModal(workout);
    })
    .catch(error => {
      console.error('Fehler beim Laden der Workout-Details:', error);
      alert('Fehler beim Laden der Workout-Details. Bitte versuchen Sie es später erneut.');
    });
}

function openWorkoutModal(workout) {
  // Falls du noch kein Modal-Element hast, erstelle eines
  let modal = document.getElementById('workout-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'workout-modal';
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    document.body.appendChild(modal);
  }

  // Modal-Inhalt
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
          <h3 class="font-semibold">Beschreibung:</h3>
          <p>${workout.description || 'Keine Beschreibung verfügbar'}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold">Schwierigkeitsgrad:</h3>
            <p>${workout.difficulty_level}</p>
          </div>
          <div>
            <h3 class="font-semibold">Ziel:</h3>
            <p>${workout.goal}</p>
          </div>
          <div>
            <h3 class="font-semibold">Zielgruppe:</h3>
            <p>${workout.target_audience}</p>
          </div>
          <div>
            <h3 class="font-semibold">Dauer:</h3>
            <p>${workout.estimated_duration_minutes} Minuten</p>
          </div>
        </div>

        <!-- Hier könntest du weitere Workout-Details anzeigen -->

        <div class="mt-6 flex justify-end">
          <button id="edit-from-modal" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mr-2">
            Bearbeiten
          </button>
          <button id="close-modal-btn" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Schließen
          </button>
        </div>
      </div>
    </div>
  `;

  // Event-Listener für Modal-Buttons
  document.getElementById('close-modal').addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('edit-from-modal').addEventListener('click', () => {
    modal.remove();
    // Hier könntest du die Bearbeitungsfunktion aufrufen
    // editWorkout(workout.template_id);
  });
}
