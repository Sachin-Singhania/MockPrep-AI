import { Bot } from "lucide-react";

export function LoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-4xl">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-blue-600 text-white">
          <Bot className="w-4 h-4" />
        </div>
        <div className="px-6 py-4 rounded-xl bg-white/80 border border-white/20 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span className="text-sm text-slate-600">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}