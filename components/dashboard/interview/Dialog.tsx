"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createInterview } from "@/lib/actions/api"
import { fillsJob } from "@/lib/actions/rag"
import { useChatStore } from "@/store/store"
import { Play, Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSpeechRecognition } from "react-speech-recognition"
import { toast } from "sonner"
export default function DialogBox() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { profile, setInterview, user } = useChatStore();
  const [formData, setFormData] = useState<JobDescription>({
    jobTitle: "",
    jobDescription: "",
    skills: "",
    experience: 0,
    difficulty: "BEGINNER",
  });
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();
  const nav = useRouter();
  const handleInputChange = (field: keyof JobDescription, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "experience" ? Number(value) : value,
    }))
  }

  const generateJobDetails = async () => {
    if (!profile) return;
    if (!profile.tagline) return;
    let experience = profile.WorkExperience;
    let currentYear = new Date().getFullYear();
    let min = currentYear, max = 0;
    for (let index = 0; index < experience.length; index++) {
      const { startYear, endYear } = experience[index];
      if (endYear) {
        if (max < endYear) {
          max = endYear;
        }
      }
      if (min > startYear) {
        min = startYear;
      }
    }
    if (max <= currentYear) max = currentYear;
    const data: UserDetails = {
      userExperience: max - min == 0 ? 0 : max - min,
      userSkills: Array.from(profile.Skills),
      userTagline: profile.tagline,
    }
    const response = await fillsJob(data)
    if (response.status === false || response.data === undefined) {
      toast.error(response.error);
      return;
    }
    if (typeof response.data === "object") {
      setFormData(response.data);
      if (!user?.dashboardId) return;
    } else {
      console.log(response);
    }
    return;
  }

  const startInterview = async () => {
    if (!user?.dashboardId) {
      toast("DashboardId doesn't Exsist ", {
        richColors: true,
      });
      return;
    };
    if (!browserSupportsSpeechRecognition) {
      toast("Sorry, Browser Doesn't Support Speech Recognition", {
        richColors: true,
      });
      return;
    }
    const resp = await createInterview(user?.dashboardId, formData);
    if (!resp?.status) {
      toast.error(resp.message || "An error occurred while creating the interview");
      return;
    };
    const data: interviewDetails = {
      InterviewChatHistory: [],
      JobDescription: formData,
      name: user.name as string,
      startTime: new Date(),
      id: resp?.data?.id
    }
    setInterview(data);
    toast.success("Interview is going to start")
    nav.push(`/interview/session?title=${encodeURIComponent(formData.jobTitle)}`)
    return;
  }

  const isFormInvalid = !formData.jobTitle || !formData.jobDescription || !formData.skills || formData.experience < 0;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      {/* Header Text Section */}
      <div className="text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Interviews
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your interview sessions and practice history
        </p>
      </div>

      {/* Button Section */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 justify-center">
            <Plus className="w-4 h-4 mr-2" />
            New Interview
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Interview</DialogTitle>
            <DialogDescription>
              Set up a new interview session with job details and requirements
            </DialogDescription>
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
                <Label>Difficulty Level</Label>
                <Select
                  value={formData.difficulty ?? "SELECT"}
                  onValueChange={(value) => handleInputChange("difficulty", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level">
                      {formData.difficulty === "BEGINNER"
                        ? "BEGINNER"
                        : formData.difficulty === "INTERMEDIATE"
                          ? "INTERMEDIATE"
                          : formData.difficulty === "ADVANCED"
                            ? "ADVANCED"
                            : ""}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                    <SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem>
                    <SelectItem value="ADVANCED">ADVANCED</SelectItem>
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

            <div className="flex flex-col md:flex-row gap-3">
              <Button
                variant="outline"
                onClick={generateJobDetails}
                className="flex-1 bg-transparent"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Job Details with AI
              </Button>
              <Button
                onClick={startInterview}
                disabled={isFormInvalid}
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
  )
}
