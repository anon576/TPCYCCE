import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import TableSection from '../Table';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { BACKEND_URL } from "../../../constant";

// DashboardCard Component
const DashboardCard = ({ title, value }) => (
	<div className="bg-white p-4 rounded-lg shadow">
		<h3 className="text-sm font-medium text-gray-500">{title}</h3>
		<p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
	</div>
);

const BranchStats = () => {
	const location = useLocation();
	const { branchName } = location.state || {};
	const [studentData, setStudentData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [placementData, setPlacementData] = useState([]);
console.log(branchName)
	useEffect(() => {
		const fetchData = async () => {
			if (!branchName) return;

			try {
				const token = localStorage.getItem("token")
				const response = await axios.post(BACKEND_URL + '/stats/get_branch_stats', {
					branch: branchName // Adjusting to the new API structure
				},{
                    headers: {
                        'Authorization': `${token}`, // Adjust based on your auth mechanism
                        'Content-Type': 'application/json',
                    },
                });

				// Assuming your API response structure matches this
				const data = response.data;
				console.log(data.studentData)
				// Transform data into the format expected by the PieChart
				const formattedData = [
					{ name: "Placed", value: data.studentStats.Placed, color: "#0088FE" },
					{ name: "Eligible", value: data.studentStats.Eligible, color: "#00C49F" },
					{ name: "Higher Studies", value: data.studentStats.HigherStudies, color: "#eb4034" },
					{ name: "Opted for placement", value: data.studentStats.PlacementFacility, color: "#FFBB28" },
					{ name: "Not Eligible", value: data.studentStats.NotEligible, color: "#eb4034" },
				];

				setStudentData(formattedData);
				setPlacementData(data.campusPlacementData);
				console.log(data.campusPlacementData)
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [branchName]); // Dependency array to ensure useEffect runs when branchName changes

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="p-4 bg-gray-100 w-[95%] mx-auto">
			<h1 className="text-2xl font-bold mb-6">Stats Dashboard for {branchName}</h1>

			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
					<h2 className="text-lg font-medium mb-4">Student Status</h2>
					<ResponsiveContainer width="100%" height={400}>
						<PieChart>
							<Pie
								data={studentData}
								cx="50%"
								cy="50%"
								labelLine={false}
								outerRadius={150}
								fill="#8884d8"
								dataKey="value"
								label={({ name, value }) => `${name}: ${value}`}
							>
								{studentData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
								<Label
									value={`Total Students: ${studentData.reduce((acc, curr) => acc + curr.value, 0) || 0}`}
									position="center"
									fill="#000"
									style={{ fontSize: "16px", fontWeight: "bold" }}
								/>
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="flex justify-center space-x-4 mt-4">
						<div className="w-60 p-2 bg-gray-100 rounded-lg mt-4">
							{studentData.map((entry, index) => (
								<div key={`legend-${index}`} className="flex items-center mb-2">
									<div
										className="w-3 h-3 mr-2"
										style={{ backgroundColor: entry.color }}
									></div>
									<span>{entry.name}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="space-y-5">
					{studentData.map((data, index) => (
						<DashboardCard title={data.name} value={data.value} key={index} />
					))}
				</div>
			</div>

			{/* <TableSection
				title="Company Wise Placement"
				headers={["Campus", "Total Students", "Placed Students", "Not Eligible", "Pending", "Download", "View Stats"]}
				data={placementData}
			/> */}

		</div>
	);
};

export default BranchStats;
