import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const EmployeeSettings = () => {

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'warning'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage('All fields are required');
      setMessageType('error');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long');
      setMessageType('error');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New password and confirm password do not match');
      setMessageType('error');
      return false;
    }

    if (formData.oldPassword === formData.newPassword) {
      setMessage('New password must be different from old password');
      setMessageType('warning');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to change password');
        setMessageType('error');
        return;
      }

      const response = await axios.put('/api/auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setMessage('Password changed successfully!');
        setMessageType('success');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage(response.data.error || 'Failed to change password');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.error || 'Failed to change password. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getMessageStyles = () => {
    switch (messageType) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-6 sm:py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2">
              Account Settings
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-base sm:text-lg">Manage your account security and preferences</p>
        </div>

        {/* Settings Card */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                <Lock className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Change Password</h2>
                <p className="text-gray-400">Update your account password for better security</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {/* Message Display */}
            {message && (
              <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${getMessageStyles()}`}>
                {getMessageIcon()}
                <p className="font-medium">{message}</p>
              </div>
            )}

            {/* Old Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? 'text' : 'password'}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Changing Password...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" />
                    <span>Change Password</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Password Security Tips</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Use a strong password with at least 8 characters</li>
                <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
                <li>• Avoid using personal information or common words</li>
                <li>• Change your password regularly for better security</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeSettings;
