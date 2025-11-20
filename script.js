let videoHistory = [];

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
    btnText.textContent = 'Generating...';
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
        } else {
            showMessage(data.error || 'Failed to generate video', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred while generating the video', 'error');
    } finally {
        generateBtn.disabled = false;
        btnText.textContent = 'Generate Video';
        btnLoader.style.display = 'none';
    }
}

function displayVideo(videoUrl, prompt, duration, aspectRatio, resolution) {
    const resultSection = document.getElementById('resultSection');
    const videoElement = document.getElementById('generatedVideo');
    const videoInfo = document.getElementById('videoInfo');
    const downloadBtn = document.getElementById('downloadBtn');

    videoElement.src = videoUrl;
    videoInfo.textContent = `Prompt: "${prompt}" | Duration: ${duration}s | Aspect Ratio: ${aspectRatio} | Resolution: ${resolution}`;
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
                <span>${item.duration}s</span>
                <span>${item.aspectRatio}</span>
                <span>${item.resolution}</span>
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
    
    displayVideo(item.videoUrl, item.prompt, item.duration, item.aspectRatio, item.resolution);
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
    }, 5000);
}

window.addEventListener('DOMContentLoaded', () => {
    updateHistoryDisplay();
});
