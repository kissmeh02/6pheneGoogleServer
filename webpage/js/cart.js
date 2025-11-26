// cart.js - Handles cart logic and checkout
const CART_STORAGE_KEY = '6phene_cart';

class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    }

    addItem(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
        this.updateUI();
        this.showNotification(`Added ${product.name} to cart`);
    }

    removeItem(productId) {
        this.items = this.items.filter(i => i.id !== productId);
        this.save();
        this.updateUI();
    }

    updateQuantity(productId, delta) {
        const item = this.items.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) this.removeItem(productId);
            else this.save();
        }
        this.updateUI();
    }

    clear() {
        this.items = [];
        this.save();
        this.updateUI();
    }

    save() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    showNotification(msg) {
        // Use toast system if available, otherwise fallback to simple notification
        if (window.toast) {
            window.toast.success(msg, 3000);
        } else {
            const notif = document.createElement('div');
            notif.className = 'cart-notification fade-in';
            notif.textContent = msg;
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 3000);
        }
    }

    updateUI() {
        const count = this.items.reduce((sum, i) => sum + i.quantity, 0);
        const badge = document.getElementById('cart-count');
        if (badge) badge.textContent = count;
        
        // Update Cart Modal if open
        const container = document.getElementById('cart-items-container');
        if (container) {
            if (this.items.length === 0) {
                container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            } else {
                container.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                        </div>
                        <div class="item-actions">
                            <button onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                            <button onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                            <button onclick="cart.removeItem(${item.id})" class="remove-btn">×</button>
                        </div>
                    </div>
                `).join('');
            }
            
            document.getElementById('cart-total').textContent = `$${this.getTotal().toFixed(2)}`;
        }
    }

    async checkout(customerData) {
        const payload = {
            customer_email: customerData.email,
            customer_name: customerData.name,
            shipping_address: customerData.address,
            items: this.items.map(i => ({
                product_id: i.id,
                quantity: i.quantity
            }))
        };

        try {
            // Use Nginx proxy path with trailing slash to avoid redirect
            const response = await fetch('/api/web-orders/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Checkout failed');
            }

            const result = await response.json();
            this.clear();
            
            // Use toast notification if available
            if (window.toast) {
                window.toast.success(`Order placed successfully! Order ID: ${result.order_id}`, 6000);
            } else {
                alert(`Order Placed Successfully! Order ID: ${result.order_id}`);
            }
            
            // Close cart modal
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.classList.remove('open');
            }
            
            // Optional: redirect to success page
            // window.location.href = 'success.html';
            
        } catch (error) {
            console.error('Checkout Error:', error);
            
            // Use toast notification if available
            if (window.toast) {
                window.toast.error(`Order failed: ${error.message}`, 7000);
            } else {
                alert(`Order Failed: ${error.message}`);
            }
        }
    }
}

// Initialize Global Cart
window.cart = new ShoppingCart();

// UI Styles for Cart
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-primary);
        color: black;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .cart-modal {
        position: fixed;
        top: 0; right: 0;
        width: 100%; max-width: 400px;
        height: 100vh;
        background: var(--color-bg-card);
        border-left: 1px solid var(--color-border);
        z-index: 999;
        padding: 2rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        flex-direction: column;
    }
    .cart-modal.open { transform: translateX(0); }
    .cart-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border);
    }
    .item-actions button {
        background: rgba(255,255,255,0.1);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 0.5rem;
    }
    .item-actions .remove-btn {
        background: #ef4444;
    }
`;
document.head.appendChild(style);

