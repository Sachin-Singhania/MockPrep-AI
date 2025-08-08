"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProfile } from "@/lib/actions/api"
import { getTimeDiffInMins } from "@/lib/utils"
import { useChatStore } from "@/store/store"
import { Briefcase, Calendar, Clock, Edit, FileText, Mail, Star, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { toast } from "sonner"
import InterviewStats from "./interview/Stats"

export function DashboardContent({toggle}:{toggle(status:boolean):void}) {
  const {data:session,status} = useSession();  
  const {setUser,setProfile,user,profile}=useChatStore();
  const nav= useRouter();
  useEffect(() => {
  if (status === "loading") return;
  if (status == "unauthenticated" || !session?.user?.userId || !session.user.dashboardId) {
    if (user?.userId){
      if(profile?.profileId){
         return;
      }
      addprofile (user.userId);
      return;
    }
    toast.error("User Not Logged In");
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
      if(profile?.profileId){
         return;
      }
      addprofile (session.user.userId);
      return;
    }
    async function addprofile(userId:string) {
      const {data,message}= await getProfile(userId);
      if(!data) {
        toast.error(message);
        return;
      };
      toast.success(message);
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
  
    const toggleProfile = () => {
        toggle(true);
    }
    const interviewStats = useMemo(() => {
     const totalCount = profile?.interview?.length || 0;
     if (totalCount === 0) {
       return { totalCount: 0, averageScore: 0, successRate: 0, totalHours: "0h" };
      }
      const interivews= profile?.interview || [];
 
     const totalScore = interivews.reduce((acc, curr) => acc + (curr.Analytics?.overallScore ?? 0), 0);
     const averageScore = Math.round(totalScore / totalCount);
 
     const totalMinutes = interivews.reduce((acc, curr) => acc + getTimeDiffInMins(new Date(curr.startTime), new Date(curr.endTime!)), 0);
     const totalHours = (totalMinutes / 60).toFixed(1);
      const successRate =
                    interivews.filter(
                      (interview) =>
                        (interview.Analytics?.overallScore ?? 0) >= 65
                    ).length / interivews.length;
 
     return { totalCount, averageScore, successRate, totalHours: `${totalHours}h` };
   }, [profile?.interview]);
  return (
     <div className="p-4 sm:p-6 md:p-8">
    <div className="mb-6 sm:mb-8 text-center md:text-left">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Dashboard
      </h2>
      <p className="text-gray-600 text-sm sm:text-base">
        Track your interview preparation progress
      </p>
    </div>

      {/* Stats Cards */}
      <InterviewStats stats={interviewStats} />

      {/* Profile Section */}


    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Profile Card - Red Area */}
<Card className="w-full h-fit shadow-xl rounded-2xl border border-gray-100 bg-white ">
  {/* Header */}
  <CardHeader className="pb-3 border-b border-gray-100">
    <div className="flex items-center justify-between flex-wrap gap-2">
      <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
        Profile Overview
      </CardTitle>
      <Button
        onClick={toggleProfile}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition"
      >
        <Edit className="w-4 h-4" />
        Edit Profile
      </Button>
    </div>
  </CardHeader>

  {/* Content */}
  <CardContent className="space-y-6 pt-4">
    {/* Profile Info */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
      <Avatar className="w-20 h-20 shadow border border-gray-200">
        <AvatarImage src={user?.profilePic as string} />
        <AvatarFallback className="bg-blue-600 text-white text-2xl">
          {user?.name ? user?.name.charAt(0) : 'J'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1 min-w-0">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          {user?.name || 'John Doe'}
        </h3>
        <div className="flex items-center justify-center sm:justify-start text-gray-500 text-sm ">
          <Mail className="w-4 h-4 mr-2" />
          <div className="truncate">
          {user?.email || 'john.doe@example.com'}
          </div>
        </div>
      </div>
    </div>

    {/* Tagline + About */}
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl shadow-sm border border-indigo-100">
      <h4 className="font-semibold text-gray-900 mb-1">
        {profile?.tagline || 'Complete your profile to see your tagline'}
      </h4>
      <p className="text-gray-700 text-sm leading-relaxed">
        {profile?.about || 'Complete your profile to see your about section'}
      </p>
    </div>

    {/* Experience + Projects */}
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
      {/* Experience */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm text-center">
        <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
          {profile?.WorkExperience && profile?.WorkExperience.length > 0
            ? (() => {
                const currentYear = new Date().getFullYear();
                const { min, max } = profile.WorkExperience.reduce(
                  ({ min, max }, { startYear, endYear }) => ({
                    min: Math.min(min, startYear),
                    max: endYear ? Math.max(max, endYear) : max,
                  }),
                  { min: currentYear, max: 0 }
                );
                return Math.max(currentYear, max) - min;
              })()
            : 0}
        </div>
        <div className="text-sm text-gray-600">Years Experience</div>
      </div>

      {/* Projects */}
      <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm text-center">
        <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
          {profile?.Projects?.length || 0}
        </div>
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
        className="border border-gray-300 bg-white/70 text-gray-800 hover:bg-white shadow-sm rounded-full px-3 py-1 text-xs sm:text-sm"
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
              <div>
                 {/* we will add this feature later */}
                <p className="text-gray-500 text-sm">Feature coming soon...</p>
              </div>
              {/* <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
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
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
