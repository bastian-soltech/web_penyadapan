# Kebun Glantangan Management System (web_rekap_penyadap)

Comprehensive management platform for rubber tree tapping operations at Kebun Glantangan, built with Next.js and Supabase.

## Project Overview

*   **Purpose:** To manage and monitor rubber tree tapping activities, including block management, tree inventory, tapper performance, and quality assessments.
*   **Main Technologies:**
    *   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4, DaisyUI 5.
    *   **Backend/Database:** Supabase (Auth, PostgreSQL, SSR).
    *   **Data Visualization:** Recharts.
    *   **File Handling:** `xlsx` for Excel operations, `jspdf` for PDF generation.
    *   **Integrations:** Google Sheets API.

## Architecture

The project follows the Next.js App Router architecture:

*   `src/app/`: Contains the main application routes, pages, and API endpoints.
    *   `api/`: Server-side API routes for handling data operations (CRUD for blocks, trees, tappers, and assessments).
    *   `dashboard/`: Authenticated area for management tasks.
    *   `login/`: Authentication entry point.
    *   `components/`: Reusable React components (modals, tables, cards).
    *   `lib/`: Core utilities including Supabase clients (`supabaseClient.js`, `supabaseServer.js`), middleware, and field definitions.
*   `public/`: Static assets like images and SVG icons.

## Database Schema (Supabase/PostgreSQL)

Key tables defined in `penyadapan_pohon.sql`:
*   `profiles`: User profiles linked to Supabase Auth.
*   `tabel_blok`: Management of plantation blocks.
*   `tabel_pohon`: Inventory of rubber trees assigned to blocks.
*   `tabel_penyadap`: List of tappers.
*   `tabel_penilaian`: Detailed quality assessments for tapping activities.
*   `tabel_rekap_penilaian`: Summarized assessment records.

## Key Features

1.  **Authentication:** Secure login using Supabase Auth, managed via middleware for session persistence.
2.  **Dashboard:** High-level overview of plantation status and performance.
3.  **Assessment System:** Tools for recording and scoring various tapping parameters (e.g., cut depth, bark usage, cleanliness).
4.  **Data Management:** CRUD operations for blocks, tappers, and trees.
5.  **Import/Export:** Support for importing tapper data from Excel and exporting reports to PDF/Excel.
6.  **Google Sheets Sync:** Integration with Google Spreadsheets for data synchronization.

## Building and Running

### Prerequisites
*   Node.js (latest LTS recommended)
*   Supabase Project (URL and Anon Key required in `.env`)

### Commands
*   `npm run dev`: Starts the development server with Turbopack.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Runs ESLint for code quality checks.

## Development Conventions

*   **Styling:** Use Tailwind CSS 4 utility classes and DaisyUI components.
*   **Database Access:** 
    *   Use `src/app/lib/supabaseClient.js` for client-side interactions.
    *   Use `src/app/lib/supabaseServer.js` for Server Components and API routes.
*   **API Routes:** Follow the structured routing in `src/app/api/` for all backend logic.
*   **Naming:** Maintain the existing naming convention (e.g., `tabel_` prefix for database-related symbols in Indonesian).


# System Role
You are an expert developer, software engineer and designer. You must always adhere to the following rules:

# Design Constraints
- Minimalism: Design must be clean and functional.
- Theme Alignment: Align every visual element with the project theme.
- Gradients: Strictly AVOID excessive or garish gradients. Use subtle gradients or solid colors only.

# Coding Standards
- Clean Code: Write readable, maintainable, and well-named code.
- Functional: Focus on functional programming and predictable input/output.
- DRY: Strictly apply the DRY principle. Refactor repetitive code into reusable modules.

# Operational Logic
- Before providing any output, verify: "Is this minimal, clean, functional, and DRY?"


