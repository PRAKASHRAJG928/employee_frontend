                                                                                                                                                                                                                                                                                                                                                                                                                            import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  Building2,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';

const ViewSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalary = async () => {
      setLoading(true);
      try {
        if (!id && location.pathname.includes('/employee-dashboard')) {
          // For employee dashboard, fetch current employee's salary
          const employeeResponse = await axios.get('http://localhost:2000/api/employee/', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (employeeResponse.data.success) {
            const employee = employeeResponse.data.employees.find(emp => emp.userId._id === user._id);
            if (employee) {
              // Create salary object from employee data
              setSalary({
                basicSalary: employee?.salary || 0,
                allowances: 0,
                deductions: 0,
                netSalary: employee?.salary || 0,
                payDate: new Date(),
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt,
                employeeId: employee
              });
            }
          }
        } else {
          // For admin dashboard, fetch specific salary by id
          const response = await axios.get(`http://localhost:2000/api/salary/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.data.success) {
            setSalary(response.data.salary);
          }
        }
      } catch (error) {
        console.error('Error fetching salary:', error);
        setError('Failed to load salary details');
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [id, location.pathname, user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <div className="text-white text-xl">Loading salary details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/admin-dashboard/salaries')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-lg hover:scale-105 transition-transform"
          >
            Back to Salaries
          </button>
        </div>
      </div>
    );
  }

  if (!salary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Salary Record Not Found</h2>
          <p className="text-gray-400 mb-6">The salary record you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin-dashboard/salaries')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-lg hover:scale-105 transition-transform"
          >
            Back to Salaries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <button
              onClick={() => navigate(location.pathname.includes('/employee-dashboard') ? '/employee-dashboard' : '/admin-dashboard/salaries')}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              {location.pathname.includes('/employee-dashboard') ? 'Back to Dashboard' : 'Back to Salaries'}
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2">Salary Details</h1>
            <p className="text-gray-300 text-sm sm:text-base">Detailed view of salary record</p>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>

        {/* Employee Information Card */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
            <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-cyan-400" />
            Employee Information
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center border-2 border-gray-600 flex-shrink-0">
                {salary.employeeId?.userId?.profileImage ? (
                  <img
                    src={`http://localhost:2000/uploads/${salary.employeeId.userId.profileImage}`}
                    alt={salary.employeeId?.userId?.name || 'Employee'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-white truncate">{salary.employeeId?.userId?.name || 'N/A'}</h3>
                <p className="text-gray-400 text-sm sm:text-base">ID: {salary.employeeId?.employeeId || 'N/A'}</p>
                <p className="text-cyan-400 text-sm sm:text-base truncate">{salary.employeeId?.userId?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">Department:</span>
                <span className="text-white font-medium text-sm sm:text-base truncate">{salary.employeeId?.department?.dep_name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">Designation:</span>
                <span className="text-white font-medium text-sm sm:text-base truncate">{salary.employeeId?.designation || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

          {/* Salary Components */}
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              Salary Breakdown
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300 font-medium text-sm sm:text-base">Basic Salary</span>
                <span className="text-white font-bold text-xs sm:text-sm">{formatCurrency(salary.basicSalary)}</span>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 bg-green-900/20 rounded-lg border border-green-400/30">
                <span className="text-green-300 font-medium text-sm sm:text-base">Allowances</span>
                <span className="text-green-400 font-bold text-xs sm:text-sm">+{formatCurrency(salary.allowances)}</span>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 bg-red-900/20 rounded-lg border border-red-400/30">
                <span className="text-red-300 font-medium text-sm sm:text-base">Deductions</span>
                <span className="text-red-400 font-bold text-xs sm:text-sm">-{formatCurrency(salary.deductions)}</span>
              </div>
              <div className="border-t border-gray-600 pt-3 sm:pt-4">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-400/50">
                  <span className="text-white font-bold text-sm sm:text-base">Net Salary</span>
                  <span className="text-green-400 font-bold text-lg sm:text-xl">{formatCurrency(salary.netSalary)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              Payment Information
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300 font-medium text-sm sm:text-base">Pay Date</span>
                <span className="text-white font-bold text-sm sm:text-base">{formatDate(salary.payDate)}</span>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300 font-medium text-sm sm:text-base">Record Created</span>
                <span className="text-white font-bold text-sm sm:text-base">{formatDate(salary.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300 font-medium text-sm sm:text-base">Last Updated</span>
                <span className="text-white font-bold text-sm sm:text-base">{formatDate(salary.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {location.pathname.includes('/employee-dashboard') ? null : (
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate(`/admin-dashboard/salary/edit/${salary._id}`)}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-transform font-medium text-sm sm:text-base"
            >
              Edit Salary
            </button>
            <button
              onClick={() => navigate('/admin-dashboard/salaries')}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:scale-105 transition-transform font-medium text-sm sm:text-base"
            >
              Back to List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSalary;
