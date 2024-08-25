import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';
import logo from "../../assets/y.png"

const Nav = () => {
    const [isMobile, setIsMobile] = useState(false);

    return (
        <>
            <nav className="nav1bar">
                <div className="logo"><img className='img' src={logo} alt=''/>Yeshwant</div>
                {/* <span className="menu-toggle" onClick={() => setIsMobile(!isMobile)}>
                    &#9776;
                </span> */}
                <ul className={`nav1-links ${isMobile ? 'active' : ''}`}>
                    <li className="nav1-item">
                        <NavLink to="/student_login" className="nav1-link" end>Student</NavLink>
                    </li>
                    <li className="nav1-item">
                        <NavLink to="/tpo" className="nav1-link">TPO</NavLink>
                    </li>
                    <li className="nav1-item">
                        <NavLink to="/tpc" className="nav1-link">TPC</NavLink>
                    </li>
                    <li className="nav1-item">
                        <NavLink to="/dean" className="nav1-link">Dean</NavLink>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Nav;
