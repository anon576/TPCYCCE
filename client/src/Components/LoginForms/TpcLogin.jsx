import React, { useState } from 'react';
import './LoginForm.css'; 
import { Link, useNavigate } from 'react-router-dom';

const TpcLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle TPC login
        console.log('TPC Username:', username);
        console.log('TPC Password:', password);

        // Navigate to the home route
        navigate('/');
    };

    return (
        <div className='box'>
            <div className='nest'>
                <div className='text'>
                    <h2>Yeshwantrao Chavan College of Engineering</h2>
                    <p>“Vision : To act as a seamless conduit between the Institute and Industry, identifying the requirements of the industry, mapping them with industry readiness and core competencies of students, identifying and filling the gaps through enhanced training so as to make them relevant with the global industrial needs</p><br></br>
                    <p>“Mission : To assist the holistic development of the students with balanced set of technical skills, interpersonal skills and with a positive attitude towards life and to be the interface between the Institute and Industry.</p>
                </div>
                
                <div className='form-box'>
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>TPC Login</h2>
                        <div className="form-group">
                            <label htmlFor="username">Enter Email:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder='Email'
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Enter Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder='Password'
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                        <div className='links'>
                            <Link className='link' to="/forgotpassword">Forgot Password ?</Link><br />
                            <Link className='link' to="/register">Register Now</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TpcLogin;
