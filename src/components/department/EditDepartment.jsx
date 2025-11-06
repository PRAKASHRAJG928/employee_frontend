import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const EditDepartment = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [department, setDepartment] = useState(null);
    const [depLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
          setLoading(true)
          try {
            const response = await axios.get(`/api/department/${id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (response.data.success) {
              setDepartment(response.data.department)
            }
          } catch (error) {
            if (error.response && error.response.data && !error.response.data.success) {
              alert(error.response.data.error);
            }
          } finally {
            setLoading(false)
          }
        }
        fetchDepartments()
      }, [id])

      const handleChange = (e) => {
        setDepartment({ ...department, [e.target.name]: e.target.value })
      }

      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`/api/department/${id}`, department, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(response.data.success){
                alert('Department updated successfully')
                navigate('/admin-dashboard/department')
            }
        } catch(error){
            if(error.response && error.response.data && !error.response.data.success){
                alert(error.response.data.error);
            }
        }
    }


  return (
    <>{depLoading ? <div>Loading...</div> : department ? (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg text-white">
      <h3 className="text-2xl font-semibold mb-6 relative inline-block pb-2">
        Edit Department
        <span className="absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-[length:300%_100%] animate-[waveLine_6s_linear_infinite]" />
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Department Name */}
        <div className="flex flex-col">
          <label htmlFor="dep_name" className="mb-2 text-gray-300 font-medium">Department Name</label>
          <input
            type="text"
            name="dep_name"
            value={department.dep_name}
            onChange={handleChange}
            required
            placeholder="Enter Department Name"
            className="px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-2 text-gray-300 font-medium">Description</label>
          <textarea
            name="description"
            value={department.description || ''}
            onChange={handleChange}
            placeholder="Description"
            className="px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition resize-none h-32"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="relative w-full sm:w-auto text-center px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
        >
          <span className="relative z-10">Edit Department</span>
          <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
        </button>
      </form>

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
) : <div>Department not found</div>
}</>
  )
}

export default EditDepartment
