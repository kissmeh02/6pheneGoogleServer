# Customer Portal & Authentication System

## Overview
This document describes the customer portal and authentication system implemented for 6phene.

## Authentication Flow

### User Roles
1. **Admin** (`kissmehrass` / `1234`)
   - Full access to Invoice System Dashboard
   - Can manage invoices, customers, products, inventory, expenses
   - Access to company settings

2. **Customer** (`admin` / `1234`)
   - Access to Customer Portal
   - View their own invoices
   - See account statistics
   - Change password

## Login System

### Login Page (`/login.html`)
- **Location**: `webpage/login.html`
- **Features**:
  - Role-based authentication
  - Hexagon particle background
  - Session management using `sessionStorage`
  - "Forgot Password?" link
  - Error handling with shake animation

### Authentication Logic
```javascript
// Admin Login
if (user === 'kissmehrass' && pass === '1234') {
    sessionStorage.setItem('userRole', 'admin');
    sessionStorage.setItem('username', user);
    window.location.href = '/invoice/';
}

// Customer Login
else if (user === 'admin' && pass === '1234') {
    sessionStorage.setItem('userRole', 'customer');
    sessionStorage.setItem('username', user);
    window.location.href = '/customer-portal.html';
}
```

## Customer Portal

### Customer Portal Page (`/customer-portal.html`)
- **Location**: `webpage/customer-portal.html`
- **Features**:
  - Account statistics dashboard
  - Invoice history table
  - Payment status tracking
  - Logout functionality
  - Hexagon particle background
  - Session validation (redirects to login if not authenticated)

### Dashboard Widgets
1. **Total Invoices**: Count of all customer invoices
2. **Total Spent**: Sum of all invoice amounts
3. **Outstanding Balance**: Sum of pending invoices

### Invoice Table
- Invoice number
- Date
- Amount
- Status (Paid, Pending, Overdue)
- Action buttons (View PDF, Pay Now)

## Password Reset

### Reset Password Page (`/reset-password.html`)
- **Location**: `webpage/reset-password.html`
- **Features**:
  - Email-based reset request
  - Simulated API call
  - Success/error messaging
  - Hexagon particle background
  - Contact information for admin assistance

### Best Practices Implemented
1. **Session Management**: Uses `sessionStorage` for temporary session data
2. **Client-Side Validation**: Email format validation
3. **User Feedback**: Clear success/error messages
4. **Security Note**: Includes admin contact for manual password reset
5. **Responsive Design**: Mobile-friendly layout

## Invoice System (React App)

### Auth Context (`/context/AuthContext.tsx`)
- **Location**: `modern-invoice-system/frontend/src/context/AuthContext.tsx`
- **Features**:
  - Centralized authentication state
  - Session persistence
  - Login/logout methods
  - Role-based access control

### Layout Updates
- **Username Display**: Shows logged-in user in sidebar
- **Logout Button**: Red hover effect, clears session
- **Hexagon Background**: Consistent visual theme across admin panel

### Hexagon Background Component
- **Location**: `modern-invoice-system/frontend/src/components/HexagonBackground.tsx`
- **Features**:
  - Canvas-based animation
  - Mouse interaction (hexagons glow on hover)
  - Responsive to window resize
  - Performance optimized

## File Structure

```
webpage/
├── login.html              # Login page with role-based auth
├── customer-portal.html    # Customer dashboard
├── reset-password.html     # Password reset page
├── js/
│   └── particles.js        # Hexagon background animation
└── css/
    └── [existing styles]

modern-invoice-system/frontend/src/
├── context/
│   └── AuthContext.tsx     # Authentication context provider
├── components/
│   ├── Layout.tsx          # Updated with auth & hexagons
│   └── HexagonBackground.tsx  # React hexagon component
└── App.tsx                 # Updated with AuthProvider
```

## Testing

### Test Customer Login
1. Navigate to `/login.html`
2. Enter username: `admin`, password: `1234`
3. Should redirect to `/customer-portal.html`
4. Verify dashboard shows statistics and invoices

### Test Admin Login
1. Navigate to `/login.html`
2. Enter username: `kissmehrass`, password: `1234`
3. Should redirect to `/invoice/` (React app)
4. Verify hexagon background is visible
5. Verify username shows in sidebar
6. Test logout button

### Test Password Reset
1. Navigate to `/reset-password.html`
2. Enter any valid email
3. Should show success message
4. Verify "Back to Login" link works

## Security Considerations

### Current Implementation (Development)
- Hardcoded credentials for demo purposes
- Client-side authentication only
- Session stored in `sessionStorage` (cleared on tab close)

### Production Recommendations
1. **Backend Authentication**: Implement JWT-based auth with backend API
2. **Password Hashing**: Use bcrypt or similar for password storage
3. **HTTPS**: Enforce SSL/TLS for all authentication endpoints
4. **Rate Limiting**: Prevent brute force attacks
5. **Session Expiry**: Implement automatic session timeout
6. **CSRF Protection**: Add CSRF tokens for form submissions
7. **Email Verification**: Implement actual email service for password reset

## Future Enhancements

1. **Customer-Specific Data**: Connect customer portal to backend API
2. **Payment Integration**: Add Stripe/PayPal for online payments
3. **Email Notifications**: Send invoice notifications
4. **Multi-Factor Authentication**: Add 2FA for admin accounts
5. **Activity Logs**: Track login attempts and user actions
6. **Profile Management**: Allow customers to update their info
7. **Document Upload**: Allow customers to upload POs or contracts

## Maintenance

### Adding New Users
Currently, users are hardcoded in `webpage/login.html`. To add new users:
1. Edit the login form submit handler
2. Add new credential checks
3. Set appropriate `userRole` in sessionStorage

### Updating Permissions
Modify the `AuthContext.tsx` to add role-based permission checks:
```typescript
const hasPermission = (requiredRole: string) => {
    return userRole === requiredRole || userRole === 'admin';
};
```

## Support

For issues or questions:
- **Email**: info@6phene.com
- **Phone**: +1 (519) 555-0123
- **Location**: Guelph, Ontario, Canada

