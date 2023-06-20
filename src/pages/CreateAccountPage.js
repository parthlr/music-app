import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Axios from "axios";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

export default function CreateAccountPage() {

    const [username_r, setUsername] = useState("");
    const [email_r, setEmail] = useState("");
    const [name_r, setName] = useState("");
    const [password_r, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error_message, setErrorMessage] = useState("");

    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const createAccount = (event) => {
        event.preventDefault();
        //alert("Name: " + name + " Email: " + email + " Password: " + password);

        if (password_r != confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        let accountExists = false;

        Axios.post("http://localhost:5000/check_account_exists", {
            username: username_r,
            email: email_r,
        }).then((response) => {
            console.log(response);
            if(response.data.exists) {
                if (response.data.exists == 1) {
                    setErrorMessage("Account already exists");
                    accountExists = true;
                    console.log("EXISTS: " + accountExists);
                }
            }
            if (response.data.error) {
                setErrorMessage(response.data.error);
                localStorage.setItem("isLoggedIn", false);
            }
        });

        console.log("EXISTS: " + accountExists);
        if (accountExists) {
            return;
        }

        Axios.post("http://localhost:5000/create_account", {
            email: email_r,
            name: name_r,
            password: password_r,
        }).then((response) => {
            console.log(response);
            if(response.data.message) {
                localStorage.setItem("user", response.data.user);
                localStorage.setItem("isLoggedIn", true);
                navigate('/profile');
                window.location.reload(false);
            }
            if (response.data.error) {
                setErrorMessage(response.data.error);
                localStorage.setItem("isLoggedIn", false);
            }
        });
    };

    return (
        <Modal open={true}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                size="lg"
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Create Account
                </Typography>
                <Typography color="danger" >
                    {error_message}
                </Typography>
                <form onSubmit={createAccount}>
                    <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', flexWrap: 'wrap', }}>
                        <Input autoFocus required placeholder="Name" sx={{ width: "100%" }}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                        <Input autoFocus required placeholder="Username" sx={{ width: "100%" }}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                        <Input autoFocus required type="email" placeholder="Email" sx={{ width: "100%" }}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                        <Input autoFocus required placeholder="Password" type="password" autoComplete="current-password" sx={{ width: "100%" }}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <Input autoFocus required placeholder="Confirm Password" type="password" autoComplete="current-password" sx={{ width: "100%" }}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                        />
                        <Button type="submit" sx={{ width: "100%" }}>Create</Button>
                    </Box>
                </form>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href="/login" underline="none">
                        Already have an account?
                    </Link>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
