import * as React from 'react';
import {useEffect, useState} from 'react';
import Axios from "axios";
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import FormLabel from '@mui/joy/FormLabel';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function FriendRequestsDialog(props) {

    useEffect((e) => {
        getFriendRequests();
    },[]);

    const [requests, setRequests] = useState([]);

    const getFriendRequests = async() => {
        Axios.post('http://localhost:5000/api/get_friend_requests', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.error) {
                setRequests(response.data);
                console.log("GOT FRIEND REQUESTS");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const acceptFriendRequest = (userID) => {
        Axios.post('http://localhost:5000/api/accept_friend_request', {
            to_userID: localStorage.getItem("user"),
            from_userID: userID,
        }).then((response) => {
            if (!response.data.error) {
                console.log("FRIEND REQUEST ACCEPTED");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const rejectFriendRequest = (userID) => {
        Axios.post('http://localhost:5000/api/reject_friend_request', {
            to_userID: localStorage.getItem("user"),
            from_userID: userID,
        }).then((response) => {
            if (!response.data.error) {
                console.log("FRIEND REQUEST REJECTED");
            } else {
                console.log(response.data.error);
            }
        });
    }

    return (
        <Modal open={props.open} onClose={props.close}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                size="lg"
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Friend Requests
                </Typography>
                <List>
                    {(requests.length > 0) ?
                        requests.map((user) => (
                            <ListItem>
                                <ListItemButton>
                                    <ListItemContent>{user.name}</ListItemContent>
                                    <IconButton variant="contained" color="success" onClick={() => acceptFriendRequest(user.userID)}>
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton variant="contained" color="error" onClick={() => rejectFriendRequest(user.userID)}>
                                        <CloseIcon />
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>
                        ))
                        : <Typography sx={{ fontSize: 18 }}level="body3">No friend requests</Typography>
                    }
                </List>
            </ModalDialog>
        </Modal>
    );
}
