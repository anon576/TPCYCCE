import React, { useEffect, useState } from "react";
import Loader from "../../../../loader/loader";

const Certification = () => {
	const [cerificate, setcerificate] = useState("");
	const [level, setLevel] = useState("");
	const [cerificatesList, setcerificatesList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const handleAddcerificate = (e) => {
		e.preventDefault();

		if (cerificate && level) {
			setcerificatesList([...cerificatesList, { cerificate, level }]);
			setcerificate("");
			setLevel("");
		}
	};

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	});
	if (isLoading) return <Loader />;

	return (
		<div className="p-8 bg-white shadow-md rounded-lg">
			<h1 className="text-2xl font-bold mb-6 text-blue-600">Add Your cerificates</h1>

			{/* Form to add cerificate */}
			<form onSubmit={handleAddcerificate} className="mb-6">
				<div className="mb-4">
					<label
						className="block text-left text-gray-700 text-sm font-bold mb-2"
						htmlFor="cerificate"
					>
						cerificate:
					</label>
					<input
						type="text"
						id="cerificate"
						value={cerificate}
						onChange={(e) => setcerificate(e.target.value)}
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
						placeholder="Enter cerificate"
						required
					/>
				</div>

				<div className="mb-4">
					<label
						className="block text-left text-gray-700 text-sm font-bold mb-2"
						htmlFor="level"
					>
						Organization:
					</label>
					<input
						type="text"
						id="level"
						value={level}
						onChange={(e) => setLevel(e.target.value)}
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
						placeholder="Enter organization"
						min="1"
						max="10"
						required
					/>
				</div>

				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
				>
					Add cerificate
				</button>
			</form>

			{/* Display previous cerificates */}
			<div>
				<h2 className="text-xl font-bold mb-4 text-gray-700">Your cerificates</h2>
				{cerificatesList.length > 0 ? (
					<ul className="list-disc list-inside ml-4">
						{cerificatesList.map((item, index) => (
							<li key={index} className="text-gray-700">
								{item.cerificate} - Level: {item.level}/10
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-600">No cerificates added yet.</p>
				)}
			</div>
		</div>
	);
};

export default Certification;
