"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log("Form submitted!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegister ? "Create an Account" : "Welcome Back!"}
          </h1>
          <p className="text-gray-600">
            {isRegister ? "Join InterviewAI today." : "Sign in to continue your interview practice."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Your Name" required />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@example.com" required />
          </div>
          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-8 h-8 w-8 p-0"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg shadow-md transition-all duration-300"
          >
            {isRegister ? "Register" : "Sign In"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-white/70 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.307-7.439-7.393S8.145 2.5 12.24 2.5c2.11 0 3.412.932 4.168 1.688l3.097-3.097C17.117.99 14.463 0 12.24 0 5.463 0 0 5.337 0 12c0 6.663 5.463 12 12.24 12 6.821 0 11.856-4.783 11.856-11.648 0-.852-.118-1.49-.292-2.057H12.24z" />
          </svg>
          <span>Sign in with Google</span>
        </Button>

        <div className="mt-8 text-center text-sm text-gray-600">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Button  onClick={() => setIsRegister(false)} className="text-blue-600 hover:underline">
                Sign In
              </Button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Button  onClick={() => setIsRegister(true)} className="text-blue-600 hover:underline">
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
