import { Button } from "@/components/ui/button"
import { LoadingBubble } from "@/components/ui/LoadingBubble"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { Bot, Send, User } from "lucide-react"

export function ChatContent({
  interview,
  messagesContainerRef,
  loading,
  message,
  setMessage,
  sendMessage
}:{
  interview: interviewDetails | null,
  messagesContainerRef: React.RefObject<HTMLDivElement>,
  loading: boolean,
  message: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  sendMessage: () => Promise<void>
}) {
  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesContainerRef}>
        {interview?.InterviewChatHistory?.map((msg:any) => (
          <div key={msg.id} className={`flex ${msg.Sender === "USER" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${msg.Sender === "USER" ? "order-2" : "order-1"}`}>
              <div
                className={`flex items-start space-x-2 ${
                  msg.Sender === "USER" ? "flex-row-reverse space-x-reverse" : ""
                }`}
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
        {loading && <LoadingBubble />}
      </div>

      {/* Input */}
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
    </>
  )
}