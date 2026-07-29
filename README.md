# 🚀 Just-In — AI-Powered Attendance & Employee Management System

**Just-In** is an automated attendance and workforce management backend powered by FastAPI, PostgreSQL, and deep learning facial recognition. It provides secure employee onboarding, facial encoding generation, anti-duplicate check-in protection, and real-time verification.

---

## ✨ Features

* **🔐 Authentication & RBAC**: JWT-based authentication with role-based access control (Admin, Employee).
* **👥 Employee Management**: Full CRUD operations for managing employee profiles, departments, and roles.
* **📸 AI Face Registration**: Single-face detection validation, 128-dimensional embedding generation, and automated pickle storage.
* **🤖 Smart Attendance Check-In**: Instant facial verification against stored embeddings for automated check-ins.
* **🛡️ Duplicate Check-In Protection**: Prevents multiple check-in entries on the same day.
* **🚪 Seamless Check-Out**: Tracks total shift duration with automated timestamp recording.
* **🗃️ Database Migrations**: Schema evolution tracked using Alembic and PostgreSQL.

---

## 📂 Folder Structure

```text
backend/
├── alembic/              # Database migration scripts
├── app/
│   ├── ai/               # Facial detection, encoding, & comparator modules
│   │   ├── comparator.py
│   │   ├── detector.py
│   │   ├── encoder.py
│   │   └── face_service.py
│   ├── api/              # API route definitions
│   │   ├── v1/
│   │   │   ├── attendance.py
│   │   │   ├── auth.py
│   │   │   ├── employees.py
│   │   │   ├── health.py
│   │   │   └── users.py
│   │   └── dependencies.py
│   ├── core/             # Security, JWT, hashing & app configs
│   ├── db/               # Database session & ORM dependencies
│   ├── models/           # SQLAlchemy ORM models
│   ├── repositories/     # Data Access Layer (Repository pattern)
│   ├── schemas/          # Pydantic schemas for request/response validation
│   ├── services/         # Business logic layer
│   └── main.py           # FastAPI entry point & router setup
├── scripts/              # Database seeding scripts (e.g., admin seed)
├── uploads/              # Local storage for profile images & face encodings
│   ├── encodings/
│   └── profiles/
├── .env                  # Environment variables
├── alembic.ini           # Alembic config file
├── requirements.txt      # Python dependencies
└── README.md             # Project documentation

```

---

## 🛠️ Technologies Used

* **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
* **Database**: [PostgreSQL](https://www.postgresql.org/)
* **ORM & Migrations**: [SQLAlchemy](https://www.sqlalchemy.org/) & [Alembic](https://alembic.sqlalchemy.org/)
* **Computer Vision & AI**: [OpenCV](https://opencv.org/), [dlib](http://dlib.net/), `face_recognition`, NumPy
* **Security**: Passlib (Bcrypt), PyJWT, OAuth2
* **Server**: Uvicorn

---

## 🚀 Installation & Setup

### 1. Prerequisites

* Python 3.10+
* PostgreSQL installed and running locally/remotely
* C++ Build Tools (required for `dlib`)

### 2. Clone Repository

```cmd
git clone [https://github.com/darshanpkumar/Just-In.git](https://github.com/darshanpkumar/Just-In.git)
cd Just-In/backend

```

### 3. Create & Activate Virtual Environment

```cmd
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

```

### 4. Install Dependencies

```cmd
pip install -r requirements.txt

```

### 5. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/justin_db
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

```

### 6. Run Migrations & Seed Database

```cmd
alembic upgrade head
python -m scripts.seed_admin

```

### 7. Run Server

```cmd
uvicorn app.main:app --reload

```

Server running at: `http://127.0.0.1:8000`

Swagger API Documentation: `http://127.0.0.1:8000/docs`

---

## 📡 API Endpoints Summary

### 🔑 Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/auth/login` | User login & JWT token generation |

### 👥 Employees

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/employees/` | Retrieve all employees |
| `POST` | `/api/v1/employees/` | Create new employee profile |
| `GET` | `/api/v1/employees/{id}` | Get employee details by ID |
| `PUT` | `/api/v1/employees/{id}` | Update employee record |
| `DELETE` | `/api/v1/employees/{id}` | Soft delete employee |
| `POST` | `/api/v1/employees/{id}/register-face` | Register face profile & generate `.pkl` encoding |

### ⏱️ Attendance

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/attendance/check-in` | Facial recognition check-in (Duplicate protection enabled) |
| `POST` | `/api/v1/attendance/check-out` | Mark employee check-out timestamp |

---

## 🔮 Future Scope

* **Liveness Detection**: Integrate anti-spoofing techniques (blink detection, depth estimation) to prevent photo/video spoof attacks.
* **Geofencing & IP Restriction**: Ensure attendance can only be marked within specific office premises or trusted networks.
* **Analytics Dashboard**: Real-time insights into late arrivals, total working hours, and monthly attendance trends.
* **Mobile Application**: Cross-platform Flutter/React Native integration for mobile check-ins.

```

---

Save the file and push it to GitHub:
```cmd
git add README.md
git commit -m "docs: add comprehensive README.md documentation"
git push origin main

```