// Gemini AI Integration Utility
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Fallback mock data generators for when API quota is exceeded
const generateMockNotes = (fileName) => ({
  title: fileName.replace(/\.[^/.]+$/, ""),
  summary: "This lecture covers fundamental concepts in education management systems, including user authentication, role-based access control, and data management strategies.",
  keyPoints: [
    "Understanding authentication mechanisms and security best practices",
    "Implementing role-based access control (RBAC) for different user types",
    "Database design patterns for educational platforms",
    "Real-time data synchronization and state management",
    "UI/UX principles for educational interfaces"
  ],
  detailedNotes: `# Lecture Notes: ${fileName.replace(/\.[^/.]+$/, "")}

## Introduction
This session provides a comprehensive overview of building modern education management systems.

## Main Topics

### 1. Authentication & Authorization
- User Authentication: Implementing secure login systems
- Security Best Practices: Password hashing and token management

### 2. Role-Based Access Control
- Student Role: Access to enrolled classes and assignments
- Teacher Role: Class management and student progress tracking
- Admin Role: System-wide management and analytics

### 3. Database Architecture
- MongoDB Schema Design: Optimizing document structure
- Relationships: Managing connections between entities
- Indexing Strategy: Improving query performance

### 4. Frontend Development
- React Component Architecture: Building reusable components
- State Management: Using React Query and Context API
- Responsive Design: Creating mobile-first interfaces

## Key Takeaways
- Modern platforms require robust authentication
- Proper database design is crucial for scalability
- User experience should be prioritized across all devices

## Note
*Generated in fallback mode due to API quota limits. For AI-generated content, please check your Gemini API quota.*`,
  timestamp: new Date().toISOString(),
  wordCount: 180
});

const generateMockSlides = () => ({
  title: "Course Presentation",
  totalSlides: 8,
  slides: [
    {
      slideNumber: 1,
      title: "Introduction",
      content: ["Course Overview", "Learning Objectives", "Key Topics"],
      notes: "Welcome and introduce the course structure"
    },
    {
      slideNumber: 2,
      title: "Core Concepts",
      content: ["Fundamental Principles", "Key Terminology", "Basic Framework"],
      notes: "Explain the foundational concepts"
    },
    {
      slideNumber: 3,
      title: "Practical Applications",
      content: ["Real-world Examples", "Use Cases", "Implementation"],
      notes: "Demonstrate practical usage"
    },
    {
      slideNumber: 4,
      title: "Advanced Topics",
      content: ["Complex Scenarios", "Best Practices", "Optimization"],
      notes: "Dive into advanced concepts"
    },
    {
      slideNumber: 5,
      title: "Tools & Resources",
      content: ["Development Tools", "Libraries", "Documentation"],
      notes: "Overview of available resources"
    },
    {
      slideNumber: 6,
      title: "Common Challenges",
      content: ["Typical Issues", "Solutions", "Debugging Tips"],
      notes: "Address common problems"
    },
    {
      slideNumber: 7,
      title: "Best Practices",
      content: ["Code Quality", "Performance", "Security"],
      notes: "Share industry standards"
    },
    {
      slideNumber: 8,
      title: "Summary & Next Steps",
      content: ["Key Takeaways", "Further Learning", "Resources"],
      notes: "Wrap up and provide next steps"
    }
  ],
  theme: "professional",
  generatedAt: new Date().toISOString(),
  note: "Generated in fallback mode due to API quota limits"
});

const generateMockMindMap = () => ({
  centralTopic: "Course Content",
  branches: [
    {
      id: 1,
      topic: "Fundamentals",
      subtopics: [
        { id: 11, name: "Core Concepts", items: ["Basics", "Principles", "Theory"] },
        { id: 12, name: "Prerequisites", items: ["Background", "Requirements", "Setup"] }
      ]
    },
    {
      id: 2,
      topic: "Implementation",
      subtopics: [
        { id: 21, name: "Practical Skills", items: ["Coding", "Design", "Testing"] },
        { id: 22, name: "Tools", items: ["IDE", "Libraries", "Frameworks"] }
      ]
    },
    {
      id: 3,
      topic: "Advanced Topics",
      subtopics: [
        { id: 31, name: "Optimization", items: ["Performance", "Scalability", "Efficiency"] },
        { id: 32, name: "Security", items: ["Authentication", "Authorization", "Data Protection"] }
      ]
    },
    {
      id: 4,
      topic: "Best Practices",
      subtopics: [
        { id: 41, name: "Code Quality", items: ["Clean Code", "Documentation", "Standards"] },
        { id: 42, name: "Collaboration", items: ["Version Control", "Code Review", "Communication"] }
      ]
    },
    {
      id: 5,
      topic: "Resources",
      subtopics: [
        { id: 51, name: "Learning", items: ["Tutorials", "Courses", "Books"] },
        { id: 52, name: "Community", items: ["Forums", "Support", "Open Source"] }
      ]
    }
  ],
  totalNodes: 40,
  generatedAt: new Date().toISOString(),
  note: "Generated in fallback mode due to API quota limits"
});

const generateMockQuizQuestions = (difficulty, count) => {
  const baseQuestions = [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is the primary purpose of this course content?",
      options: ["Learning fundamentals", "Advanced techniques", "Quick reference", "Project showcase"],
      correctAnswer: 0,
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
      explanation: "This course focuses on teaching fundamental concepts and building a strong foundation."
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "Which approach is recommended for learning this material?",
      options: ["Memorization only", "Hands-on practice", "Passive reading", "Skip to advanced topics"],
      correctAnswer: 1,
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
      explanation: "Hands-on practice is essential for mastering the concepts covered in this course."
    },
    {
      id: 3,
      type: "multiple-choice",
      question: "What is a key benefit of understanding these concepts?",
      options: ["Better job prospects", "Improved problem-solving skills", "Enhanced productivity", "All of the above"],
      correctAnswer: 3,
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
      explanation: "Understanding these concepts provides multiple benefits including career advancement, better problem-solving, and increased productivity."
    },
    {
      id: 4,
      type: "true-false",
      question: "Continuous practice is important for mastering the course material.",
      options: ["True", "False"],
      correctAnswer: 0,
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
      explanation: "Regular practice and repetition are crucial for long-term retention and skill development."
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "What should you do when encountering difficult concepts?",
      options: ["Skip them", "Give up", "Review and practice more", "Memorize without understanding"],
      correctAnswer: 2,
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
      explanation: "When facing challenges, the best approach is to review the material and practice more to build understanding."
    }
  ];

  return baseQuestions.slice(0, Math.min(count, baseQuestions.length));
};

/**
 * Call Gemini AI API with a prompt
 * @param {string} prompt - The prompt to send to Gemini
 * @param {object} options - Additional options
 * @returns {Promise<string>} - The generated text response
 */
export async function callGeminiAI(prompt, options = {}) {
  // Check if API key is available
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found, using fallback mode');
    throw new Error('API_KEY_MISSING');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: options.temperature || 0.7,
          topK: options.topK || 40,
          topP: options.topP || 0.95,
          maxOutputTokens: options.maxOutputTokens || 8192,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error?.message || 'Failed to generate content';
      
      // Check if it's a quota error
      if (response.status === 429 || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return generatedText;
  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Re-throw with specific error types for better handling
    if (error.message === 'QUOTA_EXCEEDED' || error.message.includes('quota')) {
      throw new Error('QUOTA_EXCEEDED');
    }
    if (error.message === 'API_KEY_MISSING') {
      throw new Error('API_KEY_MISSING');
    }
    
    throw error;
  }
}

/**
 * Generate lecture notes from audio/video transcript
 * @param {string} fileName - Name of the uploaded file
 * @param {string} transcript - Transcript or description of the content
 * @returns {Promise<object>} - Structured notes object
 */
export async function generateLectureNotes(fileName, transcript = '') {
  const prompt = `You are an expert educational content creator. Generate comprehensive lecture notes based on the following information:

File Name: ${fileName}
${transcript ? `Content/Transcript: ${transcript}` : ''}

Please generate structured lecture notes in the following JSON format:
{
  "title": "Lecture title",
  "summary": "Brief 2-3 sentence summary",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "detailedNotes": "Detailed notes in markdown format with proper headers, bullet points, and sections"
}

Make the notes educational, well-organized, and comprehensive. Include sections like Introduction, Main Topics, Key Takeaways, and References if applicable.`;

  try {
    const response = await callGeminiAI(prompt, { temperature: 0.7 });
    
    // Extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const notes = JSON.parse(jsonMatch[0]);
      notes.timestamp = new Date().toISOString();
      notes.wordCount = notes.detailedNotes.split(/\s+/).length;
      return notes;
    }
  } catch (error) {
    if (error.message === 'QUOTA_EXCEEDED') {
      console.warn('API quota exceeded, using fallback notes generator');
      return generateMockNotes(fileName);
    }
    console.error('Error parsing notes:', error);
  }
  
  // Fallback
  return generateMockNotes(fileName);
}

/**
 * Generate presentation slides from course outline
 * @param {string} outline - Course outline or topics
 * @returns {Promise<object>} - Slides object
 */
export async function generateSlides(outline) {
  const prompt = `You are an expert presentation designer. Create professional presentation slides based on the following course outline:

${outline}

Generate slides in the following JSON format:
{
  "title": "Presentation title",
  "totalSlides": 8,
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "notes": "Speaker notes for this slide"
    }
  ],
  "theme": "professional"
}

Create 8 engaging slides with clear content points and helpful speaker notes. Make it educational and professional.`;

  try {
    const response = await callGeminiAI(prompt, { temperature: 0.7 });
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const slides = JSON.parse(jsonMatch[0]);
      slides.generatedAt = new Date().toISOString();
      return slides;
    }
  } catch (error) {
    if (error.message === 'QUOTA_EXCEEDED') {
      console.warn('API quota exceeded, using fallback slides generator');
      return generateMockSlides();
    }
    console.error('Error parsing slides:', error);
  }
  
  return generateMockSlides();
}

/**
 * Generate mind map from course content
 * @param {string} content - Course content or concepts
 * @returns {Promise<object>} - Mind map object
 */
export async function generateMindMap(content) {
  const prompt = `You are an expert in creating educational mind maps. Create a hierarchical mind map based on the following course content:

${content}

Generate a mind map in the following JSON format:
{
  "centralTopic": "Main topic",
  "branches": [
    {
      "id": 1,
      "topic": "Branch topic",
      "subtopics": [
        {
          "id": 11,
          "name": "Subtopic name",
          "items": ["Item 1", "Item 2", "Item 3"]
        }
      ]
    }
  ],
  "totalNodes": 45
}

Create 5 main branches with 2-3 subtopics each, and 2-4 items per subtopic. Make it comprehensive and well-organized.`;

  try {
    const response = await callGeminiAI(prompt, { temperature: 0.7 });
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const mindMap = JSON.parse(jsonMatch[0]);
      mindMap.generatedAt = new Date().toISOString();
      return mindMap;
    }
  } catch (error) {
    if (error.message === 'QUOTA_EXCEEDED') {
      console.warn('API quota exceeded, using fallback mind map generator');
      return generateMockMindMap();
    }
    console.error('Error parsing mind map:', error);
  }
  
  return generateMockMindMap();
}

/**
 * Generate quiz questions from course material
 * @param {string} material - Course material
 * @param {string} difficulty - easy, medium, or hard
 * @param {number} count - Number of questions to generate
 * @returns {Promise<object>} - Quiz object
 */
export async function generateQuiz(material, difficulty = 'medium', count = 5) {
  const difficultyPrompts = {
    easy: 'basic recall and understanding level questions (multiple choice and true/false)',
    medium: 'application and analysis level questions (multiple choice and short answer)',
    hard: 'evaluation and synthesis level questions (multiple choice, short answer, and essay)'
  };

  const prompt = `You are an expert quiz creator. Generate ${count} ${difficulty} difficulty quiz questions based on the following course material:

${material}

Create ${difficultyPrompts[difficulty]}.

Generate the quiz in the following JSON format:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "points": 10,
      "explanation": "Detailed explanation of the correct answer"
    }
  ]
}

For difficulty levels:
- Easy: 10 points per question, simple recall
- Medium: 15 points per question, application of concepts
- Hard: 20-25 points per question, complex analysis

Make questions educational, clear, and well-explained.`;

  try {
    const response = await callGeminiAI(prompt, { temperature: 0.8, maxOutputTokens: 4096 });
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const quizData = JSON.parse(jsonMatch[0]);
      
      return {
        id: Date.now(),
        title: "AI-Generated Quiz",
        description: `This quiz tests your understanding of the course material. Difficulty: ${difficulty}`,
        difficulty: difficulty,
        totalQuestions: quizData.questions.length,
        questions: quizData.questions,
        timeLimit: quizData.questions.length * 2,
        passingScore: 70,
        adaptiveEnabled: true,
        createdAt: new Date().toISOString(),
        config: {
          questionTypes: difficulty === 'easy' ? ["multiple-choice", "true-false"] : 
                        difficulty === 'medium' ? ["multiple-choice", "short-answer"] :
                        ["multiple-choice", "short-answer", "essay"],
          complexity: difficulty === 'easy' ? "Basic recall and understanding" :
                     difficulty === 'medium' ? "Application and analysis" :
                     "Evaluation and synthesis"
        }
      };
    }
  } catch (error) {
    if (error.message === 'QUOTA_EXCEEDED') {
      console.warn('API quota exceeded, using fallback quiz generator');
      return {
        id: Date.now(),
        title: "Quiz (Fallback Mode)",
        description: `This quiz tests your understanding. Difficulty: ${difficulty}. Note: Generated in fallback mode due to API quota limits.`,
        difficulty: difficulty,
        totalQuestions: count,
        questions: generateMockQuizQuestions(difficulty, count),
        timeLimit: count * 2,
        passingScore: 70,
        adaptiveEnabled: true,
        createdAt: new Date().toISOString(),
        config: {
          questionTypes: difficulty === 'easy' ? ["multiple-choice", "true-false"] : 
                        difficulty === 'medium' ? ["multiple-choice", "short-answer"] :
                        ["multiple-choice", "short-answer", "essay"],
          complexity: difficulty === 'easy' ? "Basic recall and understanding" :
                     difficulty === 'medium' ? "Application and analysis" :
                     "Evaluation and synthesis"
        }
      };
    }
    console.error('Error parsing quiz:', error);
  }
  
  // Fallback
  return {
    id: Date.now(),
    title: "Quiz (Fallback Mode)",
    description: `Quiz based on course material - ${difficulty} difficulty. Note: Generated in fallback mode.`,
    difficulty: difficulty,
    totalQuestions: count,
    questions: generateMockQuizQuestions(difficulty, count),
    timeLimit: count * 2,
    passingScore: 70,
    adaptiveEnabled: true,
    createdAt: new Date().toISOString()
  };
}
