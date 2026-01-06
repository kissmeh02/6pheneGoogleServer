/**
 * Site-wide Search Functionality
 * Provides search across products, pages, and content
 */

class SiteSearch {
    constructor() {
        this.searchIndex = [];
        this.init();
    }

    async init() {
        // Build search index
        await this.buildIndex();
        
        // Create search UI
        this.createSearchUI();
    }

    async buildIndex() {
        // Index products
        try {
            const productsResponse = await fetch('/api/products');
            if (productsResponse.ok) {
                const products = await productsResponse.json();
                products.forEach(product => {
                    this.searchIndex.push({
                        title: product.name,
                        description: product.description || '',
                        url: `products.html#${product.id}`,
                        type: 'product',
                        category: product.category || ''
                    });
                });
            }
        } catch (e) {
            console.log('Products API not available');
        }

        // Index pages
        const pages = [
            { title: 'Home', url: 'index.html', description: '6phene homepage - Advanced graphene solutions' },
            { title: 'Products', url: 'products.html', description: 'Browse our graphene products and solutions' },
            { title: 'Technology', url: 'technology.html', description: 'Learn about graphene technology and applications' },
            { title: 'About Us', url: 'about.html', description: 'About 6phene - Engineering the future of material science' },
            { title: 'Contact', url: 'contact.html', description: 'Contact 6phene team in Guelph, Canada' }
        ];

        pages.forEach(page => {
            this.searchIndex.push({
                ...page,
                type: 'page'
            });
        });
    }

    createSearchUI() {
        // Create search button in navbar
        const navActions = document.querySelector('.nav-actions');
        if (navActions && !document.getElementById('search-toggle')) {
            const searchBtn = document.createElement('button');
            searchBtn.id = 'search-toggle';
            searchBtn.className = 'search-btn';
            searchBtn.setAttribute('aria-label', 'Open search');
            searchBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            `;
            searchBtn.style.cssText = `
                padding: 0.5rem;
                border-radius: 0.5rem;
                color: var(--color-text-secondary);
                background: transparent;
                border: none;
                cursor: pointer;
                transition: all 0.3s;
                min-width: 44px;
                min-height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            searchBtn.addEventListener('click', () => this.openSearch());
            navActions.insertBefore(searchBtn, navActions.firstChild);
        }

        // Create search modal
        if (!document.getElementById('search-modal')) {
            const modal = document.createElement('div');
            modal.id = 'search-modal';
            modal.className = 'search-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-label', 'Site search');
            modal.setAttribute('aria-modal', 'true');
            modal.innerHTML = `
                <div class="search-modal-backdrop" onclick="window.siteSearch.closeSearch()"></div>
                <div class="search-modal-content">
                    <div class="search-header">
                        <div class="search-input-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-text-secondary);">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input 
                                type="search" 
                                id="search-input" 
                                placeholder="Search products, pages, content..."
                                autocomplete="off"
                                aria-label="Search"
                            />
                            <button class="search-close" onclick="window.siteSearch.closeSearch()" aria-label="Close search">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="search-results" id="search-results" role="listbox" aria-label="Search results"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .search-modal {
                    position: fixed;
                    inset: 0;
                    z-index: 10000;
                    display: none;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 10vh;
                }
                
                .search-modal.active {
                    display: flex;
                }
                
                .search-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                }
                
                .search-modal-content {
                    position: relative;
                    width: 90%;
                    max-width: 600px;
                    background: var(--color-bg-card);
                    border: 1px solid var(--color-border);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(20px);
                }
                
                .search-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--color-border);
                }
                
                .search-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: var(--color-bg-secondary);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                }
                
                .search-input-wrapper:focus-within {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
                }
                
                #search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--color-text-primary);
                    font-size: 1rem;
                    outline: none;
                }
                
                #search-input::placeholder {
                    color: var(--color-text-secondary);
                }
                
                .search-close {
                    background: transparent;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 4px;
                    transition: all 0.2s;
                    min-width: 44px;
                    min-height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .search-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--color-text-primary);
                }
                
                .search-results {
                    max-height: 60vh;
                    overflow-y: auto;
                    padding: 1rem;
                }
                
                .search-result-item {
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                
                .search-result-item:hover,
                .search-result-item:focus {
                    background: var(--color-bg-secondary);
                    border-color: var(--color-primary);
                    outline: none;
                }
                
                .search-result-item.selected {
                    background: rgba(56, 189, 248, 0.1);
                    border-color: var(--color-primary);
                }
                
                .search-result-title {
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin-bottom: 0.25rem;
                }
                
                .search-result-description {
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                }
                
                .search-result-type {
                    display: inline-block;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: var(--color-primary);
                    margin-top: 0.5rem;
                    font-weight: 600;
                }
                
                .search-no-results {
                    padding: 2rem;
                    text-align: center;
                    color: var(--color-text-secondary);
                }
            `;
            document.head.appendChild(style);

            // Setup search input handler
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeSearch();
                    } else if (e.key === 'Enter') {
                        const firstResult = document.querySelector('.search-result-item');
                        if (firstResult) {
                            firstResult.click();
                        }
                    }
                });
            }
        }
    }

    openSearch() {
        const modal = document.getElementById('search-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            const input = document.getElementById('search-input');
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }

    closeSearch() {
        const modal = document.getElementById('search-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            const input = document.getElementById('search-input');
            if (input) {
                input.value = '';
            }
            const results = document.getElementById('search-results');
            if (results) {
                results.innerHTML = '';
            }
        }
    }

    performSearch(query) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        if (query.length < 2) {
            resultsContainer.innerHTML = '<div class="search-no-results">Type at least 2 characters to search</div>';
            return;
        }

        const lowerQuery = query.toLowerCase();
        const matches = this.searchIndex.filter(item => {
            return item.title.toLowerCase().includes(lowerQuery) ||
                   item.description.toLowerCase().includes(lowerQuery) ||
                   (item.category && item.category.toLowerCase().includes(lowerQuery));
        });

        if (matches.length === 0) {
            resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
            return;
        }

        resultsContainer.innerHTML = matches.slice(0, 10).map((item, index) => `
            <div 
                class="search-result-item" 
                role="option"
                tabindex="0"
                data-url="${item.url}"
                ${index === 0 ? 'data-selected="true"' : ''}
                onclick="window.location.href='${item.url}'"
                onkeydown="if(event.key==='Enter') window.location.href='${item.url}'"
            >
                <div class="search-result-title">${this.highlightMatch(item.title, query)}</div>
                <div class="search-result-description">${item.description}</div>
                <div class="search-result-type">${item.type}</div>
            </div>
        `).join('');
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: rgba(56, 189, 248, 0.3); color: var(--color-primary);">$1</mark>');
    }
}

// Initialize search
const siteSearch = new SiteSearch();
window.siteSearch = siteSearch;

// Keyboard shortcut: Cmd/Ctrl + K
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        siteSearch.openSearch();
    }
});












