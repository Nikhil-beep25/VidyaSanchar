# VidyaSanchar - Student Management System ERP

VidyaSanchar is a modern, scalable, enterprise-grade school enterprise resource planning (ERP) system designed primarily for Indian schools, colleges, universities, and coaching institutes. It is built entirely on free and open-source technologies.

---

## 🛠️ Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, React Router v6, TanStack React Query
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL (containerized)
- **Authentication**: JWT Access tokens (in-memory) & Refresh tokens (HTTP-only cookies), bcrypt hashing, Role-Based Access Control (RBAC)
- **Infrastructure**: Docker, Docker Compose, Nginx (routing & proxy)
- **Documentation**: Swagger/OpenAPI 3.0

---

## 📁 Project Structure

```
.
├── docker-compose.yml           # Multi-container orchestration
├── README.md                    # Setup documentation
├── backend/
│   ├── Dockerfile               # Backend Docker build layers
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma        # Database relational models
│   │   └── seed.ts              # Seeding script with Indian context
│   └── src/
│       ├── index.ts             # Express application entry
│       ├── config/              # Environment & DB clients
│       ├── controllers/         # API business controllers
│       ├── middlewares/         # JWT parsing & RBAC role checks
│       ├── routes/              # Express API route maps
│       ├── swagger/             # OpenAPI json schemas
│       └── utils/               # JWT & bcrypt hashing helpers
└── frontend/
    ├── Dockerfile               # React + Nginx proxy image compiler
    ├── nginx.conf               # Nginx reverse proxy configuration
    ├── package.json
    ├── tailwind.config.js
    ├── src/
    │   ├── App.tsx              # Routing and Provider registrations
    │   ├── main.tsx
    │   ├── index.css            # Stylesheets, Dark/Light custom variables
    │   ├── components/layout/   # Landing and Dashboard layout wrappers
    │   ├── context/             # Auth context (silent refresh loops) & Themes
    │   ├── lib/api.ts           # Fetch client with auto refresh handler
    │   ├── routes/              # Public/Private Protected routing configs
    │   └── pages/
    │       ├── landing/         # Marketing site pages
    │       └── dashboard/       # SuperAdmin, Admin, Teacher, Student, Parent dashboards
```

---

## 🚀 How to Run the Production Stack

### Prerequisites
Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### Step 1: Start the Docker Containers
In the root directory, run:
```bash
docker-compose up --build -d
```
This will compile and spin up:
- **db**: PostgreSQL database container (port `5432` mapped internally).
- **backend**: Express API container (port `5001` mapped locally).
- **frontend**: React client served via Nginx (port `80` mapped locally).

### Step 2: Run Database Migrations
Create the PostgreSQL database tables using Prisma ORM:
```bash
docker-compose exec backend npx prisma migrate dev --name init
```

### Step 3: Seed Database with Mock Data
Populate the database with realistic Indian educational data (subjects, timetables, attendances, fees):
```bash
docker-compose exec backend npm run prisma:seed
```

---

## 🔑 Verification & Test Credentials

The portal client will load at **[http://localhost](http://localhost)**. 
Open the portal login page and use the following test accounts:

**Default Password for all accounts**: `Password@123`

| Role | Login Email | Description / Visual Highlights |
|---|---|---|
| **Admin** | `admin@sms.edu.in` | Manage student/teacher lists, collect UPI/Cash dues, issue library books. |
| **Teacher** | `ramesh.verma@sms.edu.in` | Mark daily attendance, grade exams, view teaching timetable schedules. |
| **Student** | `aarav.sharma@student.sms.edu.in` | Check attendance charts, view outstanding dues, view report cards. |
| **Parent** | `anil.sharma@parent.sms.edu.in` | Monitor child's progress calendar, review class exam records, and view fee receipts. |

---

## 📖 API Documentation
You can explore, test, and run sandbox queries against the backend endpoints via the Swagger UI panel:
- URL: **[http://localhost:5001/api-docs](http://localhost:5001/api-docs)**
- Security: Uses Bearer Authorization. Log in via `/api/auth/login` to obtain an Access Token, then paste it in the "Authorize" dialog.
