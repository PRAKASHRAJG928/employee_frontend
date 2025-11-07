import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { EmployeeButtons } from '../../utils/EmployeeHelper'

const List = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const navigate = useNavigate()

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:2000/api/employee/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        let Sno = 1;
        const data = response.data.employees.map((emp) => ({
          _id: emp._id,
          sno: Sno++,
          name: emp.userId?.name || 'N/A',
          image: emp.userId?.profileImage || 'https://i.pinimg.com/564x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
          employeeId: emp.employeeId || 'N/A',
          department: emp.department?.dep_name || 'N/A',
          designation: emp.designation || 'N/A',
          dob: emp.dob,
          salary: emp.salary || 0,
          action: <EmployeeButtons _id={emp._id} onDelete={handleDelete} />
        }));
        setEmployees(data)
        setFilteredEmployees(data)
      }
    } catch (error) {
      if (error.response && error.response.data && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    // Re-fetch employees to ensure UI is in sync with backend after delete
    await fetchEmployees()
  }

  const filterEmployees = (e) => {
    const searchValue = e.target.value.toLowerCase()
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchValue) ||
      emp.department.toLowerCase().includes(searchValue)
    );
    setFilteredEmployees(records);
    setCurrentPage(1)
  }

  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newSortOrder)
    const sorted = [...filteredEmployees].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
    setFilteredEmployees(sorted)
    setCurrentPage(1)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  useEffect(() => {
    fetchEmployees()
  }, [])
  return (
    <>{loading ? <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">Loading...</div> :
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex flex-col items-center py-10 px-4 text-white">
      <div className="w-full max-w-3xl mb-8 relative">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-semibold text-white inline-block pb-2 relative">
            Manage Employees
            {/* Animated Underline */}
            <span className="absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-[length:300%_100%] animate-[waveLine_6s_linear_infinite]" />
          </h3>
          <button
            onClick={handleSort}
            className="relative bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
          >
            <span className="relative z-10">Sort {sortOrder === 'asc' ? '↑' : '↓'}</span>
            <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
          </button>
        </div>
      </div>

      {/* Search + Add Button */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-800/60 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-gray-700">
        <input
          type="text"
          placeholder="Search By Employee Name or Department"
          onChange={filterEmployees}
          className="w-full sm:w-2/3 px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <Link
          to="/admin-dashboard/add-employee"
          className="relative w-full sm:w-auto px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
        >
          <span className="relative z-10">Add New Employee</span>
          {/* Shine Sweep Effect */}
          <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
        </Link>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes waveLine {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          @keyframes shineSweep {
            0% { left: -75%; }
            100% { left: 125%; }
          }
        `}
      </style>
      <div className="w-full max-w-3xl mt-6">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No employees found</div>
            <p className="text-gray-500 mt-2">Add your first employee to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentItems.map((emp) => (
              <div
                key={emp._id}
                onClick={() => navigate(`/admin-dashboard/employee/view/${emp._id}`)}
                className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <img
                      src={emp.image.startsWith('http') ? emp.image : `http://localhost:2000/public/uploads/${emp.image}`}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg sm:text-xl truncate">{emp.name}</h3>
                      <p className="text-gray-400 text-sm">Employee #{emp.sno}</p>
                      <div className="text-gray-300 text-xs sm:text-sm mt-1 space-y-1 sm:space-y-0">
                        <p className="break-words">
                          <span className="font-medium">ID:</span> {emp.employeeId} |
                          <span className="font-medium"> Dept:</span> {emp.department}
                        </p>
                        <p className="break-words">
                          <span className="font-medium">Designation:</span> {emp.designation.trim()} |
                          <span className="font-medium"> DOB:</span> {emp.dob ? new Date(emp.dob).toLocaleDateString() : 'N/A'} |
                          <span className="font-medium"> Salary:</span> ${emp.salary}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {emp.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full max-w-3xl mt-8 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative px-4 py-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10">Previous</span>
              <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`relative px-4 py-2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500'
                }`}
              >
                <span className="relative z-10">{page}</span>
                <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative px-4 py-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10">Next</span>
              <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>
        {`
          @keyframes waveLine {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          @keyframes shineSweep {
            0% { left: -75%; }
            100% { left: 125%; }
          }
        `}
      </style>
    </div>
    }</>
  )
}

export default List
