import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
import TpoLogin from "./Components/LoginForms/TpoLogin";
import TpcLogin from "./Components/LoginForms/TpcLogin";
import DeanLogin from "./Components/LoginForms/DeanLogin";
import StudentLogin from "./Components/LoginForms/StudentLogin";
import Footer from "./Components/Foot/Footer";
import Layout from "./Components/Student Dashboard/Components/Layout";
import DashboardHome from "./Components/Student Dashboard/Components/DashboardHome";
import NewPasswordForm from "./Components/LoginForms/NewPassword";
import StudentPrivateRoute from '../src/Components/Student Dashboard/StudentPrivateRouter'

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home></Home>}></Route>
					<Route
						path="/create_coordinator"
						element={<Coordinator></Coordinator>}
					></Route>
					<Route
						path="/view_coordinator"
						element={<ViewCoordinator></ViewCoordinator>}
					/>
					<Route
						path="/update_coordinator"
						element={<UpdateCoordinator></UpdateCoordinator>}
					/>
					<Route
						path="/create_subadmin"
						element={<SubAdmin></SubAdmin>}
					></Route>
					<Route
						path="/view_subadmin"
						element={<ViewSubAdmin></ViewSubAdmin>}
					/>
					<Route
						path="/update_subadmin"
						element={<UpdateSubAdmin></UpdateSubAdmin>}
					/>
					<Route path="/sign_in" element={<SignIn></SignIn>} />
					<Route
						path="/campus_create"
						element={<CreateCampus></CreateCampus>}
					/>
					<Route path="/add_students" element={<AddStudent></AddStudent>} />
					<Route path="/view_students" element={<ViewStudent></ViewStudent>} />
					<Route
						path="/update_student"
						element={<UpdateStudent></UpdateStudent>}
					/>
					<Route
						path="/update_campus"
						element={<UpdateCampus></UpdateCampus>}
					/>
					<Route
						path="/round_attendance/:roundID"
						element={<AttendanceTable></AttendanceTable>}
					/>
					<Route path="/round" element={<RoundTable></RoundTable>} />
					<Route path="/update_round" element={<UpdateRound></UpdateRound>} />
					<Route path="/loader" element={<Loader></Loader>} />
					<Route
						path="/subadmin_login"
						element={<SubAdminSignIn></SubAdminSignIn>}
					></Route>
					<Route path="/skill" element={<AddSkill></AddSkill>}></Route>
					<Route path="/add_round/:campusID" element={<AddRound />}></Route>
					<Route
						path="/add_study_material"
						element={<CampusMaterial></CampusMaterial>}
					></Route>
					<Route
						path="/add_coding_question"
						element={<AddCodingQuestion></AddCodingQuestion>}
					></Route>
					<Route
						path="/view_coding_question"
						element={<ViewCodingQuestions></ViewCodingQuestions>}
					></Route>
					<Route
						path="/update_coding_question"
						element={<UpdateCodingQuestion></UpdateCodingQuestion>}
					></Route>
					<Route
						path="/add_apti_lr_question"
						element={<CreateAptiLRQuestion></CreateAptiLRQuestion>}
					></Route>
					<Route
						path="/view_apti_lr_question"
						element={<ViewAptiLRQuestions></ViewAptiLRQuestions>}
					></Route>

					<Route
						path="/update_apti_lr_question"
						element={<UpdateAptiLRQuestion></UpdateAptiLRQuestion>}
					></Route>

					<Route
						path="/add_interview_question"
						element={<AddInterviewQuestion></AddInterviewQuestion>}
					></Route>

					<Route
						path="/veiw_interview_question"
						element={<ViewInterviewQuestions></ViewInterviewQuestions>}
					></Route>

					<Route
						path="/update_interview_question"
						element={<UpdateInterviewQuestion></UpdateInterviewQuestion>}
					></Route>

					<Route
						path="/view_pyq_stats"
						element={<SeenComponent></SeenComponent>}
					></Route>

					<Route
						path="/create_notification"
						element={<CreateNotification></CreateNotification>}
					></Route>

					<Route
						path="/read_notification"
						element={<ViewNotification></ViewNotification>}
					></Route>

					<Route
						path="/update_notification"
						element={<UpdateNotification></UpdateNotification>}
					>
						{" "}
					</Route>
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
						path="/tpo"
						element={
							<>
								<Nav />
								<TpoLogin />
								<Footer />
							</>
						}
					/>
					<Route
						path="/tpc"
						element={
							<>
								<Nav />
								<TpcLogin />
								<Footer />
							</>
						}
					/>
					<Route
						path="/dean"
						element={
							<>
								<Nav />
								<DeanLogin />
								<Footer />
							</>
						}
					/>
					<Route path="/student-dashboard" element={<StudentPrivateRoute component={Layout} />}>
						<Route index element={<Navigate to="home" replace />} />
						<Route path="home" element={<DashboardHome />} />
						
					</Route>
				</Routes>
			</Router>
		</>
	);
}

export default App;
