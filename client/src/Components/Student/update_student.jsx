import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './student.css';
import { BACKEND_URL } from '../../constant';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../../loader/loader'; 


function UpdateStudent() {
    const token = localStorage.getItem("token")
    const { state: { student } } = useLocation();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading
    const navigate = useNavigate();

    useEffect(() => {
        if (student) {
            setValue('name', student["Name of Student"]);
            setValue('collegeID', student["College ID"]);
            setValue('branch', student.Branch);
            setValue('section', student.Section);
            setValue('gender', student.Gender);
            setValue('dob', student.DoB);
            setValue('sscYOP', student["SSC YOP"]);
            setValue('sscPercentage', student["SSC %age"]);
            setValue('hscYOP', student["HSC YoP"]);
            setValue('hscPercentage', student["HSSC %age"]);
            setValue('sgpa1', student.SGPA1);
            setValue('sgpa2', student.SGPA2);
            setValue('sgpa3', student.SGPA3);
            setValue('sgpa4', student.SGPA4);
            setValue('sgpa5', student.SGPA5);
            setValue('sgpa6', student.SGPA6);
            setValue('sgpa7', student.SGPA7);
            setValue('avgSGPA', student["Avg. SGPA"]);
            setValue('mobile1', student["Mobile 1"]);
            setValue('mobile2', student["Mobile 2"]);
            setValue('mobile3', student["Mobile 3"]);
            setValue('personalEmail', student["Personal Email Address"]);
            setValue('collegeMailID', student["College MailID"]);
        }
    }, [student, setValue]);
    

    const onSubmit = async (data) => {
        setLoading(true); // Start loading
        try {
            const res = await axios.put(`${BACKEND_URL}/student/update`, {
                id: student.id,
                collegeID: data.collegeID,
                name: data.name,
                branch: data.branch,
                section: data.section,
                gender: data.gender,
                dob: data.dob,
                sscYOP: data.sscYOP,
                sscPercentage: data.sscPercentage,
                hscYOP: data.hscYOP,
                hscPercentage: data.hscPercentage,
                sgpa1: data.sgpa1,
                sgpa2: data.sgpa2,
                sgpa3: data.sgpa3,
                sgpa4: data.sgpa4,
                sgpa5: data.sgpa5,
                sgpa6: data.sgpa6,
                sgpa7: data.sgpa7,
                avgSGPA: data.avgSGPA,
                mobile1: data.mobile1,
                mobile2: data.mobile2,
                mobile3: data.mobile3,
                personalEmail: data.personalEmail,
                collegeMailID: data.collegeMailID,
            },{
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 409) {
                setErrorMessage("Student already exists");
                setSuccessMessage('');
            } else if (res.status === 200) {
                setSuccessMessage("Student updated successfully");
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || "An error occurred");
            setSuccessMessage('');
        } finally {
            setLoading(false); // Stop loading
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
               
                <div className="center vs1 upb">
                    <form className="form ups" onSubmit={handleSubmit(onSubmit)}>
                        <p className="title upj">Update Student</p>
                        <p className="message upj">Update the student's details</p>
                        <div className="flex">
                            <div className="half-column">
                                <label className="upv">
                                    <input className="input" type="text" placeholder="" {...register('name', { required: true })} required />
                                    <span>Name</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="text" placeholder="" {...register('collegeID', { required: true })} required />
                                    <span>College ID</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="text" placeholder="" {...register('branch', { required: true })} required />
                                    <span>Branch</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="text" placeholder="" {...register('section', { required: true })} required />
                                    <span>Section</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="text" placeholder="" {...register('gender', { required: true })} required />
                                    <span>Gender</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="date" placeholder="" {...register('dob', { required: true })} required />
                                    <span>Date of Birth</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number" placeholder="" {...register('sscYOP', { required: true })} required />
                                    <span>SSC Year of Passing</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"  step=".0001"   placeholder="" {...register('sscPercentage', { required: true })} required />
                                    <span>SSC Percentage</span>
                                </label>
                            </div>
                            <div className="half-column">
                                <label className="upv">
                                    <input className="input" type="number" placeholder="" {...register('hscYOP', { required: true })} required />
                                    <span>HSC Year of Passing</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"  step=".0001"    placeholder="" {...register('hscPercentage', { required: true })} required />
                                    <span>HSC Percentage</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"   step=".0001"    placeholder="" {...register('sgpa1', { required: true })} required />
                                    <span>SGPA1</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"  step=".0001"    placeholder="" {...register('sgpa2', { required: true })} required />
                                    <span>SGPA2</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"   step=".0001"    placeholder="" {...register('sgpa3', { required: true })} required />
                                    <span>SGPA3</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"   step=".0001"    placeholder="" {...register('sgpa4', { required: true })} required />
                                    <span>SGPA4</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"   step=".0001"    placeholder="" {...register('sgpa5', { required: true })} required />
                                    <span>SGPA5</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"   step=".0001"    placeholder="" {...register('sgpa6', { required: true })} required />
                                    <span>SGPA6</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"   step=".0001"    placeholder="" {...register('sgpa7', { required: true })} required />
                                    <span>SGPA7</span>
                                </label>
                                <label className="upv">
                                    <input className="input" type="number"   step=".0001"    placeholder="" {...register('avgSGPA', { required: true })} required />
                                    <span>Average SGPA</span>
                                </label>
                            </div>
                        </div>
                        <div className="full-column">
                            <label className="upv">
                                <input className="input" type="text" placeholder="" {...register('mobile1', { required: true })} required />
                                <span>Mobile 1</span>
                            </label>
                            <label className="upv">
                                <input className="input" type="text" placeholder="" {...register('mobile2')} />
                                <span>Mobile 2</span>
                            </label>
                            <label className="upv">
                                <input className="input" type="text" placeholder="" {...register('mobile3')} />
                                <span>Mobile 3</span>
                            </label>
                            <label className="upv">
                                <input className="input" type="email" placeholder="" {...register('personalEmail', { required: true })} required />
                                <span>Personal Email</span>
                            </label>
                            <label className="upv">
                                <input className="input" type="email" placeholder="" {...register('collegeMailID', { required: true })} required />
                                <span>College Email</span>
                            </label>
                        </div>
                        <button className="submit upv">Submit</button>
                    </form>
                    {loading && <Loader />} {/* Show loader when loading */}
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

export default UpdateStudent;
