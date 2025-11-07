import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  DollarSign,
  Calendar,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  AlertCircle,
  CheckCircle,
  User,
  Building2
} from 'lucide-react';

const SalaryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [formData, setFormData] = useState({
    basicSalary: '',
    allowances: '',
    deductions: '',
    payDate: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmployeeAndSalaries();
  }, [id]);

  const fetchEmployeeAndSalaries = async () => {
    setLoading(true);
    try {
      const [employeeResponse, salaryResponse] = await Promise.all([
        axios.get(`http://localhost:2000/api/employee/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`http://localhost:2000/api/salary/employee/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (employeeResponse.data.success) {
        setEmployee(employeeResponse.data.employee);
      }

      if (salaryResponse.data.success) {
        setSalaries(salaryResponse.data.salaries);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load employee salary details');
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

  const calculateStats = () => {
    if (salaries.length === 0) return { total: 0, average: 0, highest: 0, lowest: 0, count: 0 };

    const amounts = salaries.map(s => s.netSalary);
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    const average = total / amounts.length;
    const highest = Math.max(...amounts);
    const lowest = Math.min(...amounts);

    return { total, average, highest, lowest, count: salaries.length };
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      basicSalary: '',
      allowances: '',
      deductions: '',
      payDate: ''
    });
    setEditingSalary(null);
    setShowAddForm(false);
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setSuccess('');

    try {
      const salaryData = {
        ...formData,
        employeeId: id,
        department: employee.department._id
      };

      let response;
      if (editingSalary) {
        response = await axios.put(`http://localhost:2000/api/salary/${editingSalary._id}`, salaryData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        response = await axios.post('http://localhost:2000/api/salary/add', salaryData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
      }

      if (response.data.success) {
        setSuccess(editingSalary ? 'Salary updated successfully!' : 'Salary added successfully!');
        fetchEmployeeAndSalaries();
        setTimeout(() => {
          resetForm();
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving salary:', error);
      setError(error.response?.data?.error || 'Failed to save salary');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (salary) => {
    setEditingSalary(salary);
    setFormData({
      basicSalary: salary.basicSalary,
      allowances: salary.allowances,
      deductions: salary.deductions,
      payDate: salary.payDate.split('T')[0]
    });
    setShowAddForm(true);
  };

  const handleDelete = async (salaryId) => {
    if (!window.confirm('Are you sure you want to delete this salary record?')) return;

    try {
      const response = await axios.delete(`http://localhost:2000/api/salary/${salaryId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setSuccess('Salary deleted successfully!');
        fetchEmployeeAndSalaries();
        setTimeout(() => setSuccess(''), 1500);
      }
    } catch (error) {
      console.error('Error deleting salary:', error);
      setError('Failed to delete salary');
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
          <p>Loading employee salary details...</p>
        </div>
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-10 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin-dashboard/employees')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Salary Details
                </h1>
                {employee && (
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-4 h-4" />
                      <span>{employee.userId?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building2 className="w-4 h-4" />
                      <span>{employee.department?.dep_name || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg transition-all duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? 'Cancel' : 'Add Salary'}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Records</p>
                  <p className="text-2xl font-bold text-cyan-400">{stats.count}</p>
                </div>
                <Calendar className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Paid</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.total)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Salary</p>
                  <p className="text-2xl font-bold text-blue-400">{formatCurrency(stats.average)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Highest Salary</p>
                  <p className="text-2xl font-bold text-purple-400">{formatCurrency(stats.highest)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Lowest Salary</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(stats.lowest)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-8 border border-gray-700 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingSalary ? 'Edit Salary' : 'Add New Salary'}
            </h3>

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Basic Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleFormChange}
                    className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Allowances</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    name="allowances"
                    value={formData.allowances}
                    onChange={handleFormChange}
                    className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Deductions</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleFormChange}
                    className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pay Date</label>
                <input
                  type="date"
                  name="payDate"
                  value={formData.payDate}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : (editingSalary ? 'Update Salary' : 'Add Salary')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Salary Records Table */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Salary Records</h3>
          </div>

          {salaries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No salary records found</div>
              <p className="text-gray-500 mt-2">Add the first salary record for this employee</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Pay Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Basic Salary
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Allowances
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Net Salary
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {salaries.map((salary) => (
                    <tr key={salary._id} className="hover:bg-gray-700/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(salary.payDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                        {formatCurrency(salary.basicSalary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 font-medium">
                        +{formatCurrency(salary.allowances)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400 font-medium">
                        -{formatCurrency(salary.deductions)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-green-400">
                          {formatCurrency(salary.netSalary)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(salary)}
                            className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(salary._id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
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
      </div>
    </div>
  );
};

export default SalaryDetails;
