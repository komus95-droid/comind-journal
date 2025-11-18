document.addEventListener('DOMContentLoaded', function() {
    // Рендеринг статей
    function renderArticles(container, articles, limit = null) {
        const articlesToShow = limit ? articles.slice(0, limit) : articles;
        
        container.innerHTML = articlesToShow.map(article => `
            <a href="article.html?slug=${article.slug}" class="article-card">
                <h3>${article.title}</h3>
                <p class="description">${article.description}</p>
                <div class="meta">
                    <time datetime="${article.date}">${formatDate(article.date)}</time>
                    <div>
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `).join('');
    }

    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Инициализация главной страницы
    const latestContainer = document.getElementById('latest-articles');
    if (latestContainer) {
        renderArticles(latestContainer, articlesData, 3);
    }

    // Инициализация страницы статей
    const articlesGrid = document.getElementById('articles-grid');
    const filterTags = document.getElementById('filter-tags');
    
    if (articlesGrid && filterTags) {
        // Рендеринг всех статей
        renderArticles(articlesGrid, articlesData);
        
        // Рендеринг фильтров
        const filterHTML = [
            '<button class="tag active" data-tag="all">Все темы</button>',
            ...allTags.map(tag => `<button class="tag" data-tag="${tag}">${tag}</button>`)
        ].join('');
        filterTags.innerHTML = filterHTML;
        
        // Обработка фильтров
        filterTags.addEventListener('click', function(e) {
            if (e.target.classList.contains('tag')) {
                // Обновление активного состояния
                filterTags.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
                e.target.classList.add('active');
                
                const selectedTag = e.target.dataset.tag;
                let filteredArticles = articlesData;
                
                if (selectedTag !== 'all') {
                    filteredArticles = articlesData.filter(article => 
                        article.tags.includes(selectedTag)
                    );
                }
                
                renderArticles(articlesGrid, filteredArticles);
                
                // Показать/скрыть пустое состояние
                const emptyState = document.getElementById('empty-state');
                if (emptyState) {
                    if (filteredArticles.length === 0) {
                        emptyState.style.display = 'block';
                    } else {
                        emptyState.style.display = 'none';
                    }
                }
            }
        });
    }

    // Похожие статьи (на странице статьи)
    const relatedContainer = document.getElementById('related-articles');
    if (relatedContainer) {
        const currentSlug = new URLSearchParams(window.location.search).get('slug');
        const otherArticles = articlesData.filter(a => a.slug !== currentSlug);
        const randomArticles = otherArticles.sort(() => 0.5 - Math.random()).slice(0, 2);
        
        renderArticles(relatedContainer, randomArticles);
    }

    // Обработка формы контактов
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            contactForm.style.display = 'none';
            const success = document.getElementById('form-success');
            if (success) success.style.display = 'block';

            console.log('Форма отправлена:', {
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            });
        });
    }
});
