import { useNavigate } from "react-router-dom"
import axios from 'axios'

export const DepartmentButtons = ({ _id, onDelete }) => {
    const navigate = useNavigate()
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                const response = await axios.delete(`http://localhost:2000/api/department/${_id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.success) {
                    onDelete(_id);
                } else {
                    alert(response.data.error);
                }
            } catch (error) {
                if (error.response && error.response.data && !error.response.data.success) {
                    alert(error.response.data.error);
                } else {
                    alert("An error occurred while deleting the department.");
                }
            }
        }
    }
    return (
        <div className="flex gap-2">
            <button className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm">
                <span className="relative z-10" onClick={()=>navigate(`/admin-dashboard/department/${_id}`)}>Edit</span>
                <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
            </button>
            <button className="relative bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm">
                <span className="relative z-10" onClick={handleDelete}>Delete</span>
                <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[-20deg] animate-[shineSweep_2s_infinite]" />
            </button>
            <style>
                {`
                    @keyframes shineSweep {
                        0% { left: -75%; }
                        100% { left: 125%; }
                    }
                `}
            </style>
        </div>
    )
}
