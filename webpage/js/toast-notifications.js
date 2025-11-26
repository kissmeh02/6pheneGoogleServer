/**
 * Toast Notification System
 * Provides user feedback for actions (success, error, info, warning)
 */

class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-atomic', 'true');
            this.container.className = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                max-width: 400px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        const toastId = `toast-${Date.now()}`;
        toast.id = toastId;
        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const colors = {
            success: '#30d158',
            error: '#ff4444',
            warning: '#ff9f0a',
            info: '#38bdf8'
        };

        toast.style.cssText = `
            background: rgba(3, 3, 4, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid ${colors[type]}40;
            border-left: 4px solid ${colors[type]};
            color: var(--color-text-primary);
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            gap: 1rem;
            min-height: 60px;
            pointer-events: auto;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: slideInRight 0.3s ease-out forwards;
        `;

        toast.innerHTML = `
            <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: ${colors[type]}20;
                color: ${colors[type]};
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 1.2rem;
                flex-shrink: 0;
            ">${icons[type]}</div>
            <div style="flex: 1; line-height: 1.5;">
                <div style="font-weight: 600; margin-bottom: 0.25rem; text-transform: capitalize;">${type}</div>
                <div style="font-size: 0.9rem; color: var(--color-text-secondary);">${message}</div>
            </div>
            <button 
                onclick="this.parentElement.remove()" 
                aria-label="Close notification"
                style="
                    background: transparent;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 4px;
                    transition: all 0.2s;
                    min-width: 32px;
                    min-height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
                onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='var(--color-text-primary)'"
                onmouseout="this.style.background='transparent'; this.style.color='var(--color-text-secondary)'"
            >✕</button>
        `;

        this.container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        }

        return toast;
    }

    remove(toast) {
        if (toast && toast.parentNode) {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 7000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
}

// Initialize toast manager
const toast = new ToastManager();

// Make it globally available
window.toast = toast;

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        #toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: 100%;
        }
    }
`;
document.head.appendChild(style);










