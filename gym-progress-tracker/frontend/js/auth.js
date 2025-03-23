document.addEventListener('DOMContentLoaded', function() {
  // DOM-Elemente für Tabs
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // DOM-Elemente für Login-Formular
  const loginUsername = document.getElementById('login-username');
  const loginPassword = document.getElementById('login-password');
  const loginButton = document.getElementById('login-button');

  // DOM-Elemente für Registrierungs-Formular
  const registerUsername = document.getElementById('register-username');
  const registerEmail = document.getElementById('register-email');
  const registerPassword = document.getElementById('register-password');
  const registerPasswordConfirm = document.getElementById('register-password-confirm');
  const firstName = document.getElementById('first-name');
  const lastName = document.getElementById('last-name');
  const dateOfBirth = document.getElementById('date-of-birth');
  const gender = document.getElementById('gender');
  const height = document.getElementById('height');
  const agreeTerms = document.getElementById('agree-terms');
  const registerButton = document.getElementById('register-button');

  const messageContainer = document.getElementById('message-container');

  // Tab-Wechsel-Funktionalität
  loginTab.addEventListener('click', function() {
    loginTab.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
    registerTab.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
    registerTab.classList.add('text-gray-500');

    loginForm.classList.remove('hidden');
    loginForm.classList.add('block');
    registerForm.classList.remove('block');
    registerForm.classList.add('hidden');

    messageContainer.innerHTML = '';
  });

  registerTab.addEventListener('click', function() {
    registerTab.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
    loginTab.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
    loginTab.classList.add('text-gray-500');

    registerForm.classList.remove('hidden');
    registerForm.classList.add('block');
    loginForm.classList.remove('block');
    loginForm.classList.add('hidden');

    messageContainer.innerHTML = '';

  });

  // Login-Funktion
  loginButton.addEventListener('click', async function(e) {
    e.preventDefault();

    if (!loginUsername.value || !loginPassword.value) {
      showMessage('Bitte fülle alle Pflichtfelder aus.', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername.value,
          password: loginPassword.value
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Erfolgreiche Anmeldung
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);

        showMessage('Anmeldung erfolgreich! Du wirst weitergeleitet...', 'success');

        // Weiterleitung nach erfolgreichem Login
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1500);
      } else {
        // Fehlermeldung anzeigen
        showMessage(data.error || 'Anmeldung fehlgeschlagen', 'error');
      }
    } catch (error) {
      console.error('Login-Fehler:', error);
      showMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.', 'error');
    }
  });

  // Registrierungs-Funktion
  registerButton.addEventListener('click', async function(e) {
    e.preventDefault();

    // Pflichtfelder überprüfen
    if (!registerUsername.value || !registerEmail.value || !registerPassword.value || !registerPasswordConfirm.value) {
      showMessage('Bitte fülle alle Pflichtfelder aus.', 'error');
      return;
    }

    // Passwörter überprüfen
    if (registerPassword.value !== registerPasswordConfirm.value) {
      showMessage('Die Passwörter stimmen nicht überein.', 'error');
      return;
    }

    // AGB-Zustimmung überprüfen
    if (!agreeTerms.checked) {
      showMessage('Bitte akzeptiere die Nutzungsbedingungen.', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerUsername.value,
          email: registerEmail.value,
          password: registerPassword.value,
          firstName: firstName.value || null,
          lastName: lastName.value || null,
          dateOfBirth: dateOfBirth.value || null,
          gender: gender.value || null,
          height: height.value ? parseInt(height.value) : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Erfolgreiche Registrierung
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);

        showMessage('Registrierung erfolgreich! Du wirst weitergeleitet...', 'success');

        // Weiterleitung nach erfolgreicher Registrierung
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1500);
      } else {
        // Fehlermeldung anzeigen
        showMessage(data.error || 'Registrierung fehlgeschlagen', 'error');
      }
    } catch (error) {
      console.error('Registrierungs-Fehler:', error);
      showMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.', 'error');
    }
  });

  // Hilfsfunktion zum Anzeigen von Meldungen
  function showMessage(message, type) {
    messageContainer.innerHTML = '';

    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('py-2', 'px-4', 'rounded', 'text-sm');

    if (type === 'error') {
      messageElement.classList.add('bg-red-100', 'border', 'border-red-400', 'text-red-700');
    } else {
      messageElement.classList.add('bg-green-100', 'border', 'border-green-400', 'text-green-700');
    }

    messageContainer.appendChild(messageElement);
  }

  // Überprüfung, ob Benutzer bereits eingeloggt ist
  const token = localStorage.getItem('token');
  if (token) {
    // Optional: Automatische Weiterleitung, wenn bereits eingeloggt
    // window.location.href = '/index.html';
  }
});

