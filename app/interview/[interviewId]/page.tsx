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
import { useChatStore } from "@/store/store"
import { getInterviewDetails } from "@/lib/actions/api"
import { getStatus } from "@/lib/utils"


type RadarDataItem = {
  subject: string;
  score: number;
  fullMark: number;
};

export default function InterviewAnalytics() {
  const [isLoading, setIsLoading] = useState(true);
const { interviewId } = useParams() as { interviewId: string };
const { allAnalytics, user, addOrUpdateAnalytics } = useChatStore();
const [mockInterviewData, setMockInterviewData] = useState<InterviewData | null>(null);
const [radarData, setradarData] = useState<RadarDataItem[] | null>([]);
useEffect(() => {
  if (!interviewId || !user) return;

  const existingData = allAnalytics[interviewId];
  if (existingData) {
     let rdata:RadarDataItem[]= [
            { subject: "Communication", score: existingData.InterviewScores.communication, fullMark: 100 },
            { subject: "Technical", score: existingData.InterviewScores.technicalKnowledge, fullMark: 100 },
            { subject: "Problem Solving", score: existingData.InterviewScores.problemSolving, fullMark: 100 },
            { subject: "Vocabulary", score: existingData.InterviewScores.vocabulary, fullMark: 100 },
            { subject: "Relevance", score: existingData.InterviewScores.relevance, fullMark: 100 },
        ]
        setradarData(prev=>
         [ ...prev ?? [],
          ...rdata,]
        );
    setMockInterviewData(existingData);
    setIsLoading(false);
    return;
  }

  const fetchData = async () => {
    try {
      const res = await getInterviewDetails(interviewId);
      if (res.status === 200 ) {
        if(!res.data) return;
        const data: InterviewData = {
          aiNotes: res.data?.InterviewSummary,
          areasForImprovement: res.data?.GrowthAreas,
          candidateName: user.name as string,
          date: new Date(res.data.Interview.startTime),
           duration: res.data.Interview.endTime
              ? (() => {
                  const durationMs =
                    new Date(res.data.Interview.endTime).getTime() -
                    new Date(res.data.Interview.startTime).getTime();

                  const totalMinutes = Math.floor(durationMs / 60000);
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;

                  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                })()
              : "N/A Interview Analytics Failed",
          hrInsights: {
            culturalFit: res.data?.HRInsight?.CulturalFit as string,
            experienceLevel: res.data?.HRInsight?.ExperienceLevel as string,
            interviewReadiness: res.data?.HRInsight?.InterviewReadlineScore as number,
            learningPotential: res.data?.HRInsight?.LearningPotential as string,
            technicalCompetency: res.data?.HRInsight?.TechnicalCompetency as string,
          },
          InterviewScores: {
            communication: res.data?.CommunicationScore,
            problemSolving: res.data?.ProblemSolvingScore,
            relevance: res.data?.RelevanceScore,
            technicalKnowledge: res.data?.TechnicalScore,
            vocabulary: res.data?.VocabularyScore,
          },
          overallScore: res.data?.overallScore,
          position: res.data?.Interview.Jobtitle,
          questionPerformance: res.data?.questions.map((val: any, index: number) => ({
            question: `Q${index + 1}`,
            score: val.score,
            topic: val.question,
            status: getStatus(val.score).status,
          })),
          strengths: res.data?.KeyStrengths,
          technicalKeywords: res.data?.TechnicalKeywords,
        };
        let rdata:RadarDataItem[]= [
            { subject: "Communication", score: data.InterviewScores.communication, fullMark: 100 },
            { subject: "Technical", score: data.InterviewScores.technicalKnowledge, fullMark: 100 },
            { subject: "Problem Solving", score: data.InterviewScores.problemSolving, fullMark: 100 },
            { subject: "Vocabulary", score: data.InterviewScores.vocabulary, fullMark: 100 },
            { subject: "Relevance", score: data.InterviewScores.relevance, fullMark: 100 },
        ]
        setradarData(prev=>
         [ ...prev ?? [],
          ...rdata,]
        );

        addOrUpdateAnalytics(interviewId, data);
        setMockInterviewData(data);
      }
    } catch (err) {
      console.error("Failed to fetch interview data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [interviewId, allAnalytics, user]);

 
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
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{mockInterviewData?.candidateName}</h1>
            <p className="text-xl text-indigo-100 mb-2">{mockInterviewData?.position}</p>
            <div className="flex items-center justify-center gap-6 text-indigo-200">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{mockInterviewData?.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{mockInterviewData?.date.toLocaleDateString()}</span>
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
                <span className="text-4xl font-bold">{mockInterviewData?.overallScore}%</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Overall Performance</h2>
              <Badge variant={getScoreBadgeVariant(mockInterviewData?.overallScore!==undefined ? mockInterviewData.overallScore : 0)} className="text-lg px-4 py-2">
               {mockInterviewData?.overallScore !== undefined
                        ? mockInterviewData.overallScore >= 80
                          ? "Excellent Performance"
                          : mockInterviewData.overallScore >= 60
                            ? "Good Performance"
                            : "Needs Improvement"
                        : "No Data"}
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
                <span className="text-3xl font-bold">{mockInterviewData?.InterviewScores.communication}%</span>
              </div>
              <h3 className="font-semibold text-lg">Communication</h3>
              <p className="text-emerald-100 text-sm">Clear and effective</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Code className="h-8 w-8 opacity-80" />
                <span className="text-3xl font-bold">{mockInterviewData?.InterviewScores.technicalKnowledge}%</span>
              </div>
              <h3 className="font-semibold text-lg">Technical Knowledge</h3>
              <p className="text-blue-100 text-sm">Solid foundation</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="h-8 w-8 opacity-80" />
                <span className="text-3xl font-bold">{mockInterviewData?.InterviewScores.problemSolving}%</span>
              </div>
              <h3 className="font-semibold text-lg">Problem Solving</h3>
              <p className="text-purple-100 text-sm">Analytical approach</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="h-8 w-8 opacity-80" />
                <span className="text-3xl font-bold">{mockInterviewData?.InterviewScores.relevance}%</span>
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
                  <RadarChart data={radarData!=null ? radarData :[] }>
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
          {/* <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-xl">
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
                    data={mockInterviewData?.questionPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="question" />
                    <YAxis domain={[0, 100]} />
                    <Bar activeBar={false} dataKey="score" radius={[8, 8, 0, 0]}>
                      {mockInterviewData?.questionPerformance.map((entry, index) => (
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
                {mockInterviewData?.questionPerformance.map((q, index) => (
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
          </Card> */}
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
                    data={mockInterviewData?.questionPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="question" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      {mockInterviewData?.questionPerformance.map((_, i) => (
                        <Cell key={i} fill={["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"][i % 4]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3">
                {mockInterviewData?.questionPerformance.map((q, index) => {
                  const colors = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length] }}
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
                  )
                })}
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
              {mockInterviewData?.technicalKeywords.map((keyword, index) => (
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
                {mockInterviewData?.strengths.map((strength, index) => (
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
                {mockInterviewData?.areasForImprovement.map((area, index) => (
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
                    {mockInterviewData?.hrInsights.technicalCompetency}
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    Experience Level
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mockInterviewData?.hrInsights.experienceLevel}
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-500" />
                    Cultural Fit
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mockInterviewData?.hrInsights.culturalFit}
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
                    {mockInterviewData?.hrInsights.learningPotential}
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Interview Readiness Score
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={mockInterviewData?.hrInsights.interviewReadiness} className="h-3 bg-white/20" />
                    </div>
                    <span className="text-2xl font-bold">{mockInterviewData?.hrInsights.interviewReadiness}%</span>
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
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{mockInterviewData?.aiNotes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
      </div>
    </div>
  )
}
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const { question, topic, score } = payload[0].payload
    return (
      <div className="rounded-xl border bg-white/90 p-4 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{question}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{topic}</p>
        <p className="font-bold text-indigo-600 dark:text-indigo-400">Score: {score}%</p>
      </div>
    )
  }
  return null
}
