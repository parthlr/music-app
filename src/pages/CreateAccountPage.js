import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import Axios from "axios";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function CreateAccountPage() {

    const [email_r, setEmail] = useState("");
    const [name_r, setName] = useState("");
    const [password_r, setPassword] = useState("");

    Axios.defaults.withCredentials = true;

    const createAccount = () => {
        //event.preventDefault();
        //alert("Name: " + name + " Email: " + email + " Password: " + password);

        Axios.post("http://localhost:5000/create_account", {
            email: email_r,
            name: name_r,
            password: password_r,
        }).then((response) => {
            console.log(response);
            if(response.data.message) {
                alert(response.data.message);
            }
        });
    };

    return (
        <div className="create-account-page">
            <TextField id="name" label="Name"
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
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
            <Button variant="contained" onClick={createAccount}>Create</Button>
        </div>
    );
}
