// auth.js

// Sign Up functionality
document.getElementById('signUpForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        alert('Username already exists. Please choose a different one.');
        return;
    }

    // Store new user credentials in localStorage
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully! You can now log in.');
    window.location.href = 'login.html';
});

// Login functionality
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Retrieve all users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find the user with the matching username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // If credentials match, login successful
        alert('Login successful!');
        window.location.href = 'chat.html';  // Redirect to chat page
    } else {
        alert('Invalid username or password.');
    }
});
