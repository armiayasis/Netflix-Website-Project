const radioStations = [
    { name: 'Manila FM 99.5', location: 'Manila, Metro Manila', frequency: 'FM 99.5', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Cebu FM 101.1', location: 'Cebu City, Cebu', frequency: 'FM 101.1', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Davao FM 95.3', location: 'Davao City, Davao del Sur', frequency: 'FM 95.3', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Iloilo FM 97.7', location: 'Iloilo City, Iloilo', frequency: 'FM 97.7', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Baguio FM 88.9', location: 'Baguio City, Benguet', frequency: 'FM 88.9', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Cagayan de Oro FM 94.5', location: 'Cagayan de Oro, Misamis Oriental', frequency: 'FM 94.5', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Bacolod FM 103.3', location: 'Bacolod City, Negros Occidental', frequency: 'FM 103.3', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Zamboanga FM 92.1', location: 'Zamboanga City, Zamboanga del Sur', frequency: 'FM 92.1', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Tacloban FM 96.5', location: 'Tacloban City, Leyte', frequency: 'FM 96.5', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Puerto Princesa FM 98.3', location: 'Puerto Princesa, Palawan', frequency: 'FM 98.3', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Quezon City FM 100.7', location: 'Quezon City, Metro Manila', frequency: 'FM 100.7', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Makati FM 102.5', location: 'Makati City, Metro Manila', frequency: 'FM 102.5', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Pasig FM 90.3', location: 'Pasig City, Metro Manila', frequency: 'FM 90.3', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Antipolo FM 104.1', location: 'Antipolo City, Rizal', frequency: 'FM 104.1', stream: 'https://streams.radio.co/s83e4c7d3d/listen' },
    { name: 'Batangas FM 93.7', location: 'Batangas City, Batangas', frequency: 'FM 93.7', stream: 'https://streams.radio.co/s83e4c7d3d/listen' }
];

const loveSongs = [
    { id: 1, title: 'Destiny', artist: 'Jim Brickman', duration: '4:32', year: 1998 },
    { id: 2, title: 'The Gift', artist: 'Jim Brickman ft. Collin Raye & Susan Ashton', duration: '4:45', year: 1997 },
    { id: 3, title: 'Valentine', artist: 'Jim Brickman ft. Martina McBride', duration: '4:12', year: 1997 },
    { id: 4, title: 'Beautiful', artist: 'Jim Brickman ft. Wayne Brady', duration: '3:58', year: 2005 },
    { id: 5, title: 'Love of My Life', artist: 'Jim Brickman ft. Michael W. Smith', duration: '4:20', year: 1999 },
    { id: 6, title: 'Your Love', artist: 'Jim Brickman ft. Michelle Wright', duration: '4:15', year: 1997 },
    { id: 7, title: 'After All These Years', artist: 'Jim Brickman ft. Anne Cochran', duration: '4:38', year: 2001 },
    { id: 8, title: 'Simple Things', artist: 'Jim Brickman ft. Rebecca Lynn Howard', duration: '4:10', year: 2001 },
    { id: 9, title: 'Never Alone', artist: 'Jim Brickman ft. Lady Antebellum', duration: '3:55', year: 2007 },
    { id: 10, title: 'If You Believe', artist: 'Jim Brickman', duration: '4:28', year: 1997 },
    { id: 11, title: 'The Love I Found in You', artist: 'Jim Brickman ft. Michele Pillar', duration: '4:05', year: 1995 },
    { id: 12, title: 'Peace', artist: 'Jim Brickman', duration: '4:15', year: 2003 },
    { id: 13, title: 'Sending You a Little Christmas', artist: 'Jim Brickman ft. Kristy Starling', duration: '3:50', year: 2002 },
    { id: 14, title: 'Evermore', artist: 'Jim Brickman', duration: '4:22', year: 2019 },
    { id: 15, title: 'Hope', artist: 'Jim Brickman', duration: '4:00', year: 2009 },
    { id: 16, title: 'Angel Eyes', artist: 'Jim Brickman', duration: '3:45', year: 1997 },
    { id: 17, title: 'Blessings', artist: 'Jim Brickman', duration: '4:18', year: 2010 },
    { id: 18, title: 'Pure Love', artist: 'Jim Brickman', duration: '4:25', year: 2016 },
    { id: 19, title: 'Homecoming', artist: 'Jim Brickman', duration: '3:52', year: 2007 },
    { id: 20, title: 'Rocket to the Moon', artist: 'Jim Brickman', duration: '4:08', year: 1994 },
    { id: 21, title: 'Shaker Lakes', artist: 'Jim Brickman', duration: '3:42', year: 1995 },
    { id: 22, title: 'Morning Light', artist: 'Jim Brickman', duration: '4:30', year: 2001 },
    { id: 23, title: 'Timeless', artist: 'Jim Brickman', duration: '3:55', year: 2003 },
    { id: 24, title: 'Serenity', artist: 'Jim Brickman', duration: '4:12', year: 2000 },
    { id: 25, title: 'Remember Me', artist: 'Jim Brickman', duration: '4:05', year: 2008 },
    { id: 26, title: 'Forever and Always', artist: 'Jim Brickman', duration: '4:20', year: 2012 },
    { id: 27, title: 'Heartland', artist: 'Jim Brickman', duration: '3:48', year: 2006 },
    { id: 28, title: 'Summer Samba', artist: 'Jim Brickman', duration: '3:38', year: 2004 }
];

let isPlaying = false;
let currentVolume = 70;
let currentAudio = null;
let currentStation = radioStations[0];
let filteredSongs = [...loveSongs];

const landingPage = document.getElementById('landingPage');
const mainApp = document.getElementById('mainApp');
const getStartedLanding = document.getElementById('getStartedLanding');
const loadingProgress = document.getElementById('loadingProgress');
const loadingText = document.getElementById('loadingText');
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const radioStream = document.getElementById('radioStream');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

document.addEventListener('DOMContentLoaded', () => {
    renderStations();
    renderMusic();
    setupEventListeners();
});

getStartedLanding.addEventListener('click', () => {
    startLoading();
});

function startLoading() {
    loadingText.textContent = 'Naghahanda ng radio stations...';
    let progress = 0;
    const loadingSteps = [
        { progress: 25, text: 'Nag-lo-load ng mga istasyon...' },
        { progress: 50, text: 'Nag-download ng music library...' },
        { progress: 75, text: 'Hinihanda ang player...' },
        { progress: 100, text: 'Tapos na! Magsisimula...' }
    ];
    
    let stepIndex = 0;
    const interval = setInterval(() => {
        if (stepIndex < loadingSteps.length) {
            progress = loadingSteps[stepIndex].progress;
            loadingText.textContent = loadingSteps[stepIndex].text;
            loadingProgress.style.width = progress + '%';
            stepIndex++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                landingPage.classList.remove('active');
                mainApp.style.display = 'block';
                setTimeout(() => {
                    mainApp.classList.add('active');
                }, 50);
            }, 500);
        }
    }, 800);
}

function renderStations() {
    const stationsGrid = document.getElementById('stationsGrid');
    stationsGrid.innerHTML = radioStations.map(station => `
        <div class="station-card" data-stream="${station.stream}" data-name="${station.name}" data-frequency="${station.frequency}">
            <div class="station-icon">📻</div>
            <h3 class="station-name">${station.name}</h3>
            <p class="station-location">📍 ${station.location}</p>
            <p class="station-frequency">${station.frequency}</p>
            <button class="station-play-btn" onclick="playStation('${station.stream}', '${station.name}', '${station.frequency}')">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                PLAY STATION
            </button>
            <div class="volume-mini">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <input type="range" class="volume-mini-slider" min="0" max="100" value="70" onchange="updateVolume(this.value)">
            </div>
        </div>
    `).join('');
}

function renderMusic(songs = loveSongs) {
    const musicGrid = document.getElementById('musicGrid');
    musicGrid.innerHTML = songs.map(song => `
        <div class="music-card">
            <div class="music-icon">🎵</div>
            <div class="music-info">
                <h3 class="music-title">${song.title}</h3>
                <p class="music-artist">${song.artist}</p>
                <p class="music-meta">
                    <span>⏱️ ${song.duration}</span>
                    <span>📅 ${song.year}</span>
                </p>
            </div>
            <div class="music-actions">
                <button class="music-play-btn" onclick="playSong('${song.title}', '${song.artist}')">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    PLAY
                </button>
                <button class="music-download-btn" onclick="downloadSong('${song.title}', '${song.artist}')">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
                    </svg>
                    DOWNLOAD
                </button>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    playBtn.addEventListener('click', togglePlay);
    volumeSlider.addEventListener('input', (e) => updateVolume(e.target.value));
    searchBtn.addEventListener('click', searchMusic);
    searchInput.addEventListener('input', searchMusic);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMusic();
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const target = this.getAttribute('href');
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Salamat sa inyong mensahe! Makikipag-ugnayan kami sa inyo sa lalong madaling panahon.');
            contactForm.reset();
        });
    }
}

function playStation(stream, name, frequency) {
    if (currentAudio && currentAudio !== radioStream) {
        currentAudio.pause();
    }
    
    currentAudio = radioStream;
    radioStream.src = stream;
    currentStation = { name, frequency };
    
    document.getElementById('currentStation').textContent = name;
    document.getElementById('currentFrequency').textContent = frequency;
    
    radioStream.play().then(() => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        showNotification(`Nakakonekta sa ${name}`);
    }).catch(error => {
        showNotification('Hindi makakonekta sa station. Subukan ulit.', 'error');
    });
    
    document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
}

function playSong(title, artist) {
    showNotification(`Tumutugtog: "${title}" ni ${artist}`, 'success');
    if (currentAudio && currentAudio !== radioStream) {
        currentAudio.pause();
    }
    document.getElementById('currentProgram').textContent = title;
    document.getElementById('currentStation').textContent = artist;
}

function downloadSong(title, artist) {
    showNotification(`Dina-download: "${title}" ni ${artist}`, 'success');
}

function togglePlay() {
    if (!currentAudio) {
        currentAudio = radioStream;
    }
    
    if (isPlaying) {
        currentAudio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        isPlaying = false;
    } else {
        currentAudio.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            isPlaying = true;
        }).catch(error => {
            showNotification('Error playing audio. Please try again.', 'error');
        });
    }
}

function updateVolume(value) {
    currentVolume = value;
    if (currentAudio) {
        currentAudio.volume = value / 100;
    }
    document.querySelectorAll('.volume-mini-slider').forEach(slider => {
        slider.value = value;
    });
    volumeSlider.value = value;
}

function searchMusic() {
    const query = searchInput.value.toLowerCase().trim();
    if (query === '') {
        renderMusic(loveSongs);
        return;
    }
    
    const filtered = loveSongs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );
    
    renderMusic(filtered);
    
    if (filtered.length === 0) {
        document.getElementById('musicGrid').innerHTML = `
            <div class="no-results">
                <p>Walang nakitang kanta. Subukan ang ibang search term.</p>
            </div>
        `;
    } else if (filtered.length === 1) {
        playSong(filtered[0].title, filtered[0].artist);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

radioStream.addEventListener('error', () => {
    showNotification('Hindi makakonekta sa stream. Subukan ulit.', 'error');
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
});
