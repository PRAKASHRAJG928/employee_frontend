import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Download,
  Eye,
  Mail,
  Phone,
  User,
  Clock,
  History
} from 'lucide-react';

const EmployeeSalary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentSalary, setCurrentSalary] = useState(null);
  const [recentSalaries, setRecentSalaries] = useState([]);
  const [allSalaries, setAllSalaries] = useState([]);
  const [nextPayDate, setNextPayDate] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.employeeId) {
      fetchSalaryData();
    }
  }, [user]);

  const fetchSalaryData = async () => {
    setLoading(true);
    try {
      // Fetch employee's salary information
      const employeeResponse = await axios.get(`http://localhost:2000/api/employee/${user.employeeId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (employeeResponse.data.success) {
        const employee = employeeResponse.data.employee;
        setCurrentSalary({
          basicSalary: employee.salary,
          employeeId: employee.employeeId,
          name: employee.userId?.name,
          department: employee.department?.dep_name
        });
      }

      // Fetch all salary records
      const salaryResponse = await axios.get(`http://localhost:2000/api/salary/employee/${user.employeeId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (salaryResponse.data.success) {
        const salaries = salaryResponse.data.salaries.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));

        // Set all salaries for history
        setAllSalaries(salaries);

        // Get the most recent 5 salary records for history section
        setSalaryHistory(salaries.slice(0, 5));

        // Get the most recent 3 salary records for recent payments
        setRecentSalaries(salaries.slice(0, 3));

        // Calculate next pay date (assuming monthly salary on the last day of month)
        if (salaries.length > 0) {
          const lastPayDate = new Date(salaries[0].payDate);
          const nextPayDate = new Date(lastPayDate.getFullYear(), lastPayDate.getMonth() + 1, lastPayDate.getDate());
          setNextPayDate(nextPayDate);
        }
      }
    } catch (error) {
      console.error('Error fetching salary data:', error);
      setError('Failed to load salary information');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilNextPay = () => {
    if (!nextPayDate) return null;
    const today = new Date();
    const diffTime = nextPayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
          <p>Loading salary information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const daysUntilNextPay = getDaysUntilNextPay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-10 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            My Salary Information
          </h1>
          <p className="text-gray-300">View your current salary details, payment history, and upcoming salary date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Pay Date Card */}
            {nextPayDate && (
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-lg rounded-xl border border-green-400/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {daysUntilNextPay > 0 ? 'Upcoming Salary Payment' : 'Next Salary Payment'}
                    </h2>
                    <p className="text-green-400 text-2xl font-bold">{formatDate(nextPayDate)}</p>
                    <p className="text-green-300 text-sm mt-1">
                      {daysUntilNextPay === 0 ? 'Payment due today!' :
                       daysUntilNextPay === 1 ? 'Tomorrow' :
                       daysUntilNextPay > 1 ? `Your salary date will be processed in ${daysUntilNextPay} days` :
                       `${daysUntilNextPay} days remaining`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Clock className="w-12 h-12 text-green-400 mb-2" />
                    <p className="text-green-400 font-medium">Monthly Salary</p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Salary Card */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Current Salary</h2>
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>

              {currentSalary ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">Basic Salary</p>
                      <p className="text-2xl font-bold text-green-400">{formatCurrency(currentSalary.basicSalary)}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">Employee ID</p>
                      <p className="text-lg font-semibold text-white">{currentSalary.employeeId}</p>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Department</p>
                    <p className="text-lg font-semibold text-white">{currentSalary.department || 'Not assigned'}</p>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => navigate('/employee-dashboard/salary-history')}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      View Full History
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200">
                      <Download className="w-4 h-4" />
                      Download Slip
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">Salary information not added yet</div>
                  <p className="text-gray-500 text-sm">Please contact HR for assistance</p>
                </div>
              )}
            </div>

            {/* Salary History */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Salary History</h2>
                <History className="w-6 h-6 text-blue-400" />
              </div>

              {salaryHistory.length > 0 ? (
                <div className="space-y-4">
                  {salaryHistory.map((salary, index) => (
                    <div key={salary._id} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white font-medium">{formatDate(salary.payDate)}</p>
                            <p className="text-gray-400 text-sm">Pay Date</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-lg">{formatCurrency(salary.netSalary)}</p>
                          <p className="text-gray-400 text-sm">Net Salary</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 text-sm">Basic</p>
                          <p className="text-white">{formatCurrency(salary.basicSalary)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Allowances</p>
                          <p className="text-blue-400">+{formatCurrency(salary.allowances)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Deductions</p>
                          <p className="text-red-400">-{formatCurrency(salary.deductions)}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {allSalaries.length > 5 && (
                    <button
                      onClick={() => navigate('/employee-dashboard/salary-history')}
                      className="w-full py-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                    >
                      View All {allSalaries.length} Salary Records →
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">No salary records found</div>
                  <p className="text-gray-500 text-sm">Your salary payment history will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary Statistics */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Salary Statistics</h3>
              {allSalaries.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Payments</span>
                    <span className="text-white font-medium">{allSalaries.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Salary</span>
                    <span className="text-green-400 font-medium">
                      {formatCurrency(
                        allSalaries.reduce((sum, s) => sum + s.netSalary, 0) / allSalaries.length
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Highest Payment</span>
                    <span className="text-purple-400 font-medium">
                      {formatCurrency(Math.max(...allSalaries.map(s => s.netSalary)))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Earned</span>
                    <span className="text-cyan-400 font-medium">
                      {formatCurrency(allSalaries.reduce((sum, s) => sum + s.netSalary, 0))}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Statistics will appear once you have salary records</p>
              )}
            </div>

            {/* Upcoming Payment Reminder */}
            {nextPayDate && daysUntilNextPay !== null && (
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-lg rounded-xl border border-blue-400/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Reminder</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{daysUntilNextPay}</div>
                  <p className="text-blue-300 text-sm mb-2">
                    {daysUntilNextPay === 0 ? 'Days until payment' :
                     daysUntilNextPay === 1 ? 'Day until payment' :
                     'Days until payment'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Next payment: {formatDate(nextPayDate)}
                  </p>
                </div>
              </div>
            )}

            {/* Contact HR */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Contact HR for any salary-related queries or concerns.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300 text-sm">hr@company.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300 text-sm">Ext: 123</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/employee-dashboard/salary-history')}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                >
                  View Salary History
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                  Download Tax Documents
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200">
                  Update Bank Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalary;
