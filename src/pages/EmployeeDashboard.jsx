import React, { useState } from 'react'
import { useAuth } from '../context/useAuth'
import EmployeeSideBar from '../components/dashboard/EmployeeSideBar'
import Navbar from '../components/dashboard/Navbar'
import { Outlet } from 'react-router-dom'
import { Menu, X, User } from 'lucide-react'

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-64 border-r border-border flex flex-col overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4),0_0_45px_rgba(139,92,246,0.2)] transition-all duration-500 group z-40 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-6 right-4 z-50">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg bg-gray-800/70 backdrop-blur-md border border-gray-700 hover:bg-gray-700/70 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <EmployeeSideBar />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-gray-900/95 backdrop-blur-md border-b border-gray-700 z-20 flex items-center justify-between px-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">Employee MS</h3>
          <span className="text-xs text-gray-400 hidden sm:inline">Employee Portal</span>
        </div>
        <div className="w-8 h-8 rounded-lg bg-gray-800/70 backdrop-blur-md border border-gray-700 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>

      <Navbar />
      <main className="lg:ml-64 mt-20 lg:mt-20 p-4 sm:p-6 lg:p-8 bg-gray-900/40 backdrop-blur-lg min-h-[calc(100vh-5rem)] overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          <h1 className="text-3xl font-semibold text-white tracking-wide relative inline-block pb-2">
            Welcome to Dashboard, {user?.name}
            {/* Animated underline */}
            <span className="absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-[length:300%_100%] animate-[waveLine_6s_linear_infinite]" />
          </h1>
          <Outlet />
        </div>
      </main>

      <style>
        {`
          @keyframes waveLine {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `}
      </style>
    </div>
  )
}

export default EmployeeDashboard
