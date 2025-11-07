import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/useAuth'
import { LogOut, User, Sun, Moon } from 'lucide-react'

const Navbar = () => {
    const {user, logout} = useAuth()
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme')
        return savedTheme ? savedTheme === 'dark' : true // default to dark
    })

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
    }

    const handleLogout = () => {
        logout()
    }

  return (
    <nav className="fixed top-0 left-16 right-0 z-30 bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 shadow-lg border-b border-gray-300 dark:border-gray-800 px-2 sm:px-3 lg:px-4 xl:px-6 h-20 flex justify-between items-center text-gray-900 dark:text-white lg:left-64 lg:right-0 lg:z-50">
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-800 dark:text-gray-200" />
        </div>
        <div className="hidden sm:block min-w-0 flex-1">
          <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold truncate text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">Welcome back, {user?.name}</p>
        </div>
        <div className="sm:hidden min-w-0 flex-1">
          <h2 className="text-sm font-semibold truncate text-gray-900 dark:text-white">Dashboard</h2>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gray-700 hover:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 dark:text-gray-900 text-white transition-all duration-300 shadow-md hover:shadow-[0_4px_8px_rgba(255,255,255,0.2)] hover:transform hover:scale-105 hover:-translate-y-0.5 cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />}
        </button>
        <div className="text-right hidden lg:block">
          <p className="text-sm sm:text-base font-medium truncate text-gray-900 dark:text-white">{user?.name}</p>
          <p className="text-sm capitalize text-gray-600 dark:text-gray-400 truncate">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-[0_4px_8px_rgba(255,0,255,0.2),0_8px_16px_rgba(0,255,255,0.15)] hover:transform hover:scale-105 hover:-translate-y-0.5 hover:backdrop-blur-sm cursor-pointer text-sm sm:text-base"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
