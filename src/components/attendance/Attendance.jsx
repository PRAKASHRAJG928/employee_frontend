import React, { useState, useEffect } from 'react';
import { Search, Calendar, CheckCircle, XCircle, Clock, UserX, Filter } from 'lucide-react';
import { markAttendance as markAttendanceAPI, getAllAttendanceForDate } from '../../utils/AttendanceHelper';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchEmployees();
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedStatus, attendanceData]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/employee/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();

      if (data.success) {
        setEmployees(data.employees);
        setFilteredEmployees(data.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const result = await getAllAttendanceForDate(currentDate);
      if (result.success) {
        const attendanceMap = {};
        result.attendance.forEach(att => {
          attendanceMap[att.employeeId._id] = att.status;
        });
        setAttendanceData(attendanceMap);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const filterEmployees = () => {
    let filtered = employees.filter(employee => employee && employee._id); // Filter out null or invalid employees

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.dep_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(employee => attendanceData[employee._id] === selectedStatus);
    }

    setFilteredEmployees(filtered);
  };

  const markAttendance = async (employeeId, status) => {
    try {
      const result = await markAttendanceAPI(employeeId, currentDate, status);
      if (result.success) {
        setAttendanceData(prev => ({
          ...prev,
          [employeeId]: status
        }));
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-white" />;
      case 'sick':
        return <Clock className="w-5 h-5 text-white" />;
      case 'leave':
        return <UserX className="w-5 h-5 text-white" />;
      default:
        return null;
    }
  };

  const getStatusButton = (employeeId, status) => {
    const isActive = attendanceData[employeeId] === status;

    let buttonClasses = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md";
    let activeClasses = "";

    switch (status) {
      case 'present':
        activeClasses = isActive
          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30"
          : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 shadow-green-500/20";
        break;
      case 'absent':
        activeClasses = isActive
          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30"
          : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-red-500/20";
        break;
      case 'sick':
        activeClasses = isActive
          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-500/30"
          : "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-500 hover:to-yellow-600 shadow-yellow-500/20";
        break;
      case 'leave':
        activeClasses = isActive
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30"
          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-blue-500/20";
        break;
      default:
        activeClasses = "bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 hover:from-gray-600 hover:to-gray-500";
    }

    return (
      <button
        onClick={() => markAttendance(employeeId, status)}
        className={`${buttonClasses} ${activeClasses}`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Manage Attendance</h1>
          <p className="text-gray-400">Mark attendance for employees</p>
        </div>

        {/* Date and Search Section */}
        <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl p-4 md:p-6 mb-6 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5" />
                <span className="font-medium text-sm md:text-base">Mark Attendance for Today:</span>
              </div>
              <span className="text-cyan-400 font-semibold text-sm md:text-base">
                {new Date(currentDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
              </div>

              <button
                onClick={() => window.location.href = '/admin-dashboard/attendance-reports'}
                className="relative bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 md:px-6 py-2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm md:text-base"
              >
                <span className="relative z-10">Attendance Report</span>
                <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm font-medium">Filter by Status:</span>
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === 'all'
                  ? 'bg-cyan-500 text-white shadow-cyan-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('present')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === 'present'
                  ? 'bg-green-500 text-white shadow-green-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Present
            </button>
            <button
              onClick={() => setSelectedStatus('absent')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === 'absent'
                  ? 'bg-red-500 text-white shadow-red-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Absent
            </button>
            <button
              onClick={() => setSelectedStatus('sick')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === 'sick'
                  ? 'bg-yellow-500 text-white shadow-yellow-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Sick
            </button>
            <button
              onClick={() => setSelectedStatus('leave')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedStatus === 'leave'
                  ? 'bg-blue-500 text-white shadow-blue-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Leave
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Emp ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600/20">
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee._id} className="hover:bg-gray-700/20 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-gray-300">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {employee.userId?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">{employee.userId?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{employee.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{employee.department?.dep_name}</td>
                    <td className="px-6 py-4">
                      {(() => {
                        const currentStatus = attendanceData[employee._id];
                        if (currentStatus) {
                          // If employee has a status marked, show only that button
                          return (
                            <div className="flex justify-center">
                              {getStatusButton(employee._id, currentStatus)}
                            </div>
                          );
                        } else if (selectedStatus === 'all') {
                          // If no status marked and "All" filter selected, show all buttons
                          return (
                            <div className="flex gap-2 flex-wrap">
                              {getStatusButton(employee._id, 'present')}
                              {getStatusButton(employee._id, 'absent')}
                              {getStatusButton(employee._id, 'sick')}
                              {getStatusButton(employee._id, 'leave')}
                            </div>
                          );
                        } else {
                          // If no status marked and specific filter selected, show only that button
                          return (
                            <div className="flex justify-center">
                              {getStatusButton(employee._id, selectedStatus)}
                            </div>
                          );
                        }
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredEmployees.map((employee, index) => (
            <div key={employee._id} className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {employee.userId?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{employee.userId?.name}</h3>
                    <p className="text-gray-400 text-sm">ID: {employee.employeeId}</p>
                  </div>
                </div>
                <span className="text-gray-300 text-sm font-medium">#{index + 1}</span>
              </div>

              <div className="mb-3">
                <p className="text-gray-400 text-sm">
                  <span className="font-medium">Department:</span> {employee.department?.dep_name}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(() => {
                  const currentStatus = attendanceData[employee._id];
                  if (currentStatus) {
                    // If employee has a status marked, show only that button
                    return getStatusButton(employee._id, currentStatus);
                  } else if (selectedStatus === 'all') {
                    // If no status marked and "All" filter selected, show all buttons
                    return (
                      <>
                        {getStatusButton(employee._id, 'present')}
                        {getStatusButton(employee._id, 'absent')}
                        {getStatusButton(employee._id, 'sick')}
                        {getStatusButton(employee._id, 'leave')}
                      </>
                    );
                  } else {
                    // If no status marked and specific filter selected, show only that button
                    return getStatusButton(employee._id, selectedStatus);
                  }
                })()}
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No employees found</div>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
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

export default Attendance;
