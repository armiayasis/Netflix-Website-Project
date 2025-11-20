
const API_KEY = 'pub_cfa8375d90e545beb1f2474330c8604c';
const BASE_API_URL = 'https://newsdata.io/api/1/latest';

const newsContainer = document.getElementById('news-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const countryFilter = document.getElementById('country-filter');
const lastUpdated = document.getElementById('last-updated');

let allArticles = [];
let currentCountry = 'all';

// Popular countries to fetch news from
const countries = ['us', 'gb', 'ca', 'au', 'in', 'ph', 'sg', 'my', 'jp', 'kr'];

async function fetchNewsFromAllCountries() {
    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        
        const promises = countries.map(country => 
            fetch(`${BASE_API_URL}?apikey=${API_KEY}&country=${country}&language=en`)
                .then(res => res.json())
                .then(data => ({
                    country,
                    articles: data.results || []
                }))
                .catch(err => {
                    console.error(`Error fetching from ${country}:`, err);
                    return { country, articles: [] };
                })
        );
        
        // Also fetch general news without country filter
        promises.push(
            fetch(`${BASE_API_URL}?apikey=${API_KEY}&language=en`)
                .then(res => res.json())
                .then(data => ({
                    country: 'all',
                    articles: data.results || []
                }))
                .catch(err => {
                    console.error('Error fetching general news:', err);
                    return { country: 'all', articles: [] };
                })
        );
        
        const results = await Promise.all(promises);
        
        allArticles = [];
        results.forEach(result => {
            result.articles.forEach(article => {
                allArticles.push({
                    ...article,
                    fetchedCountry: result.country
                });
            });
        });
        
        // Remove duplicates based on title
        allArticles = allArticles.filter((article, index, self) =>
            index === self.findIndex(a => a.title === article.title)
        );
        
        // Sort by publication date (newest first)
        allArticles.sort((a, b) => {
            const dateA = new Date(a.pubDate || 0);
            const dateB = new Date(b.pubDate || 0);
            return dateB - dateA;
        });
        
        loadingElement.style.display = 'none';
        updateLastUpdatedTime();
        displayNews(filterArticlesByCountry(currentCountry));
        
    } catch (error) {
        loadingElement.style.display = 'none';
        showError('Failed to fetch news. Please try again later.');
        console.error('Error fetching news:', error);
    }
}

function filterArticlesByCountry(country) {
    if (country === 'all') {
        return allArticles;
    }
    return allArticles.filter(article => article.fetchedCountry === country);
}

function displayNews(articles) {
    newsContainer.innerHTML = '';
    
    if (articles.length === 0) {
        newsContainer.innerHTML = '<p style="color: white; text-align: center;">No news available at the moment.</p>';
        return;
    }
    
    articles.forEach(article => {
        const newsCard = createNewsCard(article);
        newsContainer.appendChild(newsCard);
    });
}

function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    const imageUrl = article.image_url || '';
    const title = article.title || 'No title';
    const description = article.description || 'No description available.';
    const source = article.source_name || 'Unknown source';
    const pubDate = article.pubDate ? new Date(article.pubDate).toLocaleDateString() : 'Unknown date';
    const link = article.link || '#';
    const categories = article.category || [];
    const country = article.fetchedCountry ? article.fetchedCountry.toUpperCase() : '';
    
    card.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="news-image" onerror="this.style.display='none'">` : '<div class="news-image"></div>'}
        <div class="news-content">
            ${country ? `<span class="country-badge">${country}</span>` : ''}
            <h2 class="news-title">${title}</h2>
            <div class="news-meta">
                <span class="news-source">${source}</span>
                <span class="news-date">${pubDate}</span>
            </div>
            ${categories.length > 0 ? `
                <div class="news-categories">
                    ${categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                </div>
            ` : ''}
            <p class="news-description">${description}</p>
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="read-more">Read Full Article</a>
        </div>
    `;
    
    return card;
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function updateLastUpdatedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    lastUpdated.textContent = `Last updated: ${timeString}`;
}

// Country filter event listener
countryFilter.addEventListener('change', (e) => {
    currentCountry = e.target.value;
    displayNews(filterArticlesByCountry(currentCountry));
});

// Initial fetch
fetchNewsFromAllCountries();

// Auto-refresh every 3 minutes
setInterval(fetchNewsFromAllCountries, 3 * 60 * 1000);

// Countdown timer for next refresh
let countdown = 180; // 3 minutes in seconds
const countdownElement = document.getElementById('countdown');

setInterval(() => {
    countdown--;
    if (countdown <= 0) {
        countdown = 180;
    }
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    countdownElement.textContent = `Next update in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}, 1000);
