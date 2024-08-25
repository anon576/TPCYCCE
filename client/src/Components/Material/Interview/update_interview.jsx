import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '../../Navbar/navbar';
import Footer from '../../Footer/footer';
import Loader from '../../../loader/loader';
import SignIn from '../../SignIn/signin';
import { BACKEND_URL } from '../../../constant';

function UpdateInterviewQuestion() {
    const { state } = useLocation();
    const question = state?.question;
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (question) {
            setValue('question', question.Question);
            setValue('answer', question.Answer);
        } else {
            setErrorMessage('No question data provided.');
        }
    }, [question, setValue]);

    const onSubmit = async (data) => {
        if (!question) {
            setErrorMessage('No question data provided.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.put(`${BACKEND_URL}/pyq/update_interview_question/${question.CodeID}`, data, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                setSuccessMessage('Interview question updated successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to update interview question');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || 'An error occurred');
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setErrorMessage('');
    };

    const handleCloseSuccess = () => {
        setSuccessMessage('');
    };

    if (!token) {
        return <SignIn />;
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Navbar />
            <div className="center vs1">
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <p className="title">Update Interview Question</p>
                    <div className="flex">
                        <label>
                            <input className="input" type="text" placeholder="" {...register('question', { required: true })} />
                            <span>Question</span>
                        </label>
                    </div>
                    <label>
                        <textarea className="input" placeholder="" {...register('answer', { required: true })} />
                        <span>Answer</span>
                    </label>
                    <button className="submit">Submit</button>
                </form>
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
            <Footer />
        </>
    );
}

export default UpdateInterviewQuestion;
