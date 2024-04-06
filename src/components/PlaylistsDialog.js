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

export default function PlaylistsDialog(props) {

    useEffect(() => {
        getUserPlaylists();
    },[]);

    const [openDialog, setOpenDialog] = useState(false);

    const [playlists, setPlaylists] = useState([]);

    const getUserPlaylists = async() => {
        Axios.post('http://localhost:5000/api/get_user_playlists', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.err) {
                setPlaylists(response.data);
                console.log("GOT PLAYLIST DATA");
            } else {
                console.log(response.data.err);
            }
        });
    }

    const addSongToPlaylist = (id) => {
        Axios.post('http://localhost:5000/api/add_to_playlist', {
            songID: props.song.songID,
            playlistID: id,
        }).then((response) => {
            if (!response.data.err) {
                console.log("GOT PLAYLIST DATA");
            } else {
                console.log(response.data.err);
            }
        });
        props.close();
    }

    return (
        <Modal open={props.open} onClose={props.close}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                size="lg"
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Select Playlist
                </Typography>
                <List>
                    {
                        playlists.map((playlist) => (
                            <ListItem>
                                <ListItemButton onClick={() => addSongToPlaylist(playlist.playlistID)}>
                                    <ListItemContent>{playlist.name}</ListItemContent>
                                    <Add />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </ModalDialog>
        </Modal>
    );
}
