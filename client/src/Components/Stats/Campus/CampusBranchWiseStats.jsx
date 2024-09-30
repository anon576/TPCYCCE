import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../constant";
import TableSection from '../Table';

const CampusBranchWiseStats = () => {
    const { campusId } = useParams(); // Get campusId from URL params
    const [placementData, setPlacementData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBranchWisePlacement = async () => {
            try {
                const token = localStorage.getItem("token"); // If your API requires authentication
                const response = await axios.get(`${BACKEND_URL}/stats/branch_wise_placement/${campusId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Adjust based on your auth mechanism
                        'Content-Type': 'application/json',
                    },
                });
                setPlacementData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching branch-wise placement data:", err);
                setError("Failed to fetch branch-wise placement data.");
                setLoading(false);
            }
        };

        fetchBranchWisePlacement();
    }, [campusId]);

    // Prepare data for TableSection
    const tableData = placementData.map(item => ({
        Branch: item.Branch,
        'Total Students': item['Total Students'],
        'Placed Students': item['Placed Students'],
        'Pending': item['Pending'],
        'Download': <Link to={item.Download}>Download</Link>
    }));

    const headers = ["Branch", "Total Students", "Placed Students", "Pending", "Download"];

    if (loading) {
        return (
            <div className="bg-gray-100">
                <div className="p-4 w-[95%] mx-auto min-h-screen flex justify-center items-center">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-100">
                <div className="p-4 w-[95%] mx-auto min-h-screen flex justify-center items-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100">
            <div className="p-4 w-[95%] mx-auto min-h-screen">
                <h1 className="text-2xl font-bold my-6">Branch Wise Placement for Campus ID: {campusId}</h1>
                <TableSection
                    title="Branch Wise Placement Statistics"
                    headers={headers}
                    data={tableData}
                    expandedData={tableData} // Assuming expandedData is used similarly
                />
            </div>
        </div>
    );
};

export default CampusBranchWiseStats;
