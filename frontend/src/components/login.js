import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {useNavigate } from 'react-router-dom';

import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const navigate = useNavigate();
  const handleLogin = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3002/login', {
      email: email,
      pwd: pwd,
    }).then((response)=>{
      if (response.data.message) {
       // setLoginStatus(response.data.message);
       alert("Incorrect Username or Password");
      } else {
        navigate('/chat');
      }
    })
  }

  return (
    <div>
      
      <div className="vh-100 d-flex justify-content-center align-items-center ">
        <div className="col-md-5 p-5 shadow-sm border rounded-5 border-primary bg-white">
          <h2 className="text-center mb-4 text-primary">Login to MediMind</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control border border-primary" value={email}
                onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control border border-primary" value={pwd}
                onChange={(event) => setPwd(event.target.value)} />
            </div>
            <div className="d-grid">
              <button className="btn btn-primary" type="submit">Login</button>
              <h1>{loginStatus}</h1>
            </div>
          </form>
          <div className="mt-3">
            <p className="mb-0  text-center">Don't have an account? </p>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
