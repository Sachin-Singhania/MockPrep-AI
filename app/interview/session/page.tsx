"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Video, VideoOff, Phone, Settings, Send, Bot, User, Clock } from "lucide-react"
import { useChatStore } from "@/store/store"
import { analytics, InterviewTaking } from "@/lib/actions/rag"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { LoadingBubble } from "@/components/ui/LoadingBubble"
import { uuidv4 } from "@/lib/utils"
import { toast } from "sonner"
import { AnalyticsGenerationDialog } from "@/components/ui/AnalyticsGen"

export default function InterviewSessionPage() {
  const searchParams = useSearchParams()
  const jobTitle = searchParams.get("title");
  const nav = useRouter();
  const [sent, setsent] = useState(false)
  const [InterviewhasEnd,setInterviewhasEnd] = useState(false)
  const [timeLeft, setTimeLeft] = useState(23*60)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [message, setMessage] = useState("")
  const [isBlock, setisBlock] = useState(false)
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const {interview,addOrUpdateAnalytics,addInterviewMessage,questions,addInterviewQuestion,updateInterviewQuestion,SetInterviewNull,updateProfileInterview}=useChatStore();
  const [fromTranscription, setFromTranscription] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const {transcript,resetTranscript,listening} = useSpeechRecognition();
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [interview?.InterviewChatHistory]);
  
useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setInterviewhasEnd(true)
          endInterview();
          return 0;
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

    useEffect(() => {
  if (fromTranscription && message) {
    sendMessage();
    setFromTranscription(false);
  }
}, [message]);

  useEffect(() => {
    if(sent) return;
    if (!interview) {
      toast.error("No interview data provided")
      router.replace("/dashboard");
    } else {
      const runFirstMessage = () => {
        try {
          firstMessage(); 
          setsent(true);
        } catch (err) {
          console.error("Failed to run first message:", err);
        }
      };
      runFirstMessage();
    }
  }, [interview, sent]);

  useEffect(() => {
  const enterFullscreen = async () => {
    try {
      if (document.fullscreenEnabled) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen not allowed", err);
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      alert("Tab switch is not allowed during the interview.");
    }
  };

  const disableContextMenu = (e: MouseEvent) => e.preventDefault();

  const disableKeys = (e: KeyboardEvent) => {
    const blockedKeys = ["w", "t", "n","r"];
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    if (isCtrlOrCmd && blockedKeys.includes(e.key.toLowerCase())) {
      e.preventDefault();
      alert("Keyboard shortcuts are disabled during the interview.");
    }

    if (e.key === "Escape") {
      e.preventDefault();
      alert("Exiting fullscreen is not allowed.");
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      alert("You exited fullscreen. Interview will now end.");
    }
  };

  enterFullscreen();
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("contextmenu", disableContextMenu);
  window.addEventListener("keydown", disableKeys);
  document.addEventListener("fullscreenchange", handleFullscreenChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("contextmenu", disableContextMenu);
    window.removeEventListener("keydown", disableKeys);
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  };
}, []);



  const toggleRecording = () => {
    if(isBlock) return;
    if (listening) {
      SpeechRecognition.stopListening();
      setisBlock(true);
      sendMessage(transcript); 
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  const firstMessage= async() =>{
    if(!interview?.id) return;
    const newMessage:InterviewChat = {
      id: uuidv4(),
      Sender: "ASSISTANT",
      Content:  `Hi there! Welcome to your ${jobTitle} interview. I'm excited to learn more about you and your experience. lets start with the introduction first?`,
      ContentType :"FORMALCHAT",
    }
    setisBlock(true);
    setloading(true);
    PlayAudioButton(newMessage);
    setisBlock(false);
  }
  const sendMessage =async (inputText?: string) => {
    const finalMessage = inputText ?? message; 
        if (finalMessage.trim()=="") {
          setisBlock(false);
          return;
        }
        setMessage("")
       if(!interview?.id) return;
       const lastType = interview.InterviewChatHistory.at(-1)?.ContentType;
        if (lastType === "END"){
          endInterview();
          return;
        }
        const nextTypeMap = {
          FORMALCHAT: "FORMALCHAT",
          QUESTION: "ANSWER",
          VALIDATION : "FORMALCHAT",
        } as const;

        const ContentType = nextTypeMap[lastType as keyof typeof nextTypeMap];
        console.log(ContentType)
        const newMessage: InterviewChat = {
          id : uuidv4(),
          Sender: "USER",
          Content: finalMessage,
          ContentType: ContentType ? ContentType : "FORMALCHAT" ,
        };
        addInterviewMessage(newMessage);

          setloading(true);
    const aiResponse = await InterviewTaking(interview,formatTime(timeLeft).toString());
    if(!aiResponse.status || aiResponse.data==undefined){
      toast.error(aiResponse.error || "Error in AI response");
      setloading(false);
      setisBlock(false);
        return;
    }else{
      const aires:InterviewChat= {
        ...aiResponse.data,
        id : uuidv4(),
      }
      if(aires.ContentType === "QUESTION"){
        addInterviewQuestion(aires);
      }
      if(aires.ContentType== "VALIDATION"){
         const lastQuestionId = questions?.length ? questions[questions.length - 1].id : "";
         if (lastQuestionId) updateInterviewQuestion(lastQuestionId,aires.score);
      }
      PlayAudioButton(aires);
      setisBlock(false);
    }
  }
  function PlayAudioButton(AiResponse:InterviewChat) {
  const handleClick = async (AiResponse:InterviewChat) => {
    const res = await fetch(`/api/speak`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: AiResponse.Content }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData.error);

        if (res.status === 400) {
            setloading(false);
            addInterviewMessage(AiResponse);
            return;
        }
        
        if (res.status === 401 || res.status === 403) {
          
            if (AiResponse.ContentType === "END") {
              endInterview();
            }
            router.push('/login');
            return;
        }
        if (res.status === 429) {
          toast("You Are rate limitted",{
            richColors : true
          })
            setloading(false);
           addInterviewMessage(AiResponse);
           
            if (AiResponse.ContentType === "END") {
              endInterview();
            }
          return;
        }
          setloading(false);
        addInterviewMessage(AiResponse);
        return;
    }

if (!res.body) {
  toast.error("Error while generating audio")
    setloading(false);
  addInterviewMessage(AiResponse);
  
  if (AiResponse.ContentType === "END") {
    endInterview();
  }
  return;
};

const mediaSource = new MediaSource();
const audioUrl = URL.createObjectURL(mediaSource);
const audio = new Audio(audioUrl);

mediaSource.addEventListener("sourceopen", async () => {
  const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
  const reader = res.body!.getReader();
  const chunks: Uint8Array[] = [];

  const processChunks = async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const finalBuffer = new Blob(chunks, { type: "audio/mpeg" });
    const arrayBuffer = await finalBuffer.arrayBuffer();

    return new Promise<void>((resolve, reject) => {
      sourceBuffer.addEventListener("updateend", () => {
        if (!mediaSource.readyState || sourceBuffer.updating) return;
        try {
          mediaSource.endOfStream();
          resolve();
        } catch (err) {
          reject(err);
        }
      }, { once: true });

      sourceBuffer.appendBuffer(arrayBuffer);
    });
  };

  try {
    await processChunks();
  } catch (err) {
    console.error("Streaming error:", err);
  }
});

try {
  setloading(false);
  addInterviewMessage(AiResponse);
  await audio.play();

  if (AiResponse.ContentType === "END") {
    endInterview();
  }
} catch (err) {
  console.error("Audio play error:", err);
}
    };
  handleClick(AiResponse);
}
  const endInterview = async () => {
    if(!interview) return;
    try {
      setInterviewhasEnd(true);
        let end= new Date();
        const data= await analytics(interview,questions ?? [],end);
        if (!data){
          console.error ("Analytics error");
          toast.error("There was an error while generating analytics");
          SetInterviewNull();
          nav.push("/dashboard");
          return;
        }
        addOrUpdateAnalytics(interview.id as string,data);
        let d = {
          Analytics : {overallScore:data.overallScore},
          endTime :end,
          id : interview.id as string,
          Jobtitle : interview.JobDescription.jobTitle,
          startTime : interview.startTime
        }
        SetInterviewNull();
        updateProfileInterview(d);
      nav.push(`/interview/${interview.id}`);
    } catch (error) {
      console.log (error);
      nav.push(`/dashboard`);
    }finally{
      setInterviewhasEnd(false);
    }
  }
  
  return (
    <>
      {InterviewhasEnd  &&  (
        <AnalyticsGenerationDialog isOpen={InterviewhasEnd}/>
    )}
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
               onClick={toggleRecording}
               disabled ={InterviewhasEnd}
               className={`rounded-full w-12 h-12 ${
              !listening  && isBlock
                ? "bg-red-500 hover:bg-red-600" 
                : listening  && !isBlock
                ? "bg-gray-600 hover:bg-gray-700" 
                : "bg-gray-700 hover:bg-gray-800"
              } text-white`}
              >
              {listening  && !isBlock ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVideoOff(!isVideoOff)}
              disabled ={InterviewhasEnd}
              className={`rounded-full w-12 h-12 ${isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-gray-600 hover:bg-gray-700"} text-white`}
              >
              {(isVideoOff! && InterviewhasEnd) || isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
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
      <div className="w-96 bg-white flex flex-col h-screen">
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesContainerRef}>
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
                      className={`rounded-lg px-3 py-2 max-w-xs ${
                        msg.Sender === "USER"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                      }`}
                    >
                        <p className="text-sm">{msg.Content}</p>
                    </div>
                </div>
              </div>
            </div>
          ))}
          {loading &&
            <LoadingBubble/>
          }
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
                onClick={()=>sendMessage}
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
    </>
  )
}

