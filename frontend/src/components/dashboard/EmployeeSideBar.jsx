import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Calendar,
  Wallet,
  Settings
} from 'lucide-react';

const EmployeeSideBar = () => {
  const navItems = [
    { to: '/employee-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employee-dashboard/profile', icon: User, label: 'My Profile' },
    { to: '/employee-dashboard/leaves', icon: Calendar, label: 'Leave' },
    { to: '/employee-dashboard/salary', icon: Wallet, label: 'Salary' },
    { to: '/employee-dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r border-border flex flex-col overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4),0_0_45px_rgba(139,92,246,0.2)] transition-all duration-500 group z-40">

      {/* Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900"></div>

      {/* Floating Shapes & Animated Lines */}
      <div className="absolute inset-0">
        <div className="absolute top-16 right-8 w-20 h-20 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-24 left-6 w-16 h-16 bg-gradient-to-br from-purple-400/25 to-pink-500/25 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-4 w-12 h-12 bg-gradient-to-br from-emerald-400/25 to-teal-500/25 rounded-full blur-md animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-12 w-24 h-24 bg-gradient-to-br from-violet-400/15 to-indigo-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>

        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col backdrop-blur-sm">

        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-900/70 backdrop-blur-md border border-gray-700 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.15)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Employee MS</h3>
              <p className="text-xs text-sidebar-foreground/60">Employee Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/employee-dashboard'}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500 overflow-hidden ${
                    isActive
                      ? 'bg-sidebar-active text-white shadow-lg shadow-primary/30'
                      : 'text-sidebar-foreground hover:bg-gradient-to-r hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400 hover:text-white hover:shadow-[0_4px_8px_rgba(255,0,255,0.2),0_8px_16px_rgba(0,255,255,0.15)] hover:transform hover:scale-105 hover:-translate-y-0.5 hover:backdrop-blur-sm'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive ? '' : 'group-hover:scale-110'
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="bg-gray-900/70 backdrop-blur-md rounded-lg p-4 shadow-[0_0_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_12px_rgba(59,130,246,0.2)] transition-all duration-300">
            <p className="text-xs text-sidebar-foreground/70 mb-2">Need help?</p>
            <button className="text-xs text-primary hover:text-white hover:bg-gray-800/50 hover:backdrop-blur-sm px-3 py-1 rounded-md transition-all duration-300 font-medium">
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default EmployeeSideBar;
