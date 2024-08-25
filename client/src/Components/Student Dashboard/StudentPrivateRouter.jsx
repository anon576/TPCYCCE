import React from 'react';
import { Navigate } from 'react-router-dom';

const StudentPrivateRoute = ({
    studentNavbar: StudentNavbar,
    component: Component,
}) => {
    const isStudentSignedIn = !!localStorage.getItem('token');

    if (isStudentSignedIn) {
        return (
            <div>
                {StudentNavbar && <StudentNavbar />}
                <Component />
            </div>
        );
    }

    // Redirect to student login page if not signed in
    return <Navigate to="/studentlogin" />;
};

export default StudentPrivateRoute;
