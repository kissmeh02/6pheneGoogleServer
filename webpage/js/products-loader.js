// products-loader.js
(function() {
    'use strict';
    
    const API_URL = '/api/products/'; 
    let allProducts = [];
    let productGrid = null;

    // Category SVG Icon Map
    const categoryIcons = {
        'Defense': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
        'Energy': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M12 3v4M8 3v4M16 3v4"></path><path d="M6 11h12"></path></svg>',
        'Electronics': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
        'Infrastructure': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
        'Medical': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        'Aerospace': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path></svg>',
        'Consumer': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>'
    };

    function getProductIcon(category) {
        return categoryIcons[category] || '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>';
    }

    function showSkeletonLoaders() {
        if (!productGrid) return;
        productGrid.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-card skeleton';
            skeleton.style.opacity = '1';
            skeleton.innerHTML = `
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton skeleton-line short" style="margin-bottom: 0.5rem;"></div>
                    <div class="skeleton skeleton-line medium" style="margin-bottom: 1rem;"></div>
                    <div class="skeleton skeleton-line" style="margin-bottom: 0.5rem;"></div>
                    <div class="skeleton skeleton-line short"></div>
                </div>
            `;
            productGrid.appendChild(skeleton);
        }
    }

    async function loadProducts() {
        if (!productGrid) {
            console.error('Product grid not available for loading');
            return;
        }
        
        showSkeletonLoaders();
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            allProducts = await response.json();
            console.log(`Loaded ${allProducts.length} products`);
            // Small delay for smooth transition
            setTimeout(() => {
                renderProducts(allProducts);
                setupFilters();
            }, 300);
        } catch (error) {
            console.error('Error loading products:', error);
            if (productGrid) {
                productGrid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Unable to load products. Ensure the invoice system API is running.</p>';
            }
        }
    }

    function renderProducts(products) {
        if (!productGrid) {
            console.error('Product grid not found when rendering!');
            return;
        }
        
        productGrid.innerHTML = ''; // Clear existing

        if (products.length === 0) {
             productGrid.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; grid-column: 1/-1;">No products found in this category.</p>';
             return;
        }
        
        console.log(`Rendering ${products.length} products`);

        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card product-card-3d fade-in visible';
            card.style.animationDelay = `${index * 0.05}s`;
            card.style.opacity = '1';
            
            // Image Logic
            let imageContent;
            if (product.image_url) {
                let imageUrl = product.image_url;
                
                if (imageUrl.startsWith('/')) {
                    imageUrl = `/api${imageUrl}`;
                } else if (imageUrl.startsWith('http://localhost:8000')) {
                    imageUrl = imageUrl.replace('http://localhost:8000', '/api');
                }
                
                imageContent = `<img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">`;
            } else {
                imageContent = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: var(--color-primary); opacity: 0.6;">${getProductIcon(product.category)}</div>`;
            }

            const category = product.category || 'General';
            const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price);

            card.innerHTML = `
                <div class="product-image">${imageContent}</div>
                <div class="product-content">
                    <span class="product-badge">${category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description || 'No description available.'}</p>
                    
                    <div class="specs-list">
                        <div class="spec-item"><span>Price</span> <span>${price}</span></div>
                        <div class="spec-item">
                            <span>Stock</span> 
                            <span style="color: ${product.stock_quantity > 0 ? 'var(--color-text-primary)' : '#ef4444'}">
                                ${product.stock_quantity > 0 ? product.stock_quantity + ' units' : 'Out of Stock'}
                            </span>
                        </div>
                        ${product.sku ? `<div class="spec-item"><span>SKU</span> <span>${product.sku}</span></div>` : ''}
                    </div>
                    
                    <div style="display: flex;">
                        <a href="contact.html?product=${encodeURIComponent(product.name)}" class="btn btn-primary" style="flex: 1; font-size: 0.85rem; text-align: center;">Inquire</a>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
        
        // Re-trigger mouse effect
        const cards = document.querySelectorAll('.product-card');
        document.addEventListener('mousemove', (e) => {
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    function setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.innerText;
                if (category === 'All') {
                    renderProducts(allProducts);
                } else {
                    const filtered = allProducts.filter(p => p.category === category);
                    renderProducts(filtered);
                }
            });
        });
    }

    function init() {
        // Try multiple selectors
        productGrid = document.querySelector('.product-grid') || document.getElementById('product-grid');
        
        if (!productGrid) {
            console.warn('Product grid not found, retrying in 200ms...');
            setTimeout(init, 200);
            return;
        }
        
        console.log('Product grid found, loading products...');
        loadProducts();
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        setTimeout(init, 100);
    }
})();
