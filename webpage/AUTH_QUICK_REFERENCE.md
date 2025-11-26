# 6phene Authentication Quick Reference

## Login Credentials

### Admin Access (Full Invoice System)
- **Username**: `kissmehrass`
- **Password**: `1234`
- **Redirects to**: `/invoice/` (Full Dashboard)
- **Capabilities**: 
  - Create/edit invoices
  - Manage customers, products, inventory
  - View financial reports
  - Access company settings
  - Manage expenses

### Customer Access (Customer Portal)
- **Username**: `admin`
- **Password**: `1234`
- **Redirects to**: `/customer-portal.html`
- **Capabilities**:
  - View personal invoices
  - See account statistics
  - Download invoice PDFs
  - Pay pending invoices
  - Change password

## Quick Links

- **Login Page**: `http://your-domain/login.html`
- **Customer Portal**: `http://your-domain/customer-portal.html`
- **Admin Dashboard**: `http://your-domain/invoice/`
- **Password Reset**: `http://your-domain/reset-password.html`
- **Main Website**: `http://your-domain/`

## Features Implemented

### ✅ Role-Based Authentication
- Separate login paths for admin and customers
- Session management with `sessionStorage`
- Automatic redirects based on role

### ✅ Customer Portal
- Clean, professional dashboard
- Invoice history table with status badges
- Account statistics (Total Invoices, Total Spent, Outstanding Balance)
- Logout functionality
- Hexagon particle background (matching main site)

### ✅ Password Reset
- Email-based reset request form
- User-friendly error/success messages
- Admin contact information for manual reset
- Consistent design with login page

### ✅ Admin Dashboard Enhancements
- Hexagon background in React app
- Username display in sidebar
- Logout button with hover effect
- Auth context for session management

### ✅ Security Best Practices
- Session validation on protected pages
- Automatic redirect to login if not authenticated
- Clear session on logout
- Client-side validation

## Testing Checklist

- [ ] Admin login works (`kissmehrass` / `1234`)
- [ ] Customer login works (`admin` / `1234`)
- [ ] Invalid credentials show error message
- [ ] Customer portal shows statistics
- [ ] Customer portal displays invoices
- [ ] Logout clears session and redirects
- [ ] Password reset form accepts email
- [ ] Hexagons visible on all pages
- [ ] Mobile responsive on all pages
- [ ] "Forgot Password?" link works

## Next Steps for Production

1. **Backend Integration**
   - Connect customer portal to real invoice API
   - Implement JWT-based authentication
   - Add database for user management

2. **Email Service**
   - Set up SMTP for password reset emails
   - Send invoice notifications to customers

3. **Payment Gateway**
   - Integrate Stripe or PayPal
   - Add "Pay Now" functionality

4. **Enhanced Security**
   - Add rate limiting
   - Implement 2FA for admin
   - Add CSRF protection
   - Enable HTTPS

5. **User Management**
   - Admin panel to create/edit customer accounts
   - Role-based permissions system
   - Activity logging

## Support

For development questions or issues:
- Check `CUSTOMER_PORTAL_DOCS.md` for detailed documentation
- Review `.cursor/rules/6phene_webpage.mdc` for architecture
- Contact: info@6phene.com

