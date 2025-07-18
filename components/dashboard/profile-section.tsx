"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Code, Plus, X, Upload, FileText, Sparkles } from "lucide-react"
import { ResumeExtracter } from "@/lib/actions/rag"

interface Projects {
  id: string,
  name: string,
  description: string,
}
interface Experience {
  title: string
  company: string
  duration: string
  badge: string
  badgeVariant: "default" | "secondary" | "destructive" | "outline" 
}

export function ProfileSection() {
  const imageInputref = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // All state hooks
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [tagline, setTagline] = useState("")
  const [about, setAbout] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [projects, setProjects] = useState<Projects[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [avatar, setAvatar] = useState<File | null>(null)
  const [resume, setResume] = useState<File | null>(null)

  const handleButtonClickImage = () => {
    imageInputref.current?.click()
  }

  const handleButtonClickFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== "application/pdf" || file.size > 2 * 1024 * 1024) return

    setResume(file)

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result?.toString()
        if (base64) {
          const { Projects, Skills, WorkExperience } = await ResumeExtracter(base64)
          // You can update states here later
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatar(file)
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile</h2>
        <p className="text-gray-600">Manage your personal information and professional details</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={avatar ? URL.createObjectURL(avatar) : "/placeholder.svg?height=128&width=128"} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">JD</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                ref={imageInputref}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <Button variant="outline" size="sm" onClick={handleButtonClickImage}>
                <Upload className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* AI Resume Analyzer */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                AI Resume Analyzer
              </CardTitle>
              <CardDescription>Upload your resume and let AI fill your profile automatically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drop your resume here or click to browse</p>
                <p className="text-xs text-gray-500">Supports PDF files up to 10MB</p>
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <Button className="mt-3" size="sm" onClick={handleButtonClickFile}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Full Stack Developer" />
              </div>

              <div>
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-2 text-gray-500 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experiences.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">No experience added yet.</p>
                ) : (
                  experiences.map((exp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-sm text-gray-600">{exp.company} • {exp.duration}</p>
                      </div>
                      <Badge variant={exp.badgeVariant}>{exp.badge}</Badge>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="px-8">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
