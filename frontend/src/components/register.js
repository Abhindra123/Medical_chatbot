import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInsertSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/check-email', {
        email: email,
      });

      if (response.data.emailExists) {
        alert('Email already exists!');
      } else {
        const insertResponse = await axios.post('http://localhost:3002/insert', {
          name: name,
          email: email,
          pwd: pwd,
        });
        setMessage(insertResponse.data.message);
        setCode(insertResponse.data.code);
        setShowCodeInput(true);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error sending verification email');
    }
  };

  const handleVerifySubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/verify', {
        name: name,
        email: email,
        pwd: pwd,
        code: code,
      });
      setMessage(response.data.message);
      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage('Error verifying code');
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="col-md-5 p-5 shadow-sm border rounded-5">
        <h1 className="text-center mb-4 text-primary">Register with MediMind</h1>
        <form onSubmit={showCodeInput ? handleVerifySubmit : handleInsertSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <br />
            <div className="ow"></div>
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <br />
          <div className="ow"></div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={pwd}
              onChange={(event) => setPwd(event.target.value)}
              required
            />
          </div>
          <br />
          <div className="ow"></div>
          {showCodeInput && (
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Verification Code" onChange={(event) => setCode(event.target.value)} required />
            </div>
          )}
          <div className="ow"></div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary w-100">
{showCodeInput ? 'Verify' : 'Register'}
</button>
</div>
{message && <p className="text-center">{message}</p>}
</form>
<br/>
<Link to="/">
<button  className="btn btn-primary w-100">LOGIN</button>
</Link>
</div>
</div>
);
}

export default Register;