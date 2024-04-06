import * as React from 'react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Axios from "axios";
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import FormLabel from '@mui/joy/FormLabel';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
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
import UserCard from '../components/UserCard';
import CreatePlaylistDialog from '../components/CreatePlaylistDialog'

export default function ProfilePage() {

    const {username} = useParams();

    useEffect(() => {
        getProfileData();
        getPlaylists();
        getLikedPlaylists();
        getLikedSongs();
        getFriends();
    },[]);

    const [profile, setProfile] = useState([]);
    const [friends, setFriends] = useState([]);

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
    const [profileAbout, setProfileAbout] = useState("");
    const [profileColor, setProfileColor] = useState("primary");

    const maxAboutLength = 500;

    const getProfileData = async() => {
        Axios.post('http://localhost:5000/api/get_profile_data', {
            userID: localStorage.getItem("user"),
        }).then((response) => {
            if (!response.data.error) {
                setProfile(response.data[0]);
                setProfileName(response.data[0].name);
                setProfileEmail(response.data[0].email);
                setProfileAbout(response.data[0].about);
                setProfileColor(response.data[0].profile_color);
                console.log("GOT PROFILE DATA");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const getPlaylists = async() => {
        Axios.post('http://localhost:5000/api/get_user_playlists', {
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
        Axios.post('http://localhost:5000/api/get_user_liked_playlists', {
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
        Axios.post('http://localhost:5000/api/get_liked_songs', {
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

    const getFriends = async() => {
        Axios.post('http://localhost:5000/api/get_friends', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.error) {
                setFriends(response.data);
                console.log("GOT FRIENDS");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const editProfile = () => {
        //var current_user = parseInt(localStorage.getItem("user"));
        //console.log(current_user);

        Axios.post("http://localhost:5000/api/edit_profile", {
            name: profileName,
            email: profileEmail,
            about: profileAbout,
            profile_color: profileColor,
            userID: localStorage.getItem("user"),
        }).then((response) => {
            console.log(response);
        });

        setProfileOpen(false);
        window.location.reload(false);
    }

    const updateProfileColor = (
        event: React.SyntheticEvent | null,
        newColor: string | null
    ) => {
        setProfileColor(newColor);
    };

    const updateAboutBox = (e) => {
        if (e.target.value.length <= maxAboutLength) {
            setProfileAbout(e.target.value);
        }
    }

    return (
        <div className="profile-page">
            <br /><br /><br /><br /><br /><br />
            <Box sx={{ display: 'flex', justifyContent: 'center', width: `calc(100% - 50px)`, ml: "50px", pl: "50px", pr: "50px" }}>
                <Stack spacing={2} sx={{ pl: "50px", pr: "50px" }}>
                    <Avatar color={profile.profile_color} variant="solid" sx={{ width: "300px", height: "300px" }}/>
                    <div>
                        <Typography sx={{ fontSize: 25 }}level="h1">{profile.name}</Typography>
                        <Typography sx={{ fontSize: 20 }}level="body3">{profile.username}</Typography>
                    </div>
                    <Box sx={{ display: 'flex' }}>
                        <MailOutlineIcon sx={{ mr: "10px" }}/>
                        <Typography sx={{ fontSize: 20 }}level="body3">{profile.email}</Typography>
                    </Box>
                    <br />
                    <Typography sx={{ fontSize: 18, width: "300px" }}level="h4">{profile.about}</Typography>
                    <br />
                    <Button variant="soft" color="neutral" onClick={() => setProfileOpen(true)}>Edit Profile</Button>
                    <br />
                    <Divider />
                    <br />
                    <Typography sx={{ fontSize: 20 }}level="h1">Friends</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            overflow: 'auto',
                            width: 300,
                            scrollSnapType: 'x mandatory',
                            '& > *': {
                              scrollSnapAlign: 'center',
                            },
                            '::-webkit-scrollbar': { display: 'none' },
                        }}
                    >
                        {
                            friends.map((friend) => (
                                <UserCard user={friend} size={75} fontSize={12} />
                            ))
                        }
                    </Box>
                    <br />
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography id="basic-modal-dialog-title" component="h2">
                        Edit Profile
                    </Typography>
                    <Select defaultValue={profileColor} size="sm" onChange={updateProfileColor} >
                        <Option value="primary" label={<Avatar color="primary" variant="solid" size="sm" />}><Avatar color="primary" variant="solid" size="sm" /></Option>
                        <Option value="neutral" label={<Avatar color="neutral" variant="solid" size="sm" />}><Avatar color="neutral" variant="solid" size="sm" /></Option>
                        <Option value="danger" label={<Avatar color="danger" variant="solid" size="sm" />}><Avatar color="danger" variant="solid" size="sm" /></Option>
                        <Option value="info" label={<Avatar color="info" variant="solid" size="sm" />}><Avatar color="info" variant="solid" size="sm" /></Option>
                        <Option value="success" label={<Avatar color="success" variant="solid" size="sm" />}><Avatar color="success" variant="solid" size="sm" /></Option>
                        <Option value="warning" label={<Avatar color="warning" variant="solid" size="sm" />}><Avatar color="warning" variant="solid" size="sm" /></Option>
                    </Select>
                </Box>
                <Stack spacing={2}>
                    <div>
                        <FormLabel>Name</FormLabel>
                        <Input autoFocus required placeholder="Name" defaultValue={profileName}
                            onChange={(e) => {
                                setProfileName(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <FormLabel>Email</FormLabel>
                        <Input autoFocus required placeholder="Email" defaultValue={profileEmail}
                            onChange={(e) => {
                                setProfileEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <FormLabel>About</FormLabel>
                        <Textarea minRows={3} value={profileAbout} defaultValue={profileAbout}
                        endDecorator={
                            <Typography level="body3" sx={{ ml: 'auto' }}>
                                {profileAbout.length}/{maxAboutLength} character(s)
                            </Typography>
                        }
                            onChange={(e) => {
                                updateAboutBox(e);
                            }}
                        />
                    </div>
                    <Button onClick={editProfile}>Save</Button>
                </Stack>
                </ModalDialog>
            </Modal>
        </div>
    );
}
