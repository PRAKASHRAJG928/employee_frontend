import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const Add = () => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    employeeId: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    designation: '',
    department: '',
    salary: '',
    password: '',
    role: '',
    image: null
  })
  const [departments, setDepartments] = useState([])
  const [openDropdown, setOpenDropdown] = useState(null)
  const [dateParts, setDateParts] = useState({ day: '', month: '', year: '' })
  const dropdownRef = useRef()

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  useEffect(() => {
    if (dateParts.day && dateParts.month && dateParts.year) {
      const monthIndex = months.indexOf(dateParts.month) + 1
      const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex
      const formattedDay = dateParts.day < 10 ? `0${dateParts.day}` : dateParts.day
      const dob = `${dateParts.year}-${formattedMonth}-${formattedDay}`
      setEmployee(prev => ({ ...prev, dob }))
    }
  }, [dateParts, months])

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  const handleDateChange = (part, value) => {
    setDateParts(prev => ({ ...prev, [part]: value }))
    setOpenDropdown(null)
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:2000/api/department/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
        });
        if (response.data.success) {
          setDepartments(response.data.departments)
        }
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }
    fetchDepartments()
  }, [])



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

    // Validation
    if (!employee.department) {
      alert('Please select a department')
      return
    }

    const formData = new FormData()
    Object.keys(employee).forEach(key => {
      if (employee[key] !== null && employee[key] !== '') {
        formData.append(key, employee[key])
      }
    })


    try {
      const response = await axios.post('http://localhost:2000/api/employee/add', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.data.success) {
        // Reset form
        setEmployee({
          name: '',
          email: '',
          employeeId: '',
          dob: '',
          gender: '',
          maritalStatus: '',
          designation: '',
          department: '',
          salary: '',
          password: '',
          role: '',
          image: null
        })
        setDateParts({ day: '', month: '', year: '' })
        setOpenDropdown(null)
        // Force page reload to refresh the employee list
        window.location.href = '/admin-dashboard/employees'
      }
    } catch (error) {
      console.error('Error adding employee:', error)
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error)
      } else {
        alert('Failed to add employee. Please try again.')
      }
    }
  }

  return (
    <div className="flex flex-col items-center py-6 sm:py-10 px-4 text-white">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-white inline-block pb-2 relative mb-6 sm:mb-8">
          Create Employee Profile
          <span className="absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-[length:300%_100%] animate-[waveLine_6s_linear_infinite]" />
        </h3>

        <form onSubmit={handleSubmit} ref={dropdownRef} className="bg-gray-800/60 backdrop-blur-lg shadow-xl rounded-xl p-8 border border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={employee.employeeId}
                onChange={handleChange}
                placeholder="Enter employee ID"
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
                      {dateParts.day || 'Day'}
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={employee.designation}
                onChange={handleChange}
                placeholder="Enter designation"
                className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                required
              />
            </div>

            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
              <div className="relative">
                <div
                  onClick={() => toggleDropdown('department')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer flex justify-between items-center"
                >
                  <span className={employee.department ? 'text-gray-200' : 'text-gray-400'}>
                    {employee.department ? departments.find(dep => dep._id === employee.department)?.dep_name : 'Select Department'}
                  </span>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                {openDropdown === 'department' && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {departments.map(dep => (
                      <div
                        key={dep._id}
                        onClick={(e) => { e.stopPropagation(); selectOption('department', dep._id); }}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                      >
                        {dep.dep_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Salary</label>
              <input
                type="number"
                name="salary"
                value={employee.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={employee.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                required
              />
            </div>

            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <div className="relative">
                <div
                  onClick={() => toggleDropdown('role')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer flex justify-between items-center"
                >
                  <span className={employee.role ? 'text-gray-200' : 'text-gray-400'}>
                    {employee.role || 'Select Role'}
                  </span>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                {openDropdown === 'role' && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <div
                      onClick={() => selectOption('role', 'admin')}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      Admin
                    </div>
                    <div
                      onClick={() => selectOption('role', 'employee')}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                    >
                      Employee
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Image</label>
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

          <div className="mt-8">
            <button
              type="submit"
              className="w-full relative px-8 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <span className="relative z-10">Add Employee</span>
              <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes waveLine {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          @keyframes shineSweep {
            0% { left: -75%; }
            100% { left: 125%; }
          }
        `}
      </style>
    </div>
  )
}

export default Add
