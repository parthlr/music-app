import * as React from 'react';
import {useEffect, useState} from 'react';
import Axios from "axios";
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import FormLabel from '@mui/joy/FormLabel';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/joy/Avatar';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import PlaylistCard from '../components/PlaylistCard';
import SongCard from '../components/SongCard';
import CreatePlaylistDialog from '../components/CreatePlaylistDialog'

export default function ProfilePage() {
    useEffect(() => {
        getProfileData();
        getPlaylists();
        getLikedPlaylists();
        getLikedSongs();
    },[]);

    const [profile, setProfile] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    const [likedPlaylists, setLikedPlaylists] = useState([]);

    const [likedSongs, setLikedSongs] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
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

    const getLikedPlaylists = async() => {
        Axios.post('http://localhost:5000/get_user_liked_playlists', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.error) {
                setLikedPlaylists(response.data);
                console.log("GOT PROFILE PLAYLIST DATA");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const getLikedSongs = async() => {
        Axios.post('http://localhost:5000/get_liked_songs', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.error) {
                setLikedSongs(response.data);
                console.log("GOT LIKED SONGS");
            } else {
                console.log(response.data.error);
            }
        });
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
        window.location.reload(false);
    }

    return (
        <div className="profile-page">
            <br /><br /><br /><br /><br /><br />
            <Box sx={{ display: 'flex', justifyContent: 'center', width: `calc(100% - 50px)`, ml: "50px", pl: "50px", pr: "50px" }}>
                <Stack spacing={2} sx={{ pl: "50px", pr: "50px" }}>
                    <Avatar color="primary" variant="solid" sx={{ width: "300px", height: "300px" }}/>
                    <div>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: 25 }}level="h1">{profile.name}</Typography>
                            <IconButton variant="soft" color="neutral">
                                <PersonAddIcon />
                            </IconButton>
                        </Box>
                        <Typography sx={{ fontSize: 20 }}level="body3">{profile.email}</Typography>
                    </div>
                    <br />
                    <Button variant="soft" color="neutral" onClick={() => setProfileOpen(true)}>Edit Profile</Button>
                </Stack>
                <Stack spacing={2} sx={{ pl: "50px", pr: "50px" }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: 20 }}level="h1">Playlists</Typography>
                        <IconButton variant="soft" color="neutral" onClick={() => setPlaylistDialogOpen(true)}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            py: 3,
                            overflow: 'auto',
                            width: 800,
                            scrollSnapType: 'x mandatory',
                            '& > *': {
                              scrollSnapAlign: 'center',
                            },
                            '::-webkit-scrollbar': { display: 'none' },
                        }}
                    >
                        {
                            playlists.map((playlist) => (
                                <Box>
                                    <PlaylistCard playlist={playlist}/>
                                </Box>
                            ))
                        }
                        {
                            likedPlaylists.map((playlist) => (
                                <Box>
                                    <PlaylistCard playlist={playlist}/>
                                </Box>
                            ))
                        }
                    </Box>
                    <br /><br />
                    <Typography sx={{ fontSize: 20 }}level="h1">Liked Songs</Typography>
                    <br />
                    <List>
                        <ListItem>
                            <Grid
                                container
                                spacing={0}

                            >
                                <Grid item xs={3}>
                                    <ListItemContent>Title</ListItemContent>
                                </Grid>
                                <Grid item xs={3}>
                                    <ListItemContent>Artist</ListItemContent>
                                </Grid>
                                <Grid item xs={3}>
                                    <ListItemContent>Released</ListItemContent>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <Divider  />
                        {
                        likedSongs.map((song) => (
                            <SongCard song={song} inPlaylist={false} openList={() => setOpenDialog(true)} clickSong={() => setClickedSong(song)} />
                        ))
                        }
                    </List>
                </Stack>
            </Box>
            <br /><br />
            <CreatePlaylistDialog open={playlistDialogOpen} close={() => setPlaylistDialogOpen(false)}/>
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
