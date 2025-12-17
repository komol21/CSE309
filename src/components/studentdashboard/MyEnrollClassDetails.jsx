import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "react-simple-star-rating";
import { Loader2, Upload, Calendar, FileText, CheckCircle, Star, ArrowLeft, AlertCircle, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthContext } from "@/provider/AuthProvider";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const FadeIn = ({ children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

FadeIn.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number
};

FadeIn.defaultProps = {
  delay: 0
};

const MyEnrollClassDetails = () => {
    const {user} = useContext(AuthContext);
  const { id } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [evaluation, setEvaluation] = useState({ description: "", rating: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const [classResponse, assignmentsResponse] = await Promise.all([
          fetch(`https://edumanagebackend.vercel.app/classes/${id}`),
          fetch(`https://edumanagebackend.vercel.app/classes/${id}/assignments`)
        ]);

        if (!classResponse.ok || !assignmentsResponse.ok) {
          throw new Error('Failed to fetch class details');
        }

        const [classData, assignmentsData] = await Promise.all([
          classResponse.json(),
          assignmentsResponse.json()
        ]);

        setClassDetails(classData);
        setAssignments(assignmentsData.assignments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  const handleSubmit = async (assignmentId, file) => {
    if (!file) {
      setSubmitSuccess("Please select a file first");
      return;
    }

    setSubmitting(true);
    const res = await fetch('https://edumanagebackend.vercel.app/users');
    const users = await res.json();
    const userId = users.find((u) => u.email === user?.email)?.uid;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', assignmentId);

    formData.append('userId', userId); 

    try {
      const response = await fetch(`https://edumanagebackend.vercel.app/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Submission failed');

      const updatedAssignments = assignments.map(assignment =>
        assignment._id === assignmentId
          ? { ...assignment, submissionCount: assignment.submissionCount + 1 }
          : assignment
      );
      setAssignments(updatedAssignments);
      setSubmitSuccess("Assignment submitted successfully!");
    } catch (err) {
      setSubmitSuccess("Failed to submit assignment: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEvaluationSubmit = async () => {
    if (!evaluation.description.trim() || evaluation.rating === 0) {
      setSubmitSuccess("Please provide both a description and rating");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch('https://edumanagebackend.vercel.app/users');
      const users = await res.json();
      const userId = users.find((u) => u.email === user?.email)?.uid;
      
      if (!userId) {
        throw new Error('User not found');
      }
      
      const response = await fetch(`https://edumanagebackend.vercel.app/classes/${id}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          name: user?.displayName || 'Anonymous',
          photo: user?.photoURL || '',
          rating: evaluation.rating,
          description: evaluation.description.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit evaluation');
      }

      setIsEvaluationOpen(false);
      setEvaluation({ description: "", rating: 0 });
      setSubmitSuccess("Evaluation submitted successfully!");
    } catch (err) {
      setSubmitSuccess("Failed to submit evaluation: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState({});

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <FadeIn>
        <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Error Loading Course</h3>
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <Button onClick={() => navigate('/dashboard/my-enroll-class')} className="mt-4" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Courses
            </Button>
          </CardContent>
        </Card>
      </FadeIn>
    );
  }

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { status: 'overdue', color: 'red', text: 'Overdue' };
    if (daysLeft === 0) return { status: 'today', color: 'orange', text: 'Due Today' };
    if (daysLeft <= 3) return { status: 'urgent', color: 'yellow', text: `${daysLeft} days left` };
    return { status: 'normal', color: 'green', text: `${daysLeft} days left` };
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <FadeIn>
        <button
          onClick={() => navigate('/dashboard/my-enroll-class')}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to My Courses</span>
        </button>
      </FadeIn>

      {/* Course Header Card */}
      <FadeIn delay={0.1}>
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            {classDetails?.image && (
              <img 
                src={classDetails.image} 
                alt={classDetails.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl font-bold text-white mb-2">{classDetails?.title}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Instructor: {classDetails?.instructorName}</span>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md">
                  {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Dialog open={isEvaluationOpen} onOpenChange={setIsEvaluationOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg shadow-blue-500/30">
                    <Star className="w-4 h-4 mr-2" />
                    Teaching Evaluation Report (TER)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Submit Teaching Evaluation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Your Feedback
                      </label>
                      <Textarea
                        placeholder="Share your experience with this course..."
                        value={evaluation.description}
                        onChange={(e) => setEvaluation({ ...evaluation, description: e.target.value })}
                        className="min-h-[120px] dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Rating
                      </label>
                      <div className="flex items-center gap-3">
                        <Rating
                          onClick={(rate) => setEvaluation({ ...evaluation, rating: rate })}
                          initialValue={evaluation.rating}
                          size={32}
                          transition
                          fillColor="#f59e0b"
                          emptyColor="#d1d5db"
                          SVGclassName="inline-block"
                          allowFraction={false}
                          showTooltip
                          tooltipArray={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
                          tooltipDefaultText="Select a rating"
                          tooltipClassName="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[60px]">
                          {evaluation.rating > 0 ? `${evaluation.rating}/5` : 'No rating'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleEvaluationSubmit} 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={!evaluation.description.trim() || evaluation.rating === 0 || submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Send Evaluation
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Success/Error Alert */}
      {submitSuccess && (
        <FadeIn>
          <Alert className={`${submitSuccess.includes('Failed') || submitSuccess.includes('Please') ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'}`}>
            <AlertDescription className={submitSuccess.includes('Failed') || submitSuccess.includes('Please') ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}>
              {submitSuccess}
            </AlertDescription>
          </Alert>
        </FadeIn>
      )}

      {/* Assignments Section */}
      <FadeIn delay={0.2}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Assignments
            </h2>
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-none">
              {assignments.length} Total
            </Badge>
          </div>

          {assignments.length === 0 ? (
            <Card className="border-none shadow-sm bg-white dark:bg-gray-900/50 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Assignments Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your instructor hasn&apos;t posted any assignments for this course yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignments.map((assignment, index) => {
                const deadlineInfo = getDeadlineStatus(assignment.deadline);
                return (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900/50 backdrop-blur-xl group">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Assignment Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {assignment.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {assignment.description}
                                </p>
                              </div>
                              <Badge className={`ml-2 flex-shrink-0 ${
                                deadlineInfo.status === 'overdue' ? 'bg-red-500 text-white' :
                                deadlineInfo.status === 'today' ? 'bg-orange-500 text-white' :
                                deadlineInfo.status === 'urgent' ? 'bg-yellow-500 text-white' :
                                'bg-green-500 text-white'
                              } border-none`}>
                                {deadlineInfo.text}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {new Date(assignment.deadline).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <CheckCircle className="w-4 h-4" />
                                <span>{assignment.submissionCount || 0} submission{assignment.submissionCount !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>

                          {/* File Upload */}
                          <div className="flex flex-col gap-2 lg:w-64">
                            <label className="relative cursor-pointer">
                              <div className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed transition-all
                                ${selectedFile[assignment._id] 
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                <Upload className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {selectedFile[assignment._id] ? selectedFile[assignment._id].name.substring(0, 20) + '...' : 'Choose File'}
                                </span>
                              </div>
                              <Input 
                                type="file" 
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    setSelectedFile({...selectedFile, [assignment._id]: e.target.files[0]});
                                  }
                                }}
                                disabled={submitting}
                              />
                            </label>
                            <Button
                              onClick={() => {
                                if (selectedFile[assignment._id]) {
                                  handleSubmit(assignment._id, selectedFile[assignment._id]);
                                } else {
                                  setSubmitSuccess("Please select a file first");
                                }
                              }}
                              disabled={submitting || !selectedFile[assignment._id]}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Submit Assignment
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default MyEnrollClassDetails;