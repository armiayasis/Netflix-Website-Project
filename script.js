
// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const getStartedBtn = document.getElementById('getStartedBtn');

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', currentTheme);

// Theme toggle event
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Get Started button event
getStartedBtn.addEventListener('click', () => {
    // Show chat interface
    showChatInterface();
});

// Chat functionality
function showChatInterface() {
    const chatHTML = `
        <div class="chat-container" id="chatContainer">
            <div class="chat-header">
                <h3>Chat with Lenna AI</h3>
                <button class="close-chat" id="closeChat">✕</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="message ai-message">
                    <strong>Lenna AI:</strong> Kumusta! Ako si Lenna AI ng Startcope Beta. Paano kita matutulungan ngayong araw?
                </div>
            </div>
            <div class="chat-input-container">
                <input type="text" id="chatInput" placeholder="Type your message..." />
                <button id="sendMessage">Send</button>
            </div>
        </div>
    `;
    
    document.querySelector('.container').insertAdjacentHTML('beforeend', chatHTML);
    
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    
    closeChat.addEventListener('click', () => {
        document.getElementById('chatContainer').remove();
    });
    
    sendMessage.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Display user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerHTML = `<strong>You:</strong> ${message}`;
    chatMessages.appendChild(userMessageDiv);
    
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.innerHTML = '<strong>Lenna AI:</strong> <span class="typing-indicator">...</span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        // Call Lenna AI API
        const response = await fetch(`https://arychauhann.onrender.com/api/lenna?prompt=${encodeURIComponent(message)}`);
        const data = await response.json();
        
        // Remove typing indicator
        typingDiv.remove();
        
        // Display AI response
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'message ai-message';
        aiMessageDiv.innerHTML = `<strong>Lenna AI:</strong> ${data.response || data.message || 'Sorry, I could not process your request.'}`;
        chatMessages.appendChild(aiMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
    } catch (error) {
        console.error('Error calling Lenna AI API:', error);
        typingDiv.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message ai-message error';
        errorDiv.innerHTML = '<strong>Lenna AI:</strong> Sorry, may technical issue. Subukan ulit mamaya.';
        chatMessages.appendChild(errorDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
