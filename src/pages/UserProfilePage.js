import * as React from 'react';
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
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
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import PlaylistCard from '../components/PlaylistCard';
import SongCard from '../components/SongCard';
import CreatePlaylistDialog from '../components/CreatePlaylistDialog'

export default function ProfilePage() {

    const {username} = useParams();

    const [profile, setProfile] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getProfileData();

        if (profile.userID == parseInt(localStorage.getItem("user"))) {
            navigate('/profile');
        }

        getPlaylists();
        getLikedPlaylists();
        getLikedSongs();
    },[username, profile.userID]);

    const [playlists, setPlaylists] = useState([]);

    const [likedPlaylists, setLikedPlaylists] = useState([]);

    const [likedSongs, setLikedSongs] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);

    const [playlistName, setPlaylistName] = useState("");

    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");

    const getProfileData = async() => {
        Axios.post('http://localhost:5000/get_profile_data', {
            username: username,
        }).then((response) => {
            if (!response.data.error) {
                setProfile(response.data[0]);
                setProfileName(response.data[0].name);
                setProfileEmail(response.data[0].email);
                console.log("GOT PROFILE DATA");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const getPlaylists = async() => {
        Axios.post('http://localhost:5000/get_user_playlists', {
            userID: profile.userID,
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
            userID: profile.userID,
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
            userID: profile.userID,
        }).then((response) => {
            if (!response.data.error) {
                setLikedSongs(response.data);
                console.log("GOT LIKED SONGS");
            } else {
                console.log(response.data.error);
            }
        });
    }

    return (
        <div className="profile-page">
            <br /><br /><br /><br /><br /><br />
            <Box sx={{ display: 'flex', justifyContent: 'center', width: `calc(100% - 50px)`, ml: "50px", pl: "50px", pr: "50px" }}>
                <Stack spacing={2} sx={{ pl: "50px", pr: "50px" }}>
                    <Avatar color="primary" variant="solid" sx={{ width: "300px", height: "300px" }}/>
                    <div>
                        <Typography sx={{ fontSize: 25 }}level="h1">{profile.name}</Typography>
                        <Typography sx={{ fontSize: 20 }}level="body3">{profile.username}</Typography>
                    </div>
                    <Box sx={{ display: 'flex' }}>
                        <MailOutlineIcon sx={{ mr: "10px" }}/>
                        <Typography sx={{ fontSize: 20 }}level="body3">{profile.email}</Typography>
                    </Box>
                    <br />
                    <Typography sx={{ fontSize: 18, width: "300px" }}level="h4">Test description for user profile to fill up space and test things out without creating more entries</Typography>
                    <br />
                    <Divider />
                    <br />
                    <Typography sx={{ fontSize: 20 }}level="h1">Friends</Typography>
                    <br />
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            py: 3,
                            overflow: 'auto',
                            width: 300,
                            scrollSnapType: 'x mandatory',
                            '& > *': {
                              scrollSnapAlign: 'center',
                            },
                            '::-webkit-scrollbar': { display: 'none' },
                        }}
                    >

                    </Box>
                    <br />
                </Stack>
                <Stack spacing={2} sx={{ pl: "50px", pr: "50px" }}>
                    <Typography sx={{ fontSize: 20 }}level="h1">Playlists</Typography>
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
        </div>
    );
}
