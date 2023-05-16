import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import Axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function LoginPage() {

    const [email_r, setEmail] = useState("");
    const [password_r, setPassword] = useState("");

    Axios.defaults.withCredentials = true;

    const login = () => {
        //event.preventDefault();
        //alert("Email: " + email + " Password: " + password);
        Axios.post("http://localhost:5000/login", {
            email: email_r,
            password: password_r,
        }).then((response) => {
            if (response.data.message) {
                alert(response.data.message);
                localStorage.setItem("isLoggedIn", false);
            }
            if (response.data.user) {
                localStorage.setItem("user", response.data.user);
                localStorage.setItem("isLoggedIn", true);
            }
        });

    }

    return (
        <div className="login-page">
            <TextField id="email" label="Email"
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            />
            <TextField id="password" label="Password" type="password" autoComplete="current-password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <Button variant="contained" onClick={login}>Login</Button>
        </div>
    );
}
