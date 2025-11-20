let videoHistory = [];
let currentOperationId = null;
let pollingInterval = null;

async function generateVideo() {
    const prompt = document.getElementById('prompt').value.trim();
    const duration = parseInt(document.getElementById('duration').value);
    const aspectRatio = document.getElementById('aspectRatio').value;
    const resolution = document.getElementById('resolution').value;

    if (!prompt) {
        showMessage('Please enter a video description!', 'error');
        return;
    }

    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    generateBtn.disabled = true;
    btnText.textContent = 'Starting generation...';
    btnLoader.style.display = 'inline-block';

    try {
        const response = await fetch('/api/generate-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                duration,
                aspectRatio,
                resolution
            })
        });

        const data = await response.json();

        if (response.ok) {
            currentOperationId = data.operationName.split('/').pop();
            btnText.textContent = 'Generating video... This may take a few minutes';
            showMessage('Video generation started! Please wait...', 'success');
            
            startPolling(currentOperationId, prompt, duration, aspectRatio, resolution);
        } else {
            showMessage(data.error || 'Failed to start video generation', 'error');
            resetButton();
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred while starting video generation', 'error');
        resetButton();
    }
}

function startPolling(operationId, prompt, duration, aspectRatio, resolution) {
    let attempts = 0;
    const maxAttempts = 60;

    pollingInterval = setInterval(async () => {
        attempts++;

        if (attempts > maxAttempts) {
            clearInterval(pollingInterval);
            showMessage('Video generation timed out. Please try again.', 'error');
            resetButton();
            return;
        }

        try {
            const response = await fetch(`/api/check-operation/${operationId}`);
            
            if (!response.ok) {
                clearInterval(pollingInterval);
                const data = await response.json();
                showMessage(data.error || `Server error: ${response.status}`, 'error');
                resetButton();
                return;
            }

            const data = await response.json();

            if (data.done) {
                clearInterval(pollingInterval);

                if (data.error) {
                    showMessage(`Generation failed: ${JSON.stringify(data.error)}`, 'error');
                    resetButton();
                } else if (data.videoUrl) {
                    displayVideo(data.videoUrl, prompt, duration, aspectRatio, resolution);
                    addToHistory({
                        prompt,
                        duration,
                        aspectRatio,
                        resolution,
                        videoUrl: data.videoUrl,
                        timestamp: new Date().toISOString()
                    });
                    showMessage('Video generated successfully!', 'success');
                    resetButton();
                } else {
                    showMessage('Video generation completed but no video URL returned', 'error');
                    resetButton();
                }
            } else {
                const progress = Math.min(95, (attempts / maxAttempts) * 100);
                document.getElementById('btnText').textContent = `Generating... ${Math.round(progress)}%`;
            }
        } catch (error) {
            console.error('Polling error:', error);
            clearInterval(pollingInterval);
            showMessage('Network error while checking video status', 'error');
            resetButton();
        }
    }, 10000);
}

function resetButton() {
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    generateBtn.disabled = false;
    btnText.textContent = 'Generate Video';
    btnLoader.style.display = 'none';
}

function displayVideo(videoUrl, prompt, duration, aspectRatio, resolution) {
    const resultSection = document.getElementById('resultSection');
    const videoElement = document.getElementById('generatedVideo');
    const videoInfo = document.getElementById('videoInfo');
    const downloadBtn = document.getElementById('downloadBtn');

    videoElement.src = videoUrl;
    videoInfo.textContent = `Prompt: "${prompt}" | Aspect Ratio: ${aspectRatio} | Resolution: ${resolution}`;
    downloadBtn.href = videoUrl;
    downloadBtn.download = `video-${Date.now()}.mp4`;

    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function addToHistory(item) {
    videoHistory.unshift(item);
    if (videoHistory.length > 10) {
        videoHistory.pop();
    }
    localStorage.setItem('videoHistory', JSON.stringify(videoHistory));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (videoHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No videos generated yet</p>';
        return;
    }

    historyList.innerHTML = videoHistory.map((item, index) => `
        <div class="history-item" onclick="loadHistoryItem(${index})">
            <div class="prompt-preview">${item.prompt}</div>
            <div class="metadata">
                <span>${item.aspectRatio}</span>
                <span>${item.resolution}</span>
                <span>${new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

function loadHistoryItem(index) {
    const item = videoHistory[index];
    document.getElementById('prompt').value = item.prompt;
    document.getElementById('duration').value = item.duration;
    document.getElementById('aspectRatio').value = item.aspectRatio;
    document.getElementById('resolution').value = item.resolution;
    
    if (item.videoUrl) {
        displayVideo(item.videoUrl, item.prompt, item.duration, item.aspectRatio, item.resolution);
    }
}

function showMessage(message, type) {
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;

    const inputCard = document.querySelector('.input-card');
    inputCard.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 8000);
}

window.addEventListener('DOMContentLoaded', () => {
    const savedHistory = localStorage.getItem('videoHistory');
    if (savedHistory) {
        try {
            videoHistory = JSON.parse(savedHistory);
        } catch (e) {
            videoHistory = [];
        }
    }
    updateHistoryDisplay();
});

window.addEventListener('beforeunload', () => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
});
