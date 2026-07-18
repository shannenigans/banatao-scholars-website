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
- **Database and auth**: Supabase (PostgreSQL)
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

3. Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_server-only_service_role_key"

# Canonical application origin (required in production unless VERCEL_URL is set)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. Run the development server:
```bash
npm run dev
```

The service-role key is used only by the server-side sign-up action to verify
the email allowlist. Never expose it through a `NEXT_PUBLIC_*` variable.

In Supabase Auth, add each deployed origin's `/auth/callback` URL to the allowed
redirect URLs. Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin;
preview deployments can fall back to Vercel's `VERCEL_URL`.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run db:test
```

Database migrations and policy tests live under `supabase/`. With Docker
running, use `npx supabase start` followed by `npm run db:test`. After changing
a migration, run `npm run db:types` and commit the regenerated
`app/types/database.generated.ts` file.

## 🔒 Protected Routes

The application uses a protected routes system under the `(protected)` directory. Users must be authenticated to access these routes.

### Proxy Authentication

The application implements route protection using the Next.js proxy plus
server-side layout guards:

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
The first row is treated as a header. Data rows must use this positional column
order (optional fields may be blank):

1. Status
2. Graduation year
3. First name
4. Middle name
5. Last name
6. School
7. Major
8. Email
9. Old emails
10. Cell phone
11. School phone
12. Home phone
13. School address
14. School address line 2
15. School city
16. School state
17. School ZIP
18. Home address
19. Home city
20. Home state
21. Home ZIP
22. Parents
23. Parents' contact information
24. Current address
25. Current city
26. Current state
27. Current ZIP
28. Current phone
29. Role or description
30. Company
31. Bio

Imports are limited to 1,000 records, 31 columns, and 5 MB. The server validates
every field and rejects duplicate or invalid email addresses before writing.

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request and add @shannenigans as a reviewer

## 📝 License

MIT License

## 👥 Contact

Shannen Barrameda - sbarrameda17@gmail.com
Alex Kim - akim04@outlook.com

---

## 📋 Deployment

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Connect your repository to Vercel:
   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your Git repository
   - Vercel will automatically detect your Next.js project

3. Configure environment variables:
   - Add all the environment variables listed in the Installation section
   - Make sure to set your production database URLs and credentials

4. Deploy:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once complete, you'll receive a deployment URL

5. Custom Domain (optional):
   - Go to your project settings
   - Navigate to "Domains"
   - Add and configure your custom domain

### Troubleshooting Deployment

If you encounter build errors during deployment:
- Check that all environment variables are correctly set in the Vercel dashboard
- Ensure your code passes the linting and type checking requirements
- Review the build logs for specific errors

## 🔄 Development Status

Deployed at https://banatao-scholars.org

## 🐛 Known Issues

Please check the [Issues](https://github.com/shannenigans/banatao-scholars-website/issues) page for current known issues and feature requests.
