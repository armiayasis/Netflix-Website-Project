
const API_KEY = 'pub_cfa8375d90e545beb1f2474330c8604c';
const API_URL = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=Manila`;

const newsContainer = document.getElementById('news-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

async function fetchNews() {
    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        
        const response = await fetch(API_URL);
        const data = await response.json();
        
        loadingElement.style.display = 'none';
        
        if (data.status === 'success' && data.results) {
            displayNews(data.results);
        } else {
            showError('No news articles found.');
        }
    } catch (error) {
        loadingElement.style.display = 'none';
        showError('Failed to fetch news. Please try again later.');
        console.error('Error fetching news:', error);
    }
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
    
    card.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="news-image" onerror="this.src=''">` : '<div class="news-image"></div>'}
        <div class="news-content">
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

// Fetch news when page loads
fetchNews();

// Refresh news every 5 minutes
setInterval(fetchNews, 5 * 60 * 1000);
