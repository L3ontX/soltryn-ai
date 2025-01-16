document.getElementById('send-btn').addEventListener('click', sendQuestion);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendQuestion();
    }
});

function sendQuestion() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();

    if (userInput !== "") {
        appendMessage("You", userInput);
        const chatWindow = document.getElementById('chat-window');
        chatWindow.scrollTop = chatWindow.scrollHeight;

        // Append thinking animation
        const thinkingEl = appendThinkingMessage();

        // Simulate 3 second thinking delay before fetching response.
        setTimeout(() => {
            fetch('qa.json')
                .then(response => {
                    if (!response.ok) {
                        console.error("Failed to fetch qa.json: ", response);
                        appendMessage("Soltryn", "Sorry, there was an issue retrieving the answers.");
                        throw new Error("Failed to fetch");
                    }
                    return response.json();
                })
                .then(data => {
                    let answer = getAnswer(userInput, data);
                    thinkingEl.remove();
                    appendMessage("Soltryn", answer);
                    chatWindow.scrollTop = chatWindow.scrollHeight;
                })
                .catch(error => {
                    console.error("Error during fetch or data handling:", error);
                    thinkingEl.remove();
                    appendMessage("Soltryn", "Sorry, I couldn't fetch the answer. Please try again later.");
                });
        }, 3000);
    } else {
        appendMessage("Soltryn", "Please ask a question.");
    }

    document.getElementById('user-input').value = "";
}

function appendMessage(sender, message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    
    if (sender === "You") {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('soltryn-message');
    }
    messageElement.innerText = message;
    chatWindow.appendChild(messageElement);
}

function appendThinkingMessage() {
    const chatWindow = document.getElementById('chat-window');
    const thinkingElement = document.createElement('div');
    // Add your class for thinking message (if you have custom styling)
    thinkingElement.classList.add('soltryn-thinking');
    // You can animate these dots via CSS animation if desired
    thinkingElement.innerHTML = '<span class="thinking-dots">...</span>';
    chatWindow.appendChild(thinkingElement);
    return thinkingElement;
}

/**
 * getAnswer (Enhanced Matching Logic):
 * 
 * - Splits the user input into an array of words after normalizing (removing punctuation, lowercasing).
 * - For each category (ignoring the "default" category), loops over its question phrases.
 * - For every question phrase, splits the text into words and counts how many words in the user input appear (or partially match) the question.
 * - Sums up the total match score for the category.
 * - Selects the category with the highest score.
 * - Returns a random response from that category.
 * - If no matches are found, returns the default response.
 */
function getAnswer(userInput, data) {
    // Normalize user's input into words
    const inputWords = userInput
        .replace(/[^\w\s]/gi, '')
        .trim()
        .toLowerCase()
        .split(/\s+/);

    let bestMatchCategory = null;
    let highestScore = 0;

    // Loop over each category (skip "default")
    for (let category in data) {
        if (category === "default") continue;
        const categoryData = data[category];
        const questions = categoryData.questions || [];
        let categoryScore = 0;

        // For every question phrase in the category...
        questions.forEach(question => {
            // Normalize the question phrase into words
            const questionWords = question
                .replace(/[^\w\s]/gi, '')
                .trim()
                .toLowerCase()
                .split(/\s+/);

            // Count matching words (using partial substring matching)
            inputWords.forEach(userWord => {
                if (questionWords.some(qw => qw.includes(userWord) || userWord.includes(qw))) {
                    categoryScore++;
                }
            });
        });

        // Update best category if score is higher
        if (categoryScore > highestScore) {
            highestScore = categoryScore;
            bestMatchCategory = category;
        }
    }

    // If no category yielded a score, return default
    if (!bestMatchCategory || highestScore === 0) {
        return data["default"] ? data["default"].response : "Sorry, I don't understand that.";
    }

    // Otherwise, pick a random response from the best matched category
    const responses = data[bestMatchCategory].response;
    if (Array.isArray(responses) && responses.length > 0) {
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    } else {
        return data["default"] ? data["default"].response : "Sorry, I don't understand that.";
    }
}
