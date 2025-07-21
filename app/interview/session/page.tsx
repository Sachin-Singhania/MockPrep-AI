"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Video, VideoOff, Phone, Settings, Send, Bot, User, Clock } from "lucide-react"
import { useChatStore } from "@/store/store"
import { analytics, InterviewTaking } from "@/lib/actions/rag"
import { addMessage } from "@/lib/actions/api"

export default function InterviewSessionPage() {
  const searchParams = useSearchParams()
  const jobTitle = searchParams.get("title");
  const nav = useRouter();
  const [timeLeft, setTimeLeft] = useState(600)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [message, setMessage] = useState("")
  
  const {interview,addOrUpdateAnalytics,addInterviewMessage}=useChatStore();

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Handle interview end
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  const firstMessage= async() =>{
     if (!message.trim()) return
    if(!interview?.id) return;
    const newMessage:InterviewChat = {
      Sender: "ASSISTANT",
      Content:  `Hi there! Welcome to your ${jobTitle} interview. I'm excited to learn more about you and your experience. What motivated you to apply for this role?`,
      ContentType :"FORMALCHAT",
    }
    const res= await addMessage(interview?.id,newMessage);
    if(res.status==200 && res.data){
      const msg= {
        ...newMessage,
        id: res.data.id,
      }
     addInterviewMessage(msg);
   }else{
    return;
   }
  }
  const sendMessage =async () => {
       if (!message.trim()) return
          if(!interview?.id) return;
       const lastType = interview.InterviewChatHistory.at(-1)?.ContentType;
        if (lastType === "END"){
          endInterview();
          return;
        }
        const nextTypeMap = {
          FORMALCHAT: "FORMALCHAT",
          QUESTION: "ANSWER",
          VALIDATION: "FORMALCHAT",
        } as const;

        const ContentType = nextTypeMap[lastType as keyof typeof nextTypeMap];

        const newMessage: InterviewChat = {
          Sender: "USER",
          Content: message,
          ContentType: ContentType ,
        };
          const res= await addMessage(interview?.id,newMessage);
          if(res.status==200 && res.data){
            const msg= {
              ...newMessage,
              id: res.data.id,
            }
            addInterviewMessage(msg);
            setMessage("")
          }else{
            return;
          }


   
    const aiResponse = await InterviewTaking(interview);
    if(!aiResponse){
        return;
    }else{
      const res= await addMessage(interview?.id,aiResponse);
      if(res.status==200 && res.data){
            const msg= {
              ...aiResponse,
              id: res.data.id,
            }
            addInterviewMessage(msg);
            setMessage("")
          }else{
            return;
          }
    }
  }

  const endInterview = async () => {
    if(!interview) return;
    try {
     const data= await analytics(interview);
     if (!data) return;
      addOrUpdateAnalytics(interview.id as string,data);
      nav.push(`/interview/${interview.id}`);
    } catch (error) {
      console.log (error);
      nav.push(`/dashboard`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-red-500 text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              LIVE
            </Badge>
            <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
          </div>
          <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
            {jobTitle} Interview
          </Badge>
        </div>

        {/* Video Content */}
        <div className="h-full bg-black flex items-center justify-center">
          {isVideoOff ? (
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarFallback className="bg-gray-600 text-white text-4xl">JD</AvatarFallback>
              </Avatar>
              <p className="text-white text-lg">Camera is off</p>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-16 h-16" />
                </div>
                <p className="text-lg">Your video feed</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 bg-black/80 backdrop-blur-sm rounded-full px-6 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className={`rounded-full w-12 h-12 ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"} text-white`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`rounded-full w-12 h-12 ${isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"} text-white`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={endInterview}
              className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600 text-white"
            >
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="w-96 bg-white flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Interview Conversation</h3>
              <p className="text-sm text-gray-600">AI Interviewer</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {interview?.InterviewChatHistory?.map((msg) => (
            <div key={msg.id} className={`flex ${msg.Sender === "USER" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${msg.Sender === "USER" ? "order-2" : "order-1"}`}>
                <div
                  className={`flex items-start space-x-2 ${msg.Sender === "USER" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8">
                    {msg.Sender === "ASSISTANT" ? (
                      <AvatarFallback className="bg-blue-600 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-gray-600 text-white">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.Sender === "USER" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.Content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Type your response..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 min-h-[60px] resize-none"
              onKeyUp={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                className={`${isMuted ? "bg-red-50 border-red-200" : ""}`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={sendMessage}
                disabled={!message.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
