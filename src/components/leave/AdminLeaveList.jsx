import React, { useState, useEffect } from 'react';
import { Search, Calendar, FileText, Clock, CheckCircle, XCircle, AlertCircle, Check, X, Users, Award, User, Mail, Phone, MapPin, X as CloseIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';

const AdminLeaveList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
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

      const response = await axios.get('/api/leave', {
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
    leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.employeeId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.employeeId?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleLeaveAction = async (leaveId, action) => {
    setActionLoading(leaveId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to perform this action');
        return;
      }

      const response = await axios.put(`/api/leave/${leaveId}`, {
        status: action,
        approvedBy: user._id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setLeaves(leaves.map(leave =>
          leave._id === leaveId ? response.data.leave : leave
        ));
        setError('');
      } else {
        setError(response.data.error || `Failed to ${action} leave request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing leave:`, error);
      setError(error.response?.data?.error || `Failed to ${action} leave request`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCardClick = (leave) => {
    setSelectedLeave(leave);
  };

  const closeModal = () => {
    setSelectedLeave(null);
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

        {/* Professional Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Leave Management Dashboard
          </h1>
          <p className="text-gray-300 text-lg">Review and manage all employee leave requests</p>

          {/* Professional Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center hover:bg-gray-800/70 transition-colors duration-200">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{leaves.length}</div>
              <div className="text-sm text-gray-400">Total Requests</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center hover:bg-gray-800/70 transition-colors duration-200">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{leaves.filter(l => l.status === 'pending').length}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center hover:bg-gray-800/70 transition-colors duration-200">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{leaves.filter(l => l.status === 'approved').length}</div>
              <div className="text-sm text-gray-400">Approved</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center hover:bg-gray-800/70 transition-colors duration-200">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{leaves.filter(l => l.status === 'rejected').length}</div>
              <div className="text-sm text-gray-400">Rejected</div>
            </div>
          </div>
        </div>

        {/* Professional Search Bar */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by status, type, name, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <XCircle className="w-6 h-6 text-red-400" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Leave Requests List */}
        <div className="space-y-6">
          {filteredLeaves.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Leave Requests
              </h3>
              <p className="text-gray-400 text-base max-w-md mx-auto">
                There are no leave requests matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredLeaves.map((leave, index) => (
                <div
                  key={leave._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-cyan-400/50 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-cyan-400/10 transition-all duration-300 cursor-pointer active:scale-[0.98] transform"
                  onClick={() => handleCardClick(leave)}
                >
                  {/* Status Bar */}
                  <div className={`h-1 ${leave.status === 'approved' ? 'bg-green-500' : leave.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>

                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">

                      {/* Main Content */}
                      <div className="flex-1 space-y-6">
                        {/* Header with Employee Info and Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-xl">
                                {leave.employeeId?.userId?.name?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-semibold text-xl">{leave.employeeId?.userId?.name || 'Unknown'}</div>
                              <div className="text-gray-400 text-base">ID: {leave.employeeId?.employeeId || 'N/A'}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium border ${getStatusColor(leave.status)}`}>
                              {getStatusIcon(leave.status)}
                              <span className="capitalize">{leave.status}</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-300 text-base">
                                {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="flex items-center gap-4 p-5 bg-gray-700/30 rounded-lg border border-gray-600/30 flex-1">
                            <Calendar className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">From</div>
                              <div className="text-white font-medium text-lg">{formatDate(leave.fromDate)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-5 bg-gray-700/30 rounded-lg border border-gray-600/30 flex-1">
                            <Calendar className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">To</div>
                              <div className="text-white font-medium text-lg">{formatDate(leave.toDate)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {leave.description && (
                          <div className="flex items-start gap-4 p-5 bg-gray-700/20 rounded-lg border border-gray-600/20">
                            <FileText className="w-6 h-6 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Description</div>
                              <p className="text-gray-200 leading-relaxed text-base">{leave.description}</p>
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-600/30">
                          <div className="flex items-center gap-3 text-base text-gray-400">
                            <Clock className="w-5 h-5" />
                            <span>Applied on {formatDate(leave.appliedDate)}</span>
                          </div>
                          {leave.approvedDate && (
                            <div className="flex items-center gap-3 text-base text-gray-400">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              <span>Processed on {formatDate(leave.approvedDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop Sidebar */}
                      <div className="hidden lg:flex flex-col items-end space-y-6 min-w-[220px]">
                        <div className="bg-gray-700/30 p-5 rounded-lg border border-gray-600/30 w-full text-center">
                          <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Department</div>
                          <div className="text-white font-medium text-lg">{leave.employeeId?.department?.dep_name || 'N/A'}</div>
                        </div>

                        {/* Action Buttons */}
                        {leave.status === 'pending' && (
                          <div className="w-full space-y-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLeaveAction(leave._id, 'approved');
                              }}
                              disabled={actionLoading === leave._id}
                              className="relative inline-flex items-center justify-center w-full px-6 py-3 overflow-hidden tracking-tighter text-white bg-green-600 rounded-md group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-700 rounded-full group-hover:w-56 group-hover:h-56"></span>
                              <span className="absolute bottom-0 left-0 h-full -ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-full opacity-100 object-stretch" fill="currentColor" viewBox="0 0 487 487">
                                  <path fill-opacity=".1" fill-rule="nonzero" fill="#FFF" d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"></path>
                                </svg>
                              </span>
                              <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="object-cover w-full h-full" fill="currentColor" viewBox="0 0 487 487">
                                  <path fill-opacity=".1" fill-rule="nonzero" fill="#FFF" d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"></path>
                                </svg>
                              </span>
                              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
                              <span className="relative text-base font-semibold flex items-center gap-2">
                                {actionLoading === leave._id ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <Check className="w-5 h-5" />
                                    Approve
                                  </>
                                )}
                              </span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLeaveAction(leave._id, 'rejected');
                              }}
                              disabled={actionLoading === leave._id}
                              className="relative inline-flex items-center justify-center w-full px-6 py-3 overflow-hidden tracking-tighter text-white bg-red-600 rounded-md group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-red-700 rounded-full group-hover:w-56 group-hover:h-56"></span>
                              <span className="absolute bottom-0 left-0 h-full -ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-full opacity-100 object-stretch" fill="currentColor" viewBox="0 0 487 487">
                                  <path fill-opacity=".1" fill-rule="nonzero" fill="#FFF" d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"></path>
                                </svg>
                              </span>
                              <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="object-cover w-full h-full" fill="currentColor" viewBox="0 0 487 487">
                                  <path fill-opacity=".1" fill-rule="nonzero" fill="#FFF" d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"></path>
                                </svg>
                              </span>
                              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
                              <span className="relative text-base font-semibold flex items-center gap-2">
                                {actionLoading === leave._id ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <X className="w-5 h-5" />
                                    Reject
                                  </>
                                )}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Mobile Action Buttons */}
                      {leave.status === 'pending' && (
                        <div className="flex lg:hidden gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeaveAction(leave._id, 'approved');
                            }}
                            disabled={actionLoading === leave._id}
                            className="flex items-center justify-center gap-3 flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                          >
                            {actionLoading === leave._id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Check className="w-5 h-5" />
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeaveAction(leave._id, 'rejected');
                            }}
                            disabled={actionLoading === leave._id}
                            className="flex items-center justify-center gap-3 flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                          >
                            {actionLoading === leave._id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <X className="w-5 h-5" />
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employee Details Modal */}
        {selectedLeave && (
          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 z-50 flex flex-col items-center py-10 px-4 text-white">
            <div className="w-full max-w-5xl bg-gray-800/60 backdrop-blur-lg shadow-xl rounded-xl p-8 border border-gray-700 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-400 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-4xl font-bold text-White bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Employee Details
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-400 mx-auto mt-2 rounded-full"></div>
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <CloseIcon className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Section */}
                  <div className="lg:col-span-1 flex flex-col items-center text-center">
                    <div className="relative mb-8 group">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
                      <img
                        src={selectedLeave.employeeId?.userId?.profileImage ? `http://localhost:2000/public/uploads/${selectedLeave.employeeId.userId.profileImage}` : '/image.jpg'}
                        alt="Profile"
                        className="relative w-56 h-56 rounded-full object-cover border-4 border-yellow-400 shadow-2xl hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                    </div>
                    <h4 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">{selectedLeave.employeeId?.userId?.name}</h4>
                    <p className="text-cyan-300 font-medium text-xl mb-4">{selectedLeave.employeeId?.userId?.email}</p>
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {selectedLeave.employeeId?.userId?.role}
                    </span>
                  </div>

                  {/* Details Section */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-cyan-400/10 to-blue-400/10 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-cyan-400/20">
                        <h5 className="text-cyan-300 font-bold mb-4 flex items-center text-lg">
                          <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                          Personal Information
                        </h5>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-gray-200 font-medium">Employee ID:</span>
                            <span className="text-white font-bold text-lg">{selectedLeave.employeeId?.employeeId}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-gray-200 font-medium">Date of Birth:</span>
                            <span className="text-white font-bold">{selectedLeave.employeeId?.dob ? new Date(selectedLeave.employeeId.dob).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-gray-200 font-medium">Gender:</span>
                            <span className="text-white font-bold">{selectedLeave.employeeId?.gender || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-gray-200 font-medium">Marital Status:</span>
                            <span className="text-white font-bold">{selectedLeave.employeeId?.maritalStatus || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-400/10 to-teal-400/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-emerald-400/20">
                        <h5 className="text-emerald-300 font-bold mb-4 flex items-center text-lg">
                          <span className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                          Professional Information
                        </h5>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-gray-200 font-medium">Designation:</span>
                            <span className="text-white font-bold text-lg">{selectedLeave.employeeId?.designation || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-gray-200 font-medium">Department:</span>
                            <span className="text-white font-bold">{selectedLeave.employeeId?.department?.dep_name || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-gray-200 font-medium">Salary:</span>
                            <span className="text-green-400 font-bold text-xl">${selectedLeave.employeeId?.salary || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Leave Information */}
                    <div className="mt-8 bg-gradient-to-br from-purple-400/10 to-pink-400/10 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-purple-400/20">
                      <h5 className="text-white font-bold mb-6 flex items-center text-lg">
                        <span className="w-3 h-3 bg-purple-400 rounded-full mr-3 animate-pulse"></span>
                        Leave Information
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg p-3 border border-purple-400/40 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-400/30">
                          <div className="text-sm font-bold text-purple-300 mb-1">{selectedLeave.leaveType.charAt(0).toUpperCase() + selectedLeave.leaveType.slice(1)}</div>
                          <div className="text-xs text-gray-200 font-medium">Leave Type</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg p-3 border border-purple-400/40 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-400/30">
                          <div className="text-sm font-bold text-purple-300 mb-1">{formatDate(selectedLeave.fromDate)}</div>
                          <div className="text-xs text-gray-200 font-medium">From Date</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg p-3 border border-purple-400/40 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-400/30">
                          <div className="text-sm font-bold text-purple-300 mb-1">{formatDate(selectedLeave.toDate)}</div>
                          <div className="text-xs text-gray-200 font-medium">To Date</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg p-3 border border-purple-400/40 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-400/30">
                          <div className={`text-sm font-bold mb-1 ${selectedLeave.status === 'approved' ? 'text-green-400' : selectedLeave.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>{selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}</div>
                          <div className="text-xs text-gray-200 font-medium">Status</div>
                        </div>
                      </div>

                      {/* Description */}
                      {selectedLeave.description && (
                        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Description</div>
                          <p className="text-white leading-relaxed">{selectedLeave.description}</p>
                        </div>
                      )}

                      {/* Action Buttons for Pending Leaves */}
                      {selectedLeave.status === 'pending' && (
                        <div className="mt-6 flex gap-4 justify-center">
                          <button
                            onClick={() => {
                              handleLeaveAction(selectedLeave._id, 'approved');
                              closeModal();
                            }}
                            disabled={actionLoading === selectedLeave._id}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === selectedLeave._id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Check className="w-5 h-5" />
                                Approve Leave
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              handleLeaveAction(selectedLeave._id, 'rejected');
                              closeModal();
                            }}
                            disabled={actionLoading === selectedLeave._id}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === selectedLeave._id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <X className="w-5 h-5" />
                                Reject Leave
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-indigo-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminLeaveList;
