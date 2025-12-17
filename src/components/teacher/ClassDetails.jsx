import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"
import CreateAssignmentModal from "./CreateAssignmentModal"
import { useLoaderData } from "react-router-dom"
import { motion } from "framer-motion"
import { Users, FileCheck, Send, Plus, TrendingUp } from "lucide-react"

const ClassDetails = () => {
  const loaderData = useLoaderData()
  const [classDetails, setClassDetails] = useState(loaderData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateAssignment = () => {
    setIsModalOpen(true)
  }

  const handleAssignmentCreated = async () => {
    try {
      // Refresh class details after creating assignment
      const response = await axios.get(
        `https://edumanagebackend.vercel.app/classes/${classDetails._id}`
      )
      setClassDetails(response.data)
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error refreshing class details:", error)
    }
  }

  const FadeIn = ({ children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )

  if (!classDetails) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading class details...</p>
      </div>
    )
  }

  const submissionRate = classDetails.totalAssignments > 0
    ? ((classDetails.totalSubmissions / (classDetails.totalAssignments * classDetails.totalEnrollment)) * 100).toFixed(0)
    : 0

  return (
    <div className="space-y-6">
      {/* Header with Class Info */}
      <FadeIn>
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {classDetails.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage assignments and track student progress
                </p>
              </div>
              <Button
                onClick={handleCreateAssignment}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FadeIn delay={0.1}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
                      {classDetails.totalEnrollment || 0}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Enrolled</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignments</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                      {classDetails.totalAssignments || 0}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Created</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <FileCheck className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submissions</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                      {classDetails.totalSubmissions || 0}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Received</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Send className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <motion.div whileHover={{ y: -4 }}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion</p>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mt-2">
                      {submissionRate}%
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Rate</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>
      </div>

      {/* Class Overview */}
      <FadeIn delay={0.5}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Class Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Course Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-sm font-semibold ${
                      classDetails.status === 'approved' ? 'text-green-600 dark:text-green-400' :
                      classDetails.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {classDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${classDetails.price}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Submissions per Assignment</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {classDetails.totalAssignments > 0 
                        ? (classDetails.totalSubmissions / classDetails.totalAssignments).toFixed(1)
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                    <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      {classDetails.averageRating || 'N/A'} ⭐
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {classDetails.description && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{classDetails.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <CreateAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssignmentCreated={handleAssignmentCreated}
        classId={classDetails._id}
      />
    </div>
  )
}

export default ClassDetails