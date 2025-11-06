import React, { useState, useEffect } from 'react';
import { Calendar, Download, ChevronDown } from 'lucide-react';

const AttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchAttendanceForDate(selectedDate);
  }, [selectedDate]);

  const fetchAttendanceForDate = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/attendance/report?startDate=${date}&endDate=${date}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();

      if (data.success) {
        // Populate the data with employee details
        const populatedData = data.attendance.map((record, index) => ({
          sno: index + 1,
          employeeId: record.employeeId.employeeId,
          employeeName: record.employeeId.userId?.name || 'N/A',
          department: record.employeeId.department?.dep_name || 'N/A',
          status: record.status.charAt(0).toUpperCase() + record.status.slice(1)
        }));
        setAttendanceData(populatedData);
      }
    } catch (error) {
      console.error('Error fetching attendance report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const loadMore = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateString = prevDate.toISOString().split('T')[0];
    setCurrentDate(prevDate);
    fetchAttendanceForDate(prevDateString);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'text-green-400';
      case 'absent':
        return 'text-red-400';
      case 'sick':
        return 'text-yellow-400';
      case 'leave':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const exportToCSV = () => {
    if (attendanceData.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['S.No', 'Employee ID', 'Employee Name', 'Department', 'Status'];
    const csvContent = [
      headers.join(','),
      ...attendanceData.map(row => [
        row.sno,
        row.employeeId,
        `"${row.employeeName}"`,
        `"${row.department}"`,
        row.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Attendance Reports</h1>
          <p className="text-gray-400 text-sm md:text-base">View and filter attendance records</p>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl p-4 md:p-6 mb-6 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="text-white font-medium text-sm md:text-base">Filter by Date:</span>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-sm md:text-base"
              />
            </div>

            <button
              onClick={exportToCSV}
              className="relative bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm md:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </span>
              <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">S.No</th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">Employee ID</th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">Employee Name</th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">Department</th>
                  <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600/20">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-3 py-6 md:px-6 md:py-8 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-cyan-400 mx-auto"></div>
                    </td>
                  </tr>
                ) : attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-3 py-6 md:px-6 md:py-8 text-center text-gray-400 text-sm">
                      No attendance records found for this date
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-700/20 transition-colors duration-200">
                      <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-300">{record.sno}</td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-300">{record.employeeId}</td>
                      <td className="px-3 py-3 md:px-6 md:py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs md:text-sm">
                              {record.employeeName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white font-medium text-xs md:text-sm truncate">{record.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-300 truncate">{record.department}</td>
                      <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm">
                        <span className={`font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Load More Button */}
        {!loading && attendanceData.length > 0 && (
          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={loadMore}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-md hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto text-sm md:text-base"
            >
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Load More (Previous Day)</span>
              <span className="sm:hidden">Load More</span>
            </button>
          </div>
        )}
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
  );
};

export default AttendanceReport;
