import { useState, useEffect, useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, 
  Award, 
  Star, 
  Flame, 
  Target, 
  Zap,
  Crown,
  Medal,
  TrendingUp,
  Calendar,
  CheckCircle,
  Lock,
  Sparkles
} from "lucide-react"
import { AuthContext } from "@/provider/AuthProvider"
import confetti from "canvas-confetti"

const AchievementSystem = () => {
  const { user } = useContext(AuthContext)
  const [userStats, setUserStats] = useState({
    points: 1250,
    level: 12,
    streak: 7,
    quizzesTaken: 28,
    coursesCompleted: 3,
    totalStudyHours: 45
  })

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first quiz",
      icon: Star,
      points: 50,
      unlocked: true,
      unlockedAt: "2025-11-01"
    },
    {
      id: 2,
      title: "Study Streak",
      description: "Study 7 days in a row",
      icon: Flame,
      points: 100,
      unlocked: true,
      unlockedAt: "2025-11-08"
    },
    {
      id: 3,
      title: "Quiz Master",
      description: "Score 90% or higher on 5 quizzes",
      icon: Trophy,
      points: 200,
      unlocked: true,
      unlockedAt: "2025-11-10"
    },
    {
      id: 4,
      title: "Course Finisher",
      description: "Complete 3 courses",
      icon: Award,
      points: 300,
      unlocked: true,
      unlockedAt: "2025-11-12"
    },
    {
      id: 5,
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: Crown,
      points: 250,
      unlocked: false
    },
    {
      id: 6,
      title: "Marathon Learner",
      description: "Study for 50 hours total",
      icon: Target,
      points: 500,
      unlocked: false,
      progress: 90
    },
    {
      id: 7,
      title: "Speed Runner",
      description: "Complete a course in under 7 days",
      icon: Zap,
      points: 350,
      unlocked: false
    },
    {
      id: 8,
      title: "Knowledge Seeker",
      description: "Complete 10 courses",
      icon: Medal,
      points: 1000,
      unlocked: false,
      progress: 30
    }
  ])

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: "Alex Johnson", points: 2450, avatar: "AJ" },
    { rank: 2, name: "Sarah Miller", points: 2120, avatar: "SM" },
    { rank: 3, name: user?.displayName || "You", points: 1250, avatar: user?.email?.charAt(0).toUpperCase() || "Y", isCurrentUser: true },
    { rank: 4, name: "Mike Chen", points: 1180, avatar: "MC" },
    { rank: 5, name: "Emma Davis", points: 1050, avatar: "ED" }
  ])

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalAchievements = achievements.length
  const levelProgress = ((userStats.points % 200) / 200) * 100
  const nextLevelPoints = 200 - (userStats.points % 200)

  const celebrateAchievement = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  useEffect(() => {
    // Trigger confetti for newly unlocked achievements
    const recentlyUnlocked = achievements.find(a => {
      if (!a.unlocked || !a.unlockedAt) return false
      const unlockDate = new Date(a.unlockedAt)
      const now = new Date()
      const hoursDiff = (now - unlockDate) / (1000 * 60 * 60)
      return hoursDiff < 1
    })
    
    if (recentlyUnlocked) {
      celebrateAchievement()
    }
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Achievements
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your progress and earn rewards
            </p>
          </div>
        </div>
      </motion.div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm opacity-90 mb-1">Level</p>
              <h3 className="text-3xl font-bold">{userStats.level}</h3>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm opacity-90 mb-1">Points</p>
              <h3 className="text-3xl font-bold">{userStats.points}</h3>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm opacity-90 mb-1">Streak</p>
              <h3 className="text-3xl font-bold">{userStats.streak}</h3>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm opacity-90 mb-1">Unlocked</p>
              <h3 className="text-3xl font-bold">{unlockedCount}/{totalAchievements}</h3>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Level {userStats.level}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {nextLevelPoints} points to Level {userStats.level + 1}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`border-2 ${
                        achievement.unlocked
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
                          : "border-gray-200 dark:border-gray-800 opacity-60"
                      } transition-all hover:shadow-lg`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              achievement.unlocked
                                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                                : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                            }`}>
                              {achievement.unlocked ? (
                                <achievement.icon className="w-6 h-6" />
                              ) : (
                                <Lock className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                  {achievement.title}
                                </h3>
                                <Badge className={achievement.unlocked 
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                                  : "bg-gray-200 dark:bg-gray-800 text-gray-600"
                                }>
                                  {achievement.points}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {achievement.description}
                              </p>
                              {achievement.unlocked && achievement.unlockedAt && (
                                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                                </p>
                              )}
                              {!achievement.unlocked && achievement.progress && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    <span>Progress</span>
                                    <span>{achievement.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                      style={{ width: `${achievement.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <div>
          <Card className="border-none shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${
                      entry.isCurrentUser
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-500"
                        : "bg-gray-50 dark:bg-gray-800/50"
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        entry.rank === 1 ? "bg-yellow-500 text-white" :
                        entry.rank === 2 ? "bg-gray-400 text-white" :
                        entry.rank === 3 ? "bg-orange-600 text-white" :
                        "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                        {entry.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {entry.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {entry.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {entry.points} points
                        </p>
                      </div>
                      {entry.rank <= 3 && (
                        <Crown className={`w-5 h-5 ${
                          entry.rank === 1 ? "text-yellow-500" :
                          entry.rank === 2 ? "text-gray-400" :
                          "text-orange-600"
                        }`} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Challenge */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white mt-4">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Daily Challenge</h3>
                  <p className="text-sm opacity-90 mb-3">
                    Complete 3 quizzes today to earn bonus 100 points!
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2" style={{ width: "66%" }} />
                    </div>
                    <span className="text-xs">2/3</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AchievementSystem
