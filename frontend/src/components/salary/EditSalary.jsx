import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Save,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';

const EditSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    basicSalary: '',
    allowances: '',
    deductions: '',
    payDate: ''
  });

  useEffect(() => {
    fetchSalary();
  }, [id]);

  const fetchSalary = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:2000/api/salary/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const salaryData = response.data.salary;
        setSalary(salaryData);
        setFormData({
          basicSalary: salaryData.basicSalary.toString(),
          allowances: salaryData.allowances.toString(),
          deductions: salaryData.deductions.toString(),
          payDate: new Date(salaryData.payDate).toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error fetching salary:', error);
      setError('Failed to load salary details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return basic + allowances - deductions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await axios.put(
        `http://localhost:2000/api/salary/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        navigate(`/admin-dashboard/salary/view/${id}`, {
          state: { message: 'Salary updated successfully!' }
        });
      }
    } catch (error) {
      console.error('Error updating salary:', error);
      setError('Failed to update salary');
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(`/admin-dashboard/salary/view/${id}`)}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Details
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Edit Salary</h1>
            <p className="text-gray-300">Update salary information for {salary?.employeeId?.userId?.name}</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-full flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Employee Info Card */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Employee Information</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              {salary?.employeeId?.userId?.profileImage ? (
                <img
                  src={`http://localhost:2000/uploads/${salary.employeeId.userId.profileImage}`}
                  alt={salary.employeeId.userId.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {salary?.employeeId?.userId?.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{salary?.employeeId?.userId?.name}</h3>
              <p className="text-gray-400">ID: {salary?.employeeId?.employeeId}</p>
              <p className="text-cyan-400">{salary?.employeeId?.department?.dep_name} - {salary?.employeeId?.designation}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Save className="w-6 h-6 text-yellow-400" />
            Update Salary Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Basic Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Basic Salary *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                  placeholder="Enter basic salary"
                />
              </div>
            </div>

            {/* Allowances */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Allowances
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="allowances"
                  value={formData.allowances}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                  placeholder="Enter allowances"
                />
              </div>
            </div>

            {/* Deductions */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deductions
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                  placeholder="Enter deductions"
                />
              </div>
            </div>

            {/* Pay Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pay Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="payDate"
                  value={formData.payDate}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Net Salary Preview */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-400/30">
            <div className="flex justify-between items-center">
              <span className="text-green-300 font-bold text-sm">Calculated Net Salary</span>
              <span className="text-green-400 font-bold text-2xl">{formatCurrency(calculateNetSalary())}</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Basic: {formatCurrency(parseFloat(formData.basicSalary) || 0)} +
              Allowances: {formatCurrency(parseFloat(formData.allowances) || 0)} -
              Deductions: {formatCurrency(parseFloat(formData.deductions) || 0)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate(`/admin-dashboard/salary/view/${id}`)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:scale-105 transition-transform font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalary;
