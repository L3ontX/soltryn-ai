// login.js
// Retrieve the users from localStorage (or empty array if none exist)
const users = JSON.parse(localStorage.getItem('users')) || [];

/**
 * Attempts to log in a user based on their email and password.
 * Also checks if the user is banned or terminated.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
const loginUser = (email, password) => {
    // Find a user in the localStorage array that matches the provided credentials.
    const user = users.find(u => u.email === email && u.password === password);

    // If no matching user is found, alert and exit.
    if (!user) {
        alert('Invalid email or password');
        return;
    }

    // Check if the user is banned or terminated.
    if (user.status === 'banned' || user.status === 'terminated') {
        const currentTime = Date.now();

        // Check if the user is permanently terminated.
        if (user.status === 'terminated') {
            // Permanently banned - no expiry check.
            const reason = user.ban && user.ban.reason ? user.ban.reason : 'No reason provided';
            alert(`Your account has been permanently banned. Reason: ${reason}`);
            return;
        }

        // If the user is banned temporarily, check the expiry.
        if (currentTime < user.ban.expiry) {
            const timeLeft = Math.floor((user.ban.expiry - currentTime) / (1000 * 60 * 60)); // hours left
            const reason = user.ban && user.ban.reason ? user.ban.reason : 'No reason provided';
            alert(`You are banned. Reason: ${reason}. Ban expires in ${timeLeft} hours.`);
            return;
        } else {
            // Ban has expired, remove ban details and set status to active.
            user.status = 'active';
            user.ban = null;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Your ban has expired. Welcome back!');
        }
    }

    // If the user is active, continue with the login process.
    alert('Logged in successfully!');
    
    // Store the logged in user in localStorage (for further use in your app)
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to the chat page after successful login.
    window.location.href = 'chat.html';
};

// ---------------------
// Additional helper functions or comments can be added below
// For example, a function to validate email format could be added here
// Or additional logging functionality if needed by your application.

// Example: Validate email format (Optional)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * When integrating with an API in the future,
 * you might replace the localStorage users data with a fetch call.
 * For now, this system uses localStorage for demonstration purposes.
 */

// For debugging: Print out current stored users (Optional)
// console.log("Current users in localStorage:", JSON.parse(localStorage.getItem('users')));

// ---------------------
// Example usage: (Not needed in production)
// If you want to manually test loginUser(), you could call it with dummy data:
// loginUser('test@example.com', 'password123');

// End of login.js
