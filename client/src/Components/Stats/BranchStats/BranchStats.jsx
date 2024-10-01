import React, {useState} from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

// Sample data - replace with your actual data
const studentData = [
	{ name: "Placed", value: 400, color: "#0088FE" },
	{ name: "Eligible", value: 300, color: "#00C49F" },
	{ name: "Higher Studies", value: 100, color: "#eb4034" },
	{ name: "Opted for placement", value: 200, color: "#FFBB28" },
	{ name: "Not Eligible", value: 200, color: "#eb4034" },
];

const DashboardCard = ({ title, value }) => (
	<div className="bg-white p-4 rounded-lg shadow">
		<h3 className="text-sm font-medium text-gray-500">{title}</h3>
		<p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
	</div>
);
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

const BranchStats = () => {
	
	return (
		<div className="p-4 bg-gray-100 w-[95%] mx-auto">
			<h1 className="text-2xl font-bold mb-6">Stats Dashboard</h1>

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
									value={`Total Students: ${100 || 0}`}
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
					{/* <DashboardCard title="Total Ongoing Campus" value="15" /> */}
					{studentData.map((data, index) => {
						return <DashboardCard title={data.name} value={data.value} key={index}/>;
					})}
				</div>
			</div>

			<TableSection
				title="Company wise placement"
				headers={["Company", "No. Of selected students", "See More"]}
				data={[
					{ company: "Tech Co", position: 10, element: <button className="bg-green-600 text-white rounded-lg px-3 p-1">View More</button> },
					{ company: "Finance Inc", position: 20, element: <button className="bg-green-600 text-white rounded-lg px-3 p-1">View More</button> },
					{
						company: "Marketing Ltd",
						position: 30,
						element: <button className="bg-green-600 text-white rounded-lg px-3 p-1">View More</button>,
					},
				]}
				expandedData={
					[
					{ company: "Tech Co", position: 10, element: <button className="bg-green-600 text-white rounded-lg px-3 p-1">View More</button> },
					{ company: "Finance Inc", position: 20, element: <button className="bg-green-600 text-white rounded-lg px-3 p-1">View More</button> },
					
				]
				}
			/>

			<TableSection
				title="Jobs Published by Employer"
				headers={["Employer", "Job Title", "Date Published"]}
				data={[
					{
						employer: "InnoTech",
						jobTitle: "Full Stack Developer",
						datePublished: "2024-09-15",
					},
					{
						employer: "DataCorp",
						jobTitle: "Machine Learning Engineer",
						datePublished: "2024-09-14",
					},
					{
						employer: "CreativeMinds",
						jobTitle: "UX Designer",
						datePublished: "2024-09-13",
					},
				]}
			/>

			<TableSection
				title="Recent Ongoing Campuses"
				headers={["Campus", "Start Date", "End Date"]}
				data={[
					{
						campus: "Tech University",
						startDate: "2024-09-20",
						endDate: "2024-09-22",
					},
					{
						campus: "Business School",
						startDate: "2024-09-18",
						endDate: "2024-09-19",
					},
					{
						campus: "Engineering Institute",
						startDate: "2024-09-16",
						endDate: "2024-09-17",
					},
				]}
			/>

			<TableSection
				title="Recent Companies Visited Campus"
				headers={["Company", "Visit Date", "Positions Offered"]}
				data={[
					{
						company: "Google",
						visitDate: "2024-09-25",
						positionsOffered: "Software Engineer, Product Manager",
					},
					{
						company: "Amazon",
						visitDate: "2024-09-23",
						positionsOffered: "Data Scientist, Operations Manager",
					},
					{
						company: "Microsoft",
						visitDate: "2024-09-21",
						positionsOffered: "Cloud Architect, UX Researcher",
					},
				]}
			/>
		</div>
	);
};

export default BranchStats;
