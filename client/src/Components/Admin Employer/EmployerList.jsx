import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import axios from 'axios';
import { BACKEND_URL } from '../../constant';

const EmployersTable = () => {
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployers = async () => {
            const token = localStorage.getItem("token")
            try {
                const response = await axios.get(BACKEND_URL+'/employer/employers',{
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                }); // Replace with your actual API endpoint
                setEmployers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employers');
                setLoading(false);
            }
        };

        fetchEmployers();
    }, []);

    const handleViewRequests = (employerID) => {
        navigate(`/admin/employers/${employerID}/requests`); // Navigates to the requests page for the selected employer
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="tl" id="vc">
            <table className="ctble">
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Employer Name</th>
                        <th>Employer Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employers.map((employer, index) => (
                        <tr key={employer.employerID}>
                            <td>{index + 1}</td>
                            <td>{employer.employerName}</td>
                            <td>{employer.employerEmail}</td>
                            <td>
                                <button onClick={() => handleViewRequests(employer.employerID)}>
                                    View Requests
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployersTable;
