# Shopify Form Builder App

A production-ready Shopify app that enables merchants to create and embed custom forms with automatic customer data capture, including special Social Name and auto-generated Bestellnummer ID fields.

## Features

### 🎨 Form Builder
- Drag & drop form builder with intuitive interface
- 11+ field types including text, email, select, radio, checkbox, file upload
- Special fields: Social Name (required) and Bestellnummer ID (auto-generated)
- Conditional logic and multi-step forms
- Real-time preview with multiple styling options

### 🆔 Bestellnummer ID System
- Auto-generated unique numeric IDs (4-10 digits configurable)
- Collision-safe generation with Redis reservation system
- Optional prefix/suffix (e.g., "MA-12345-2024")
- Automatic Shopify Customer metafield and tag creation
- Customer cannot edit - server-side generation only

### 🛍️ Shopify Integration
- Full OAuth integration with required scopes
- Theme App Extension for seamless storefront embedding
- App Proxy endpoints for public form access
- Automatic metafield definitions creation
- Customer creation/update with metafields and tags

### 🌍 Multi-Language Support
- English, German, and Greek translations
- Configurable per form
- JSON-based translation system

### 📧 Email & Webhooks
- Customizable email confirmation templates
- Liquid-like variable substitution
- Webhook notifications for submissions
- Background job processing

### 🔒 Security & Performance
- HMAC verification for App Proxy requests
- Rate limiting per IP and email
- Honeypot and reCAPTCHA v3 spam protection
- Redis-based caching and session management

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Admin UI**: Shopify Polaris components
- **Database**: Prisma + PostgreSQL
- **Cache/Queue**: Redis
- **Email**: Resend
- **Validation**: Zod
- **Forms**: React Hook Form
- **Drag & Drop**: React DnD

## Setup Instructions

### 1. Shopify App Creation

1. Create a new app in your Shopify Partner Dashboard
2. Set the app URL to your deployment domain
3. Configure the following scopes:
   ```
   read_customers,write_customers,read_customer_fields,write_customer_fields,read_content,read_themes,write_themes
   ```
4. Set up Theme App Extension and App Proxy endpoints

### 2. Environment Variables

Copy `.env.local` and configure:

```bash
# Database (Neon, PlanetScale, or local PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/database"

# Redis (Upstash or local Redis)
REDIS_URL="redis://host:port"

# Email service (Resend)
RESEND_API_KEY="your_resend_api_key"
FROM_EMAIL="noreply@yourstore.com"

# Shopify App credentials
SHOPIFY_API_KEY="your_shopify_api_key"
SHOPIFY_API_SECRET="your_shopify_api_secret"
SHOPIFY_SCOPES="read_customers,write_customers,read_customer_fields,write_customer_fields,read_content,read_themes,write_themes"

# Deployment URL
APP_URL="https://your-app-domain.com"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Deployment

#### Option 1: Vercel + Neon + Upstash

1. Deploy to Vercel: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/shopify-form-builder)
2. Create Neon PostgreSQL database
3. Create Upstash Redis instance
4. Configure environment variables in Vercel

#### Option 2: Render

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

## Usage

### Admin Dashboard

1. Navigate to `/admin` for the main dashboard
2. Create forms in `/admin/forms/new`
3. Configure settings in `/admin/settings`
4. Monitor submissions in `/admin/submissions`

### Storefront Integration

1. In Shopify admin, go to Online Store > Themes
2. Click "Customize" on your active theme
3. Add the "Form Builder" block to any section
4. Enter the form slug (e.g., "customer-registration")
5. Save and publish

### API Endpoints

- **Public Form Access**: `/apps/form-builder/forms/{slug}`
- **Form Submission**: `/api/forms/{slug}/submit`
- **Admin APIs**: `/api/admin/*`

## Customer Data Flow

1. Customer fills out form on storefront
2. Server validates submission data
3. Bestellnummer ID generated with collision checking
4. Shopify Customer created/updated with:
   - Metafields: `custom.social_name`, `custom.bestellnummer_id`
   - Tags: Social Name value, Bestellnummer ID value
5. Email confirmation sent (if enabled)
6. Webhook notification sent (if configured)
7. Submission stored in app database

## Form Templates

The app includes pre-built templates:
- **Customer Registration**: Basic customer signup with required fields
- **Lead Capture**: Simple lead generation form
- **Event RSVP**: Event registration with additional fields

## Bestellnummer ID Details

- **Generation**: Cryptographically secure random numbers
- **Length**: 4-10 digits (merchant configurable)
- **Format**: Optional prefix + digits + optional suffix
- **Uniqueness**: Checked against Shopify customers via tags and metafields
- **Collision Handling**: Up to 20 retry attempts with Redis reservation
- **Display**: Read-only field in forms, auto-populated after generation

## Security Features

- HMAC signature verification for App Proxy requests
- Rate limiting (configurable per minute)
- Input validation with Zod schemas
- CSRF protection for admin pages
- Honeypot and reCAPTCHA spam protection
- Secure customer data handling

## Monitoring & Debugging

- **Admin Logs**: View API errors and Shopify responses
- **Submission Analytics**: Track form performance
- **Rate Limit Monitoring**: Monitor spam and abuse
- **Error Logging**: Comprehensive error tracking

## License

MIT License - see LICENSE file for details.

## Support

For support, please contact [your-support-email] or create an issue in the repository.