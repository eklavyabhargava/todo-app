import { useState } from "react";
import './login.css';
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    
    // get user data from localstorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    // if userData, redirect to homepage
    if (userData) {
        window.location = '/';
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const successId = "SuccessId123";
    const errorId = "ErrorId123";

    // user login
    const UserLogin = async(e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:4000/auth/login', {
                username,
                password
            });
            if (response.status === 200) {
                localStorage.setItem('userData', JSON.stringify({ token: response.data.Token, userId: response.data.userId}));
                toast.success("Login Successful!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: successId
                });
                navigate('/');
            } else {
                toast.error(response.data.Error || "Some Error Occurred!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: errorId
                });
            }
        } catch (error) {
            console.log(error.response.data.Error);
            toast.error(error.response.data.Error || "Internal Server Error", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                toastId: errorId
            });
        }
        setLoading(false);
    }

    return (
        <div className="body">
            <ToastContainer />
            <div className="card" style={{ width: "40%" }}>
                <div className="card-body">
                    <h5 className="card-title fs-4 fw-bold text-center">LOGIN</h5>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Username:</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" />
                        </div>
                        <div className="d-grid mb-2">
                            <button type="submit" className="btn btn-primary" onClick={(e) => UserLogin(e)} disabled={loading}>{loading ? "Loading..." : "Login"}</button>
                        </div>
                        <p className="text-center">Not Registered? <Link to="/register">Register Here</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Login;