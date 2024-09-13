import "./App.css";
import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import Home from "./Components/Home/home";
import Coordinator from "./Components/Coordinator/coordinator";
import ViewCoordinator from "./Components/Coordinator/veiw_coordinator";
import UpdateCoordinator from "./Components/Coordinator/update_coordinator";
import SignIn from "./Components/SignIn/signin";
import CreateCampus from "./Components/Campus/create_campus";
import AddStudent from "./Components/Student/add_student";
import ViewStudent from "./Components/Student/veiw_student";
import UpdateStudent from "./Components/Student/update_student";
import UpdateCampus from "./Components/Campus/update_campus";
import AttendanceTable from "./Components/Round/roundattendace";
import RoundTable from "./Components/Round/round";
import UpdateRound from "./Components/Round/update_round";
import Loader from "./loader/loader";
import SubAdmin from "./Components/SubAdmn/subadmin";
import ViewSubAdmin from "./Components/SubAdmn/veiw_subadmin";
import UpdateSubAdmin from "./Components/SubAdmn/update_subadmin";
import SubAdminSignIn from "./Components/SignIn/subadmin";
import AddSkill from "./Components/Student/skill";
import AddRound from "./Components/Round/add_round";
import CampusMaterial from "./Components/Material/material_campus";
import AddCodingQuestion from "./Components/Material/Coding/AddCode";
import ViewCodingQuestions from "./Components/Material/Coding/ReadCode";
import UpdateCodingQuestion from "./Components/Material/Coding/UpdateCode";
import CreateAptiLRQuestion from "./Components/Material/Aptitude/add_apti";
import ViewAptiLRQuestions from "./Components/Material/Aptitude/veiw_apit";
import UpdateAptiLRQuestion from "./Components/Material/Aptitude/update_apit";
import AddInterviewQuestion from "./Components/Material/Interview/add_interview";
import ViewInterviewQuestions from "./Components/Material/Interview/view_interview";
import UpdateInterviewQuestion from "./Components/Material/Interview/update_interview";
import SeenComponent from "./Components/Material/pyq_stats";
import CreateNotification from "./Components/Notification/create_notification";
import ViewNotification from "./Components/Notification/read_notification";
import UpdateNotification from "./Components/Notification/update_notification";
import Nav from "./Components/Nav/Nav";
import TpoLogin from "./Components/LoginForms/Admin/TpoLogin";
import TpcLogin from "./Components/LoginForms/Admin/TpcLogin";
import DeanLogin from "./Components/LoginForms/Admin/DeanLogin";
import StudentLogin from "./Components/LoginForms/Student/StudentLogin";
import Footer from "./Components/Footer/StudentFooter";
import Layout from "./Components/Student Dashboard/Components/Layout";
import DashboardHome from "./Components/Student Dashboard/Components/DashboardHome";
import NewPasswordForm from "./Components/LoginForms/Student/NewPassword";
import StudentPrivateRoute from "../src/Components/Student Dashboard/StudentPrivateRouter";
import Profile from "./Components/Student Dashboard/Components/Profile/Profile";
import Forgetpassword from "./Components/LoginForms/Student/ForgetPassword";
import AdminNav from "./Components/Nav/AdminNav";
import AdminPrivateRoute from './Components/PrivateRoute/AdminPrivateRoute'
import EmployerLogin from './Components/LoginForms/Employer/Login'
import EmployerRegister from './Components/LoginForms/Employer/Register'
import EmployerDashboard from "./Components/Employer/EmployerDashboard";
import HomePage from "./Components/Home/HomePage";





function App() {
	return (
		<>
			<Router>
				<Routes>
					{/* Public Route */}
					<Route path="/sign_in" element={<SignIn />} />
					<Route path="/" element={<HomePage />} />

					{/* Admin Routes */}
					<Route path="/admin/*" element={<AdminPrivateRoute />}>
						<Route
							path=""
							element={
								<>
									<Home />
								</>
							}
						/>
						<Route
							path="create_coordinator"
							element={
								<>
									<Coordinator />
								</>
							}
						/>
						<Route
							path="view_coordinator"
							element={
								<>
									<ViewCoordinator />
								</>
							}
						/>
						<Route
							path="update_coordinator"
							element={
								<>
									<UpdateCoordinator />
								</>
							}
						/>
						<Route
							path="create_subadmin"
							element={
								<>
									<SubAdmin />
								</>
							}
						/>
						<Route
							path="view_subadmin"
							element={
								<>
									<ViewSubAdmin />
								</>
							}
						/>
						<Route
							path="update_subadmin"
							element={
								<>
									<UpdateSubAdmin />
								</>
							}
						/>
						{/* Additional Admin Routes */}
						<Route path="campus_create" element={<CreateCampus />} />
						<Route path="add_students" element={<AddStudent />} />
						<Route path="view_students" element={<ViewStudent />} />
						<Route path="update_student" element={<UpdateStudent />} />
						<Route path="update_campus" element={<UpdateCampus />} />
						<Route
							path="round_attendance/:roundID"
							element={<AttendanceTable />}
						/>
						<Route path="round" element={<RoundTable />} />
						<Route path="update_round" element={<UpdateRound />} />
						<Route path="subadmin_login" element={<SubAdminSignIn />} />
						<Route path="skill" element={<AddSkill />} />
						<Route path="add_round/:campusID" element={<AddRound />} />
						<Route path="add_study_material" element={<CampusMaterial />} />
						<Route path="add_coding_question" element={<AddCodingQuestion />} />
						<Route
							path="view_coding_question"
							element={<ViewCodingQuestions />}
						/>
						<Route
							path="update_coding_question"
							element={<UpdateCodingQuestion />}
						/>
						<Route
							path="add_apti_lr_question"
							element={<CreateAptiLRQuestion />}
						/>
						<Route
							path="view_apti_lr_question"
							element={<ViewAptiLRQuestions />}
						/>
						<Route
							path="update_apti_lr_question"
							element={<UpdateAptiLRQuestion />}
						/>
						<Route
							path="add_interview_question"
							element={<AddInterviewQuestion />}
						/>
						<Route
							path="view_interview_question"
							element={<ViewInterviewQuestions />}
						/>
						<Route
							path="update_interview_question"
							element={<UpdateInterviewQuestion />}
						/>
						<Route path="view_pyq_stats" element={<SeenComponent />} />
						<Route
							path="create_notification"
							element={<CreateNotification />}
						/>
						<Route path="read_notification" element={<ViewNotification />} />
						<Route
							path="update_notification"
							element={<UpdateNotification />}
						/>
						{/* End of Admin Routes */}
					</Route>

					{/* Other Routes */}
					<Route path="/loader" element={<Loader />} />

					<Route
						path="/admin_login"
						element={
							<>
								<AdminNav />
								<TpoLogin />
								<Footer />
							</>
						}
					/>

					<Route
						path="/tpo"
						element={
							<>
								<AdminNav />
								<TpoLogin />
								<Footer />
							</>
						}
					/>
					<Route
						path="/tpc"
						element={
							<>
								<AdminNav />
								<TpcLogin />
								<Footer />
							</>
						}
					/>
					<Route
						path="/dean"
						element={
							<>
								<AdminNav />
								<DeanLogin />
								<Footer />
							</>
						}
					/>

					<Route
						path="/student_login"
						element={
							<>
								<Nav />
								<StudentLogin />
								<Footer />
							</>
						}
					/>

					<Route
						path="/employer_login"
						element={
							<>
								<Nav />
								<EmployerLogin></EmployerLogin>
								<Footer />
							</>
						}
					/>
					<Route
						path="/employer-dashboard"
						element={
							<>
								<Nav />
								<EmployerDashboard />
								<Footer />
							</>
						}
					/>
					<Route
						path="/employer_register"
						element={
							<>
								<Nav />
								<EmployerRegister></EmployerRegister>
								<Footer />
							</>
						}
					/>

					<Route
						path="/new_password"
						element={
							<>
								<Nav />
								<NewPasswordForm />
								<Footer />
							</>
						}
					/>

					<Route
						path="/forget_password"
						element={
							<>
								<Nav />
								<Forgetpassword />
								<Footer />
							</>
						}
					/>

					<Route
						path="/student-dashboard"
						element={<StudentPrivateRoute component={Layout} />}
					>
						<Route index element={<Navigate to="home" replace />} />
						<Route path="home" element={<DashboardHome />} />
					</Route>

					<Route
						path="/home"
						element={<StudentPrivateRoute component={Layout} />}
					>
						<Route index element={<Navigate to="home" replace />} />
						<Route path="home" element={<DashboardHome />} />
					</Route>

					<Route
						path="/profile"
						element={
							<>
								<Profile></Profile>
							</>
						}
					/>
				</Routes>
			</Router>
		</>
	);
}

export default App;
