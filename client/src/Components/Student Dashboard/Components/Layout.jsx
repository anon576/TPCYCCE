import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import UserInfo from "./UserInfo";

const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<div className="flex py-16 flex-1">
				{/* Sidebar */}
				<aside className="fixed w-64 h-screen top-0 left-0 bottom-0 bg-white pt-20">
					<div className="p-4">
						{/* <h2 className="text-xl font-semibold">Sidebar</h2> */}
						<UserInfo/>
						<div className="mt-4 p-4 bg-gray-100 rounded-lg">
							<ul>
								<li className="mb-2">
									<NavLink
										to="/student-dashboard/home"
										className={({ isActive }) =>
											isActive
												? "text-blue-800 font-bold"
												: "text-blue-600 hover:text-blue-800"
										}
									>
										Home
									</NavLink>
								</li>
								<li className="mb-2">
									<NavLink
										to="/student-dashboard/profile"
										className={({ isActive }) =>
											isActive
												? "text-blue-800 font-bold"
												: "text-blue-600 hover:text-blue-800"
										}
									>
										Profile
									</NavLink>
								</li>
								{/* <li className="mb-2">
									<NavLink
										to="/student-dashboard/certification"
										className={({ isActive }) =>
											isActive
												? "text-blue-800 font-bold"
												: "text-blue-600 hover:text-blue-800"
										}
									>
										Certification
									</NavLink>
								</li> */}
							</ul>
						</div>
					</div>
				</aside>
				<div className="w-64"></div>

				{/* Main content */}
				<div className="flex-1 p-8">
					<Outlet />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Layout;
