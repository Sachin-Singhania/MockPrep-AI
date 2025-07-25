"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ResumeExtracter } from "@/lib/actions/rag"
import { useChatStore } from "@/store/store"
import { FileText, Sparkles, Upload } from "lucide-react"
import { useRef, useState } from "react"
import ProfileCard from "./Profile/Profile"
import ProjectCard from "./Profile/Project"
import SkillCard from "./Profile/Skill"
import Exp from "./Profile/Work"


export function ProfileSection() {
  const imageInputref = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [_resume, setResume] = useState<File | null>(null)
  const { profile, user,updateSkills,updateProfilePic,updateProjects,updateWorkExp} = useChatStore();
  
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
          const hey = await ResumeExtracter(base64)
          if (typeof hey === 'string') {
            alert(hey)
          } else {
            const skill= new Set(hey.Skills);
            updateSkills(skill);
            updateProjects(hey.Projects);
            updateWorkExp(hey.WorkExperience);
          }
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error(err)
    }
  }
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const hey = URL.createObjectURL(file);
      updateProfilePic(hey);
    }
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
                <AvatarImage src={user?.profilePic ? user?.profilePic : "/placeholder.svg?height=128&width=128"} />
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
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard about={profile?.about} email={user?.email} name={user?.name} tagline={profile?.tagline} />
           <SkillCard skills={profile?.Skills} /> 
          <Exp experiences={profile?.WorkExperience }/>  
          <ProjectCard projects={ profile?.Projects}/>    
        </div>
      </div>
    </div>
  )
}
 

