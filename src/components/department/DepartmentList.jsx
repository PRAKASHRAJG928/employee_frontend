import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { DepartmentButtons } from '../../utils/DepartmentHelper'

const DepartmentList = () => {
  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:2000/api/department/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (response.data.success) {
        let Sno = 1;
        const data = response.data.departments.map((dep) => ({
          _id: dep._id,
          sno: Sno++,
          dep_name: dep.dep_name,
          description: dep.description,
          action: <DepartmentButtons _id={dep._id} onDelete={handleDelete} />,
        }));
        setDepartments(data)
        setFilteredDepartments(data)
      }
    } catch (error) {
      if (error.response && error.response.data && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    // Re-fetch departments to ensure UI is in sync with backend after delete
    await fetchDepartments()
  }

  const filterDepartments = (e) => {
    const searchValue = e.target.value.toLowerCase()
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(searchValue)
    );
    setFilteredDepartments(records);
    setCurrentPage(1)
  }

  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newSortOrder)
    const sorted = [...filteredDepartments].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return a.dep_name.localeCompare(b.dep_name)
      } else {
        return b.dep_name.localeCompare(a.dep_name)
      }
    })
    setFilteredDepartments(sorted)
    setCurrentPage(1)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  useEffect(() => {
    fetchDepartments()
  }, [])


  return (
    <>{loading ? <div>Loading...</div> :
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex flex-col items-center py-4 sm:py-6 px-4 text-white">
      {/* Header */}
      <div className="w-full max-w-4xl mb-4 sm:mb-6 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-white inline-block pb-2 relative">
            Manage Departments
            {/* Animated Underline */}
            <span className="absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-[length:300%_100%] animate-[waveLine_6s_linear_infinite]" />
          </h3>
          <button
            onClick={handleSort}
            className="relative bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm w-full sm:w-auto"
          >
            <span className="relative z-10">Sort {sortOrder === 'asc' ? '↑' : '↓'}</span>
            <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
          </button>
        </div>
      </div>

      {/* Search + Add Button */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-800/60 backdrop-blur-lg shadow-xl rounded-xl p-4 sm:p-6 border border-gray-700">
        <input
          type="text"
          placeholder="Search By Department Name"
          className="w-full sm:w-2/3 px-4 py-2 rounded-lg bg-gray-900/70 border border-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          onChange={filterDepartments}
        />

        <Link
          to="/admin-dashboard/add-department"
          className="relative w-full sm:w-auto px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 text-center"
        >
          <span className="relative z-10">Add New Department</span>
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
      <div className="w-full max-w-4xl mt-6">
        {filteredDepartments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No departments found</div>
            <p className="text-gray-500 mt-2">Add your first department to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {currentItems.map((dep) => (
              <div
                key={dep._id}
                className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/50"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">
                        {dep.dep_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg sm:text-xl truncate">{dep.dep_name}</h3>
                      <p className="text-gray-400 text-sm">Department #{dep.sno}</p>
                    </div>
                  </div>
                  {dep.description && (
                    <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {dep.description}
                      </p>
                    </div>
                  )}
                  <div className="flex space-x-2 justify-end pt-2 border-t border-gray-600/30">
                    {dep.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full max-w-4xl mt-8 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
            >
              <span className="relative z-10">Previous</span>
              <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`relative px-3 sm:px-4 py-2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 text-sm ${
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
              className="relative px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
            >
              <span className="relative z-10">Next</span>
              <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
            </button>
          </div>
        </div>
      )}
    </div>
     } </>
  )
}

export default DepartmentList
