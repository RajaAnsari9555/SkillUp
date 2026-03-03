🚀 SkillUp – AI Powered Course Selling Platform

SkillUp is a full-stack course marketplace where Students can enroll in courses and Educators can create, manage, and sell their courses.

The platform integrates AI-powered course search to help students find the most relevant courses quickly and efficiently.

📌 Features
👨‍🎓 Student Features

Secure Authentication (Register / Login)

Browse & Search Courses

🤖 AI-Powered Smart Search

Enroll in Courses

View Enrolled Courses Dashboard

Track Learning Progress

Responsive UI

👨‍🏫 Educator Features

Secure Login / Registration

Create & Publish Courses

Upload Course Content (Videos, Descriptions, Pricing)

Edit & Delete Courses

Manage Enrollments

View Course Performance

🤖 AI Integration

Smart course search using AI

Natural language search (e.g., “Best beginner web development course”)

Relevant course recommendations

🛠️ Tech Stack
Frontend

React.js

Tailwind CSS

Axios

React Router

Backend

Node.js

Express.js

MongoDB

JWT Authentication

AI Integration

OpenAI API (or any AI search integration used)

🗂️ Project Structure
SkillUp/
│
├── Fronted/        # Frontend (React)
├── server/        # Backend (Node + Express)
├── models/        # Database Models
├── routes/        # API Routes
├── controllers/   # Business Logic
└── README.md
🔐 Authentication & Authorization

JWT-based authentication

Role-based access control:

Student

Educator

Protected Routes

📊 Core Functionalities
Feature	Student	Educator
Register/Login	✅	✅
Browse Courses	✅	❌
Enroll in Course	✅	❌
Create Course	❌	✅
Edit/Delete Course	❌	✅
AI Search	✅	✅
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/SkillUp.git
cd SkillUp
2️⃣ Setup Backend
cd Backend
npm install
npm run dev
3️⃣ Setup Frontend
cd Fronted
npm install
npm run dev
🌍 Environment Variables

Create a .env file in the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
🎯 Future Improvements

Payment Gateway Integration (Stripe/Razorpay)

Course Reviews & Ratings

Live Classes Integration

Certificates Generation

Admin Dashboard

Advanced AI Recommendations



📌 Why SkillUp?

SkillUp provides:

Seamless course management

AI-enhanced learning discovery

Secure and scalable architecture

Clean and responsive UI

👨‍💻 Author

MD Raja Ansari
MERN Stack Developer
