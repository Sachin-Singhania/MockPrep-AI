"use client"

import { DashboardContent } from "@/components/dashboard/Dashboard"
import { InterviewSection } from "@/components/dashboard/interview-section"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { Button } from "@/components/ui/button"
import { Briefcase, LogOut, Settings, User } from "lucide-react"
import { useState } from "react"

type SidebarOption = "dashboard" | "profile" | "interviews"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<SidebarOption>("dashboard")
const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: Settings },
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "interviews" as const, label: "Interviews", icon: Briefcase },
  ]
    const toggle = (state:boolean)=>{
      if(state==true){
        setActiveSection("profile");
      }
    }
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection  />
      case "interviews":
        return <InterviewSection />
      default:
        return <DashboardContent toggle={toggle} />
    }
  }
return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">

      {/* Hamburger Button (mobile only) */}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`p-4 md:hidden z-50 fixed top-4 left-4 bg-white rounded-md shadow-lg ${sidebarOpen ? "hidden" : "block"}`}
      >
        ☰
      </button>

      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-72 bg-transparent p-4 flex flex-col gap-y-6 transform transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Card - Logo */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MockPrep</h1>
          </div>
        </div>

        {/* Bottom Card - Profile + Nav + Logout */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col flex-1 justify-between">
          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2 mt-4">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false); // Close sidebar on mobile
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}

