
const API_URL = 'https://betadash-api-swordslush-production.up.railway.app/gpt-5';
const BOT_AVATAR = 'https://i.ibb.co/prfVyfQ/profile.jpg';
const USER_AVATAR = 'https://via.placeholder.com/28/0084ff/ffffff?text=U';

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatToggle = document.getElementById('chatToggle');

// Send message function
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Call API
        const response = await fetch(`${API_URL}?ask=${encodeURIComponent(message)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response - check all possible response fields
        let botReply = '';
        
        if (data.response) {
            botReply = data.response;
        } else if (data.result) {
            botReply = data.result;
        } else if (data.message) {
            botReply = data.message;
        } else if (data.answer) {
            botReply = data.answer;
        } else if (typeof data === 'string') {
            botReply = data;
        } else {
            botReply = 'Sorry, I couldn\'t process that request.';
            console.log('Unexpected response format:', data);
        }
        
        addMessage(botReply, 'bot');
    } catch (error) {
        removeTypingIndicator();
        addMessage('Sorry, may error sa pag-connect sa AI server. Please try again.', 'bot');
        console.error('Error details:', error);
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('img');
    avatar.className = 'message-avatar';
    avatar.src = sender === 'bot' ? BOT_AVATAR : USER_AVATAR;
    avatar.alt = sender;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textP = document.createElement('p');
    textP.textContent = text;
    
    contentDiv.appendChild(textP);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('img');
    avatar.className = 'message-avatar';
    avatar.src = BOT_AVATAR;
    avatar.alt = 'Bot';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    
    contentDiv.appendChild(typingIndicator);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

chatToggle.addEventListener('click', () => {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.style.display = chatContainer.style.display === 'none' ? 'flex' : 'none';
});

// Initialize
scrollToBottom();
