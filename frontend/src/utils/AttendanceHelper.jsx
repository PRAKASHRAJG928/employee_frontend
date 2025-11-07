import axios from 'axios'

const API_BASE_URL = '/api/attendance'

export const markAttendance = async (employeeId, date, status) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/mark`, {
            employeeId,
            date,
            status
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data
    } catch (error) {
        console.error('Error marking attendance:', error)
        throw error
    }
}

export const getAttendance = async (employeeId, date) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/`, {
            params: { employeeId, date },
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data
    } catch (error) {
        console.error('Error fetching attendance:', error)
        throw error
    }
}

export const getAttendanceReport = async (startDate, endDate, employeeId = null) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/report`, {
            params: { startDate, endDate, employeeId },
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data
    } catch (error) {
        console.error('Error fetching attendance report:', error)
        throw error
    }
}

export const getAllAttendanceForDate = async (date) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all`, {
            params: { date },
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data
    } catch (error) {
        console.error('Error fetching all attendance for date:', error)
        throw error
    }
}
