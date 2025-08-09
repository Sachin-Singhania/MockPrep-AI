"use client"
import { Button } from "@/components/ui/button"
import { Briefcase, Clock, Star, Zap, BarChart3, FileText, Video, User, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"


export default function HomePage() {
  const { data: session, status } = useSession();
  const [showdashboard, setshowdashboard] = useState(false);
  useEffect(() => {
    if (status === "authenticated" && session.user?.dashboardId && showdashboard == false) {
      setshowdashboard(true);
    }
  }, [status])
  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden relative">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <header className="fixed top-4 left-4 right-4 z-50 bg-white/30 backdrop-blur-xl border border-white/50 shadow-lg rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">MockPrep AI</h1>
        </div>

        <div className="flex items-center space-x-3">
          {showdashboard ?
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Button>
            </Link> : ""
          }
          <Link href="/signin">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300">
              Register
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-24 text-center flex flex-col items-center justify-center min-h-[80vh]">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6 animate-fade-in-up">
            Master Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Job Interview
            </span>
          </h2>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
            Practice with our AI interviewer and get real-time feedback to improve your interview skills and land your
            dream job.
          </p>
          <div className="flex items-center justify-center space-x-6 text-lg text-gray-600 mb-16 animate-fade-in-up animation-delay-600">
            <div className="flex items-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Instant feedback
            </div>
            <div className="flex items-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Star className="w-5 h-5 mr-2 text-purple-500" />
              AI-powered questions
            </div>
            <div className="flex items-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <User className="w-5 h-5 mr-2 text-pink-500" />
              Personalized interviews
            </div>
          </div>

          <Link href="/signin">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-bounce-once">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Description */}
      <section className="py-24 relative z-10" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Transform Your Interview Skills with AI</h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              MockPrep revolutionizes interview preparation by providing personalized, AI-powered mock interviews
              tailored to your specific job applications. Practice with confidence and land your dream job.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Personalized Experience */}
            <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-lg border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group will-change-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-3 text-gray-900 text-center">Personalized for You</h4>
              <p className="text-gray-700 leading-relaxed text-center">
                Upload your resume and job descriptions for tailored questions.
              </p>
            </div>

            {/* Instant AI Feedback */}
            <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-lg border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group will-change-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-3 text-gray-900 text-center">Instant AI Feedback</h4>
              <p className="text-gray-700 leading-relaxed text-center">
                Get immediate, detailed feedback to improve your performance.
              </p>
            </div>

            {/* Realistic Practice */}
            <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-lg border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group will-change-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-3 text-gray-900 text-center">Realistic Simulations</h4>
              <p className="text-gray-700 leading-relaxed text-center">
                Practice in a professional video interview environment.
              </p>
            </div>

            {/* Advanced Analytics */}
            <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-lg border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group will-change-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-3 text-gray-900 text-center">Advanced Analytics</h4>
              <p className="text-gray-700 leading-relaxed text-center">
                Track progress with detailed metrics and identify improvement areas.
              </p>
            </div>

            {/* Smart Resume Builder */}
            <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-lg border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group will-change-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-3 text-gray-900 text-center">Smart Profile Builder</h4>
              <p className="text-gray-700 leading-relaxed text-center">
                Create your profile with our AI resume extractor feature
              </p>
            </div>

            {/* Proven Results */}
            <div className="relative p-8 rounded-3xl bg-white/70 backdrop-blur-lg border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-semibold mb-3 text-gray-900 text-center">Proven Results</h4>
              <p className="text-gray-700 leading-relaxed text-center">
                Join thousands of successful candidates who landed their dream jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-slate-100 to-slate-200 relative z-10" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our streamlined process ensures you get the most relevant and effective interview practice tailored to
              your career goals.
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* Process Flow Arrows (Modernized) */}
            <div className="absolute hidden lg:block inset-x-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 rounded-full"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Step 1 */}
              <div className="text-center relative z-10 group bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 will-change-transform">
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-600">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Build Your Profile</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Create a comprehensive resume to personalize your interview.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center relative z-10 group bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 will-change-transform">
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Briefcase className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-600">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Target Your Role</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Input job descriptions to receive tailored questions.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center relative z-10 group bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 will-change-transform ">

                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Zap className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-600">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Practice with AI</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Engage in realistic simulations with our intelligent AI.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center relative z-10 group bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 will-change-transform">
                <div className="relative w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-600">
                    <span className="text-orange-600 font-bold text-sm">4</span>
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Analyze Performance</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Receive detailed insights and actionable feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative z-10">
        <div className="container mx-auto px-4 text-center text-white">
          <h4 className="text-4xl font-bold mb-6">Ready to Ace Your Next Interview?</h4>
          <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their interview skills with AI-powered practice
            sessions.
          </p>
          <Link href="/signin">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-xl font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-2xl">MockPrep</span>
          </div>
          <p className="text-gray-400 text-sm">© 2025 MockPrep. All rights reserved. Powered by AI SDK.</p>
        </div>
      </footer>
    </div>
  )
}
