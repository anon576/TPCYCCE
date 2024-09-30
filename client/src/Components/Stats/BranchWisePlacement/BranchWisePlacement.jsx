import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../../constant";
const TableSection = ({ title, data, headers, expandedData }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
			<h3 className="text-lg font-medium p-4 bg-gray-50 border-b">{title}</h3>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							{headers.map((header, index) => (
								<th
									key={index}
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{(isExpanded ? expandedData : data).map((row, index) => (
							<tr key={index}>
								{Object.values(row).map((cell, cellIndex) => (
									<td
										key={cellIndex}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
									>
										{cell}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};



const CampusBranchOverview = () => {
  const [placementData, setPlacementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchBranchWisePlacement = async () => {
          try {
              const token = localStorage.getItem("token"); // If your API requires authentication
              const response = await axios.get(BACKEND_URL+"/stats/branch-wise-placement", {
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
  }, []);

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
              <h1 className="text-2xl font-bold my-6">Branch Wise Placement</h1>
              <TableSection
                  title="Placement Drive Statistics"
                  headers={headers}
                  data={tableData}
                  expandedData={tableData} // Assuming expandedData is used similarly
              />
          </div>
      </div>
  );
};

export default CampusBranchOverview;