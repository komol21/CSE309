import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, 
  FileText, 
  Presentation, 
  Brain,
  Download,
  Sparkles,
  Video,
  Music,
  X,
  CheckCircle,
  Loader2,
  FileAudio,
  Copy,
  AlertCircle
} from "lucide-react"
import toast from "react-hot-toast"
import { useDropzone } from "react-dropzone"
import { generateLectureNotes, generateSlides, generateMindMap } from "@/lib/groq-ai"

const AILectureNotesGenerator = () => {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedFile, setUploadedFile] = useState(null)
  const [courseOutline, setCourseOutline] = useState("")
  const [courseContent, setcourseContent] = useState("")
  const [processing, setProcessing] = useState(false)
  const [generatedNotes, setGeneratedNotes] = useState(null)
  const [generatedSlides, setGeneratedSlides] = useState(null)
  const [generatedMindMap, setGeneratedMindMap] = useState(null)
  const [activeOutput, setActiveOutput] = useState("notes")

  // Dropzone for file upload
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setUploadedFile(file)
      toast.success(`File "${file.name}" uploaded successfully!`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    },
    maxFiles: 1
  })

  // Simulate AI processing for audio/video to notes
  const processMediaToNotes = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a media file first")
      return
    }

    setProcessing(true)
    setActiveOutput("notes")

    try {
      // In a real implementation, you would transcribe the audio/video first
      // For now, we'll use the filename as context for AI generation
      const transcript = `This is a lecture about ${uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")}. The content covers educational concepts and teaching methodologies.`;
      
      const notes = await generateLectureNotes(uploadedFile.name, transcript);
      setGeneratedNotes(notes);
      toast.success("Notes generated successfully with AI!");
    } catch (error) {
      console.error("Error generating notes:", error);
      toast.error("Failed to generate notes. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  // Generate slides from course outline
  const generateSlidesFromOutline = async () => {
    if (!courseOutline.trim()) {
      toast.error("Please enter a course outline")
      return
    }

    setProcessing(true)
    setActiveOutput("slides")

    try {
      const slides = await generateSlides(courseOutline);
      setGeneratedSlides(slides);
      toast.success("Slides generated successfully with AI!");
    } catch (error) {
      console.error("Error generating slides:", error);
      toast.error("Failed to generate slides. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  // Generate mind map from course content
  const generateMindMapFromContent = async () => {
    if (!courseContent.trim()) {
      toast.error("Please enter course content")
      return
    }

    setProcessing(true)
    setActiveOutput("mindmap")

    try {
      const mindMap = await generateMindMap(courseContent);
      setGeneratedMindMap(mindMap);
      toast.success("Mind map generated successfully with AI!");
    } catch (error) {
      console.error("Error generating mind map:", error);
      toast.error("Failed to generate mind map. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  // Copy content to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  // Download content as file
  const downloadContent = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Download started!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI Lecture Notes Generator
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Transform your lectures into structured notes, slides, and mind maps
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeTab === "upload" ? "default" : "outline"}
          onClick={() => setActiveTab("upload")}
          className={activeTab === "upload" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
        >
          <Video className="w-4 h-4 mr-2" />
          Media to Notes
        </Button>
        <Button
          variant={activeTab === "slides" ? "default" : "outline"}
          onClick={() => setActiveTab("slides")}
          className={activeTab === "slides" ? "bg-gradient-to-r from-blue-600 to-cyan-600" : ""}
        >
          <Presentation className="w-4 h-4 mr-2" />
          Generate Slides
        </Button>
        <Button
          variant={activeTab === "mindmap" ? "default" : "outline"}
          onClick={() => setActiveTab("mindmap")}
          className={activeTab === "mindmap" ? "bg-gradient-to-r from-green-600 to-teal-600" : ""}
        >
          <Brain className="w-4 h-4 mr-2" />
          Create Mind Map
        </Button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">Upload Audio/Video</h3>
                  
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-300 dark:border-gray-700 hover:border-purple-400"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-3">
                      {uploadedFile ? (
                        <>
                          <CheckCircle className="w-12 h-12 text-green-500" />
                          <p className="font-medium text-gray-900 dark:text-white">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setUploadedFile(null)
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </>
                      ) : (
                        <>
                          {isDragActive ? (
                            <Upload className="w-12 h-12 text-purple-500 animate-bounce" />
                          ) : (
                            <div className="flex gap-4">
                              <Video className="w-12 h-12 text-gray-400" />
                              <FileAudio className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <p className="font-medium text-gray-900 dark:text-white">
                            {isDragActive ? "Drop the file here" : "Drag & drop media file"}
                          </p>
                          <p className="text-sm text-gray-500">
                            or click to browse (MP4, AVI, MOV, MP3, WAV)
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={processMediaToNotes}
                    disabled={processing || !uploadedFile}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Notes
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {activeTab === "slides" && (
                <motion.div
                  key="slides"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">Course Outline</h3>
                  
                  <div className="space-y-3">
                    <Label htmlFor="outline">Enter your course outline or topics</Label>
                    <Textarea
                      id="outline"
                      placeholder="Example:&#10;1. Introduction to React&#10;2. Components and Props&#10;3. State Management&#10;4. Hooks and Lifecycle&#10;5. Advanced Patterns"
                      value={courseOutline}
                      onChange={(e) => setCourseOutline(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button
                    onClick={generateSlidesFromOutline}
                    disabled={processing || !courseOutline.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Presentation className="w-4 h-4 mr-2" />
                        Generate Slides
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {activeTab === "mindmap" && (
                <motion.div
                  key="mindmap"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold mb-4">Course Content</h3>
                  
                  <div className="space-y-3">
                    <Label htmlFor="content">Enter your course content or key concepts</Label>
                    <Textarea
                      id="content"
                      placeholder="Example:&#10;React is a JavaScript library for building user interfaces. Key concepts include components, props, state, hooks, and the virtual DOM. Components are reusable pieces of UI..."
                      value={courseContent}
                      onChange={(e) => setcourseContent(e.target.value)}
                      rows={12}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    onClick={generateMindMapFromContent}
                    disabled={processing || !courseContent.trim()}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating with AI...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Create Mind Map
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Generated Output</h3>
              {(generatedNotes || generatedSlides || generatedMindMap) && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      let content = ""
                      let filename = "output.txt"
                      
                      if (activeOutput === "notes" && generatedNotes) {
                        content = generatedNotes.detailedNotes
                        filename = "lecture-notes.md"
                      } else if (activeOutput === "slides" && generatedSlides) {
                        content = JSON.stringify(generatedSlides, null, 2)
                        filename = "slides.json"
                      } else if (activeOutput === "mindmap" && generatedMindMap) {
                        content = JSON.stringify(generatedMindMap, null, 2)
                        filename = "mindmap.json"
                      }
                      
                      copyToClipboard(content)
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      let content = ""
                      let filename = "output.txt"
                      
                      if (activeOutput === "notes" && generatedNotes) {
                        content = generatedNotes.detailedNotes
                        filename = "lecture-notes.md"
                      } else if (activeOutput === "slides" && generatedSlides) {
                        content = JSON.stringify(generatedSlides, null, 2)
                        filename = "slides.json"
                      } else if (activeOutput === "mindmap" && generatedMindMap) {
                        content = JSON.stringify(generatedMindMap, null, 2)
                        filename = "mindmap.json"
                      }
                      
                      downloadContent(content, filename)
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {generatedNotes && activeOutput === "notes" && (
                <motion.div
                  key="notes-output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-2">{generatedNotes.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {generatedNotes.summary}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>📊 {generatedNotes.wordCount} words</span>
                      <span>📅 {new Date(generatedNotes.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-2">Key Points:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {generatedNotes.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-gray-700 dark:text-gray-300">{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {generatedNotes.detailedNotes}
                    </pre>
                  </div>
                </motion.div>
              )}

              {generatedSlides && activeOutput === "slides" && (
                <motion.div
                  key="slides-output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-2">{generatedSlides.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📊 {generatedSlides.totalSlides} slides generated
                    </p>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedSlides.slides.map((slide) => (
                      <div
                        key={slide.slideNumber}
                        className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold">
                            Slide {slide.slideNumber}
                          </span>
                          <h5 className="font-semibold text-sm">{slide.title}</h5>
                        </div>
                        <ul className="list-disc list-inside text-sm space-y-1 mb-2">
                          {slide.content.map((item, idx) => (
                            <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
                          ))}
                        </ul>
                        <p className="text-xs text-gray-500 italic">💡 {slide.notes}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {generatedMindMap && activeOutput === "mindmap" && (
                <motion.div
                  key="mindmap-output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-2 text-center">
                      🧠 {generatedMindMap.centralTopic}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {generatedMindMap.totalNodes} nodes mapped
                    </p>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {generatedMindMap.branches.map((branch) => (
                      <div
                        key={branch.id}
                        className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4"
                      >
                        <h5 className="font-bold text-green-700 dark:text-green-400 mb-3">
                          {branch.topic}
                        </h5>
                        <div className="space-y-3 pl-4">
                          {branch.subtopics.map((subtopic) => (
                            <div key={subtopic.id}>
                              <h6 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">
                                • {subtopic.name}
                              </h6>
                              <ul className="list-disc list-inside pl-4 text-sm space-y-1">
                                {subtopic.items.map((item, idx) => (
                                  <li key={idx} className="text-gray-600 dark:text-gray-400">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {!generatedNotes && !generatedSlides && !generatedMindMap && (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <FileText className="w-16 h-16 mb-4" />
                  <p className="text-center">
                    Your generated content will appear here
                  </p>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AILectureNotesGenerator
