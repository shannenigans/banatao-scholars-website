# Banatao Scholars Website

A web-based application built with Next.js for managing scholar information through file imports and data management.

## 🚀 Features

- Secure authentication system
- Admin dashboard for scholar management
- File upload support for .xlsx and .csv files
- Scholar profile update
- Scholar directory
- Data validation and error handling
- Toast notifications for user feedback

## 💻 Tech Stack

- **Frontend Framework**: Next.js
- **Language**: TypeScript
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **UI Components**: Custom UI components
- **Database**: PostgreSQL
- **File Processing**: XLSX, CSV via /admin/importScholarForm.tsx
- **Styling**: Tailwind CSS 

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/shannenigans/banatao-scholars-website.git
cd banatao-scholars-website
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
POSTGRES_URL="your_postgres_url"
POSTGRES_PRISMA_URL="your_postgres_prisma_url"
POSTGRES_URL_NON_POOLING="your_postgres_non_pooling_url"
POSTGRES_USER="your_postgres_username"
POSTGRES_PASSWORD="your_postgres_password"
POSTGRES_DATABASE="your_database_name"
POSTGRES_HOST="your_postgres_host"

# Supabase Configuration
SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
SUPABASE_JWT_SECRET="your_supabase_jwt_secret"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# Authentication
# Generate one here: https://generate-secret.vercel.app/32 (only required for localhost)
AUTH_SECRET="your_auth_secret"
```

4. Run the development server:
```bash
npm run dev
```

## 🔒 Protected Routes

The application uses a protected routes system under the `(protected)` directory. Users must be authenticated to access these routes.

### Middleware Authentication

The application implements route protection using Next.js middleware:

- All routes under `app/(protected)/*` require authentication
- Unauthenticated users are redirected to the login page
- Authentication state is managed through session cookies
- Role-based access control for admin routes
- Users need to be whitelisted to access the website. Currently only scholars are allowed to access the website.

## 📊 Data Import

The system supports importing scholar data through Excel (.xlsx) and CSV files. The import process includes:

1. File validation (type and size)
2. Data parsing and validation
3. Database storage
4. Error handling and user feedback

### Import File Format
The Excel or CSV file should contain the following columns:
- First Name
- Last Name
- Email
- Graduation Year
- Major
- University
- Current Job Title (optional)
- Current Company (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request and add @shannenigans as a reviewer

## 📝 License

MIT License

## 👥 Contact

Shannen Barrameda - sbarrameda17@gmail.com

---

## 🔄 Development Status

Awaiting deployment to Vercel.

## 🐛 Known Issues

Please check the [Issues](https://github.com/shannenigans/banatao-scholars-website/issues) page for current known issues and feature requests.