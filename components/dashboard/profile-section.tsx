"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, X, Upload, FileText, Sparkles } from "lucide-react"
import { ResumeExtracter } from "@/lib/actions/rag"
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { DialogFooter } from "../ui/dialog"
import { useChatStore } from "@/store/store"


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
const Exp= ({experiences}:{experiences:Experience[]| undefined })=>{
  const   setExperiences = (experiences:Experience[]) => {}
  return (
    <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <button
                  className="text-sm px-3 py-1 bg-black text-white rounded-md hover:bg-gray-500 transition"
                >
                  Save
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experiences?.map((val,index) => (
                  <div key={val.id ? val.id : index+1} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{val.role}</p>
                        <p className="text-sm text-gray-600">
                          {val.company} •{" "}
                          {typeof val.endYear === "number"
                            ? val.endYear - val.startYear === 0
                              ? "<1 years"
                              : `${val.endYear - val.startYear} years`
                            : `${new Date().getFullYear() - val.startYear} years`}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{val.endYear ? `${val.startYear}-${val.endYear}` : "Current"}</Badge>
                  </div>
                ))}
              </div>

              <AddExperienceDialog onAddExperience={(exp) => setExperiences([...experiences ??[] ,exp])} />
            </CardContent>
          </Card>
    </>
  )
}
const ProfileCard = ({name, email,tagline,about} :{ name:string| undefined| null ,email:string| undefined ,tagline:string| undefined ,about:string| undefined })=> {
     const setName = (name: string) => {}
     const setAbout = (about: string) => {}
     const setTagline = (tagline: string) => {}
  return(
    <>
    <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Details</CardTitle>
                <button
                  className="text-sm px-3 py-1 bg-black text-white rounded-md hover:bg-gray-500 transition"
                >
                  Save
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name as string | undefined} onChange={(e) =>{
                          setName(e.target.value)

                  } } placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email}  type="email" placeholder="john@example.com" disabled />
                </div>
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" value={tagline} onChange={(e) =>{
                    setTagline(e.target.value)
                } } placeholder="Full Stack Developer" />
              </div>

              <div>
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  value={about}
                  onChange={(e) =>{
                setAbout(e.target.value)
                  }}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
    </>
  )
}
const SkillCard = ({skills} : {skills:Set<string>| undefined }) => {
 
  const [newSkill, setNewSkill] = useState("")
    const addSkill = () => {
    
  }

  const removeSkill = (skillToRemove: string) => {
  }
  return(
    <>
   <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <button
                  className="text-sm px-3 py-1 bg-black text-white rounded-md hover:bg-gray-500 transition"
                >
                  Save
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
             {skills && Array.from(skills).map((skill) => (
        <Badge key={skill} variant="secondary" className="px-3 py-1">
          {skill}
          <button
            onClick={() => removeSkill(skill)}
            className="ml-2 text-gray-500 hover:text-red-500"
          >
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
    </>
  )
}
const ProjectCard = ({projects}: {projects:Project[] | undefined}) => {
  const setProjects = (projects: Project[]) => {
  }
  return (
    <>
      <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <button
                  className="text-sm px-3 py-1 bg-black text-white rounded-md hover:bg-gray-500 transition"
                >
                  Save
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects?.map((project , index) => (
                  <div key={project.id ? project.id : index+1} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                ))}
              </div>
              <AddProjectDialog onAddProject={(proj) => setProjects([...projects ??[], proj])} />
            </CardContent>
          </Card>
    </>
  )
}
interface Props {
  onAddExperience: (exp: Experience) => void;
}

const AddExperienceDialog = ({ onAddExperience }: Props) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startYear, setStartYear] = useState<number | "">("");
  const [endYear, setEndYear] = useState<number | "">("");

  const handleSave = () => {
    if (!title || !company || !startYear) return;

    onAddExperience({
      role: title,
      company,
      startYear: Number(startYear),
      endYear: endYear ? Number(endYear) : undefined,
    });

    setTitle("");
    setCompany("");
    setStartYear("");
    setEndYear("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="grid gap-4 py-4">
          <Input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
          <Input
            placeholder="Start Year"
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
          />
          <Input
            placeholder="End Year (Leave empty if current)"
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
function AddProjectDialog({
  onAddProject,
}: {
  onAddProject: (project: Project) => void;
}) {
  const [project, setProject] = useState<Project>({
    name: "",
    description: "",
  });

  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!project.name || !project.description) return;
    onAddProject(project);
    setProject({ name: "", description: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          <Plus className="w-4 h-14 mr-2" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <Input
            placeholder="Project Name"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
          />
          <Textarea
            placeholder="Project Description"
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
          />
          <Button onClick={handleAdd} className="w-full">
            Save Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}