"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { BarChart3 } from "lucide-react"

interface AnalyticsGenerationDialogProps {
  isOpen: boolean
}

export function AnalyticsGenerationDialog({ isOpen }: AnalyticsGenerationDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center space-y-8 py-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Generating Analytics</h2>
            <p className="text-gray-600 text-lg">Please wait while we analyze your interview performance</p>
          </div>

          {/* Loading Spinner */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-600 text-lg">Processing</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>This may take a few moments</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
