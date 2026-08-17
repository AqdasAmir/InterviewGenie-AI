# InterviewGenie-AI

[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5.2.1-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.7.1-13AA52?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![Google Generative AI](https://img.shields.io/badge/Google_GenAI-2.9.0-EA4335?style=flat-square&logo=google)](https://ai.google.dev)
[![Groq](https://img.shields.io/badge/Groq_API-1.5.0-FF5733?style=flat-square)](https://groq.com)
[![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**🚀 Try it live:** [Interview Genie Live Demo](https://interview-genie-ai.onrender.com)

---

## 📋 About the Project

**InterviewGenie-AI** is an intelligent, AI-powered interview preparation platform designed to help job seekers practice and excel in technical interviews. The application leverages cutting-edge AI technology to analyze user resumes, generate personalized interview strategies, and conduct realistic mock interviews with real-time feedback.

Users can upload their resume and provide a job description to receive an AI-generated interview preparation plan containing technical and behavioral questions and the user can generate ATS friendy resume according to that Job description. Additionally, they can participate in interactive mock interview sessions where they answer questions, receive immediate evaluation from AI models, and get detailed performance feedback with improvement suggestions.

---

## 🎯 Key Features

- **📤 Resume Upload & Analysis**  
  Upload your resume in PDF format or self description along with the job description and let AI analyze your skills, experience, and qualifications.

- **🎓 AI-Generated Interview Plans**  
  Generate personalized interview preparation strategies based on your resume, target job role, and job description.

- **📄 Resume PDF Generation**  
  Download an ATS friendly resume for target joob role in PDF format.

- **🤖 Interactive Mock Interview Sessions**  
  Practice with realistic interview questions in a simulated environment with AI-driven question generation.

- **📊 Real-time AI Evaluation**  
  Get instant scoring (0-10 scale) and detailed feedback on your answers after each question.

- **📈 Performance Analytics**  
  View overall performance metrics, average scores, and comprehensive feedback on completed mock interviews.

- **💾 Interview History**  
  Track all your interview preparation reports and mock interview sessions for progress monitoring.

- **🔐 Secure User Authentication**  
  Register, login, and maintain secure sessions with JWT-based authentication and bcrypt password encryption.

- **🔄 Fallback AI Integration**  
  Seamless fallback from Google Generative AI to Groq API for reliable AI-powered features.

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.6 | UI Framework |
| Vite | 8.0.12 | Build Tool & Dev Server |
| React Router | 7.18.0 | Client-side Routing |
| Axios | 1.18.0 | HTTP Client |
| SASS | 1.101.0 | Styling |
| React Hot Toast | 2.6.0 | Notifications |

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Express.js | 5.2.1 | Web Framework |
| MongoDB | - | Database |
| Mongoose | 9.7.1 | MongoDB ODM |
| Google Generative AI | 2.9.0 | Primary AI Model |
| Groq SDK | 1.5.0 | Fallback AI Model |
| JWT | 9.0.3 | Authentication |
| bcryptjs | 3.0.3 | Password Hashing |
| Multer | 2.2.0 | File Upload Handler |
| pdf-parse | 2.4.5 | PDF Parsing |
| PDFMake | 0.3.11 | PDF Generation |
| Zod | 4.4.3 | Schema Validation |
| Cookie Parser | 1.4.7 | Cookie Parsing |
| CORS | 2.8.6 | Cross-Origin Resource Sharing |

### **Database**
- **MongoDB** - Document-based NoSQL database for storing users, interview reports, and mock interview sessions.

---

## 🚀 Getting Started

### **Prerequisites**
Before you begin, ensure you have the following installed on your system:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Git**

### **Installation & Setup**

#### **1. Clone the Repository**
```bash
git clone https://github.com/AqdasAmir/InterviewGenie-AI.git
cd InterviewGenie-AI
```

#### **2. Backend Setup**

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory (see [Environment Variables](#-environment-variables) section for required variables).

Run the development server with auto-reload:
```bash
npm run dev
```

The backend server will start on `http://localhost:3000`

> **Note:** Make sure MongoDB is running and connection string is correctly configured in your `.env` file.

#### **3. Frontend Setup**

In a new terminal window, navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `frontend` directory (typically only needs `VITE_API_BASE_URL`).

Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### **4. Access the Application**

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🌍 Environment Variables

### **Backend `.env` Configuration**

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/InterviewGenie-AI
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/InterviewGenie

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173

# Authentication
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Google Generative AI
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here

# Groq API (Fallback)
GROQ_API_KEY=your_groq_api_key_here

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf
```

### **Frontend `.env` Configuration**

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000
```

### **Environment Variables Description**

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/resumeGenie` |
| `JWT_SECRET` | Secret key for JWT token signing | Any secure random string |
| `JWT_EXPIRE` | JWT token expiration time | `7d`, `24h` |
| `GOOGLE_GENAI_API_KEY` | Google Generative AI API key | Obtain from Google AI Studio |
| `GROQ_API_KEY` | Groq API key for fallback AI | Obtain from Groq console |
| `FRONTEND_URL` | Frontend application URL for CORS | `http://localhost:5173` |
| `VITE_API_BASE_URL` | Backend API base URL for frontend | `http://localhost:3000` |

---

## 📁 Project Structure

```
ResumeGenie-AI/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── config/
│   │   │   └── database.js        # MongoDB connection
│   │   ├── controllers/           # Route controllers
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # API routes
│   │   ├── middlewares/           # Auth, file upload middlewares
│   │   └── services/              # Business logic (AI, PDF)
│   ├── server.js                  # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root component
│   │   ├── app.routes.jsx         # Route definitions
│   │   ├── features/
│   │   │   ├── auth/              # Authentication feature
│   │   │   └── interview/         # Interview feature
│   │   └── style/                 # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔗 API Endpoints

### **Authentication Routes** (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/get-me` - get the current logged in user details

### **Interview Routes** (`/api/interview`)
- `POST /api/interview/` - Generate interview report (requires resume PDF)
- `GET /api/interview/` - Get all interview reports for user
- `GET /api/interview/report/:interviewId` - Get specific interview report
- `POST /api/interview/resume/pdf/:interviewId` - Generate PDF report

### **Mock Interview Routes** (`/api/mock-interview`)
- `POST /api/mock-interview/start` - Start a new mock interview session
- `POST /api/mock-interview/:id/answer` - Submit answer and get evaluation
- `GET /api/mock-interview/` - Get all mock interviews for user
- `GET /api/mock-interview/:id` - Get specific mock interview details

---

## 🔧 Available Scripts

### **Backend**
```bash
npm run dev      # Start development server with auto-reload (nodemon)
```

### **Frontend**
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 💡 Tips for Success

### **Getting AI API Keys**

1. **Google Generative AI**
   - Visit [Google AI Studio](https://aistudio.google.com)
   - Create a new API key
   - Add it to your `.env` file

2. **Groq API**
   - Sign up at [Groq Console](https://console.groq.com)
   - Generate an API key
   - Add it to your `.env` file (used as fallback)

### **MongoDB Setup**

- **Local Development:** Install MongoDB Community Edition
- **Cloud:** Use MongoDB Atlas (free tier available)
  - Create a cluster
  - Get connection string
  - Replace `<password>` and `<cluster>` in connection string

### **Testing the Application**

1. Create a user account through the registration page
2. Upload a sample resume (PDF format)
3. Fill in job description and self-description
4. Generate your interview plan
5. Start a mock interview session and practice!

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Ensure MongoDB is running and connection string is correct in `.env` |
| AI API errors | Verify API keys are valid and have sufficient quota |
| CORS errors | Check `FRONTEND_URL` in backend `.env` matches your frontend URL |
| File upload fails | Ensure file size is under `MAX_FILE_SIZE` and format is PDF |
| Token expired | Clear browser cookies and login again |

---

## 📞 Support

For questions or issues, please open an issue on the GitHub repository 
or 
contact: 
Linkdin: https://www.linkedin.com/in/aqdas-amir-4007692a3

Email: aqdasamir3@gmail.com

---

**Built with ❤️ by the Aqdas Amir**

*Last Updated: 2026*
