import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, BookOpen, User, LogOut, Menu, X, Home, GraduationCap, Star, Clock, TrendingUp, Award, Activity, ChevronRight, Brain, MessageCircle, BarChart3, Bell, Sparkles, Trophy } from "lucide-react"
import { AuthContext } from "@/provider/AuthProvider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { FadeIn } from "@/components/ui/micro-interactions"

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleLogout = () => {
    logOut()
      .then(() => navigate("/"))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user details
        const userRes = await fetch('https://edumanagebackend.vercel.app/users');
        const users = await userRes.json();
        const userId = users.find((u) => u.email === user?.email)?.uid;

        // Fetch enrolled classes
        const classesResponse = await fetch(`https://edumanagebackend.vercel.app/enrolled-classes/${userId}`);
        if (!classesResponse.ok) {
          throw new Error('Failed to fetch enrolled classes');
        }
        const classesData = await classesResponse.json();
        setEnrolledClasses(classesData.enrolledClasses || []);

        // Fetch reviews
        const reviewsResponse = await fetch('https://edumanagebackend.vercel.app/reviews');
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchDashboardData();
    }
  }, [user]);

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/my-enroll-class", icon: BookOpen, label: "My Enroll Class" },
    { path: "/dashboard/quiz-generator", icon: Brain, label: "Quiz Generator" },
    { path: "/dashboard/ai-study-buddy", icon: MessageCircle, label: "AI Study Buddy" },
    { path: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/dashboard/flashcards", icon: Sparkles, label: "Flashcards" },
    { path: "/dashboard/achievements", icon: Trophy, label: "Achievements" },
    { path: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    { path: "/dashboard/profile", icon: User, label: "Profile" },
  ]

  // Calculate statistics
  const totalEnrolledCourses = enrolledClasses.length;
  const averageProgress = enrolledClasses.reduce((acc, course) => acc + (course.progress || 0), 0) / totalEnrolledCourses || 0;
  const completedCourses = enrolledClasses.filter(course => course.progress === 100).length;

  // Chart data
  const progressData = enrolledClasses.map(course => ({
    name: course.title?.substring(0, 15) + '...',
    progress: course.progress || 0
  }));

  const NavItem = ({ path, icon: Icon, label }) => (
    <NavLink
      to={path}
      end={path === "/dashboard"}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl font-medium transition-all duration-200
        ${isActive 
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-purple-500/30" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110`} />
      <span>{label}</span>
    </NavLink>
  )

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <FadeIn>
          <Card className="border-none bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">Welcome back,</p>
                  <h2 className="text-3xl font-bold mb-2">{user?.displayName}</h2>
                  <p className="text-white/90">Keep up the great work! 🚀</p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Completion Rate</p>
                    <p className="text-2xl font-bold">{totalEnrolledCourses > 0 ? ((completedCourses / totalEnrolledCourses) * 100).toFixed(0) : 0}%</p>
                  </div>
                  <div className="w-20 h-20">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={[
                            { value: completedCourses },
                            { value: totalEnrolledCourses - completedCourses }
                          ]}
                          innerRadius={25}
                          outerRadius={40}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#fff" />
                          <Cell fill="rgba(255,255,255,0.2)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FadeIn delay={0.1}>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Enrolled Courses</p>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{totalEnrolledCourses}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Active learning
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Average Progress</p>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{averageProgress.toFixed(1)}%</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Keep going!
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{completedCourses}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Well done!
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <GraduationCap className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Reviews</p>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{reviews.length}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Feedback given
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                      <Star className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn delay={0.5}>
            <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white font-semibold">Course Progress</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {progressData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" />
                        <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-400" fontSize={12} />
                        <YAxis stroke="#6b7280" className="dark:stroke-gray-400" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Bar dataKey="progress" fill="url(#colorProgress)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No course data available
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.6}>
            <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white font-semibold">Recent Activity</span>
                  <Link 
                    to="/dashboard/my-enroll-class"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {enrolledClasses.length > 0 ? (
                    enrolledClasses.slice(0, 4).map((course, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                      >
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                            {course.progress || 0}%
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress || 0}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                              />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium min-w-[40px] text-right">
                              {course.progress || 0}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No courses enrolled yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-800">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduManage
              </h1>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavItem key={item.path} {...item} />
              ))}
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <Link 
              to='/' 
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              <Home className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">Home</span>
            </Link>
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-none shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="h-full flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {window.location.pathname === '/dashboard' ? 'Dashboard' : 
                   window.location.pathname.includes('/my-enroll-class') ? 'My Courses' :
                   window.location.pathname.includes('/profile') ? 'My Profile' : 'Student Dashboard'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  {window.location.pathname === '/dashboard' ? 'Overview of your learning journey' : 
                   window.location.pathname.includes('/my-enroll-class') ? 'Manage your enrolled courses' :
                   window.location.pathname.includes('/profile') ? 'View and edit your profile' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="h-10 w-px bg-gray-200 dark:bg-gray-800" />
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="hidden sm:block text-right">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
                </div>
                <div className="relative">
                  <img
                    src={user?.photoURL || "/placeholder.svg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="p-4 lg:p-8">
            {window.location.pathname === '/dashboard' ? renderDashboardContent() : <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout