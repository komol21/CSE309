import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, 
  Plus, 
  Shuffle, 
  BookOpen, 
  Loader2,
  RotateCw,
  Check,
  X,
  Brain,
  Zap,
  TrendingUp
} from "lucide-react"
import toast from "react-hot-toast"

const FlashcardGenerator = () => {
  const [content, setContent] = useState("")
  const [flashcards, setFlashcards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("study") // study, quiz
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const generateFlashcards = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content to generate flashcards")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `Generate 8 educational flashcards from this content. Return ONLY valid JSON in this exact format:
{
  "flashcards": [
    {
      "id": 1,
      "question": "Clear question here",
      "answer": "Concise answer here",
      "category": "topic category"
    }
  ]
}

Content: ${content}

Make questions clear and answers concise (1-2 sentences). Cover key concepts.`
            }
          ],
          temperature: 0.8,
          max_tokens: 2000
        })
      })

      const data = await response.json()
      const responseText = data.choices[0]?.message?.content || ""
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setFlashcards(parsed.flashcards || [])
        setCurrentIndex(0)
        setIsFlipped(false)
        setQuizAnswers({})
        setShowResults(false)
        toast.success(`Generated ${parsed.flashcards?.length || 0} flashcards!`)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Flashcard generation error:", error)
      toast.error("Failed to generate flashcards")
      
      // Fallback flashcards
      setFlashcards([
        {
          id: 1,
          question: "What is the main concept discussed?",
          answer: "Based on the provided content.",
          category: "General"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const shuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
    setFlashcards(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    toast.success("Flashcards shuffled")
  }

  const markAnswer = (correct) => {
    setQuizAnswers({
      ...quizAnswers,
      [flashcards[currentIndex].id]: correct
    })
    
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        nextCard()
      } else {
        setShowResults(true)
      }
    }, 500)
  }

  const resetQuiz = () => {
    setQuizAnswers({})
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowResults(false)
  }

  const currentCard = flashcards[currentIndex]
  const correctCount = Object.values(quizAnswers).filter(v => v).length
  const totalAnswered = Object.keys(quizAnswers).length

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Flashcard Generator
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create smart study cards instantly</p>
          </div>
        </div>
      </motion.div>

      {flashcards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Generate Flashcards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Paste your study material
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your notes, textbook excerpts, or any educational content..."
                    className="min-h-[200px]"
                  />
                </div>
                <Button
                  onClick={generateFlashcards}
                  disabled={loading || !content.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Flashcards
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={mode === "study" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setMode("study")
                  resetQuiz()
                }}
                className={mode === "study" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Study Mode
              </Button>
              <Button
                variant={mode === "quiz" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setMode("quiz")
                  resetQuiz()
                }}
                className={mode === "quiz" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : ""}
              >
                <Zap className="w-4 h-4 mr-1" />
                Quiz Mode
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={shuffle}>
                <Shuffle className="w-4 h-4 mr-1" />
                Shuffle
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setFlashcards([])
                  setContent("")
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                New Set
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm">
              Card {currentIndex + 1} of {flashcards.length}
            </Badge>
            {mode === "quiz" && totalAnswered > 0 && (
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Score: {correctCount}/{totalAnswered}
              </Badge>
            )}
          </div>

          {/* Flashcard */}
          {!showResults ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="border-none shadow-2xl bg-white dark:bg-gray-900/50 backdrop-blur-xl cursor-pointer h-[400px] relative overflow-hidden"
                onClick={() => mode === "study" && setIsFlipped(!isFlipped)}
              >
                <div className="absolute top-4 right-4">
                  {currentCard?.category && (
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {currentCard.category}
                    </Badge>
                  )}
                </div>
                <CardContent className="h-full flex items-center justify-center p-8">
                  <AnimatePresence mode="wait">
                    {!isFlipped ? (
                      <motion.div
                        key="question"
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -90 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                          {currentCard?.question}
                        </h2>
                        {mode === "study" && (
                          <p className="text-sm text-gray-500">Click to reveal answer</p>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="answer"
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -90 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-xl text-gray-900 dark:text-gray-100 font-medium">
                          {currentCard?.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                  <p className="text-xl mb-6">
                    You got {correctCount} out of {flashcards.length} correct
                  </p>
                  <p className="text-lg mb-6">
                    Score: {((correctCount / flashcards.length) * 100).toFixed(0)}%
                  </p>
                  <Button
                    onClick={resetQuiz}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Controls */}
          {!showResults && (
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevCard}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>

              {mode === "quiz" && isFlipped && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => markAnswer(false)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Wrong
                  </Button>
                  <Button
                    onClick={() => markAnswer(true)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Correct
                  </Button>
                </div>
              )}

              {mode === "study" && (
                <Button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <RotateCw className="w-4 h-4 mr-1" />
                  Flip Card
                </Button>
              )}

              <Button
                variant="outline"
                onClick={mode === "quiz" && !isFlipped ? () => setIsFlipped(true) : nextCard}
                disabled={currentIndex === flashcards.length - 1 && (mode === "study" || isFlipped)}
              >
                {mode === "quiz" && !isFlipped ? "Show Answer" : "Next"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FlashcardGenerator
