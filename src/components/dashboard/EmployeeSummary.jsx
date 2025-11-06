import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import axios from 'axios';
import {
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  TrendingUp,
  CalendarDays,
  MessageSquare,
  DollarSign
} from 'lucide-react';

const EmployeeSummary = () => {
  const { user } = useAuth();

  const [summaryData, setSummaryData] = useState({
    attendance: { present: 0, total: 0, percentage: 0 },
    leaveBalance: { annual: 0, sick: 0, casual: 0 },
    upcomingHolidays: [],
    recentAnnouncements: [],
    workingHours: { thisMonth: 0, average: 0 },
    salary: { current: 0, lastPaid: '' }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployeeSummary = async () => {
      try {
        // Fetch employee data - you can add more API calls as backend endpoints become available
        const response = await axios.get('http://localhost:2000/api/employee/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data.success) {
          const employee = response.data.employees.find(emp => emp.userId._id === user._id);

          // Use mock data for holidays since the endpoint doesn't exist yet
          const upcomingHolidays = [
            { date: '2024-01-26', name: 'Republic Day' },
            { date: '2024-03-08', name: 'Holi' },
            { date: '2024-04-14', name: 'Good Friday' }
          ];

          // Mock data for demonstration - replace with actual API calls
          setSummaryData({
            attendance: { present: 22, total: 25, percentage: 88 },
            leaveBalance: { annual: 15, sick: 7, casual: 5 },
            upcomingHolidays,
            recentAnnouncements: [
              { id: 1, title: 'New Office Policy', date: '2024-01-15', priority: 'high' },
              { id: 2, title: 'Team Building Event', date: '2024-01-10', priority: 'medium' }
            ],
            workingHours: { thisMonth: 168, average: 8.4 },
            salary: { current: employee?.salary || 0, lastPaid: '2024-01-01' }
          });
        }
      } catch (error) {
        console.error('Error fetching employee summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeSummary();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-400/20">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-gray-300 text-sm sm:text-base">Here's your dashboard overview for today.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Attendance Card */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{summaryData.attendance.percentage}%</h3>
          <p className="text-xs sm:text-sm text-gray-400">Attendance Rate</p>
          <p className="text-xs text-gray-500 mt-1">{summaryData.attendance.present}/{summaryData.attendance.total} days</p>
        </div>

        {/* Leave Balance Card */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <AlertCircle className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{summaryData.leaveBalance.annual + summaryData.leaveBalance.sick + summaryData.leaveBalance.casual}</h3>
          <p className="text-xs sm:text-sm text-gray-400">Total Leave Days</p>
          <p className="text-xs text-gray-500 mt-1">Annual: {summaryData.leaveBalance.annual}, Sick: {summaryData.leaveBalance.sick}</p>
        </div>

        {/* Working Hours Card */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <CalendarDays className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{summaryData.workingHours.thisMonth}h</h3>
          <p className="text-xs sm:text-sm text-gray-400">This Month</p>
          <p className="text-xs text-gray-500 mt-1">Avg: {summaryData.workingHours.average}h/day</p>
        </div>

        {/* Salary Card */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
            <MessageSquare className="w-4 h-4 text-yellow-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">${summaryData.salary.current.toLocaleString()}</h3>
          <p className="text-xs sm:text-sm text-gray-400">Current Salary</p>
          <p className="text-xs text-gray-500 mt-1">Last paid: {summaryData.salary.lastPaid}</p>
        </div>
      </div>

      {/* Upcoming Holidays & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upcoming Holidays */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Upcoming Holidays
          </h3>
          <div className="space-y-3">
            {summaryData.upcomingHolidays.map((holiday, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{holiday.name}</p>
                  <p className="text-gray-400 text-xs">{holiday.date}</p>
                </div>
                <CalendarDays className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            Recent Announcements
          </h3>
          <div className="space-y-3">
            {summaryData.recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm sm:text-base truncate">{announcement.title}</p>
                  <p className="text-gray-400 text-xs">{announcement.date}</p>
                </div>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  announcement.priority === 'high' ? 'bg-red-400' :
                  announcement.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSummary;
