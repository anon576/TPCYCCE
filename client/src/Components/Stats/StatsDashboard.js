import React from "react";
import { Link } from "react-router-dom";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Label,
	Tooltip,
	Legend,
} from "recharts";

// Sample data - replace with your actual data
const studentData = [
	{ name: "Placed", value: 400, color: "#0088FE" },
	{ name: "Eligible", value: 300, color: "#00C49F" },
	{ name: "Not Eligible", value: 200, color: "#FFBB28" },
];

const DashboardCard = ({ title, value }) => (
	<div className="bg-white p-4 rounded-lg shadow">
		<h3 className="text-sm font-medium text-gray-500">{title}</h3>
		<p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
	</div>
);

const TableSection = ({ title, data, headers }) => (
	<div className="mt-6 bg-white rounded-lg shadow">
		<h3 className="text-lg font-medium p-4 border-b">{title}</h3>
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
					{data.map((row, index) => (
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
			<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
				View More
			</button>
		</div>
	</div>
);

const StatsDashboard = () => {
	return (
		<div className="bg-gray-100">
			<div className="p-4 w-[95%] mx-auto">
				<h1 className="text-2xl font-bold mb-6">Stats Dashboard</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-lg font-medium mb-4">Placement Status</h2>
						<ResponsiveContainer width="100%" height={450}>
							<PieChart>
								<Pie
									data={studentData}
									cx="50%"
									cy="50%"
									labelLine={true}
									outerRadius={180}
									fill="#8884d8"
									dataKey="value"
									label={({ name, value }) => `${name}: ${value}`}
								>
									{studentData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
									<Label
										value={`Total students : ${studentData.reduce(
											(acc, curr) => acc + curr.value,
											0
										)}`}
										position="center"
										fill="#000"
										style={{ fontSize: "16px", fontWeight: "bold" }}
									/>
								</Pie>
							</PieChart>
						</ResponsiveContainer>
						<div className="w-40 p-5 bg-gray-100 rounded-lg">
							{studentData.map((entry, index) => (
								<div key={`legend-${index}`} className="flex items-center">
									<div
										className="w-3 h-3"
										style={{ backgroundColor: entry.color }}
									></div>
									<span>{entry.name}</span>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-5">
						<DashboardCard title="Total Ongoing Campus" value="15" />
						<DashboardCard title="Total Companies Visited" value="32" />
						<DashboardCard title="Total Students" value="900" />
						<Link to="/campus-overview">
							<button className="bg-green-600 p-4 my-4 rounded-lg shadow text-white">
								Campus Overview
							</button>
						</Link>
					</div>
				</div>

				<TableSection
					title="No. of Employees Required"
					headers={["Company", "Position", "Required"]}
					data={[
						{ company: "Tech Co", position: "Software Engineer", required: 5 },
						{ company: "Finance Inc", position: "Data Analyst", required: 3 },
						{
							company: "Marketing Ltd",
							position: "Digital Marketer",
							required: 2,
						},
					]}
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
		</div>
	);
};

export default StatsDashboard;
