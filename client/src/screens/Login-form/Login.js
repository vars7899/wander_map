import React, { useState, useRef } from "react";
import axios from "axios";
import Close from "@material-ui/icons/Close";
import "./Login.css";
const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
    const [error, setError] = useState(false);

    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const res = await axios.post("/users/login", user);
            myStorage.setItem("user", res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false);
        } catch (err) {
            console.log(err);
            setError(true);
        }
    };
    return (
        <div className="login-form-container">
            <div className="login-form-content">
                <div className="login-intro-content">
                    <div className="text3 heading">Wander Map</div>
                    <div className="text4 fade">Hello there!</div>
                    <div className="text4 fade">Welcome Back</div>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        ref={nameRef}
                        className="login-input"
                        type="text"
                        placeholder="username"
                    />

                    <input
                        ref={passwordRef}
                        type="password"
                        className="login-input"
                        placeholder="Password"
                    />

                    <button className="btn" type="submit">
                        Login
                    </button>
                    {error && (
                        <span className="failure">Something! went wrong</span>
                    )}
                    <Close
                        className="logincancel"
                        onClick={() => {
                            setShowLogin(false);
                        }}
                    />
                </form>
            </div>
        </div>
    );
};

export default Login;
