const API_URL = process.env.API_URL;


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

  // Tab switching functionality
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

  /**
   * Handles user login when the login button is clicked.
   * @param {Event} e - The click event.
   * @returns {void}
   */
  loginButton.addEventListener('click', async function(e) {
    e.preventDefault();

    if (!loginUsername.value || !loginPassword.value) {
      showMessage('Bitte fülle alle Pflichtfelder aus.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
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
        // Successful login
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);

        showMessage('Anmeldung erfolgreich! Du wirst weitergeleitet...', 'success');

        // Redirect after successful login
        setTimeout(() => {
          window.location.href = '../public/index.html';
        }, 1500);
      } else {
        // Show error message
        showMessage(data.error || 'Anmeldung fehlgeschlagen', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage('An error occurred. Please try again later.', 'error');
    }
  });

  /**
   * Handles user registration when the register button is clicked.
   * @param {Event} e - The click event.
   * @returns {void}
   */
  registerButton.addEventListener('click', async function(e) {
    e.preventDefault();

    // Check required fields
    if (!registerUsername.value || !registerEmail.value || !registerPassword.value || !registerPasswordConfirm.value) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Check passwords
    if (registerPassword.value !== registerPasswordConfirm.value) {
      showMessage('Passwords do not match.', 'error');
      return;
    }

    // Check terms agreement
    if (!agreeTerms.checked) {
      showMessage('Please accept the terms and conditions.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
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
        // Successful registration
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);

        showMessage('Registrierung erfolgreich! Du wirst weitergeleitet...', 'success');

        // Redirect after successful registration
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1500);
      } else {
        // Show error message
        showMessage(data.error || 'Registrierung fehlgeschlagen', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('An error occurred. Please try again later.', 'error');
    }
  });

  /**
   * Helper function to display messages to the user.
   * @param {string} message - The message to display.
   * @param {string} type - The type of message ('error' or 'success').
   * @returns {void}
   */
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

  // Check if user is already logged in
  const token = localStorage.getItem('token');
  if (token) {
    // Optionally, redirect if already logged in
    // window.location.href = '/index.html';
  }
});

