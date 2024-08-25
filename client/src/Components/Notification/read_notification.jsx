import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { BACKEND_URL } from '../../constant';

import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../Navbar/navbar';
import Footer from '../Footer/footer';
import Loader from '../../loader/loader'; 
import SignIn from '../SignIn/signin';

function ViewNotification() {
    const token = localStorage.getItem("token");
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(BACKEND_URL + '/notification/get_notification', {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
                if (Array.isArray(response.data.notifications)) {
                    setNotifications(response.data.notifications.reverse()); // Reverse the order of notifications
                } else {
                    setError('Data format error: Expected an array');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const navigateToUpdateNotification = (notification) => {
        navigate('/update_notification', { state: { notification } });
    };

    if (loading) {
        return <Loader />; // Display loader while fetching data
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (token) {
        return (
            <>
                <Navbar />
                <div className="tl" id="vc">
                    <table className="ctble">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Title</th>
                                <th>Short Line</th>
                                <th>Messages</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((notification, index) => (
                                <tr key={notification.nID}>
                                    <td>{index + 1}</td>
                                    <td>{notification.Title}</td>
                                    <td>{notification.ShortLine}</td>
                                    <td>
                                        <ul>
                                            {notification.messages.map((msg, msgIndex) => (
                                                <li key={msgIndex}>{msg.message || "No message available"}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <button onClick={() => navigateToUpdateNotification(notification)}>Update</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Footer />
            </>
        );
    } else {
        return <SignIn />;
    }
}

export default ViewNotification;
