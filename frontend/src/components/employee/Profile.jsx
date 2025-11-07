import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/useAuth'
import axios from 'axios'
import { History, DollarSign, Edit } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:2000/api/employee/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          // Find the current user's employee record
          const currentEmployee = response.data.employees.find(emp => emp.userId._id === user._id)
          setEmployee(currentEmployee)
        }
      } catch (error) {
        if (error.response && error.response.data && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeProfile()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex flex-col items-center py-10 px-4 text-white">
        <div className="text-center text-gray-300 py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex flex-col items-center py-10 px-4 text-white">
        <div className="text-center text-red-400 py-20">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-xl">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex flex-col items-center py-10 px-4 text-white">
      <div className="w-full max-w-5xl bg-gray-800/60 backdrop-blur-lg shadow-xl rounded-xl p-8 border border-gray-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h3 className="text-4xl font-bold .text-white mb-10 text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            My Profile
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-400 mx-auto mt-2 rounded-full"></div>
          </h3>

          {employee ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Section */}
              <div className="lg:col-span-1 flex flex-col items-center text-center">
                <div className="relative mb-8 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
                  <img
                    src={employee.userId?.profileImage ? `http://localhost:2000/public/uploads/${employee.userId.profileImage}` : '/image.jpg'}
                    alt="Profile"
                    className="relative w-56 h-56 rounded-full object-cover border-4 border-gradient-to-r from-yellow-400 to-pink-400 shadow-2xl hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                </div>
                <h4 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">{employee.userId?.name}</h4>
                <p className="text-cyan-300 font-medium text-xl mb-4">{employee.userId?.email}</p>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {employee.userId?.role}
                </span>

                {/* Edit Profile Button */}
                <div className="mt-6">
                  <button
                    onClick={() => window.location.href = '/employee-dashboard/edit-profile'}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-400/20"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Details Section */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-cyan-400/10 to-blue-400/10 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-cyan-400/20">
                    <h5 className="text-cyan-300 font-bold mb-4 flex items-center text-lg">
                      <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                      Personal Information
                    </h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-200 font-medium">Employee ID:</span>
                        <span className="text-white font-bold text-lg">{employee.employeeId}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-200 font-medium">Date of Birth:</span>
                        <span className="text-white font-bold">{new Date(employee.dob).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-200 font-medium">Gender:</span>
                        <span className="text-white font-bold">{employee.gender}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-200 font-medium">Marital Status:</span>
                        <span className="text-white font-bold">{employee.maritalStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-400/10 to-teal-400/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-emerald-400/20">
                    <h5 className="text-emerald-300 font-bold mb-4 flex items-center text-lg">
                      <span className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                      Professional Information
                    </h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-200 font-medium">Designation:</span>
                        <span className="text-white font-bold text-lg">{employee.designation}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-200 font-medium">Department:</span>
                        <span className="text-white font-bold">{employee.department?.dep_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-200 font-medium">Salary:</span>
                        <span className="text-green-400 font-bold text-xl">${employee.salary}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="mt-8 bg-gradient-to-br from-rose-400/10 to-pink-400/10 backdrop-blur-sm rounded-xl p-6 border border-rose-400/30 hover:border-rose-400/50 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-rose-400/20">
                  <h5 className="text-white font-bold mb-6 flex items-center text-lg">
                    <span className="w-3 h-3 bg-rose-400 rounded-full mr-3 animate-pulse"></span>
                    Quick Stats
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-lg p-3 border border-rose-400/40 hover:border-rose-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-rose-400/30">
                      <div className="text-2xl font-bold text-rose-300 mb-1">{employee.employeeId}</div>
                      <div className="text-xs text-gray-200 font-medium">Employee ID</div>
                    </div>
                    <div className="bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-lg p-3 border border-rose-400/40 hover:border-rose-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-rose-400/30">
                      <div className="text-2xl font-bold text-rose-300 mb-1">${employee.salary}</div>
                      <div className="text-xs text-gray-200 font-medium">Salary</div>
                    </div>
                    <div className="bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-lg p-3 border border-rose-400/40 hover:border-rose-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-rose-400/30">
                      <div className="text-2xl font-bold text-rose-300 mb-1">{employee.gender}</div>
                      <div className="text-xs text-gray-200 font-medium">Gender</div>
                    </div>
                    <div className="bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-lg p-3 border border-rose-400/40 hover:border-rose-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-rose-400/30">
                      <div className="text-2xl font-bold text-rose-300 mb-1">{employee.maritalStatus}</div>
                      <div className="text-xs text-gray-200 font-medium">Status</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-400 py-20">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-xl">Employee not found</p>
            </div>
          )}
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-indigo-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <style>
        {`
          @keyframes waveLine {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  )
}

export default Profile
