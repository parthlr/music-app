import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Axios from "axios";
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

export default function LoginPage() {

    const [username_r, setUsername] = useState("");
    const [password_r, setPassword] = useState("");

    Axios.defaults.withCredentials = true;

    const navigate = useNavigate();

    const login = () => {
        //event.preventDefault();
        //alert("Email: " + email + " Password: " + password);
        Axios.post("http://localhost:5000/login", {
            email: username_r,
            password: password_r,
        }).then((response) => {
            if (response.data.message) {
                localStorage.setItem("isLoggedIn", false);
            }
            if (response.data.user) {
                localStorage.setItem("user", response.data.user);
                localStorage.setItem("isLoggedIn", true);
                navigate('/');
                window.location.reload(false);
            }
        });
    }

    return (
        <Modal open={true}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                size="lg"
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Login
                </Typography>
                <Stack spacing={2}>
                    <Input autoFocus required placeholder="Username"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <Input autoFocus required placeholder="Password" type="password" autoComplete="current-password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button onClick={login}>Login</Button>
                </Stack>
            </ModalDialog>
        </Modal>
    );
}
