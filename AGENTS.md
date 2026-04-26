<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Progress: Authentication
- Completed full signup/login flow.
- Database: CockroachDB with Prisma 6.3.0.
- Schema: `User` model includes `email`, `password`, `name`, and `address`.
- Frontend: `AuthModal` handles state and API calls. `Navbar` and `Compte` page are session-aware.
- Providers: `AuthProvider` wraps the root layout for session management.

