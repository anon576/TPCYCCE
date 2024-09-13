import React, { useState } from "react";
import { User, Briefcase, Users, Calendar, Search, X } from "lucide-react";

const EmployerDashboard = () => {
	const [activeTab, setActiveTab] = useState("shortlist");
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [eventDetails, setEventDetails] = useState({
		title: "",
		date: "",
		description: "",
	});

	const companyInfo = {
		name: "TechCorp",
		industry: "Information Technology",
		employees: "1000-5000",
		location: "Silicon Valley",
	};

	// Mock student data
	const students = [
		{
			id: 1,
			name: "Alice Johnson",
			skills: ["JavaScript", "React", "Node.js"],
		},
		{ id: 2, name: "Bob Smith", skills: ["Python", "Django", "SQL"] },
		{ id: 3, name: "Charlie Brown", skills: ["Java", "Spring", "Hibernate"] },
		{ id: 4, name: "Diana Ross", skills: ["C++", "Qt", "OpenGL"] },
	];

	// All available skills
	const allSkills = [
		"JavaScript",
		"React",
		"Node.js",
		"Python",
		"Django",
		"SQL",
		"Java",
		"Spring",
		"Hibernate",
		"C++",
		"Qt",
		"OpenGL",
	];

	const addSkill = (skill) => {
		if (!selectedSkills.includes(skill)) {
			setSelectedSkills([...selectedSkills, skill]);
		}
	};

	const removeSkill = (skill) => {
		setSelectedSkills(selectedSkills.filter((s) => s !== skill));
	};

	const filteredStudents = students.filter((student) =>
		selectedSkills.every((skill) => student.skills.includes(skill))
	);

	const handleEventInputChange = (e) => {
		const { name, value } = e.target;
		setEventDetails({ ...eventDetails, [name]: value });
	};

	const handleEventSubmit = (e) => {
		e.preventDefault();
		// Here you would typically send the event details to your backend
		console.log("Event submitted:", eventDetails);
		// Reset form
		setEventDetails({ title: "", date: "", description: "" });
		alert("Event created successfully!");
	};

	return (
		<div className="flex h-full pt-20 bg-gray-100">
			{/* Sidebar */}
			<div className="w-64 bg-white shadow-md">
				<div className="p-6">
					<h2 className="text-2xl font-semibold text-gray-800">
						{companyInfo.name}
					</h2>
					<div className="mt-4">
						<p className="grid text-gray-600 mb-2">
							<Briefcase size={18} className="mr-2" /> {companyInfo.industry}
						</p>
						<p className="grid text-gray-600 mb-2">
							<Users size={18} className="mr-2" /> {companyInfo.employees}{" "}
							employees
						</p>
						<p className="grid text-gray-600">
							<User size={18} className="mr-2" /> {companyInfo.location}
						</p>
						<button className="p-2 my-4 bg-orange-300 text-lg flex">
							Logout
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-10 overflow-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">
					Employer Dashboard
				</h1>

				{/* Tab Navigation */}
				<div className="flex border-b border-gray-200 mb-6">
					<button
						className={`py-2 px-4 font-medium ${
							activeTab === "shortlist"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("shortlist")}
					>
						Shortlist Students
					</button>
					<button
						className={`py-2 px-4 font-medium ${
							activeTab === "events"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("events")}
					>
						Host Events
					</button>
				</div>

				{/* Tab Content */}
				<div className="mt-6">
					{activeTab === "shortlist" && (
						<div>
							<h2 className="text-xl font-semibold mb-4">
								Shortlist Students Based on Skills
							</h2>

							{/* Skill selection */}
							<div className="mb-4">
								<h3 className="text-lg font-medium mb-2">Select Skills:</h3>
								<div className="flex gap-2 mb-2">
									{selectedSkills.map((skill) => (
										<span
											key={skill}
											className="flex bg-blue-100 text-blue-800 px-2 py-1 rounded"
										>
											{skill}
											<button
												onClick={() => removeSkill(skill)}
												className="ml-1"
											>
												<X size={14} />
											</button>
										</span>
									))}
								</div>
								<select
									className="border rounded p-2"
									onChange={(e) => addSkill(e.target.value)}
									value=""
								>
									<option value="">Add a skill</option>
									{allSkills
										.filter((skill) => !selectedSkills.includes(skill))
										.map((skill) => (
											<option key={skill} value={skill}>
												{skill}
											</option>
										))}
								</select>
							</div>

							{/* Student list */}
							<div>
								<h3 className="text-lg font-medium mb-2">Matching Students:</h3>
								{filteredStudents.map((student) => (
									<div
										key={student.id}
										className="bg-white shadow rounded-lg p-4 mb-4"
									>
										<h4 className="text-lg font-semibold">{student.name}</h4>
										<p className="text-gray-600">
											Skills: {student.skills.join(", ")}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
					{activeTab === "events" && (
						<div>
							<h2 className="text-xl font-semibold mb-4">Host Events</h2>
							<form
								onSubmit={handleEventSubmit}
								className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
							>
								<div className="mb-4">
									<label
										className=" text-gray-700 text-sm font-bold mb-2"
										htmlFor="title"
									>
										Event Title
									</label>
									<input
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
										id="title"
										type="text"
										placeholder="Enter event title"
										name="title"
										value={eventDetails.title}
										onChange={handleEventInputChange}
										required
									/>
								</div>
								<div className="mb-4">
									<label
										className=" text-gray-700 text-sm font-bold mb-2"
										htmlFor="date"
									>
										Event Date
									</label>
									<input
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
										id="date"
										type="date"
										name="date"
										value={eventDetails.date}
										onChange={handleEventInputChange}
										required
									/>
								</div>
								<div className="mb-6">
									<label
										className="text-gray-700 text-sm font-bold mb-5"
										htmlFor="description"
									>
										Event Description
									</label>
									<textarea
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
										id="description"
										placeholder="Enter event description"
										name="description"
										value={eventDetails.description}
										onChange={handleEventInputChange}
										required
									/>
								</div>
								<div className="flex items-center justify-between">
									<button
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
										type="submit"
									>
										Create Event
									</button>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default EmployerDashboard;
