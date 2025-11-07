import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  DollarSign,
  Plus,
  Minus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Add = () => {
  const [salary, setSalary] = useState({
    employeeId: '',
    department: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    payDate: ''
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [netSalary, setNetSalary] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:2000/api/department/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          setDepartments(response.data.departments);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setErrors({ general: 'Failed to load departments' });
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:2000/api/employee/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          setEmployees(response.data.employees);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setErrors({ general: 'Failed to load employees' });
      }
    };

    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (salary.department) {
      const filtered = employees.filter(emp => emp.department && emp.department._id === salary.department);
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  }, [salary.department, employees]);

  useEffect(() => {
    const basic = parseFloat(salary.basicSalary) || 0;
    const allowances = parseFloat(salary.allowances) || 0;
    const deductions = parseFloat(salary.deductions) || 0;
    setNetSalary(basic + allowances - deductions);
  }, [salary.basicSalary, salary.allowances, salary.deductions]);

  const validateForm = () => {
    const newErrors = {};

    if (!salary.department) newErrors.department = 'Department is required';
    if (!salary.employeeId) newErrors.employeeId = 'Employee is required';
    if (!salary.basicSalary || salary.basicSalary <= 0) newErrors.basicSalary = 'Valid basic salary is required';
    if (!salary.payDate) newErrors.payDate = 'Pay date is required';

    const payDate = new Date(salary.payDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (payDate < today) {
      newErrors.payDate = 'Pay date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary(prev => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleDropdown = (field) => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  const selectOption = (field, value) => {
    setSalary(prev => ({ ...prev, [field]: value }));
    setOpenDropdown(null);

    // Clear specific error when user selects
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:2000/api/salary/add', salary, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setSuccess('Salary added successfully!');
        setTimeout(() => {
          navigate('/admin-dashboard/salaries');
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding salary:', error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: 'Failed to add salary. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Add New Salary</h1>
          <p className="text-gray-300">Create a new salary record for an employee</p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/60 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-700">
              {errors.general && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} ref={dropdownRef} className="space-y-6">
                {/* Department Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Building2 className="w-4 h-4" />
                    Department
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <div
                      onClick={() => toggleDropdown('department')}
                      className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition cursor-pointer flex justify-between items-center"
                    >
                      <span className={salary.department ? 'text-gray-200' : 'text-gray-400'}>
                        {salary.department ? departments.find(dep => dep._id === salary.department)?.dep_name : 'Select Department'}
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
                  {errors.department && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.department}
                    </p>
                  )}
                </div>

                {/* Employee Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Users className="w-4 h-4" />
                    Employee
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <div
                      onClick={() => toggleDropdown('employeeId')}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-900/70 border text-gray-200 focus:outline-none focus:ring-2 transition cursor-pointer flex justify-between items-center ${
                        !salary.department
                          ? 'border-gray-600 opacity-50 cursor-not-allowed'
                          : 'border-gray-700 focus:ring-cyan-400'
                      }`}
                    >
                      <span className={salary.employeeId ? 'text-gray-200' : 'text-gray-400'}>
                        {salary.employeeId
                          ? filteredEmployees.find(emp => emp._id === salary.employeeId)?.userId?.name + ' - ' + filteredEmployees.find(emp => emp._id === salary.employeeId)?.employeeId
                          : salary.department ? 'Select Employee' : 'Select department first'
                        }
                      </span>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    {openDropdown === 'employeeId' && salary.department && (
                      <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredEmployees.map(emp => (
                          <div
                            key={emp._id}
                            onClick={(e) => { e.stopPropagation(); selectOption('employeeId', emp._id); }}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
                          >
                            {emp.userId?.name || 'Unknown'} - {emp.employeeId}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.employeeId && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.employeeId}
                    </p>
                  )}
                </div>

                {/* Salary Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Salary */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <DollarSign className="w-4 h-4" />
                      Basic Salary
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        name="basicSalary"
                        value={salary.basicSalary}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-4 py-2 rounded-lg bg-gray-900/70 border placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 transition ${
                          errors.basicSalary
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-700 focus:ring-cyan-400'
                        }`}
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.basicSalary && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.basicSalary}
                      </p>
                    )}
                  </div>

                  {/* Allowances */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Plus className="w-4 h-4" />
                      Allowances
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        name="allowances"
                        value={salary.allowances}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Minus className="w-4 h-4" />
                      Deductions
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        name="deductions"
                        value={salary.deductions}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Pay Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Calendar className="w-4 h-4" />
                    Pay Date
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <input
                        type="date"
                        name="payDate"
                        value={salary.payDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-900/70 border placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.payDate
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-700 focus:ring-cyan-400 focus:border-cyan-400'
                        }`}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Date Preview */}
                    {salary.payDate && (
                      <div className="mt-2 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <Calendar className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {new Date(salary.payDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-gray-400">
                              {Math.ceil((new Date(salary.payDate) - new Date()) / (1000 * 60 * 60 * 24))} days from today
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.payDate && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.payDate}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding Salary...</span>
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10">Add Salary</span>
                        <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_3s_infinite]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/60 backdrop-blur-lg shadow-2xl rounded-2xl p-6 border border-gray-700 sticky top-4">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Salary Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Basic Salary:</span>
                  <span className="text-white font-medium">
                    {formatCurrency(parseFloat(salary.basicSalary) || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Allowances:</span>
                  <span className="text-green-400 font-medium">
                    +{formatCurrency(parseFloat(salary.allowances) || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Deductions:</span>
                  <span className="text-red-400 font-medium">
                    -{formatCurrency(parseFloat(salary.deductions) || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-4 border-t-2 border-gray-600">
                  <span className="text-sm font-semibold text-white">Net Salary:</span>
                  <span className={`text-xl font-bold ${
                    netSalary >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(netSalary)}
                  </span>
                </div>
              </div>

              {salary.payDate && (
                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Pay Date</span>
                  </div>
                  <p className="text-white font-medium">
                    {new Date(salary.payDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
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

export default Add;
