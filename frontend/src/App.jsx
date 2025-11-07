import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AuthContext from './context/AuthContext';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import AdminSummary from './components/dashboard/AdminSummary';
import AdminSettings from './components/dashboard/AdminSettings';
import EmployeeSettings from './components/dashboard/EmployeeSettings';
import EmployeeSummary from './components/dashboard/EmployeeSummary';
import DepartmentList from './components/department/DepartmentList';
import AddDepartment from './components/department/AddDepartment';
import EditDepartment from './components/department/EditDepartment';
import List from './components/employee/List'
import Add from './components/employee/Add';
import View from './components/employee/View';
import Edit  from './components/employee/Edit';
import Profile from './components/employee/Profile';
import EditProfile from './components/employee/EditProfile';
import SalaryHistory from './components/employee/SalaryHistory';
import EmployeeSalary from './components/employee/EmployeeSalary';
import SalaryDetails from './components/salary/SalaryDetails';
import LeaveList from './components/leave/List';
import AddLeave from './components/leave/Add'
import AdminLeaveList from './components/leave/AdminLeaveList';
import SalaryList from './components/salary/List';
import AddSalary from './components/salary/Add';

import ViewSalary from './components/salary/ViewSalary';
import EditSalary from './components/salary/EditSalary';
import Attendance from './components/attendance/Attendance';
import AttendanceReport from './components/attendance/AttendanceReport';

function App() {
  return (
    <AuthContext>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/login" />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/admin-dashboard' element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin']}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }>

           <Route index element = {<AdminSummary />}></Route>
           <Route path = "/admin-dashboard/department" element={<DepartmentList />}></Route>
           <Route path = "/admin-dashboard/add-department" element={<AddDepartment />}></Route>
           <Route path = "/admin-dashboard/department/:id" element={<EditDepartment />}></Route>

           <Route path = "/admin-dashboard/employees" element={<List />}></Route>
           <Route path = "/admin-dashboard/add-employee" element={<Add />}></Route>
           <Route path = "/admin-dashboard/employee/view/:id" element={<View />}></Route>
           <Route path = "/admin-dashboard/employee/:id" element={<Edit />}></Route>
           <Route path = "/admin-dashboard/employee/salary-history/:id" element={<SalaryHistory />}></Route>
           <Route path = "/admin-dashboard/salary/:id" element={<SalaryDetails />}></Route>

           <Route path = "/admin-dashboard/salaries" element={<SalaryList />}></Route>
           <Route path = "/admin-dashboard/add-salary" element={<AddSalary />}></Route>









           <Route path = "/admin-dashboard/salary/view/:id" element={<ViewSalary />}></Route>
           <Route path = "/admin-dashboard/salary/edit/:id" element={<EditSalary />}></Route>

           <Route path = "/admin-dashboard/leaves" element={<AdminLeaveList />}></Route>
           <Route path = "/admin-dashboard/attendance" element={<Attendance />}></Route>
           <Route path = "/admin-dashboard/attendance-reports" element={<AttendanceReport />}></Route>
           <Route path = "/admin-dashboard/settings" element={<AdminSettings />}></Route>


          </Route>
          <Route path='/employee-dashboard' element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={['admin', 'employee']}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }>
            <Route index element={<EmployeeSummary />} />
            <Route path="/employee-dashboard/profile" element={<Profile />} />
            <Route path="/employee-dashboard/edit-profile" element={<EditProfile />} />
            <Route path="/employee-dashboard/leaves" element={<LeaveList />} />
            <Route path="/employee-dashboard/add-leave" element={<AddLeave />} />

            <Route path="/employee-dashboard/salary" element={<SalaryHistory />} />
            <Route path="/employee-dashboard/settings" element={<EmployeeSettings />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthContext>
  )
}

export default App
