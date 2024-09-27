import React, { useState } from "react";
import { Link } from "react-router-dom";

const TableSection = ({ title, data, headers, expandedData }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

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
			<div className="p-4 border-t">
				<button
					onClick={toggleExpand}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
				>
					{isExpanded ? "View Less" : "View More"}
				</button>
			</div>
		</div>
	);
};

const CampusOverview = () => {
	// Sample data for the first table
	const placementData = [
		{
			name: "Tech Expo 2024",
			dates: "Jan 15-17, 2024",
			eligible: 500,
			placed: 300,
			pending: 200,
		},
		{
			name: "CodeFest 2024",
			dates: "Feb 10-12, 2024",
			eligible: 400,
			placed: 250,
			pending: 150,
		},
		{
			name: "DataSummit 2024",
			dates: "Mar 5-7, 2024",
			eligible: 300,
			placed: 180,
			pending: 120,
		},
	];

	// Expanded data for the first table
	const expandedPlacementData = [
		...placementData,
		{
			name: "AI Conference 2024",
			dates: "Apr 20-22, 2024",
			eligible: 350,
			placed: 200,
			pending: 150,
		},
		{
			name: "Cyber Security Symposium",
			dates: "May 15-17, 2024",
			eligible: 250,
			placed: 150,
			pending: 100,
		},
		{
			name: "Robotics Expo 2024",
			dates: "Jun 10-12, 2024",
			eligible: 200,
			placed: 120,
			pending: 80,
		},
	];

	// Sample data for the second table
	const branchData = [
		{ branch: "Computer Science", placed: 150, notPlaced: 50 },
		{ branch: "Electrical Engineering", placed: 120, notPlaced: 80 },
		{ branch: "Mechanical Engineering", placed: 100, notPlaced: 100 },
	];

	// Expanded data for the second table
	const expandedBranchData = [
		...branchData,
		{ branch: "Civil Engineering", placed: 80, notPlaced: 120 },
		{ branch: "Chemical Engineering", placed: 70, notPlaced: 130 },
		{ branch: "Aerospace Engineering", placed: 60, notPlaced: 90 },
	];

	return (
		<div className="bg-gray-100">
			<div className="p-4 w-[95%] mx-auto min-h-screen">
                <Link to="/placement_statistics" className="px-3 bg-green-700 text-white rounded-lg">Go Back</Link>
				<h1 className="text-2xl font-bold my-6">Campus Overview</h1>
				<TableSection
					title="Placement Drive Statistics"
					headers={[
						"Name",
						"Dates",
						"Eligible Students",
						"Placed Students",
						"Pending",
					]}
					data={placementData}
					expandedData={expandedPlacementData}
				/>

				<TableSection
					title="Branch-wise Placement Statistics"
					headers={["Engineering Branch", "Placed", "Not Placed"]}
					data={branchData}
					expandedData={expandedBranchData}
				/>
			</div>
		</div>
	);
};

export default CampusOverview;
