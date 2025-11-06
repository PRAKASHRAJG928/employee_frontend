import React, { useState, useEffect } from 'react'
import { FaBuilding, FaCheckCircle, FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaTimesCircle, FaUsers } from 'react-icons/fa'
import SummaryCard from './SummaryCard'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminSummary = () => {
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalaries: 0,
    leaveApplied: 0,
    leaveApproved: 0,
    leavePending: 0,
    leaveRejected: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const navigate = useNavigate()

  useEffect(() => {
    fetchSummaryData()
  }, [])

  const fetchSummaryData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please login to view dashboard')
        setLoading(false)
        return
      }

      // Fetch all data in parallel
      const [employeesRes, departmentsRes, leavesRes] = await Promise.all([
        axios.get('/api/employee', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('/api/department', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('/api/leave', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      // Calculate summary data
      const employees = employeesRes.data.success ? employeesRes.data.employees : []
      const departments = departmentsRes.data.success ? departmentsRes.data.departments : []

      const leaves = leavesRes.data.success ? leavesRes.data.leaves : []

      // Calculate total monthly salary (sum of all employee salaries)
      const totalMonthlySalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0)

      // Calculate leave statistics
      const leaveStats = leaves.reduce((stats, leave) => {
        stats.total++
        switch (leave.status) {
          case 'approved':
            stats.approved++
            break
          case 'rejected':
            stats.rejected++
            break
          case 'pending':
            stats.pending++
            break
        }
        return stats
      }, { total: 0, approved: 0, rejected: 0, pending: 0 })

      setSummary({
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        totalSalaries: totalMonthlySalary,
        leaveApplied: leaveStats.total,
        leaveApproved: leaveStats.approved,
        leavePending: leaveStats.pending,
        leaveRejected: leaveStats.rejected
      })

    } catch (error) {
      console.error('Error fetching summary data:', error)
      setError(error.response?.data?.error || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (route) => {
    navigate(route)
  }

  if (loading) {
    return (
      <div className='p-6 bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg text-white'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-300 mt-4">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6 bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg text-white'>
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchSummaryData}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='p-4 sm:p-6 bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg text-white'>
      <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6'>Dashboard Overview</h3>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
          <div onClick={() => handleCardClick('/admin-dashboard/employees')} className="cursor-pointer">
            <SummaryCard Icon={<FaUsers />} text="Total Employee" number={summary.totalEmployees} color="blue"/>
          </div>
          <div onClick={() => handleCardClick('/admin-dashboard/department')} className="cursor-pointer">
            <SummaryCard Icon={<FaBuilding />} text="Total Departments" number={summary.totalDepartments} color="green"/>
          </div>
          <div onClick={() => handleCardClick('/admin-dashboard/salaries')} className="cursor-pointer">
            <SummaryCard Icon={<FaMoneyBillWave />} text="Monthly Salary" number={`$${summary.totalSalaries.toLocaleString()}`} color="purple"/>
          </div>
        </div>

        <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6 pt-6 sm:pt-8' >Leave Details</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        <div onClick={() => handleCardClick('/admin-dashboard/leaves')} className="cursor-pointer">
          <SummaryCard Icon={<FaFileAlt />} text="Leave Applied" number={summary.leaveApplied} color="orange"/>
        </div>
        <div onClick={() => handleCardClick('/admin-dashboard/leaves')} className="cursor-pointer">
          <SummaryCard Icon={<FaCheckCircle />} text="Leave Approved" number={summary.leaveApproved} color="green"/>
        </div>
        <div onClick={() => handleCardClick('/admin-dashboard/leaves')} className="cursor-pointer">
          <SummaryCard Icon={<FaHourglassHalf />} text="Leave Pending" number={summary.leavePending} color="amber"/>
        </div>
        <div onClick={() => handleCardClick('/admin-dashboard/leaves')} className="cursor-pointer">
          <SummaryCard Icon={<FaTimesCircle />} text="Leave Rejected" number={summary.leaveRejected} color="red"/>
        </div>
        </div>
      </div>
  )
}

export default AdminSummary
