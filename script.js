
const API_KEY = 'pub_cfa8375d90e545beb1f2474330c8604c';
const BASE_API_URL = 'https://newsdata.io/api/1/latest';

const newsContainer = document.getElementById('news-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const countryFilter = document.getElementById('country-filter');
const lastUpdated = document.getElementById('last-updated');

let allArticles = [];
let currentCountry = 'all';
let showingFavorites = false;
let favorites = JSON.parse(localStorage.getItem('starcope_favorites') || '[]');
let likes = JSON.parse(localStorage.getItem('starcope_likes') || '{}');

// Popular countries to fetch news from
const countries = ['us', 'gb', 'ca', 'au', 'in', 'ph', 'sg', 'my', 'jp', 'kr'];

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}-page`).classList.add('active');
    });
});

// Favorites toggle
document.getElementById('show-favorites').addEventListener('click', () => {
    showingFavorites = !showingFavorites;
    const btn = document.getElementById('show-favorites');
    
    if (showingFavorites) {
        btn.innerHTML = '<i class="fas fa-th"></i> Show All News';
        displayNews(allArticles.filter(a => favorites.includes(a.title)));
    } else {
        btn.innerHTML = `<i class="fas fa-star"></i> Show Favorites (<span id="favorites-count">${favorites.length}</span>)`;
        displayNews(filterArticlesByCountry(currentCountry));
    }
});

function updateFavoritesCount() {
    const countElement = document.getElementById('favorites-count');
    if (countElement) {
        countElement.textContent = favorites.length;
    }
}

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
        
        allArticles = allArticles.filter((article, index, self) =>
            index === self.findIndex(a => a.title === article.title)
        );
        
        allArticles.sort((a, b) => {
            const dateA = new Date(a.pubDate || 0);
            const dateB = new Date(b.pubDate || 0);
            return dateB - dateA;
        });
        
        loadingElement.style.display = 'none';
        updateLastUpdatedTime();
        displayNews(filterArticlesByCountry(currentCountry));
        updateFavoritesCount();
        
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
        newsContainer.innerHTML = '<p style="color: white; text-align: center; font-size: 1.2em;">No news available at the moment.</p>';
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
    
    const likeCount = likes[title] || 0;
    const isFavorited = favorites.includes(title);
    
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
            <div class="news-actions">
                <button class="action-btn btn-like" data-title="${title.replace(/"/g, '&quot;')}">
                    <i class="fas fa-heart"></i> Like (${likeCount})
                </button>
                <button class="action-btn btn-share" data-link="${link}" data-title="${title.replace(/"/g, '&quot;')}">
                    <i class="fab fa-facebook"></i> Share
                </button>
                <button class="action-btn btn-favorite ${isFavorited ? 'favorited' : ''}" data-title="${title.replace(/"/g, '&quot;')}">
                    <i class="fas fa-star"></i> ${isFavorited ? 'Favorited' : 'Favorite'}
                </button>
            </div>
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="read-more">
                Read Full Article <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `;
    
    // Like button event
    card.querySelector('.btn-like').addEventListener('click', function() {
        const articleTitle = this.dataset.title;
        likes[articleTitle] = (likes[articleTitle] || 0) + 1;
        localStorage.setItem('starcope_likes', JSON.stringify(likes));
        this.innerHTML = `<i class="fas fa-heart"></i> Like (${likes[articleTitle]})`;
        this.classList.add('liked');
    });
    
    // Share button event
    card.querySelector('.btn-share').addEventListener('click', function() {
        const articleLink = this.dataset.link;
        const articleTitle = this.dataset.title;
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleLink)}&quote=${encodeURIComponent(articleTitle)}`;
        window.open(fbShareUrl, '_blank', 'width=600,height=400');
    });
    
    // Favorite button event
    card.querySelector('.btn-favorite').addEventListener('click', function() {
        const articleTitle = this.dataset.title;
        const index = favorites.indexOf(articleTitle);
        
        if (index > -1) {
            favorites.splice(index, 1);
            this.classList.remove('favorited');
            this.innerHTML = '<i class="fas fa-star"></i> Favorite';
        } else {
            favorites.push(articleTitle);
            this.classList.add('favorited');
            this.innerHTML = '<i class="fas fa-star"></i> Favorited';
        }
        
        localStorage.setItem('starcope_favorites', JSON.stringify(favorites));
        updateFavoritesCount();
    });
    
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

countryFilter.addEventListener('change', (e) => {
    currentCountry = e.target.value;
    showingFavorites = false;
    document.getElementById('show-favorites').innerHTML = `<i class="fas fa-star"></i> Show Favorites (<span id="favorites-count">${favorites.length}</span>)`;
    displayNews(filterArticlesByCountry(currentCountry));
});

// Initial fetch
fetchNewsFromAllCountries();

// Auto-refresh every 3 minutes
setInterval(fetchNewsFromAllCountries, 3 * 60 * 1000);

// Countdown timer
let countdown = 180;
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
