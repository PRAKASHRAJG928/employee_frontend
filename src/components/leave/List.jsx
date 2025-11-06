import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Calendar, FileText, Clock, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';

const List = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view leave requests');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/leave/employee/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setLeaves(response.data.leaves);
      } else {
        setError(response.data.error || 'Failed to fetch leave requests');
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setError(error.response?.data?.error || 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaves = leaves.filter(leave =>
    leave.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteLeave = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to delete leave request');
        return;
      }

      const response = await axios.delete(`/api/leave/${leaveId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setLeaves(leaves.filter(leave => leave._id !== leaveId));
        setDeleteConfirm(null);
        setError('');
      } else {
        setError(response.data.error || 'Failed to delete leave request');
      }
    } catch (error) {
      console.error('Error deleting leave:', error);
      setError(error.response?.data?.error || 'Failed to delete leave request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading leave requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header with Stats */}
        <div className="text-center space-y-4">
          <div className="relative">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2">
              Manage Leave
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-lg">View and manage your leave requests</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl border border-blue-500/30 p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{leaves.length}</div>
              <div className="text-sm text-gray-300">Total Requests</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl border border-yellow-500/30 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{leaves.filter(l => l.status === 'pending').length}</div>
              <div className="text-sm text-gray-300">Pending</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl border border-green-500/30 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{leaves.filter(l => l.status === 'approved').length}</div>
              <div className="text-sm text-gray-300">Approved</div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-red-500/30 p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{leaves.filter(l => l.status === 'rejected').length}</div>
              <div className="text-sm text-gray-300">Rejected</div>
            </div>
          </div>
        </div>

        {/* Search Bar and Add Button Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
          {/* Search Bar */}
          <div className="relative max-w-md w-full sm:w-auto flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by status or leave type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-base"
            />
          </div>

          {/* Add Leave Button */}
          <Link to="/employee-dashboard/add-leave">
            <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300 font-semibold text-base whitespace-nowrap group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Leave Request
            </button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <XCircle className="w-6 h-6 text-red-400" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Leave Requests List */}
        <div className="space-y-4">
          {filteredLeaves.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-3">
                  No Leave Requests
                </h3>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  You haven't submitted any leave requests yet. Start by creating your first request.
                </p>
                <Link to="/employee-dashboard/add-leave">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold text-lg group">
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    Create Your First Request
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredLeaves.map((leave, index) => (
                <div key={leave._id} className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:border-cyan-500/30">
                  {/* Status Bar */}
                  <div className={`h-1 bg-gradient-to-r ${leave.status === 'approved' ? 'from-green-400 to-emerald-400' : leave.status === 'rejected' ? 'from-red-400 to-pink-400' : 'from-cyan-400 to-blue-400'}`}></div>

                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                      {/* Main Content */}
                      <div className="flex-1 space-y-4">
                        {/* Header with Status and Type */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border backdrop-blur-sm ${getStatusColor(leave.status)} shadow-lg`}>
                              {getStatusIcon(leave.status)}
                              <span className="uppercase tracking-wide">{leave.status}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                              <FileText className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-300 font-medium text-sm">
                                {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
                              </span>
                            </div>
                          </div>

                          {/* Employee Info - Mobile */}
                          <div className="flex items-center gap-4 lg:hidden">
                            <div className="text-right">
                              <div className="text-xs text-indigo-300 uppercase tracking-wide">ID</div>
                              <div className="text-white font-semibold">{leave.employeeId?.employeeId || 'N/A'}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-teal-300 uppercase tracking-wide">Dept</div>
                              <div className="text-white font-medium text-sm">{leave.employeeId?.department?.dep_name || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl border border-gray-600/30 flex-1">
                            <Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs text-gray-400 uppercase tracking-wide">From</div>
                              <div className="text-white font-medium truncate">{formatDate(leave.fromDate)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl border border-gray-600/30 flex-1">
                            <Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs text-gray-400 uppercase tracking-wide">To</div>
                              <div className="text-white font-medium truncate">{formatDate(leave.toDate)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {leave.description && (
                          <div className="flex items-start gap-3 p-4 bg-gray-700/20 rounded-xl border border-gray-600/20">
                            <FileText className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Description</div>
                              <p className="text-gray-200 leading-relaxed text-sm line-clamp-2">{leave.description}</p>
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                            <Clock className="w-4 h-4" />
                            <span>Applied on {formatDate(leave.appliedDate)}</span>
                          </div>

                          {/* Delete Button - Mobile */}
                          {leave.status === 'pending' && (
                            <div className="lg:hidden flex-shrink-0">
                              {deleteConfirm === leave._id ? (
                                <div className="flex gap-2 flex-wrap">
                                  <button
                                    onClick={() => handleDeleteLeave(leave._id)}
                                    className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-xs font-medium whitespace-nowrap"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-3 py-1.5 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-colors text-xs font-medium whitespace-nowrap"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(leave._id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-xs font-medium whitespace-nowrap"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop Sidebar */}
                      <div className="hidden lg:flex flex-col items-end space-y-4 min-w-[200px]">
                        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-xl border border-indigo-500/30 w-full text-center">
                          <div className="text-xs text-indigo-300 uppercase tracking-wide mb-1">Employee ID</div>
                          <div className="text-white font-semibold text-lg">{leave.employeeId?.employeeId || 'N/A'}</div>
                        </div>
                        <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 p-4 rounded-xl border border-teal-500/30 w-full text-center">
                          <div className="text-xs text-teal-300 uppercase tracking-wide mb-1">Department</div>
                          <div className="text-white font-medium">{leave.employeeId?.department?.dep_name || 'N/A'}</div>
                        </div>
                        {leave.status === 'pending' && (
                          <div className="w-full">
                            {deleteConfirm === leave._id ? (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleDeleteLeave(leave._id)}
                                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-4 py-2 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-colors text-sm font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(leave._id)}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default List;
