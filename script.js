const API_BASE = 'https://de1.api.radio-browser.info/json';

let allStations = [];
let filteredStations = [];
let currentStation = null;
let audioPlayer = null;
let isPlaying = false;

const popularCountriesList = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Spain',
    'Italy', 'Canada', 'Australia', 'Brazil', 'Japan', 'Philippines',
    'India', 'Mexico', 'Netherlands', 'Sweden', 'Norway', 'Poland',
    'Russia', 'Argentina', 'South Korea', 'Thailand', 'Indonesia'
];

async function init() {
    audioPlayer = document.getElementById('audioPlayer');
    
    setupEventListeners();
    await loadStations();
    populateFilters();
    displayPopularCountries();
    updateStats();
}

function setupEventListeners() {
    document.getElementById('playBtn').addEventListener('click', togglePlay);
    document.getElementById('volumeSlider').addEventListener('input', updateVolume);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('countryFilter').addEventListener('change', applyFilters);
    document.getElementById('genreFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applySorting);
    
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        updatePlayButton();
    });
    
    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayButton();
    });
    
    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        showNotification('Failed to load radio stream. Trying alternative stream...', 'error');
        isPlaying = false;
        updatePlayButton();
    });
}

async function loadStations() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE}/stations/search?limit=1000&order=votes&reverse=true&hidebroken=true`);
        allStations = await response.json();
        filteredStations = [...allStations];
        
        displayStations(filteredStations.slice(0, 50));
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Error loading stations:', error);
        loadingIndicator.innerHTML = 'Failed to load stations. Please refresh the page.';
    }
}

function populateFilters() {
    const countries = [...new Set(allStations.map(s => s.country).filter(c => c))].sort();
    const tags = [...new Set(allStations.flatMap(s => s.tags.split(',').map(t => t.trim()).filter(t => t)))].sort();
    
    const countrySelect = document.getElementById('countryFilter');
    const genreSelect = document.getElementById('genreFilter');
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
    
    tags.slice(0, 50).forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        genreSelect.appendChild(option);
    });
}

function displayPopularCountries() {
    const container = document.getElementById('popularCountries');
    
    popularCountriesList.forEach(country => {
        const chip = document.createElement('div');
        chip.className = 'country-chip';
        chip.textContent = `${getCountryFlag(country)} ${country}`;
        chip.onclick = () => filterByCountry(country);
        container.appendChild(chip);
    });
}

function getCountryFlag(country) {
    const flags = {
        'United States': '🇺🇸',
        'United Kingdom': '🇬🇧',
        'Germany': '🇩🇪',
        'France': '🇫🇷',
        'Spain': '🇪🇸',
        'Italy': '🇮🇹',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'Brazil': '🇧🇷',
        'Japan': '🇯🇵',
        'Philippines': '🇵🇭',
        'India': '🇮🇳',
        'Mexico': '🇲🇽',
        'Netherlands': '🇳🇱',
        'Sweden': '🇸🇪',
        'Norway': '🇳🇴',
        'Poland': '🇵🇱',
        'Russia': '🇷🇺',
        'Argentina': '🇦🇷',
        'South Korea': '🇰🇷',
        'Thailand': '🇹🇭',
        'Indonesia': '🇮🇩'
    };
    return flags[country] || '🌍';
}

function displayStations(stations) {
    const container = document.getElementById('stationsList');
    container.innerHTML = '';
    
    if (stations.length === 0) {
        container.innerHTML = '<p class="loading">No stations found. Try different filters.</p>';
        return;
    }
    
    stations.forEach(station => {
        const card = createStationCard(station);
        container.appendChild(card);
    });
}

function createStationCard(station) {
    const card = document.createElement('div');
    card.className = 'station-card';
    if (currentStation && currentStation.stationuuid === station.stationuuid) {
        card.classList.add('playing');
    }
    
    card.innerHTML = `
        <div class="station-card-header">
            <img class="station-card-logo" src="${station.favicon || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📻</text></svg>'}" 
                 alt="${station.name}"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📻</text></svg>'">
            <div class="station-card-info">
                <h4>${station.name}</h4>
                <p>${getCountryFlag(station.country)} ${station.country || 'Unknown'}</p>
            </div>
        </div>
        <div class="station-card-tags">${station.tags ? station.tags.split(',').slice(0, 3).join(', ') : 'General'}</div>
        <div class="station-card-stats">
            <span>👍 ${station.votes || 0}</span>
            <span>▶️ ${station.clickcount || 0}</span>
            <span>📶 ${station.bitrate || 0} kbps</span>
        </div>
    `;
    
    card.onclick = () => playStation(station);
    return card;
}

async function playStation(station) {
    currentStation = station;
    
    document.getElementById('stationName').textContent = station.name;
    document.getElementById('stationCountry').textContent = `${getCountryFlag(station.country)} ${station.country || 'Unknown'}`;
    document.getElementById('stationTags').textContent = station.tags ? station.tags.split(',').slice(0, 5).join(', ') : '';
    document.getElementById('stationLogo').src = station.favicon || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📻</text></svg>';
    
    document.getElementById('playBtn').disabled = false;
    
    try {
        await fetch(`${API_BASE}/url/${station.stationuuid}`);
    } catch (e) {
        console.log('Click tracking failed, but continuing...');
    }
    
    audioPlayer.src = station.url_resolved || station.url;
    audioPlayer.load();
    
    try {
        await audioPlayer.play();
        showNotification(`Now playing: ${station.name}`, 'success');
    } catch (error) {
        console.error('Playback error:', error);
        showNotification('Failed to play station. Please try another one.', 'error');
    }
    
    updateStationCards();
}

function togglePlay() {
    if (!currentStation) return;
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch(error => {
            console.error('Play error:', error);
            showNotification('Failed to resume playback', 'error');
        });
    }
}

function updatePlayButton() {
    const playIcon = document.getElementById('playIcon');
    playIcon.textContent = isPlaying ? '⏸️' : '▶️';
}

function updateVolume(e) {
    const volume = e.target.value / 100;
    audioPlayer.volume = volume;
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    applyFilters(searchTerm);
}

function applyFilters(searchTerm = null) {
    const search = searchTerm || document.getElementById('searchInput').value.toLowerCase();
    const country = document.getElementById('countryFilter').value;
    const genre = document.getElementById('genreFilter').value;
    
    filteredStations = allStations.filter(station => {
        const matchesSearch = !search || 
            station.name.toLowerCase().includes(search) ||
            station.country.toLowerCase().includes(search) ||
            station.tags.toLowerCase().includes(search);
        
        const matchesCountry = !country || station.country === country;
        const matchesGenre = !genre || station.tags.toLowerCase().includes(genre.toLowerCase());
        
        return matchesSearch && matchesCountry && matchesGenre;
    });
    
    applySorting();
}

function applySorting() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredStations.sort((a, b) => {
        switch (sortBy) {
            case 'votes':
                return (b.votes || 0) - (a.votes || 0);
            case 'clickcount':
                return (b.clickcount || 0) - (a.clickcount || 0);
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });
    
    displayStations(filteredStations.slice(0, 50));
    updateStats();
}

function filterByCountry(country) {
    document.getElementById('countryFilter').value = country;
    applyFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStationCards() {
    document.querySelectorAll('.station-card').forEach(card => {
        card.classList.remove('playing');
    });
    
    if (currentStation) {
        const playingCards = Array.from(document.querySelectorAll('.station-card')).filter(card => 
            card.textContent.includes(currentStation.name)
        );
        playingCards.forEach(card => card.classList.add('playing'));
    }
}

function updateStats() {
    const totalStations = filteredStations.length;
    const countries = [...new Set(filteredStations.map(s => s.country).filter(c => c))];
    const totalListeners = filteredStations.reduce((sum, s) => sum + (s.clickcount || 0), 0);
    
    document.getElementById('totalStations').textContent = totalStations.toLocaleString();
    document.getElementById('totalCountries').textContent = countries.length;
    document.getElementById('nowListening').textContent = totalListeners.toLocaleString();
}

function showNotification(message, type) {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) existingNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', init);
