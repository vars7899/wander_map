import React, { useRef, useState } from "react";
import Close from "@material-ui/icons/Close";
import axios from "axios";
import "./Register.css";
const Register = ({ setShowRegister }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            await axios.post("/users/register", newUser);
            setError(false);
            setSuccess(true);
        } catch (err) {
            console.log(err);
            setError(true);
        }
    };
    return (
        <div className="register-form-container">
            <div className="register-form-content">
                <div className="register-intro-content">
                    <div className="text3 heading">Wander map</div>
                    <div className="text4 fade">Become a member</div>
                </div>
                <form className="register-form" onSubmit={handleSubmit}>
                    <input
                        ref={nameRef}
                        type="text"
                        className="register-input"
                        placeholder="Username"
                    />

                    <input
                        ref={emailRef}
                        type="email"
                        className="register-input"
                        placeholder="Email"
                    />

                    <input
                        ref={passwordRef}
                        type="password"
                        className="register-input"
                        placeholder="Password"
                    />

                    <button className="btn" type="submit">
                        Register
                    </button>
                    {success && (
                        <span className="success">
                            Successfull! You can register now
                        </span>
                    )}
                    {error && (
                        <span className="failure">Something! went wrong</span>
                    )}
                </form>
                <Close
                    className="registercancel"
                    onClick={() => {
                        setShowRegister(false);
                    }}
                />
            </div>
        </div>
    );
};

export default Register;
