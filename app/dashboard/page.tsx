"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Briefcase, LogOut, Settings, Calendar, Clock, Star, FileText, MapPin, Mail, Edit } from "lucide-react"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { InterviewSection } from "@/components/dashboard/interview-section"
import { getProfile } from "@/lib/actions/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useChatStore } from "@/store/store"

type SidebarOption = "dashboard" | "profile" | "interviews"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<SidebarOption>("dashboard")

  const sidebarItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: Settings },
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "interviews" as const, label: "Interviews", icon: Briefcase },
  ]
  
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />
      case "interviews":
        return <InterviewSection />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 p-4 bg-transparent flex flex-col gap-y-6">
        
        {/* Top Card - Logo */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MockPrep</h1>
          </div>
        </div>

        {/* Bottom Card - Profile + Nav + Logout */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col flex-1 justify-between">
          

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2 mt-4">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}

function DashboardContent() {
  const {data:session,status} = useSession();  
  const {setUser,setProfile,user,profile}=useChatStore();
  const nav= useRouter();
  useEffect(() => {
    
  if (status === "loading") return;
  if (status == "unauthenticated" || !session?.user?.userId || !session.user.dashboardId) {
    if (user?.userId){
      profile (user.userId);
      return;
    }
    nav.push("/");
    return;
  };
  if(session.user.userId && session.user.dashboardId){
      const userval= {
         userId :session.user.userId,
         dashboardId :session.user.dashboardId,
          name : session.user.name as string,
          email : session.user.email as string,
          profilePic :session.user.image as string
      }
      setUser(userval);
      profile (session.user.userId);
      return;
    }
    async function profile(userId:string) {
      const {data}= await getProfile(userId);
      if(!data) return;
      const profile ={
        profileId : data.Profile?.id,
        about : data.Profile?.about ? data.Profile?.about : undefined,
        tagline : data.Profile?.tagline ? data.Profile?.tagline : undefined,
        interview : data.Interview ?? [],
        Projects : data.Profile?.Projects ?? [],
        Skills : new Set(data.Profile?.Skills) ?? [],
        WorkExperience : data.Profile?.WorkExperience ?? [],
      }
      setProfile(profile)
    }
  }, [status])
 
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Track your interview preparation progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interviews Completed</p>
                <p className="text-2xl font-bold text-gray-900">{ profile?.interview && profile?.interview?.length> 0 ?  profile?.interview?.length : 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{
                  profile?.interview && profile.interview.length > 0
                    ? (
                        profile.interview.reduce(
                          (sum, interview) =>
                            sum +
                            (interview.Analytics?.overallScore ?? 0),
                          0
                        ) / profile.interview.length
                      ).toFixed(2)
                    : 0
                  }%</p>
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
                <p className="text-sm text-gray-600">Practice Hours</p>
                <p className="text-2xl font-bold text-gray-900">{
  profile?.interview && profile.interview.length > 0
    ? profile.interview.reduce((sum, interview) => {
        if (interview.endTime && interview.startTime) {
          const diff = interview.endTime.getTime() - interview.startTime.getTime();
          return sum + (diff / (1000 * 60 * 60)); 
        }
        return sum;
      }, 0).toFixed(1)
    : 0
}
</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{
  profile?.interview && profile.interview.length > 0
    ? (() => {
        const res =
          profile.interview.filter(
            (interview) => (interview.Analytics?.overallScore ?? 0) >= 65
          ).length / profile.interview.length;
        return res <= 0 ? 0 : res;
      })()
    : 10
}
%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Card - Red Area */}
<Card className="h-fit shadow-xl rounded-2xl border border-gray-100 bg-white">
  <CardHeader className="pb-3 border-b border-gray-100">
    <div className="flex items-center justify-between">
      <CardTitle className="text-2xl font-semibold text-gray-900">Profile Overview</CardTitle>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition"
      >
        <Edit className="w-4 h-4"  />
        Edit Profile
      </Button >
    </div>
  </CardHeader>

  <CardContent className="space-y-6 pt-4">
    {/* Profile Header */}
    <div className="flex items-center space-x-5">
      <Avatar className="w-20 h-20 shadow border border-gray-200">
        <AvatarImage src={user?.profilePic as string} />
        <AvatarFallback className="bg-blue-600 text-white text-2xl">{user?.name ? user?.name?.slice(1) : 'J'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900">{ user?.name ? user?.name : 'John Doe'}</h3>
        <div className="flex items-center text-gray-500 mt-1">
          <Mail className="w-4 h-4 mr-2" />
          <span className="text-sm">{user?.email ? user?.email : 'john.doe@example.com'}</span>
        </div>
      </div>
    </div>

    {/* Tagline */}
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl shadow-sm border border-indigo-100">
      <h4 className="font-semibold text-gray-900 mb-1">{profile?.tagline ? profile?.tagline : 'Complete your profile to see your tagline'}</h4>
      <p className="text-gray-700 text-sm leading-relaxed">
        {profile?.about ? profile?.about : 'Complete your profile to see your tagline'}
      </p>
    </div>

    {/* Work Experience */}
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm text-center">
        <div className="text-4xl font-extrabold text-gray-900 mb-1"> {
   profile?.WorkExperience && profile?.WorkExperience?.length > 0
      ? (() => {
        let currentYear= new Date().getFullYear();
          let { min, max } :{min:number,max:number} = profile?.WorkExperience.reduce(
            ({ min, max }, { startYear, endYear }) => ({
              min: Math.min(min, startYear),
              max: endYear ? Math.max(max, endYear) : max,
            }),
            { min: currentYear, max: 0 }
          );
           if(max<=currentYear) max =currentYear;
          return max - min;
        })()
      : 0
  }</div>
        <div className="text-sm text-gray-600">Years Experience</div>
      </div>
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm text-center">
        <div className="text-4xl font-extrabold text-gray-900 mb-1">{profile?.Projects ? profile?.Projects?.length : 0}</div>
        <div className="text-sm text-gray-600">Projects Completed</div>
      </div>
    </div>

    {/* Skills */}
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">Top Skills</h4>
      <div className="flex flex-wrap gap-2">
        {profile?.Skills && Array.from(profile.Skills).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="border border-gray-300 bg-white/70 text-gray-800 hover:bg-white shadow-sm rounded-full px-3 py-1 text-sm transition"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>

  </CardContent>
</Card>


        {/* Recent Activity - Blue Area */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interview sessions and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Frontend Developer Interview</p>
                  <p className="text-sm text-gray-600">Completed 2 hours ago • Score: 88%</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Excellent
                </Badge>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Resume Updated</p>
                  <p className="text-sm text-gray-600">Updated 1 day ago</p>
                </div>
                <Badge variant="outline">Complete</Badge>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Skill Assessment Completed</p>
                  <p className="text-sm text-gray-600">JavaScript • Advanced Level</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Advanced
                </Badge>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Interview Scheduled</p>
                  <p className="text-sm text-gray-600">Backend Engineer • Tomorrow 2:00 PM</p>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  Upcoming
                </Badge>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Profile Viewed</p>
                  <p className="text-sm text-gray-600">By TechCorp Recruiter • 3 days ago</p>
                </div>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  New
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
