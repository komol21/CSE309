import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Brain,
  Plus,
  Trash2,
  Eye,
  Download,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  HelpCircle,
  Target,
  TrendingUp,
  Copy,
  Save,
  Zap
} from "lucide-react"
import toast from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generateQuiz as generateQuizWithAI } from "@/lib/groq-ai"

const InteractiveQuizGenerator = () => {
  const [courseMaterial, setCourseMaterial] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState(5)
  const [processing, setProcessing] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState(null)
  const [activeView, setActiveView] = useState("create")
  const [previewMode, setPreviewMode] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [adaptiveLevel, setAdaptiveLevel] = useState("beginner")
  const [savedQuizzes, setSavedQuizzes] = useState([])

  // Generate quiz from course material
  const generateQuiz = async () => {
    if (!courseMaterial.trim()) {
      toast.error("Please enter course material")
      return
    }

    setProcessing(true)

    try {
      const quiz = await generateQuizWithAI(courseMaterial, difficulty, questionCount);
      setGeneratedQuiz(quiz);
      setActiveView("preview");
      toast.success("Quiz generated successfully with AI!");
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  // Generate mock questions based on difficulty
  const generateMockQuestions = (count, level) => {
    const questions = []
    
    const easyQuestions = [
      {
        id: 1,
        type: "multiple-choice",
        question: "What does MERN stack stand for?",
        options: [
          "MongoDB, Express, React, Node.js",
          "MySQL, Express, React, Next.js",
          "MongoDB, Ember, Ruby, Node.js",
          "MySQL, Express, Ruby, Next.js"
        ],
        correctAnswer: 0,
        points: 10,
        explanation: "MERN stands for MongoDB (database), Express (backend framework), React (frontend library), and Node.js (runtime environment)."
      },
      {
        id: 2,
        type: "true-false",
        question: "React is a JavaScript framework developed by Facebook.",
        options: ["True", "False"],
        correctAnswer: 1,
        points: 10,
        explanation: "React is actually a JavaScript library, not a framework. It focuses specifically on building user interfaces."
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which of the following is used for state management in React?",
        options: ["Redux", "Context API", "MobX", "All of the above"],
        correctAnswer: 3,
        points: 10,
        explanation: "All three - Redux, Context API, and MobX - are popular state management solutions in React applications."
      }
    ]

    const mediumQuestions = [
      {
        id: 4,
        type: "multiple-choice",
        question: "What is the purpose of useEffect hook in React?",
        options: [
          "To manage component state",
          "To perform side effects in function components",
          "To create context",
          "To optimize rendering performance"
        ],
        correctAnswer: 1,
        points: 15,
        explanation: "useEffect is used to perform side effects like data fetching, subscriptions, or manually changing the DOM in function components."
      },
      {
        id: 5,
        type: "short-answer",
        question: "Explain the difference between props and state in React.",
        correctAnswer: "Props are read-only data passed from parent to child components, while state is mutable data managed within a component.",
        points: 15,
        explanation: "Props enable component communication, while state allows components to create and manage their own data."
      },
      {
        id: 6,
        type: "multiple-choice",
        question: "Which HTTP method is used to update a resource in a RESTful API?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: 2,
        points: 15,
        explanation: "PUT (or PATCH) is used to update existing resources, while POST creates new resources."
      }
    ]

    const hardQuestions = [
      {
        id: 7,
        type: "multiple-choice",
        question: "What is the Virtual DOM in React and why is it used?",
        options: [
          "A copy of the real DOM stored in memory for faster updates",
          "A database for storing component state",
          "A tool for debugging React applications",
          "A method for server-side rendering"
        ],
        correctAnswer: 0,
        points: 20,
        explanation: "Virtual DOM is a lightweight copy of the actual DOM. React uses it to minimize expensive DOM operations by batching updates and only applying necessary changes."
      },
      {
        id: 8,
        type: "essay",
        question: "Describe the authentication flow in a MERN stack application using JWT tokens. Include security considerations.",
        correctAnswer: "A comprehensive answer should cover: user login, server verification, JWT generation, token storage, token validation on requests, refresh tokens, and security measures like HTTPS, secure storage, and token expiration.",
        points: 25,
        explanation: "JWT authentication provides stateless authentication, but requires proper implementation of security measures to prevent vulnerabilities."
      },
      {
        id: 9,
        type: "short-answer",
        question: "What are React Higher-Order Components (HOCs) and when would you use them?",
        correctAnswer: "HOCs are functions that take a component and return a new component with additional props or behavior. They're used for code reuse, logic abstraction, and cross-cutting concerns.",
        points: 20,
        explanation: "HOCs enable component composition and reusability without modifying the original component."
      }
    ]

    // Select questions based on difficulty
    let questionPool = []
    if (level === "easy") {
      questionPool = [...easyQuestions]
    } else if (level === "medium") {
      questionPool = [...easyQuestions, ...mediumQuestions]
    } else {
      questionPool = [...easyQuestions, ...mediumQuestions, ...hardQuestions]
    }

    // Randomly select questions up to the requested count
    const shuffled = questionPool.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerIndex
    })
  }

  // Submit quiz and calculate score
  const submitQuiz = () => {
    if (!generatedQuiz) return

    const totalQuestions = generatedQuiz.questions.length
    const answeredCount = Object.keys(userAnswers).length

    if (answeredCount < totalQuestions) {
      toast.error(`Please answer all questions (${answeredCount}/${totalQuestions} answered)`)
      return
    }

    let correctCount = 0
    let totalPoints = 0
    let earnedPoints = 0

    generatedQuiz.questions.forEach(question => {
      totalPoints += question.points
      const userAnswer = userAnswers[question.id]
      
      if (question.type === "multiple-choice" || question.type === "true-false") {
        if (userAnswer === question.correctAnswer) {
          correctCount++
          earnedPoints += question.points
        }
      }
    })

    const score = (earnedPoints / totalPoints) * 100

    setQuizSubmitted(true)
    
    // Adaptive difficulty adjustment
    if (score >= 90) {
      setAdaptiveLevel("advanced")
      toast.success(`Excellent! Score: ${score.toFixed(0)}%. Moving to advanced level!`, { duration: 4000 })
    } else if (score >= 70) {
      setAdaptiveLevel("intermediate")
      toast.success(`Good job! Score: ${score.toFixed(0)}%. Ready for intermediate level!`, { duration: 4000 })
    } else {
      setAdaptiveLevel("beginner")
      toast(`Score: ${score.toFixed(0)}%. Let's practice more on the basics.`, { duration: 4000 })
    }
  }

  // Reset quiz
  const resetQuiz = () => {
    setUserAnswers({})
    setQuizSubmitted(false)
    setPreviewMode(false)
  }

  // Save quiz
  const saveQuiz = () => {
    if (!generatedQuiz) return
    
    const updatedQuizzes = [...savedQuizzes, generatedQuiz]
    setSavedQuizzes(updatedQuizzes)
    toast.success("Quiz saved successfully!")
  }

  // Download quiz as JSON
  const downloadQuiz = () => {
    if (!generatedQuiz) return
    
    const blob = new Blob([JSON.stringify(generatedQuiz, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quiz-${generatedQuiz.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Quiz downloaded!")
  }

  // Copy quiz to clipboard
  const copyQuiz = () => {
    if (!generatedQuiz) return
    
    navigator.clipboard.writeText(JSON.stringify(generatedQuiz, null, 2))
    toast.success("Quiz copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    AI Quiz Generator
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create adaptive quizzes with multiple difficulty levels
                  </p>
                </div>
              </div>
              {adaptiveLevel && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Level: {adaptiveLevel}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* View Toggle */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeView === "create" ? "default" : "outline"}
          onClick={() => setActiveView("create")}
          className={activeView === "create" ? "bg-gradient-to-r from-blue-600 to-cyan-600" : ""}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
        <Button
          variant={activeView === "preview" ? "default" : "outline"}
          onClick={() => setActiveView("preview")}
          disabled={!generatedQuiz}
          className={activeView === "preview" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview Quiz
        </Button>
        <Button
          variant={activeView === "saved" ? "default" : "outline"}
          onClick={() => setActiveView("saved")}
          className={activeView === "saved" ? "bg-gradient-to-r from-green-600 to-teal-600" : ""}
        >
          <Save className="w-4 h-4 mr-2" />
          Saved Quizzes ({savedQuizzes.length})
        </Button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeView === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="material">Course Material / Topic</Label>
                    <Textarea
                      id="material"
                      placeholder="Enter your course material, lecture notes, or topics to generate quiz questions from...&#10;&#10;Example: React Hooks are functions that let you use state and other React features in function components. useState manages state, useEffect handles side effects, useContext consumes context values..."
                      value={courseMaterial}
                      onChange={(e) => setCourseMaterial(e.target.value)}
                      rows={8}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger id="difficulty" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-green-500" />
                              <span>Easy - Basic Recall</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-yellow-500" />
                              <span>Medium - Application</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="hard">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-red-500" />
                              <span>Hard - Analysis</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="count">Number of Questions</Label>
                      <Input
                        id="count"
                        type="number"
                        min="1"
                        max="20"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Adaptive Testing</Label>
                      <div className="mt-2 flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Zap className="w-5 h-5 text-purple-500" />
                        <span className="text-sm font-medium">Enabled</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={generateQuiz}
                    disabled={processing || !courseMaterial.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        AI is Generating Quiz...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Quiz with AI
                      </>
                    )}
                  </Button>
                </div>

                {/* Quiz Configuration Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {questionCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {questionCount * 2}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      70%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Passing Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeView === "preview" && generatedQuiz && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Quiz Header */}
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{generatedQuiz.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{generatedQuiz.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={saveQuiz}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyQuiz}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadQuiz}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 text-sm">
                  <Badge variant="outline">
                    {generatedQuiz.totalQuestions} Questions
                  </Badge>
                  <Badge variant="outline">
                    {generatedQuiz.timeLimit} Minutes
                  </Badge>
                  <Badge variant="outline" className={
                    generatedQuiz.difficulty === "easy" ? "border-green-500 text-green-700" :
                    generatedQuiz.difficulty === "medium" ? "border-yellow-500 text-yellow-700" :
                    "border-red-500 text-red-700"
                  }>
                    {generatedQuiz.difficulty.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-4">
              {generatedQuiz.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-none shadow-sm ${
                    quizSubmitted && userAnswers[question.id] === question.correctAnswer
                      ? "bg-green-50 dark:bg-green-900/20"
                      : quizSubmitted && userAnswers[question.id] !== undefined
                      ? "bg-red-50 dark:bg-red-900/20"
                      : ""
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Q{index + 1}
                            </Badge>
                            <Badge variant="outline">
                              {question.points} points
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {question.type.replace("-", " ")}
                            </Badge>
                          </div>
                          <h4 className="text-lg font-semibold mb-3">{question.question}</h4>
                        </div>
                        {quizSubmitted && (
                          <div>
                            {userAnswers[question.id] === question.correctAnswer ? (
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>

                      {question.type !== "essay" && question.type !== "short-answer" && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              onClick={() => !quizSubmitted && handleAnswerSelect(question.id, optionIndex)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                userAnswers[question.id] === optionIndex
                                  ? quizSubmitted && optionIndex === question.correctAnswer
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : quizSubmitted
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                    : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : quizSubmitted && optionIndex === question.correctAnswer
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                              } ${quizSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  userAnswers[question.id] === optionIndex
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}>
                                  {userAnswers[question.id] === optionIndex && (
                                    <div className="w-3 h-3 rounded-full bg-white" />
                                  )}
                                </div>
                                <span>{option}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {(question.type === "short-answer" || question.type === "essay") && (
                        <Textarea
                          placeholder="Type your answer here..."
                          rows={question.type === "essay" ? 6 : 3}
                          disabled={quizSubmitted}
                          className="w-full"
                        />
                      )}

                      {quizSubmitted && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                              <p className="font-semibold text-sm text-blue-900 dark:text-blue-200 mb-1">
                                Explanation:
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Submit Button */}
            {!quizSubmitted ? (
              <Button
                onClick={submitQuiz}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Quiz
              </Button>
            ) : (
              <div className="space-y-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Based on your performance, your adaptive level has been updated
                    </p>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-4 py-2">
                      Current Level: {adaptiveLevel}
                    </Badge>
                  </CardContent>
                </Card>
                
                <div className="flex gap-4">
                  <Button onClick={resetQuiz} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                  <Button
                    onClick={() => {
                      resetQuiz()
                      setActiveView("create")
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    Create New Quiz
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeView === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                {savedQuizzes.length === 0 ? (
                  <div className="text-center py-12">
                    <Save className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No saved quizzes yet. Create and save a quiz to see it here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedQuizzes.map((quiz, index) => (
                      <Card key={quiz.id} className="border dark:border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{quiz.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {quiz.totalQuestions} questions • {quiz.difficulty} difficulty
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Created: {new Date(quiz.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setGeneratedQuiz(quiz)
                                  setActiveView("preview")
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updated = savedQuizzes.filter((_, i) => i !== index)
                                  setSavedQuizzes(updated)
                                  toast.success("Quiz deleted")
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InteractiveQuizGenerator
