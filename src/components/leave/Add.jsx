import React, { useState } from 'react';
import { Calendar, FileText, Send } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit leave request');
        return;
      }

      const response = await axios.post('http://localhost:2000/api/leave/add', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert('Leave request submitted successfully!');
        // Reset form
        setFormData({
          leaveType: '',
          fromDate: '',
          toDate: '',
          description: ''
        });
        navigate('/employee-dashboard/leaves');
      } else {
        alert(response.data.error || 'Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert(error.response?.data?.error || 'Failed to submit leave request. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Request for Leave</h1>
          <p className="text-gray-300">Submit your leave request for approval</p>
        </div>

        {/* Form */}
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Leave Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                </div>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-4 bg-gradient-to-r from-gray-700/60 to-gray-600/60 border border-gray-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 appearance-none backdrop-blur-sm hover:border-cyan-400/30"
                  required
                >
                  <option value="" className="bg-gray-800 text-gray-300">Select leave type</option>
                  <option value="sick" className="bg-gray-800 text-white">Sick Leave</option>
                  <option value="annual" className="bg-gray-800 text-white">Annual Leave</option>
                  <option value="casual" className="bg-gray-800 text-white">Casual Leave</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400"></div>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Please provide a reason for your leave request..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 resize-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:scale-105 transition-transform font-medium shadow-lg"
              >
                <Send className="w-5 h-5" />
                Add Leave Request
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Add;
