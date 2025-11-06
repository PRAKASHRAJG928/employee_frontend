import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/useAuth'
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    image: null
  })
  const [openDropdown, setOpenDropdown] = useState(null)
  const [dateParts, setDateParts] = useState({ day: '', month: '', year: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const dropdownRef = useRef()

  useEffect(() => {
    if (dateParts.day && dateParts.month && dateParts.year) {
      const monthIndex = months.indexOf(dateParts.month) + 1
      const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex
      const formattedDay = dateParts.day < 10 ? `0${dateParts.day}` : dateParts.day
      const dob = `${dateParts.year}-${formattedMonth}-${formattedDay}`
      setEmployee(prev => ({ ...prev, dob }))
    }
  }, [dateParts])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  const handleDateChange = (part, value) => {
    setDateParts(prev => ({ ...prev, [part]: value }))
    setOpenDropdown(null)
  }

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
          if (currentEmployee) {
            setEmployee({
              name: currentEmployee.userId?.name || '',
              email: currentEmployee.userId?.email || '',
              dob: currentEmployee.dob || '',
              gender: currentEmployee.gender || '',
              maritalStatus: currentEmployee.maritalStatus || '',
              image: null
            })
            // Set date parts if dob exists
            if (currentEmployee.dob) {
              const date = new Date(currentEmployee.dob)
              setDateParts({
                day: date.getDate(),
                month: months[date.getMonth()],
                year: date.getFullYear()
              })
            }
          }
        }
      } catch (error) {
        console.error('Error fetching employee profile:', error)
        alert('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeProfile()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmployee(prev => ({ ...prev, [name]: value }))
  }

  const toggleDropdown = (field) => {
    setOpenDropdown(openDropdown === field ? null : field)
  }

  const selectOption = (field, value) => {
    setEmployee(prev => ({ ...prev, [field]: value }))
    setOpenDropdown(null)
  }

  const handleFileChange = (e) => {
    setEmployee(prev => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData()
    Object.keys(employee).forEach(key => {
      if (employee[key] !== null && employee[key] !== '') {
        formData.append(key, employee[key])
      }
    })

    try {
      const response = await axios.put(`http://localhost:2000/api/employee/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.data.success) {
        alert('Profile updated successfully!')
        navigate('/employee-dashboard/profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error)
      } else {
        alert('Failed to update profile. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex flex-col items-center py-10 px-4 text-white">
      <div className="w-full max-w-4xl">
        <h3 className="text-4xl font-bold .text-white mb-10 text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Edit My Profile
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-400 mx-auto mt-2 rounded-full"></div>
        </h3>

        <form onSubmit={handleSubmit} ref={dropdownRef} className="bg-gray-800/60 backdrop-blur-lg shadow-xl rounded-xl p-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <div
                    onClick={() => toggleDropdown('day')}
                    className="w-full px-3 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer flex justify-between items-center"
                  >
                    <span className={dateParts.day ? 'text-gray-200' : 'text-gray-400'}>
                      {dateParts.day ? `${dateParts.day}${getOrdinalSuffix(dateParts.day)}` : 'Day'}
                    </span>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {openDropdown === 'day' && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {days.map(day => (
                        <div
                          key={day}
                          onClick={(e) => { e.stopPropagation(); handleDateChange('day', day); }}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div
                    onClick={() => toggleDropdown('month')}
                    className="w-full px-3 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer flex justify-between items-center"
                  >
                    <span className={dateParts.month ? 'text-gray-200' : 'text-gray-400'}>
                      {dateParts.month || 'Month'}
                    </span>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {openDropdown === 'month' && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {months.map(month => (
                        <div
                          key={month}
                          onClick={() => handleDateChange('month', month)}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                        >
                          {month}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div
                    onClick={() => toggleDropdown('year')}
                    className="w-full px-3 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer flex justify-between items-center"
                  >
                    <span className={dateParts.year ? 'text-gray-200' : 'text-gray-400'}>
                      {dateParts.year || 'Year'}
                    </span>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {openDropdown === 'year' && (
                    <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {years.map(year => (
                        <div
                          key={year}
                          onClick={() => handleDateChange('year', year)}
                          className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
              <div className="relative">
                <div
                  onClick={() => toggleDropdown('gender')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer flex justify-between items-center"
                >
                  <span className={employee.gender ? 'text-gray-200' : 'text-gray-400'}>
                    {employee.gender || 'Select Gender'}
                  </span>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                {openDropdown === 'gender' && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <div
                      onClick={(e) => { e.stopPropagation(); selectOption('gender', 'male'); }}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      Male
                    </div>
                    <div
                      onClick={(e) => { e.stopPropagation(); selectOption('gender', 'female'); }}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      Female
                    </div>
                    <div
                      onClick={(e) => { e.stopPropagation(); selectOption('gender', 'other'); }}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      Other
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Marital Status</label>
              <div className="relative">
                <div
                  onClick={() => toggleDropdown('maritalStatus')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer flex justify-between items-center"
                >
                  <span className={employee.maritalStatus ? 'text-gray-200' : 'text-gray-400'}>
                    {employee.maritalStatus || 'Select Status'}
                  </span>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                {openDropdown === 'maritalStatus' && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <div
                      onClick={(e) => { e.stopPropagation(); selectOption('maritalStatus', 'single'); }}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      Single
                    </div>
                    <div
                      onClick={(e) => { e.stopPropagation(); selectOption('maritalStatus', 'married'); }}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      Married
                    </div>
                    <div
                      onClick={(e) => { e.stopPropagation(); selectOption('maritalStatus', 'divorced'); }}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      Divorced
                    </div>
                    <div
                      onClick={(e) => { e.stopPropagation(); selectOption('maritalStatus', 'widowed'); }}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      Widowed
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Profile Image</label>
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-indigo-500 file:via-blue-500 file:to-cyan-400 file:text-white hover:file:opacity-80"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/employee-dashboard/profile')}
              className="flex-1 px-8 py-3 font-semibold text-gray-300 bg-gray-700 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 relative px-8 py-3 font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {submitting ? 'Updating...' : 'Update Profile'}
              </span>
              {!submitting && (
                <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
              )}
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes shineSweep {
            0% { left: -75%; }
            100% { left: 125%; }
          }
        `}
      </style>
    </div>
  )
}

export default EditProfile
