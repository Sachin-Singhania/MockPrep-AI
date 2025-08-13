import { getStatus, timeAgo } from "@/lib/utils";
import { JsonObject } from "@prisma/client/runtime/library";
import { Briefcase, FileText, User } from "lucide-react";
import { useRouter } from "next/router";
import { Badge } from "./badge";

export function ActivityItem({ activity }: { activity: any}) {
  const content = activity.content as JsonObject;
  switch (activity.type) {
    case "INTERVIEW": {
      const { interviewId, jobTitle, overallScore, date } = content as {
        interviewId: string;
        jobTitle: string;
        overallScore: number;
        date: string;
      };
      const nav= useRouter();
      const dateObj = new Date(date);
      const time = timeAgo(dateObj);
      return (
         <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{jobTitle}</p>
                        <p className="text-sm text-gray-600" onClick={
                          () => {
                            nav.push(`interview/${ interviewId}`);
                          }
                        }>{"Comleted "+ time} • Score : {overallScore}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {getStatus(overallScore).status}
                      </Badge>
                    </div>
      );
    }
    case "DASHBOARD_CREATED":{
      const {date } = content as {
        date: string;
      };
      return (
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                 <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Dashboard Created</p>
                  <p className="text-sm text-gray-600">{"Created " + timeAgo(new Date(date))}</p>
                </div>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  New
                </Badge>
              </div>
      );
    }

    case "PROFILE_UPDATED":{
      const {date } = content as {
        date: string;
      };
      return (
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Profile Updated</p>
                  <p className="text-sm text-gray-600">{"Updated " + timeAgo(new Date(date))}</p>
                </div>
                <Badge variant="outline">Complete</Badge>
              </div>
      );
    }
    default:
      return null;
  }
}
