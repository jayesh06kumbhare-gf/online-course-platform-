# LearnSphere — Online Course Platform Management System

[![Django](https://img.shields.io/badge/Django-5.0+-092e20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **Learn New Skills. Build Your Future.**  
> A full-stack, enterprise-grade EdTech SaaS platform where students discover practical courses, master career skills in a distraction-free learning studio, take interactive quizzes, and earn cryptographically verifiable digital certificates. Instructors organize modular curricula, while administrators govern course approvals, user accounts, and platform analytics.

---

## 🌟 Key Features

### 🎓 1. Student Learning Journey
- **Personalized Student Dashboard**: Real-time tracked statistics including total enrolled courses, in-progress coursework, completed courses, and calculated learning hours.
- **"Continue Learning" Spotlight**: Automatically resumes from the student's last accessed lesson with live progress bar and instant launch button.
- **Distraction-Free Learning Player**: High-definition video stream or lecture guide, structured module curriculum sidebar, previous/next lesson navigation, downloadable resource attachments, and automatic progress saving.
- **Interactive Quiz Engine**: Multi-question assessments with automated backend grading, passing thresholds, explanations, and retry limits.
- **Cryptographic Digital Certificates**: Automatically unlocked and generated upon 100% curriculum completion, featuring an authentic printable layout, official academy seal, and a unique verifiable UUID.
- **Course Wishlist & Bookmarking**: One-click heart bookmarking with instant synchronization.
- **Student Reviews & Ratings**: Submit ratings and detailed feedback for completed courses.

### 👨‍🏫 2. Instructor Studio
- **Instructor Dashboard**: Overview of authored courses, total active students, gross course revenue, and average student ratings.
- **Visual Analytics**: Interactive Recharts bar graph displaying student distribution across courses.
- **Course Authoring Wizard**: Draft courses with rich descriptions, categories, difficulty levels, pricing, tags, prerequisites, and learning outcomes.
- **Curriculum & Lesson Builder**: Organize courses into modules and lessons with video streaming links, duration, lecture notes, and free preview flags.
- **Submission Workflow**: Save courses as drafts and submit them for administrator approval.

### 🛡️ 3. Administrator Console
- **Platform Analytics**: Global KPIs covering total registered students, verified instructors, published vs pending courses, gross revenue, and live enrollment feeds.
- **Course Moderation Queue**: Dedicated queue to review instructor-submitted courses with one-click **Approve & Publish**, **Reject**, or **Unpublish** actions.
- **User Directory**: Central directory of all users with role-based filtering (Students, Instructors, Admins).
- **Curriculum Taxonomy**: Create and manage course categories, color codes, and discovery classifications.

---

## 👥 Demo Accounts & Credentials

The platform includes pre-seeded demo accounts for instant evaluation:

| Role | Email | Password | Primary Persona |
| :--- | :--- | :--- | :--- |
| **Platform Administrator** | `admin@learnsphere.com` | `AdminPassword123!` | Academic Director (Approves courses, monitors analytics) |
| **Lead Instructor** | `marcus.vance@learnsphere.com` | `InstructorPassword123!` | Staff Full-Stack Engineer (Web Development tracks) |
| **Research Instructor** | `sarah.chen@learnsphere.com` | `InstructorPassword123!` | AI Research Scientist (Deep Learning & NLP tracks) |
| **Active Student** | `alex.rivera@learnsphere.com` | `StudentPassword123!` | Enrolled student (Has earned certificate & in-progress courses) |
| **New Student** | `priya.patel@learnsphere.com` | `StudentPassword123!` | Enrolled in AI & Data Science coursework |

> 💡 **Quick Testing Tip**: The web app includes a 1-click **Demo Login Widget** in the navigation bar and on the login page for instant role switching without manual typing!

---

## 🏗️ System Architecture

```
learnsphere/
├── backend/                       # Python Django REST Framework
│   ├── learnsphere/               # Core configuration, settings, URLs
│   ├── accounts/                  # Custom User model, JWT auth, profiles
│   ├── courses/                   # Courses, Categories, Modules, Lessons, Bookmarks
│   ├── enrollments/               # Student Enrollments & Lesson Progress tracking
│   ├── quizzes/                   # Quiz engine, Questions, Choices, Attempt scoring
│   ├── certificates/              # Certificate generation & public UUID verification
│   ├── reviews/                   # Course reviews & automatic rating aggregations
│   ├── notifications/             # In-app notifications & alerts
│   ├── seed_data.py               # Database seeder (11 courses, modules, lessons, users)
│   ├── requirements.txt           # Python dependencies
│   └── manage.py
│
├── frontend/                      # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/            # Navbar, Footer, CourseCard, DashboardLayout, ProtectedRoute
│   │   ├── context/               # AuthContext with demo role switching & JWT persistence
│   │   ├── pages/                 # Home, Catalog, Detail, Learning Player, Quiz, Dashboards
│   │   ├── services/              # API client with token refresh & endpoint definitions
│   │   ├── types/                 # TypeScript type interfaces
│   │   └── App.tsx                # Role-based application routing
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### Step 1: Backend Setup (Django)

1. Open a terminal in the project directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
   python manage.py migrate
   ```

5. Seed the database with realistic demo courses, instructors, students, and certificates:
   ```bash
   python seed_data.py
   ```

6. Start the Django API server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   *The REST API will be accessible at `http://127.0.0.1:8000/api/`*

---

### Step 2: Frontend Setup (React + Vite)

1. Open a new terminal window:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser at `http://127.0.0.1:5173/`*

---

## 🧪 Testing

### Backend Test Suite
Run the automated Django test suite to verify authentication, role permissions, enrollment progress, and certificate generation:
```bash
cd backend
python manage.py test accounts
```
*Expected result: 5 tests passed with 100% OK.*

### Frontend Production Build Test
Verify TypeScript compilation and bundling:
```bash
cd frontend
npm run build
```
*Expected result: Successful bundle compilation with 0 TypeScript or linting errors.*

---

## 📡 REST API Reference

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/api/auth/register/` | `POST` | Register as a Student or Instructor | No |
| `/api/auth/login/` | `POST` | Authenticate and obtain JWT token pair | No |
| `/api/auth/me/` | `GET/PATCH` | Retrieve or update current user profile | Yes |
| `/api/courses/` | `GET` | List published courses with search & filters | No |
| `/api/courses/featured/` | `GET` | List curated featured courses | No |
| `/api/courses/<slug>/` | `GET` | Retrieve course details and full syllabus | No |
| `/api/courses/instructor/` | `GET/POST`| Instructor courses list and course creation | Instructor |
| `/api/courses/instructor/<id>/publish/` | `POST` | Submit for review / Admin approve or reject | Instructor / Admin |
| `/api/courses/analytics/admin/` | `GET` | Global platform metrics and revenue analytics | Admin |
| `/api/courses/analytics/instructor/` | `GET` | Instructor course performance analytics | Instructor |
| `/api/enrollments/enroll/` | `POST` | Enroll in a free or paid course | Yes |
| `/api/enrollments/my/` | `GET` | List authenticated student enrollments | Yes |
| `/api/enrollments/progress/<slug>/` | `POST`| Mark lesson completed & update progress % | Yes |
| `/api/enrollments/dashboard/` | `GET` | Student dashboard statistics | Yes |
| `/api/quizzes/<id>/submit/` | `POST` | Submit quiz answers and obtain score | Yes |
| `/api/certificates/my/` | `GET` | List earned student certificates | Yes |
| `/api/certificates/verify/<uuid>/` | `GET` | Public cryptographic certificate verification | No |
| `/api/reviews/course/<slug>/` | `GET/POST`| Fetch reviews or post course feedback | Public / Enrolled |
| `/api/notifications/` | `GET` | In-app user notifications | Yes |

---

## ☁️ Deploying on Vercel

LearnSphere is pre-configured for seamless deployment on [Vercel](https://vercel.com/):

### Option 1: Unified Single-Project Deployment (Recommended)
1. Import this repository into Vercel.
2. Vercel automatically detects the root `vercel.json` and builds both:
   - **Frontend**: Built via `@vercel/static-build` using Vite & TypeScript.
   - **Backend API**: Deployed as Python Serverless Functions via `@vercel/python` (`/api/*` routed to `api/index.py`).
3. Set the following Environment Variables in your Vercel Project Settings:
   - `SECRET_KEY`: A strong random string for production Django security.
   - `DEBUG`: `False` (for production)
   - `DATABASE_URL` *(Optional)*: PostgreSQL connection string (e.g. from Neon, Supabase, or Railway). If omitted, the pre-seeded SQLite database with all demo courses will be used automatically.
4. Click **Deploy**.

### Option 2: Split Deployments (Frontend & Backend Separate)
- **Frontend on Vercel**: Set Root Directory to `frontend`. Add environment variable `VITE_API_URL=https://your-backend-domain.com`.
- **Backend on Vercel / Railway / Render**: Deploy the Django backend and set `CORS_ALLOWED_ORIGINS` to your frontend's Vercel domain.

---

## 📄 License
This project is licensed under the MIT License. Built for real-world EdTech product demonstration.
