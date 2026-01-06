# Midnight: Personal Life Operating System (PLOS)

> "Systems over motivation."

**Midnight** is an intelligent resource orchestrator designed to align tasks with energy levels and time constraints. It moves beyond simple to-do lists by integrating habit tracking, media consumption, and project management into a single, cohesive dashboard.

## 🚧 Project Status: v0.2 Beta (Secured)

The core pillars are functional, and the system is now secured with a dual-authentication strategy.

### ✅ Completed Modules

- **Authentication (NEW):**
  - **Clerk Auth:** Secure, user-based access for production.
  - **Dev Bypass:** "Backdoor" access for local development via `/dev-login`.
- **Resource Orchestrator:**
  - **Time Grid:** 48-block interactive daily grid.
  - **The Link (NEW):** Click-to-assign functionality to schedule Habits and Projects directly onto the grid.
- **Habits Module:** Daily tracking with recurrence/frequency settings.
- **Media Backlog:** Kanban-style workflow (Backlog → In Progress → Completed).
- **Projects Module:** Sprint-based project tracking.
- **Database:** PostgreSQL with **Self-Healing User Sync** (automatically creates User records on first action).

### ⏳ In Progress / Roadmap

- **Energy Engine:** Algorithm to match high-energy tasks to peak performance hours.
- **Analytics:** Visualizing consistency and resource allocation over time.
- **Mobile PWA:** Responsive mobile interface.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **ORM:** Prisma v5
- **Auth:** Clerk + Custom Middleware Abstraction
- **Styling:** Tailwind CSS 4 + Radix UI
- **Infrastructure:** Docker Compose

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/midnight-plos.git
cd midnight-plos
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment

Create a `.env` file in the root:

```bash
# Database (Docker default)
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/plos_db?schema=public"

# Clerk Authentication (Get these from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Dev Bypass (Optional)
ADMIN_PASSWORD="midnight-override"
```

### 4. Initialize Database

```bash
# Start the DB container
docker-compose up -d

# Push schema
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to sign in via Clerk.
Visit `http://localhost:3000/dev-login` to sign in via Admin Password.

---

## 🔗 Architecture Overview

- `src/app/` - Next.js App Router structure.
- `src/lib/auth.ts` - **Auth Abstraction Layer** (Handles Clerk vs. Dev Token logic).
- `src/middleware.ts` - Edge protection logic.
- `src/features/` - Core logic for Scheduler, Habits, etc.

---
*Architected by Lucifer.*
