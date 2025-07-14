"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"
import {
  ArrowLeft,
  Download,
  Share2,
  TrendingUp,
  MessageSquare,
  Code,
  Lightbulb,
  Target,
  Star,
  AlertCircle,
  Award,
  Brain,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
} from "lucide-react"
import Link from "next/link"

// Mock data - in real app, this would come from API
const mockInterviewData = {
  id: "123",
  candidateName: "John Doe",
  position: "Senior Frontend Developer",
  date: "2024-01-15",
  duration: "45 minutes",
  overallScore: 78,
  scores: {
    communication: 85,
    technicalKnowledge: 72,
    problemSolving: 80,
    vocabulary: 75,
    relevance: 82,
  },
  questionPerformance: [
    { question: "Q1", score: 85, topic: "React Fundamentals", status: "excellent" },
    { question: "Q2", score: 70, topic: "State Management", status: "good" },
    { question: "Q3", score: 78, topic: "Performance Optimization", status: "good" },
    { question: "Q4", score: 82, topic: "Testing Strategies", status: "excellent" },
  ],
  technicalKeywords: [
    "React",
    "JavaScript",
    "TypeScript",
    "Redux",
    "Hooks",
    "Components",
    "State Management",
    "API Integration",
  ],
  strengths: [
    "Strong understanding of React fundamentals",
    "Good communication skills and clear explanations",
    "Demonstrates practical experience with modern tools",
    "Shows enthusiasm for learning new technologies",
  ],
  areasForImprovement: [
    "Deepen knowledge of advanced state management patterns",
    "Improve understanding of performance optimization techniques",
    "Practice explaining complex technical concepts more concisely",
    "Strengthen testing methodology knowledge",
  ],
  hrInsights: {
    technicalCompetency: "Mid-level. Shows solid foundation but needs growth in advanced concepts.",
    experienceLevel: "Approximately 3-4 years of relevant experience.",
    culturalFit: "Good fit. Demonstrates collaborative mindset and growth orientation.",
    learningPotential: "High. Shows curiosity and willingness to learn new technologies.",
    interviewReadiness: 75,
  },
  aiNotes:
    "The candidate demonstrated a solid understanding of React fundamentals and showed good problem-solving approach. Communication was clear and professional throughout the interview. Some hesitation was noted when discussing advanced state management patterns, indicating an area for potential growth. Overall performance suggests readiness for a mid-level position with mentorship opportunities for advancement.",
}

const radarData = [
  { subject: "Communication", score: mockInterviewData.scores.communication, fullMark: 100 },
  { subject: "Technical", score: mockInterviewData.scores.technicalKnowledge, fullMark: 100 },
  { subject: "Problem Solving", score: mockInterviewData.scores.problemSolving, fullMark: 100 },
  { subject: "Vocabulary", score: mockInterviewData.scores.vocabulary, fullMark: 100 },
  { subject: "Relevance", score: mockInterviewData.scores.relevance, fullMark: 100 },
]

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]

export default function InterviewAnalytics() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400"
    if (score >= 60) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
    if (score >= 60) return "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
    return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">Interview Complete</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{mockInterviewData.candidateName}</h1>
            <p className="text-xl text-indigo-100 mb-2">{mockInterviewData.position}</p>
            <div className="flex items-center justify-center gap-6 text-indigo-200">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{mockInterviewData.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{mockInterviewData.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 relative z-10 space-y-8 pb-12">
        {/* Overall Score Card */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-lg">
                <span className="text-4xl font-bold">{mockInterviewData.overallScore}%</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Overall Performance</h2>
              <Badge variant={getScoreBadgeVariant(mockInterviewData.overallScore)} className="text-lg px-4 py-2">
                {mockInterviewData.overallScore >= 80
                  ? "Excellent Performance"
                  : mockInterviewData.overallScore >= 60
                    ? "Good Performance"
                    : "Needs Improvement"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="h-8 w-8 opacity-80" />
                <span className="text-3xl font-bold">{mockInterviewData.scores.communication}%</span>
              </div>
              <h3 className="font-semibold text-lg">Communication</h3>
              <p className="text-emerald-100 text-sm">Clear and effective</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Code className="h-8 w-8 opacity-80" />
                <span className="text-3xl font-bold">{mockInterviewData.scores.technicalKnowledge}%</span>
              </div>
              <h3 className="font-semibold text-lg">Technical Knowledge</h3>
              <p className="text-blue-100 text-sm">Solid foundation</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="h-8 w-8 opacity-80" />
                <span className="text-3xl font-bold">{mockInterviewData.scores.problemSolving}%</span>
              </div>
              <h3 className="font-semibold text-lg">Problem Solving</h3>
              <p className="text-purple-100 text-sm">Analytical approach</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="h-8 w-8 opacity-80" />
                <span className="text-3xl font-bold">{mockInterviewData.scores.relevance}%</span>
              </div>
              <h3 className="font-semibold text-lg">Relevance</h3>
              <p className="text-orange-100 text-sm">On-topic responses</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Overview Radar Chart */}
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                Performance Overview
              </CardTitle>
              <CardDescription className="text-base">Multi-dimensional skill assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" className="text-sm" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Question Performance Bar Chart */}
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                Question Performance
              </CardTitle>
              <CardDescription className="text-base">Individual question breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockInterviewData.questionPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="question" />
                    <YAxis domain={[0, 100]} />
                    <Bar activeBar={false} dataKey="score" radius={[8, 8, 0, 0]}>
                      {mockInterviewData.questionPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3">
                {mockInterviewData.questionPerformance.map((q, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium">{q.question}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{q.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {q.score >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className="font-semibold">{q.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Keywords */}
        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <Code className="h-5 w-5 text-white" />
              </div>
              Technical Keywords Used
            </CardTitle>
            <CardDescription className="text-base">Technologies and concepts demonstrated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {mockInterviewData.technicalKeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900 dark:hover:to-purple-900 transition-all duration-200"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 text-xl">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Star className="h-5 w-5 text-white" />
                </div>
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {mockInterviewData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-4 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-700 dark:text-amber-400 text-xl">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                Growth Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {mockInterviewData.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start gap-4 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* HR Insights */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400 text-xl">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              HR Insights & Assessment
            </CardTitle>
            <CardDescription className="text-base">Professional evaluation for hiring decisions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4 text-indigo-500" />
                    Technical Competency
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mockInterviewData.hrInsights.technicalCompetency}
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    Experience Level
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mockInterviewData.hrInsights.experienceLevel}
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-500" />
                    Cultural Fit
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mockInterviewData.hrInsights.culturalFit}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-indigo-500" />
                    Learning Potential
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mockInterviewData.hrInsights.learningPotential}
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Interview Readiness Score
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={mockInterviewData.hrInsights.interviewReadiness} className="h-3 bg-white/20" />
                    </div>
                    <span className="text-2xl font-bold">{mockInterviewData.hrInsights.interviewReadiness}%</span>
                  </div>
                  <p className="text-indigo-100 text-sm mt-2">Ready for mid-level positions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Interviewer Notes */}
        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-xl">
              <div className="p-2 bg-slate-600 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              AI Interviewer Analysis
            </CardTitle>
            <CardDescription className="text-base">
              Comprehensive performance summary and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-white/80 dark:bg-slate-800/80 rounded-xl border-l-4 border-indigo-500">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{mockInterviewData.aiNotes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
      </div>
    </div>
  )
}
