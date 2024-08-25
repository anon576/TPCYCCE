import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BACKEND_URL } from '../../constant';
import './signin.css';
import axios from 'axios';
import Loader from '../../loader/loader';
import { useNavigate,Link } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);



  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Adding a 5-second delay before making the API call
    

      const res = await axios.post(BACKEND_URL + "/auth", {
        username: data.username,
        password: data.password
      });
      if (res.status === 201) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          // window.location.reload()
          navigate("/")
        }
      } else if (res.status === 401) {
        setErrorMessage('Unauthorized: Incorrect username or password.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Unauthorized: Incorrect username or password.');
      } else {
        console.error('Error:', error); // Handle other errors
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <p className="title">Sign IN</p>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register('username', { required: true })}
          />
          {errors.username && <span>Username is required</span>}
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password', { required: true })}
          />
          {errors.password && <span>Password is required</span>}
        </div>
        <button className="sign" type="submit">Sign in</button>
      </form>
      <div ><Link className='tv' to={"/subadmin_login"}>Sub Admin  <div className='tk'> click here</div></Link></div>
      {loading && <Loader />}
      {errorMessage && <div className="error-box">{errorMessage}</div>}
    </div>
  );
}

export default SignIn;
