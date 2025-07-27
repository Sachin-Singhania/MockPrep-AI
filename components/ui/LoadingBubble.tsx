import { Bot } from "lucide-react";

export function LoadingBubble() {
  return (
    <div className="flex items-start space-x-2 px-4 py-2">
      {/* Bot Icon */}
      <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow">
        <Bot className="w-4 h-4" />
      </div>

      {/* Chat Bubble */}
      <div className="px-4 py-3 rounded-2xl bg-white/80 border border-white/30 shadow backdrop-blur-md">
        <div className="flex items-center space-x-2">
          {/* Animated Dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>

          {/* Text */}
          <span className="text-sm text-slate-600">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
}
