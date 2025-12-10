# Midnight (v2)

**Intelligent Resource Orchestrator & Personal Life Operating System (PLOS)**

Midnight is a modular monolith designed to solve the "Student Entropy" problem. Unlike standard to-do lists, it acts as an operating system for personal resources, using algorithms to match tasks to current energy levels and time constraints.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL 15 (Dockerized)
- **ORM:** Prisma v5 (Stable)
- **Styling:** Tailwind CSS + Custom Dashboard Shell

## 🏗 Architecture

The project follows a **Feature-Sliced Design** to ensure modular independence:

- `features/scheduler`: The core logic engine (Resource Orchestrator).
- `features/habits`: Habit tracking and consistency algorithms.
- `features/media`: Backlog management for games and movies.
- `features/projects`: Agile-style sprint management for personal work.

## ⚡ Getting Started

1. **Clone the repo**
2. **Start Docker:** `docker-compose up -d`
3. **Install dependencies:** `npm install`
4. **Run the development server:** `npm run dev`

---

## 🛠️ Developer Setup Guide (For Team Members)

Follow these steps strictly to get the **Midnight** environment running locally.

### 1. Prerequisites

- **Node.js (LTS)** & **npm**
- [cite_start]**Docker Desktop** (Must be running for the database) [cite: 39]
- **VS Code** (Recommended IDE)

### 2. Installation

````bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/midnight.git](https://github.com/YOUR_USERNAME/midnight.git)
cd midnight

# 2. Install dependencies
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
