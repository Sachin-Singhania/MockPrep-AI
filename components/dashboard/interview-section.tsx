"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, Clock, Star, Briefcase, Sparkles, Play } from "lucide-react"
import { useChatStore } from "@/store/store"
import { fillsJob } from "@/lib/actions/rag"
import { useRouter } from "next/navigation"

const pastInterviews = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp",
    date: "2024-01-15",
    duration: "45 min",
    score: 88,
    status: "completed",
  },
  {
    id: 2,
    jobTitle: "Full Stack Engineer",
    company: "StartupXYZ",
    date: "2024-01-10",
    duration: "60 min",
    score: 92,
    status: "completed",
  },
  {
    id: 3,
    jobTitle: "React Developer",
    company: "WebSolutions",
    date: "2024-01-05",
    duration: "30 min",
    score: 85,
    status: "completed",
  },
]

export function InterviewSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {profile}=useChatStore();
  const nav= useRouter();
  const [formData, setFormData] = useState<JobDescription>({
    jobTitle: "",
    jobDescription: "",
    skills: "",
    experience: 0,
    difficulty: "EASY",
  })

  const handleInputChange = (field: keyof JobDescription, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "experience" ? Number(value) : value,
    }))
  }

  const generateJobDetails = async () => {
    if(!profile) return;
    if(!profile.tagline) return;
    let experience = profile.WorkExperience;
    let currentYear= new Date().getFullYear();
    let min=currentYear,max=0;
    for (let index = 0; index < experience.length; index++) {
      const {startYear,endYear} = experience[index];
      if(endYear){
        if(max<endYear){
          max=endYear;
        }
      }
      if(min>startYear){
        min=startYear;
      }
    }
    if(max<=currentYear) max =currentYear;
    const data:UserDetails={
      userExperience : max-min==0 ? 0 : max-min  ,
      userSkills : profile.Skills,
      userTagline : profile.tagline,
    }
    const response = await fillsJob(data)
     if(typeof response ==="string"){
      console.log(response);
     }else{
      setFormData(response);
     }
    return;
  }

  const startInterview = () => {
    nav.push (`/interview/session?title=${encodeURIComponent(formData.jobTitle)}`)
    return;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h2>
          <p className="text-gray-600">Manage your interview sessions and practice history</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Interview</DialogTitle>
              <DialogDescription>Set up a new interview session with job details and requirements</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  />
                </div>
                <div>
                  <Label >Difficulty Level</Label>
                  <Select value={formData.difficulty ?? "SELECT"} onValueChange={(value) => handleInputChange("difficulty", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select level">
                        {formData.difficulty === "EASY"
                          ? "Easy"
                          : formData.difficulty === "MEDIUM"
                          ? "Medium"
                          : formData.difficulty === "HARD"
                          ? "Hard"
                          : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Paste the job description here..."
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input
                    id="skills"
                    placeholder="e.g. React, JavaScript, Node.js"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Input
                    id="experience"
                    placeholder="e.g. 3-5 years"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={generateJobDetails} className="flex-1 bg-transparent">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Job Details with AI
                </Button>
                <Button
                  onClick={startInterview}
                  disabled={!formData.jobTitle || !formData.jobDescription || !formData.skills || !formData.experience}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Interview
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Interview Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{pastInterviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    pastInterviews.reduce((acc, interview) => acc + interview.score, 0) / pastInterviews.length,
                  )}
                  %
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold text-gray-900">2.3h</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Past Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>Interview History</CardTitle>
          <CardDescription>Your completed interview sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastInterviews?.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{interview.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{interview.company}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {interview.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{interview.score}%</p>
                    <Badge
                      variant={interview.score >= 90 ? "default" : interview.score >= 80 ? "secondary" : "outline"}
                      className={
                        interview.score >= 90
                          ? "bg-green-100 text-green-800"
                          : interview.score >= 80
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {interview.score >= 90 ? "Excellent" : interview.score >= 80 ? "Good" : "Fair"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
