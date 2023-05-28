import * as React from 'react';
import { useState } from 'react';
import Axios from "axios";
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

export default function CreatePlaylistDialog(props) {

    const [playlistName, setPlaylistName] = useState("");

    const createPlaylist = () => {
        //var current_user = parseInt(localStorage.getItem("user"));
        //console.log(current_user);

        Axios.post("http://localhost:5000/create_playlist", {
            name: playlistName,
            userID: localStorage.getItem("user"),
        }).then((response) => {
            console.log(response);
        });

        props.close();
        window.location.reload(false);
    }

    return (
        <Modal open={props.open} onClose={props.close}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                sx={{ maxWidth: 500 }}
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Create new playlist
                </Typography>
                <Stack spacing={2}>
                    <Input autoFocus required placeholder="Name"
                        onChange={(e) => {
                            setPlaylistName(e.target.value);
                        }}
                    />
                    <Button onClick={createPlaylist}>Create</Button>
                </Stack>
            </ModalDialog>
        </Modal>
    );
}
