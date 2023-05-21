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
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PlaylistCard from '../components/PlaylistCard';

export default function ProfilePage() {
    useEffect(() => {
        getProfileData();
        getPlaylists();
    },[]);

    const [profile, setProfile] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    const [playlistOpen, setPlaylistOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [playlistName, setPlaylistName] = useState("");

    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");

    const getProfileData = async() => {
        Axios.post('http://localhost:5000/get_profile_data', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.err) {
                setProfile(response.data[0]);
                setProfileName(response.data[0].name);
                setProfileEmail(response.data[0].email);
                console.log("GOT PROFILE DATA");
            } else {
                console.log(response.data.err);
            }
        });
    }

    const getPlaylists = async() => {
        Axios.post('http://localhost:5000/get_user_playlists', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.err) {
                setPlaylists(response.data);
                console.log("GOT PROFILE PLAYLIST DATA");
            } else {
                console.log(response.data.err);
            }
        });
    }

    const createPlaylist = () => {
        //var current_user = parseInt(localStorage.getItem("user"));
        //console.log(current_user);

        Axios.post("http://localhost:5000/create_playlist", {
            name: playlistName,
            userID: localStorage.getItem("user"),
        }).then((response) => {
            console.log(response);
        });

        setPlaylistOpen(false);
    }

    const editProfile = () => {
        //var current_user = parseInt(localStorage.getItem("user"));
        //console.log(current_user);

        Axios.post("http://localhost:5000/edit_profile", {
            name: profileName,
            email: profileEmail,
            userID: localStorage.getItem("user"),
        }).then((response) => {
            console.log(response);
        });

        setProfileOpen(false);
        //window.location.reload(false);
    }

    return (
        <div className="profile-page" style={{ width: "100%" }}>
            <br /><br /><br /><br />
            <Grid container direction="column" alignItems="center" justify="center">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 1,
                        m: 1,
                        width: 800,
                    }}
                >
                    <Typography level="h2">{profileName}</Typography>
                    <Button onClick={() => setProfileOpen(true)}>
                        <Typography id="basic-modal-dialog-title" component="h1">Edit</Typography>
                    </Button>
                </Box>
            </Grid>
            <br /><br /><br /><br />
            <Grid container direction="column" alignItems="center" justify="center">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 1,
                        m: 1,
                        width: 800,
                    }}
                >
                    <Typography level="h4">Playlists</Typography>
                    <Button onClick={() => setPlaylistOpen(true)}>
                        <Typography id="basic-modal-dialog-title" component="h1">+</Typography>
                    </Button>
                </Box>
                <br />
            </Grid>
            <Grid
                container
                spacing={1}
                direction="row"
                alignItems="center"
                justifyContent="center"
                wrap="wrap"
            >
                {
                playlists.map((playlist) => (
                    <Grid item xs={6} align="center">
                        <PlaylistCard playlist={playlist} />
                    </Grid>
                ))
                }
            </Grid>
            <Modal open={playlistOpen} onClose={() => setPlaylistOpen(false)}>
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
            <Modal open={profileOpen} onClose={() => setProfileOpen(false)}>
                <ModalDialog
                    aria-labelledby="basic-modal-dialog-title"
                    aria-describedby="basic-modal-dialog-description"
                    sx={{ maxWidth: 500 }}
                >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Edit Profile
                </Typography>
                <Stack spacing={2}>
                    <FormLabel>Name</FormLabel>
                    <Input autoFocus required placeholder="Name" defaultValue={profileName}
                        onChange={(e) => {
                            setProfileName(e.target.value);
                        }}
                    />
                    <FormLabel>Email</FormLabel>
                    <Input autoFocus required placeholder="Email" defaultValue={profileEmail}
                        onChange={(e) => {
                            setProfileEmail(e.target.value);
                        }}
                    />
                    <Button onClick={editProfile}>Save</Button>
                </Stack>
                </ModalDialog>
            </Modal>
        </div>
    );
}
