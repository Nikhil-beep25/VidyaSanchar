# 🎓 VidyaSanchar – Student Management System ERP

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Nikhil-beep25/VidyaSanchar?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/Nikhil-beep25/VidyaSanchar?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/Nikhil-beep25/VidyaSanchar?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/Nikhil-beep25/VidyaSanchar?style=for-the-badge)

### 🚀 Modern School ERP & Student Management System

**A full-stack School ERP platform designed to simplify administration, student management, fee collection, attendance tracking, examinations, and communication between schools, teachers, students, and parents.**

🌐 **Live Demo:** https://vidya-sanchar.vercel.app

</div>

---

# 📖 Overview

VidyaSanchar is a modern web-based School ERP solution that streamlines day-to-day school operations. It provides dedicated dashboards for administrators, teachers, students, and parents while keeping academic and administrative workflows organized in one place.

---

# ✨ Features

## 👨‍💼 Admin

- Dashboard
- Student Management
- Teacher Management
- Class & Section Management
- Fee Management
- Attendance Management
- Exam Management
- Subject Management
- Reports & Analytics
- User Management

---

## 👨‍🏫 Teacher

- Teacher Dashboard
- Student Attendance
- Student Records
- Exam Marks
- Class Management
- Profile Management

---

## 👨‍🎓 Student

- Student Dashboard
- Attendance History
- Fee Details
- Exam Results
- Academic Information
- Profile

---

## 👨‍👩‍👧 Parent

- Child Information
- Attendance Tracking
- Fee Status
- Academic Progress
- Exam Results

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- REST API

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → PostgreSQL

---

# 📂 Project Structure

```
VidyaSanchar/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── package.json
│
├── docker-compose.yml
├── render.yaml
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/Nikhil-beep25/VidyaSanchar.git
```

```
cd VidyaSanchar
```

---

# Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

---

# Run Development Server

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

---

# 📊 Modules

- Student Management
- Teacher Management
- Parent Management
- Class Management
- Attendance
- Fee Management
- Examination
- Dashboard
- Reports
- Authentication
- Profile Management

---

# 🔒 Security

- JWT Authentication
- Password Encryption
- Protected Routes
- Role-Based Access Control
- Secure REST APIs

---

# 📸 Screenshots

> Add screenshots of your application here.

Example:

```
screenshots/
├── login.png
├── dashboard.png
├── students.png
├── attendance.png
├── fees.png
```

---

# 🚀 Deployment

### Frontend

Vercel

### Backend

Render

### Database

PostgreSQL

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

## Nikhil Bhadauriya

Full Stack Developer

GitHub:
https://github.com/Nikhil-beep25

---

## ⭐ Support

If you like this project, don't forget to ⭐ Star the repository.

Made with ❤️ by **Nikhil Bhadauriya**
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
