import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../../loader/loader';

function UpdateStudent() {
    const token = localStorage.getItem("token");
    const { state: { student } } = useLocation();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
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
            // New fields
            setValue('skills', student.Skills || '');
            setValue('certifications', student.Certifications || '');
            setValue('placementCompany', student.PlacementCompany || '');
            setValue('placementSalary', student.PlacementSalary || '');
            setValue('placementPosition', student.PlacementPosition || '');
        }
    }, [student, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
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
                // New fields
                skills: data.skills,
                certifications: data.certifications,
                placementCompany: data.placementCompany,
                placementSalary: data.placementSalary,
                placementPosition: data.placementPosition,
            }, {
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
            setLoading(false);
        }
    };

    const handleCloseError = () => setErrorMessage('');
    const handleCloseSuccess = () => setSuccessMessage('');

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-semibold text-center mb-6">Update Student</h1>
                        
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium">Personal Information</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <input className="input-field" type="text" placeholder="Name" {...register('name', { required: true })} />
                                <input className="input-field" type="text" placeholder="College ID" {...register('collegeID', { required: true })} />
                                <input className="input-field" type="text" placeholder="Branch" {...register('branch', { required: true })} />
                                <input className="input-field" type="text" placeholder="Section" {...register('section', { required: true })} />
                                <input className="input-field" type="text" placeholder="Gender" {...register('gender', { required: true })} />
                                <input className="input-field" type="date" placeholder="Date of Birth" {...register('dob', { required: true })} />
                            </div>
                        </div>

                        {/* Academic Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium">Academic Information</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <input className="input-field" type="number" placeholder="SSC Year of Passing" {...register('sscYOP', { required: true })} />
                                <input className="input-field" type="number" step=".0001" placeholder="SSC Percentage" {...register('sscPercentage', { required: true })} />
                                <input className="input-field" type="number" placeholder="HSC Year of Passing" {...register('hscYOP', { required: true })} />
                                <input className="input-field" type="number" step=".0001" placeholder="HSC Percentage" {...register('hscPercentage', { required: true })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                    <input key={num} className="input-field" type="number" step=".0001" placeholder={`SGPA ${num}`} {...register(`sgpa${num}`, { required: true })} />
                                ))}
                                <input className="input-field" type="number" step=".0001" placeholder="Average SGPA" {...register('avgSGPA', { required: true })} />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium">Contact Information</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <input className="input-field" type="text" placeholder="Mobile 1" {...register('mobile1', { required: true })} />
                                <input className="input-field" type="text" placeholder="Mobile 2" {...register('mobile2')} />
                                <input className="input-field" type="text" placeholder="Mobile 3" {...register('mobile3')} />
                                <input className="input-field" type="email" placeholder="Personal Email" {...register('personalEmail', { required: true })} />
                                <input className="input-field" type="email" placeholder="College Email" {...register('collegeMailID', { required: true })} />
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium">Skills</h2>
                            <textarea className="input-field w-full h-24" placeholder="Enter skills (comma-separated)" {...register('skills')}></textarea>
                        </div>

                        {/* Certifications */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium">Certifications</h2>
                            <textarea className="input-field w-full h-24" placeholder="Enter certifications (one per line)" {...register('certifications')}></textarea>
                        </div>

                        {/* Placement Details */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-medium">Placement Details</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <input className="input-field" type="text" placeholder="Company" {...register('placementCompany')} />
                                <input className="input-field" type="number" placeholder="Salary (per annum)" {...register('placementSalary')} />
                                <input className="input-field" type="text" placeholder="Position" {...register('placementPosition')} />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                            Update Student
                        </button>
                    </form>

                    {loading && <Loader />}
                    
                    {errorMessage && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                            <p>{errorMessage}</p>
                            <button onClick={handleCloseError} className="mt-2 text-sm text-red-500 hover:text-red-700">Close</button>
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                            <p>{successMessage}</p>
                            <button onClick={handleCloseSuccess} className="mt-2 text-sm text-green-500 hover:text-green-700">Close</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UpdateStudent;