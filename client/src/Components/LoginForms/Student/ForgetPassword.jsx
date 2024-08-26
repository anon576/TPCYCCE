import { React, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BACKEND_URL} from '../../../constant'
const Forgetpassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const [stage, setStage] = useState(1);
    const [otp, setOtp] = useState(""); // State to store OTP
    const [email, setEmail] = useState(""); // State to store email
    const [storedOtpHash, setStoredOtpHash] = useState(""); // State to store hashed OTP

    const onSubmit = async (data) => {
        if (stage === 1) {
            await sendOTP(data);
        } else if (stage === 2) {
            await verifyOtp(data);
        } else if (stage === 3) {
            await submitNewPassword(data);
        }
    };

    const sendOTP = async (data) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/forget_password`, { email: data.email });

            if (response.status === 200) {
                setOtp(response.data.otp); // Set OTP from response for demo purposes (usually not needed)
                setStoredOtpHash(response.data.otp); // Store the hash of the OTP for verification
                setEmail(data.email); // Store email for later use
                setStage(2); // Move to the OTP verification stage
                toast.success("OTP has been sent to your email.");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while sending OTP.");
        }
    };

    const verifyOtp = async (data) => {
        const enteredOtp = data.otp;

        if (enteredOtp === otp) {
            setStage(3); // Move to the password reset stage
            toast.success("OTP verified successfully.");
        } else {
            toast.error("Invalid OTP. Please try again.");
        }
    };

    const submitNewPassword = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/auth/update_password`, {
                email: email,
                password: data.password,
                mtoken: data.mtoken || null, // Optionally send FCM token
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                localStorage.clear();
                localStorage.setItem("token", response.data.token);
                navigate('/student-dashboard');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the password.");
        }
    };

    return (
        <div className='register'>
            <form className='login-form otp-main-form' onSubmit={handleSubmit(onSubmit)}>
                <h1>Forget Password</h1>
                <div className="login-inputs">
                    {stage === 1 && (
                        <div>
                            <input
                                type="email"
                                name='email'
                                placeholder='Enter Registered Email'
                                {...register("email", {
                                    required: "Please Enter Registered Email"
                                })}
                            />
                            <p>{errors?.email?.message}</p>
                        </div>
                    )}
                    {stage === 2 && (
                        <div>
                            <input
                                type="text"
                                name='otp'
                                placeholder='Enter OTP'
                                {...register("otp", {
                                    required: "Please Enter OTP"
                                })}
                            />
                            <p>{errors?.otp?.message}</p>
                        </div>
                    )}
                    {stage === 3 && (
                        <>
                            <div>
                                <input
                                    type="password"
                                    name='password'
                                    placeholder='Enter New Password'
                                    {...register("password", {
                                        required: "Please Enter New Password",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters long"
                                        }
                                    })}
                                />
                                <p>{errors?.password?.message}</p>
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name='confirmPassword'
                                    placeholder='Confirm New Password'
                                    {...register("confirmPassword", {
                                        required: "Please Confirm Your Password",
                                        validate: value => value === watch('password') || "Passwords do not match"
                                    })}
                                />
                                <p>{errors?.confirmPassword?.message}</p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name='mtoken'
                                    placeholder='Enter FCM Token (Optional)'
                                    {...register("mtoken")}
                                />
                            </div>
                        </>
                    )}
                    <input type="submit" className='login-button' value={stage === 1 ? "Send OTP" : stage === 2 ? "Verify OTP" : "Reset Password"} />
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Forgetpassword;
