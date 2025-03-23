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
      const response = await fetch('http://localhost:5000/api/workouts/add', {
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
