# Midnight: Personal Life Operating System (PLOS)

> "Systems over motivation."

**Midnight** is an intelligent resource orchestrator designed to align tasks with energy levels and time constraints. It moves beyond simple to-do lists by integrating habit tracking, media consumption, and project management into a single, cohesive dashboard.

## 🚧 Project Status: v0.1 Alpha (Early Development)

The core pillars of the system are currently functional in a "bare bones" state.

### ✅ Completed Modules
- **Resource Orchestrator:** 48-block daily time grid visualization (Server Actions + Prisma).
- **Habits Module:** Daily tracking with "Mark Complete", "Edit", and "Delete" functionality.
- **Media Backlog:** workflow for Games/Movies (Backlog → In Progress → Completed/Dropped).
- **Projects Module:** Sprint-based project tracking with active/completed filtering.
- **Database:** PostgreSQL schema with self-healing user creation ("Lucifer Demo" mode).

### ⏳ In Progress / Roadmap
- **The Link:** Drag-and-drop assignment of Tasks to the Time Grid.
- **Energy Engine:** Algorithm to match high-energy tasks to peak performance hours.
- **Authentication:** Migration from demo user to secure Auth (Clerk/NextAuth).
- **Analytics:** Visualizing consistency and resource allocation over time.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **ORM:** Prisma v5
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

```
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/plos_db"
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

Visit `http://localhost:3000` to see the dashboard.

---

## 📝 Development Notes

- **Demo Mode:** The system currently uses `lucifer-demo-id` as the hardcoded user. This enables rapid testing without authentication.
- **Self-Healing:** User creation is handled via `upsert` in server actions, so you can create habits/media/projects without explicit user setup.
- **Database:** PostgreSQL runs in Docker. Ensure Docker Desktop is running before starting the app.

---

## 🔗 Architecture Overview

- `src/app/` - Next.js app structure (pages, layouts, actions)
- `src/components/` - Reusable React components (UI + dashboard)
- `src/features/` - Feature modules (habits, media, projects, scheduler)
- `src/lib/` - Utilities and database client (Prisma)
- `prisma/` - Schema and migrations

npm install

Here is the complete, ready-to-copy block to paste at the very bottom of your README.md. It includes the specific Docker instructions and the environment variables defined in your Handoff Report.



Markdown

---

## 🛠️ Developer Setup Guide (For Team Members)

Follow these steps strictly to get the **Midnight** environment running locally.

### 1. Prerequisites
- **Node.js (LTS)** & **npm**
- [cite_start]**Docker Desktop** (Must be running for the database) [cite: 39]
- **VS Code** (Recommended IDE)

### 2. Installation
```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/midnight.git](https://github.com/YOUR_USERNAME/midnight.git)
cd midnight

# 2. Install dependencies
npm install
3. Environment Configuration
Create a .env file in the root directory and paste this exact connection string (matches our Docker container):

Code snippet

DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/plos_db?schema=public"
4. Start the Database
We use Docker to run PostgreSQL isolated from your system.

Bash

# Start the database container (plos-db)
docker-compose up -d
5. Sync Database Schema
Once Docker is running, create the tables (User, Habit, MediaItem, Project) in the database:

Bash

# Push the schema to the local Docker DB
npx prisma db push
6. Launch Application
Bash

npm run dev
---
*Architected by Lucifer.*
````
