import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { BACKEND_URL } from "../../constant";
import Loader from '../../loader/loader';

function UpdateCampus() {
    const token = localStorage.getItem("token")
    const location = useLocation();
    const campusID = location.state?.campusID;
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        campusName: '',
        Message: '',
        pack: '',
        Location: '',
        file: null,
        rounds: []
    });
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchCampusDetails = async () => {
            try {
                const response = await axios.get(BACKEND_URL + `/campus/${campusID}`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    const campus = response.data.campus;
                    setFormData({
                        campusName: campus.CampusName,
                        Message: campus.Message,
                        pack: campus.package,
                        Location: campus.Location,
                    });
                    setLoading(false); // Set loading to false after fetching campus details
                } else {
                    setErrorMessage("Failed to fetch campus details");
                    setLoading(false); // Set loading to false in case of error
                }
            } catch (error) {
                setErrorMessage("An error occurred while fetching campus details");
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchCampusDetails();
    }, [campusID, token]);

    const handleInputChange = (event) => {
        const { name, value, type, files } = event.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when form is submitted
        try {
            const response = await axios.put(BACKEND_URL + `/campus/update/${campusID}`, {
                'campusName': formData.campusName,
                "Message": formData.Message,
                "pack": formData.pack,
                "Location": formData.Location
            },{
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                setErrorMessage('');
            } else if (response.status === 409) {
                setErrorMessage(response.data.message);
                setSuccessMessage('');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Something went wrong");
                setSuccessMessage('');
            } else if (error.request) {
                setErrorMessage("No response from server. Please try again later.");
                setSuccessMessage('');
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
                setSuccessMessage('');
            }
        } finally {
            setLoading(false); // Set loading to false after form submission completes
        }
    };

    const handleCloseError = () => {
        setErrorMessage('');
    };

    const handleCloseSuccess = () => {
        setSuccessMessage('');
    };

        return (
            <>
                <div className="center vs1">
                    {loading ? ( // Display loader while loading
                        <Loader />
                    ) : (
                        <form className="form" onSubmit={handleSubmit}>
                        <p className="title">Update Campus</p>
                        <p className="message">Update campus details in the form.</p>
    
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="campusName"
                                value={formData.campusName}
                                required
                                onChange={handleInputChange}
                            />
                            <span>Campus Name</span>
                        </label>
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="Message"
                                value={formData.Message}
                                required
                                onChange={handleInputChange}
                            />
                            <span>Message</span>
                        </label>
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="pack"
                                value={formData.pack}
                                required
                                onChange={handleInputChange}
                            />
                            <span>Package</span>
                        </label>
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="Location"
                                value={formData.Location}
                                required
                                onChange={handleInputChange}
                            />
                            <span>Location</span>
                        </label>
                      
                        <button className="submit">Submit</button>
                    </form>
                      )}
                    {errorMessage && (
                        <div className="popup error-popup">
                            <span className="close-btn" onClick={handleCloseError}>&times;</span>
                            <div className="popup-message">{errorMessage}</div>
                        </div>
                    )}
                    {successMessage && (
                        <div className="popup success-popup">
                            <span className="close-btn" onClick={handleCloseSuccess}>&times;</span>
                            <div className="popup-message">{successMessage}</div>
                        </div>
                    )}
                </div>
              
            </>
        );
  
}

export default UpdateCampus;
