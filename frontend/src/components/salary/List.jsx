import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

const List = () => {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalSalaries: 0,
    totalAmount: 0,
    averageSalary: 0,
    thisMonthCount: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterSalaries();
  }, [salaries, searchTerm, selectedDepartment, selectedMonth]);

  useEffect(() => {
    calculateStats();
  }, [filteredSalaries]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salariesResponse, departmentsResponse] = await Promise.all([
        axios.get('/api/salary/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/department/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (salariesResponse.data.success) {
        setSalaries(salariesResponse.data.salaries);
      }

      if (departmentsResponse.data.success) {
        setDepartments(departmentsResponse.data.departments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load salary data');
    } finally {
      setLoading(false);
    }
  };

  const filterSalaries = () => {
    let filtered = [...salaries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(salary =>
        salary.employeeId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salary.employeeId?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (selectedDepartment) {
      filtered = filtered.filter(salary =>
        salary.employeeId?.department?._id === selectedDepartment
      );
    }

    // Month filter
    if (selectedMonth) {
      filtered = filtered.filter(salary => {
        const payDate = new Date(salary.payDate);
        const month = payDate.getMonth() + 1;
        const year = payDate.getFullYear();
        return `${year}-${month.toString().padStart(2, '0')}` === selectedMonth;
      });
    }

    setFilteredSalaries(filtered);
  };

  const calculateStats = () => {
    const totalAmount = filteredSalaries.reduce((sum, salary) => sum + salary.netSalary, 0);
    const averageSalary = filteredSalaries.length > 0 ? totalAmount / filteredSalaries.length : 0;

    const thisMonth = new Date();
    const thisMonthCount = filteredSalaries.filter(salary => {
      const payDate = new Date(salary.payDate);
      return payDate.getMonth() === thisMonth.getMonth() &&
             payDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    setStats({
      totalSalaries: filteredSalaries.length,
      totalAmount,
      averageSalary,
      thisMonthCount
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getUniqueMonths = () => {
    const months = [...new Set(salaries.map(salary => {
      const date = new Date(salary.payDate);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }))].sort().reverse();

    return months.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(year, monthNum - 1);
      return {
        value: month,
        label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      };
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedMonth('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary record? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`/api/salary/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.data.success) {
          setSalaries(salaries.filter(salary => salary._id !== id));
          // Optionally show success message
        } else {
          alert(response.data.error || 'Failed to delete salary record');
        }
      } catch (error) {
        console.error('Error deleting salary:', error);
        alert('Failed to delete salary record. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <div className="text-white text-xl">Loading salary data...</div>
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
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-lg hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Salary Management
          </h1>
          <p className="text-gray-300 text-lg">Manage employee salaries and payroll records</p>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Records</p>
                <p className="text-3xl font-bold text-white">{stats.totalSalaries}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Average Salary</p>
                <p className="text-2xl font-bold text-cyan-400">{formatCurrency(stats.averageSalary)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 hover:border-cyan-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-purple-400">{stats.thisMonthCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">

              {/* Department Filter */}
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="pl-9 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 appearance-none"
                >
                  <option value="">All Departments</option>
                  {departments.map(dep => (
                    <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="pl-9 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 appearance-none"
                >
                  <option value="">All Months</option>
                  {getUniqueMonths().map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedDepartment || selectedMonth) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors duration-200 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear
                </button>
              )}

              {/* Add Salary Button */}
              <Link
                to="/admin-dashboard/add-salary"
                className="relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Salary
                </span>
                <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_3s_infinite]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Salaries Table */}
        <div className="bg-gray-800/60 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-gray-700">
          {filteredSalaries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">No Salary Records Found</h3>
              <p className="text-gray-400 mb-6">
                {salaries.length === 0
                  ? "Get started by adding your first salary record"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              <Link
                to="/admin-dashboard/add-salary"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-xl hover:scale-105 transition-transform"
              >
                <Plus className="w-5 h-5" />
                Add Your First Salary Record
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Employee Details
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Basic Salary
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Allowances
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Net Salary
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Pay Date
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSalaries.map((salary) => (
                    <tr key={salary._id} className="hover:bg-gray-700/30 transition-all duration-200 group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mr-4 border-2 border-gray-600">
                            {salary.employeeId?.userId?.profileImage ? (
                              <img
                                src={`/uploads/${salary.employeeId.userId.profileImage}`}
                                alt={salary.employeeId?.userId?.name || 'Employee'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full flex items-center justify-center ${salary.employeeId?.userId?.profileImage ? 'hidden' : ''}`}>
                              <User className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {salary.employeeId?.userId?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-400">
                              ID: {salary.employeeId?.employeeId || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {salary.employeeId?.userId?.email || 'N/A'}
                            </div>
                            <div className="text-xs text-cyan-400">
                              {salary.employeeId?.department?.dep_name || 'N/A'}
                            </div>
                            <div className="text-xs text-purple-400">
                              {salary.employeeId?.designation || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-200 font-medium">
                        {formatCurrency(salary.basicSalary)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-green-400 font-medium">
                        +{formatCurrency(salary.allowances)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-red-400 font-medium">
                        -{formatCurrency(salary.deductions)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-lg font-bold text-green-400">
                          {formatCurrency(salary.netSalary)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(salary.payDate)}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin-dashboard/salary/view/${salary._id}`)}
                            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin-dashboard/salary/edit/${salary._id}`)}
                            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                            title="Edit Salary"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(salary._id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                            title="Delete Salary"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredSalaries.length > 0 && (
          <div className="text-center text-gray-400 text-sm">
            Showing {filteredSalaries.length} of {salaries.length} salary records
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

export default List;
