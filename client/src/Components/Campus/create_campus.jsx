import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constant";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";
import Loader from '../../loader/loader'; // Import the Loader component
import SignIn from '../SignIn/signin.jsx';

function CreateCampus() {
    const token = localStorage.getItem("token")
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        campusName: '',
        Message: '',
        pack:'',
        Location:'',
        file: null,
        rounds: []
    });
    const [loading, setLoading] = useState(false); // Add loading state

    const handleInputChange = (event) => {
        const { name, value, type, files } = event.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleRoundsChange = (event) => {
        const noOfRound = parseInt(event.target.value, 10);
        const roundsArray = Array.from({ length: noOfRound }, () => ({ roundName: '', roundDate: '' }));
        setFormData({ ...formData, rounds: roundsArray });
    };

    const handleRoundInputChange = (index, event) => {
        const { name, value } = event.target;
        const rounds = [...formData.rounds];
        rounds[index][name] = value;
        setFormData({ ...formData, rounds });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when form is submitted
        const data = new FormData();
        data.append("campusName", formData.campusName);
        data.append("Message", formData.Message);
        data.append("pack",formData.pack);
        data.append("Location",formData.Location);
        data.append("file", formData.file);
        formData.rounds.forEach((round, index) => {
            data.append(`rounds[${index}][roundName]`, round.roundName);
            data.append(`rounds[${index}][roundDate]`, round.roundDate);
        });

        try {
            const response = await axios.post(BACKEND_URL + "/campus/create", data, {
                headers: {
                    'Authorization': token,
                    "Content-Type": "multipart/form-data",
                },
            });
        
            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                setErrorMessage('');
            } else if (response.status === 409) {
                setErrorMessage(response.data.message);
                setSuccessMessage("");
            } 
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Something went wrong");
                setSuccessMessage("");
            } else if (error.request) {
                setErrorMessage("No response from server. Please try again later.");
                setSuccessMessage("");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
                setSuccessMessage("");
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


    
    if(token){
        return (
            <>
            <Navbar></Navbar>
            <div className="center vs1">
                    {loading ? ( // Display loader while loading
                        <Loader />
                    ) : (
                        <form className="form" onSubmit={handleSubmit}>
                        <p className="title">Campus</p>
                        <p className="message">Fill campus details in form.</p>
    
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="campusName"
                                placeholder=""
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
                                placeholder=""
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
                                placeholder=""
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
                                placeholder=""
                                required
                                onChange={handleInputChange}
                            />
                            <span>Location</span>
                        </label>
                        <label>
                            <input
                                className="input"
                                type="file"
                                name="file"
                                placeholder=""
                                required
                                onChange={handleInputChange}
                            />
                            <span>XLS File</span>
                        </label>
                        <label>
                            <input
                                id="noOfRound"
                                className="input"
                                type="number"
                                placeholder=""
                                required
                                onChange={handleRoundsChange}
                            />
                            <span>No of Rounds</span>
                        </label>
                        {formData.rounds.map((round, index) => (
                            <div key={index} className="round-container">
                                <label>
                                    <input
                                        className="input"
                                        type="text"
                                        name="roundName"
                                        placeholder=""
                                        required
                                        onChange={(event) => handleRoundInputChange(index, event)}
                                    />
                                    <span>Round {index + 1}</span>
                                </label>
                                <label>
                                    <input
                                        className="input"
                                        type="date"
                                        name="roundDate"
                                        placeholder=""
                                        required
                                        onChange={(event) => handleRoundInputChange(index, event)}
                                    />
                                  
                                </label>
                            </div>
                        ))}
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
              
            <Footer></Footer>
            </>
        );
    }else{
           return <SignIn></SignIn>
       }

  
}

export default CreateCampus;
