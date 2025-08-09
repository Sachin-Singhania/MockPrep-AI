"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTimeDiffInMins } from "@/lib/utils"
import { useChatStore } from "@/store/store"
import { Briefcase, Calendar, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import DialogBox from "./interview/Dialog"
import InterviewStats from "./interview/Stats"
import { toast } from "sonner"


export function InterviewSection() {
  const { profile } = useChatStore();
  const [interviews, setinterviews] = useState<pastInterviews[] | null>();
  const nav = useRouter();

  const pastInterviews = useMemo(() => {
    if (!profile?.interview) return [];

    return profile.interview
      .filter(int => int.startTime && int.endTime)
      .map(int => ({
        id: int.id,
        jobTitle: int.Jobtitle,
        date: new Date(int.startTime).toLocaleDateString(),
        duration: getTimeDiffInMins(new Date(int.startTime), new Date(int.endTime!)),
        score: int.Analytics?.overallScore || 0,
      }));
  }, [profile?.interview]);


  const interviewStats = useMemo(() => {
    const totalCount = pastInterviews.length;
    if (totalCount === 0) {
      return { totalCount: 0, averageScore: 0, thisMonthCount: 0, totalHours: "0h" };
    }

    const totalScore = pastInterviews.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = Math.round(totalScore / totalCount);

    const currentMonth = new Date().getMonth();
    const thisMonthCount = pastInterviews.filter(p => p.date.split("/")[0] === (currentMonth + 1).toString()).length;

    const totalMinutes = pastInterviews.reduce((acc, curr) => acc + curr.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    return { totalCount, averageScore, thisMonthCount, totalHours: `${totalHours}h` };
  }, [pastInterviews]);


  useEffect(() => {
    if (!profile) {
      toast.error("Profile data not found")
      nav.push("/");
    };
    let data: pastInterviews[] = [];
    if (profile?.interview == null) return;
    if (profile.interview) {
      data = profile.interview
        .filter((int) => int.startTime && int.endTime)
        .map((int) => ({
          id: int.id,
          jobTitle: int.Jobtitle,
          date: new Date(int.startTime).toLocaleDateString(),
          duration: `${getTimeDiffInMins(new Date(int.startTime), new Date(int.endTime!))} mins`,
          score: int.Analytics?.overallScore || 0,
        }));
      setinterviews(data);
    }
  }, [profile])

  return (
    <div className="p-8">
      <div>
        <DialogBox />
      </div>
      {/* Interview Stats */}
      <InterviewStats stats={interviewStats} />
      {/* Past Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>Interview History</CardTitle>
          <CardDescription>Your completed interview sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews && interviews?.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{interview.jobTitle ? interview.jobTitle : "No Job Title"}</h4>
                    <div className="flex items-center space-x-4 mt-1 ">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 items-center hidden sm:flex">
                        <Clock className="w-3 h-3 mr-1" />
                        {interview.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block md:hidden lg:block">
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
                  <Button variant="ghost" size="sm" onClick={() => {
                    nav.push(`/interview/${interview.id}`)
                  }}>
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








