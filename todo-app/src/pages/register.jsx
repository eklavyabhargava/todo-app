import { useState } from "react";
import './login.css';
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'

const Register = () => {

    // get user data from localstorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    // if userData, redirect to homepage
    if (userData) {
        window.location = '/';
    }

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);

    const successId = "SuccessId123";
    const errorId = "ErrorId123";

    const navigate = useNavigate();

    // validate email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setValidEmail(emailRegex.test(email));
    }

    // validate password
    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        setValidPassword(passwordRegex.test(password));
    }

    // register user
    const UserRegistration = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (!validEmail || !validPassword) {
            toast.error("Provide Valid Input", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                toastId: errorId
            });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/auth/register', {
                email,
                username,
                password
            });
            if (response.status === 201) {
                toast.success(response.data.success || "User Registered Successfully", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: successId
                });
                navigate('/login');
            } else {
                console.log(response.data.Error);
                toast.error(response.data.Error || "Some Error Occurred", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: errorId
                });
            }
        } catch (error) {
            console.log(error.response.Error);
            toast.error(error.response.data.Error || "Internal Server Error", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                toastId: errorId
            });
        }
        setLoading(false);
    }

    return (
        <>
            <ToastContainer />
            <div className="body">
                <div className="card" style={{ width: "40%" }}>
                    <div className="card-body">
                        <h5 className="card-title fs-4 fw-bold text-center">REGISTER</h5>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Email:</label>
                                <input value={email} onChange={(e) => { validateEmail(e.target.value); setEmail(e.target.value) }} type="email" className={`form-control ${validEmail ? "" : "invalid"}`} />
                                {!validEmail &&
                                    <div className="form-text">
                                        Please provide a valid email
                                    </div>
                                }
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Username:</label>
                                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password:</label>
                                <input type="password" value={password} onChange={(e) => { validatePassword(e.target.value); setPassword(e.target.value) }} className={`form-control ${validPassword ? "" : "invalid"}`} />
                                {!validPassword &&
                                    <div className="form-text">
                                        Password must contains at least one upper and lower case letter, a symbol, a number and must be atleast 6 chars long.
                                    </div>
                                }
                            </div>
                            <div className="d-grid mb-2">
                                <button onClick={(e) => UserRegistration(e)} type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
                            </div>
                            <p className="text-center">Already Registered? <Link to="/login">Login Here</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Register;