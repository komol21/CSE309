# EduManage: Revolutionizing Education Management

EduManage is a robust and user-friendly platform designed using the MERN stack (MongoDB, Express.js, React, Node.js). It aims to streamline interactions between educational institutions, tutors, and students, making skill learning and class management efficient and accessible.

## 🌐 Live Site
[Visit EduManage Live Site](https://educationmanage.netlify.app/)

## 🚪 Admin Access
- **Admin Email:** k@m.com
- **Admin Password:** Mekat123

---

## 🚀 Features

### General Features
1. **Fully Responsive**: Supports mobile, tablet, and desktop views, including the dashboard.
2. **Modern UI/UX**: Intuitive interface with animations using Framer Motion/AOS.
3. **Authentication**: Email/password login with JWT, Google Sign-in, and token-based authentication.
4. **Environment Security**: Firebase config keys and MongoDB credentials are secured via environment variables.
5. **Real-time Notifications**: Sweet alert/toast notifications for all CRUD operations and authentication actions.
6. **Pagination**: Tables and cards feature pagination for better usability.

### Homepage Highlights
- **Dynamic Banner**: Carousel showcasing EduManage’s features.
- **Collaborators Section**: Highlights key partners with their logos and descriptions.
- **Popular Classes**: Slider showing trending classes based on the highest enrollment.
- **Feedback Section**: Displays teacher feedback in a carousel with images, class titles, and testimonials.
- **Statistics Section**: Displays total users, classes, and enrollments with relevant images and cards.
- **Teacher Call-to-Action**: Encourages teachers to join EduManage.
- **Extra Sections**: Two additional unique sections for better user engagement.

### Core Functionalities
#### Navbar
- Dynamic Navbar with profile dropdown when logged in.

#### All Classes Page
- Displays approved classes in a card format.

#### Class Details Page
- Detailed class information with an option to enroll and make payments.

#### Teach on EduManage
- Allows users to apply as teachers, complete with experience levels and category selection.

#### Dashboards
- **Student Dashboard**:
  - My Enroll Classes: View and access all enrolled classes.
  - Teaching Evaluation Report (TER): Submit feedback on teachers.
- **Teacher Dashboard**:
  - Add Class: Create and manage classes.
  - Class Progress: Track total enrollments and assignments.
  - **🤖 AI Lecture Notes Generator**: Convert audio/video to structured notes, generate slides from outlines, and create mind maps
  - **🧠 Interactive Quiz Generator**: Auto-create quizzes with multiple difficulty levels and adaptive testing
- **Admin Dashboard**:
  - Manage Teacher Requests: Approve or reject requests.
  - Manage Users: Promote users to admin.
  - Manage Classes: Approve, reject, and track class progress.

---

## 🤖 AI-Powered Features

### AI Lecture Notes Generator
Transform your teaching materials into structured, professional content:

#### Features:
1. **Audio/Video to Notes**
   - Upload lecture recordings (MP4, MP3, WAV, etc.)
   - Automatic transcription and note generation
   - Structured output with summary, key points, and detailed notes
   - Export to Markdown format

2. **Auto-Generate Slides**
   - Input course outlines or topic lists
   - AI creates professional presentation slides
   - Includes content points and speaker notes
   - Download as JSON or copy to clipboard

3. **Create Mind Maps**
   - Transform course content into visual mind maps
   - Hierarchical structure with branches and subtopics
   - Perfect for visual learners
   - Export and share with students

#### How to Use:
1. Navigate to Teacher Dashboard → AI Lecture Notes
2. Choose your input method (audio/video, outline, or content)
3. Upload or paste your material
4. Click generate and get instant results
5. Download or copy your generated content

### Interactive Quiz Generator
Create engaging assessments with AI assistance:

#### Features:
1. **Auto-Create Quizzes**
   - Input course materials or topics
   - AI generates relevant questions
   - Multiple question types:
     - Multiple Choice
     - True/False
     - Short Answer
     - Essay Questions

2. **Difficulty Levels**
   - **Easy**: Basic recall and understanding
   - **Medium**: Application and analysis  
   - **Hard**: Evaluation and synthesis
   - Customizable question count (1-20)

3. **Adaptive Testing**
   - Adjusts difficulty based on performance
   - Progressive levels: Beginner → Intermediate → Advanced
   - Smart scoring system (70% passing threshold)
   - Automatic level adjustment at 90%+ scores

4. **Quiz Management**
   - Save quizzes for later use
   - Preview mode with full quiz interface
   - Export to JSON format
   - Copy to clipboard
   - Detailed explanations for each answer

#### How to Use:
1. Navigate to Teacher Dashboard → Quiz Generator
2. Enter your course material or topics
3. Select difficulty level and question count
4. Click "Generate Quiz"
5. Preview, edit, and save your quiz
6. Share with students or export for external use

---


## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, DaisyUI, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Auth with JWT
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **File Upload**: React Dropzone
- **Icons**: Lucide React
- **Charts**: Recharts
- **Other Tools**: Axios, React Hot Toast

---

## 🏗️ Installation

### Prerequisites
- Node.js installed
- MongoDB connection URL
- Firebase configuration details

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/edu-manage.git
   ```
2. Navigate to the project directory:
   ```bash
   cd edu-manage
   ```
3. Install dependencies for both client and server:
   ```bash
   npm install
   cd client
   npm install
   ```
4. Create `.env` files for both client and server with the required keys (Firebase, MongoDB).
5. Start the development servers:
   ```bash
   cd .. # Move back to the root folder
   npm run dev
   ```



---

