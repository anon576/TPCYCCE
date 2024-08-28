import React, { useState } from "react";
import Campus from "./Campus";
import Skills from "./PYQ/Skills";
import Academics from "./Profile/Academics";


const DashboardHome = () => {
	const [activeComponent, setActiveComponent] = useState(null);

	const renderComponent = () => {
		switch (activeComponent) {
			case "Campus":
				return <Campus />;
			case "Skills":
				return <Skills />;
			case "Academics":
				return <Academics />;
			default:
				return null;
		}
	};

	return (
		<>
		<div className="flex flex-col">
			<div className="grid grid-cols-3 gap-4 mb-4">
				<button
					className={`p-4 border ${
						activeComponent === "Campus" ? "bg-blue-500" : "bg-gray-400"
					} text-white`}
					onClick={() => setActiveComponent("Campus")}
				>
					Campus
				</button>
				<button
					className={`p-4 border ${
						activeComponent === "Skills" ? "bg-blue-500" : "bg-gray-400"
					} text-white`}
					onClick={() => setActiveComponent("Skills")}
				>
					Skills
				</button>
				<button
					className={`p-4 border ${
						activeComponent === "Academics" ? "bg-blue-500" : "bg-gray-400"
					} text-white`}
					onClick={() => setActiveComponent("Academics")}
				>
					Academics
				</button>
			</div>
			<div className="flex-grow">{renderComponent()}</div>
		</div>
		</>
	);
};

export default DashboardHome;
