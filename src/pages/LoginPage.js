import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Axios from "axios";
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

export default function LoginPage() {

    const [username_r, setUsername] = useState("");
    const [password_r, setPassword] = useState("");

    const [error_message, setErrorMessage] = useState("");

    Axios.defaults.withCredentials = true;

    const navigate = useNavigate();

    const login = (event) => {
        event.preventDefault();
        //alert("Email: " + email + " Password: " + password);
        Axios.post("http://localhost:5000/app/login", {
            username: username_r,
            password: password_r,
        }).then((response) => {
            if (response.data.message) {
                localStorage.setItem("isLoggedIn", false);
                setErrorMessage(response.data.message);
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
                <Typography color="danger" >
                    {error_message}
                </Typography>
                <form onSubmit={login}>
                    <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', flexWrap: 'wrap', }}>
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
                        <Button type="submit" sx={{ width: "100%" }}>Login</Button>
                    </Box>
                </form>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href="/login" underline="none">
                        Register
                    </Link>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
