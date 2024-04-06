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
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import PlaylistCard from '../components/PlaylistCard';
import SongCard from '../components/SongCard';
import UserCard from '../components/UserCard';
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
        getFriends();
        isFriends();
        isFriendshipPending();
    },[username, profile.userID]);

    const [friends, setFriends] = useState([]);

    const [isUsersFriends, setIsFriends] = useState(false);
    const [friendshipPending, setFriendshipPending] = useState(false);

    const [playlists, setPlaylists] = useState([]);

    const [likedPlaylists, setLikedPlaylists] = useState([]);

    const [likedSongs, setLikedSongs] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);

    const [playlistName, setPlaylistName] = useState("");

    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profileAbout, setProfileAbout] = useState("");
    const [profileColor, setProfileColor] = useState("primary");

    const getProfileData = async() => {
        Axios.post('http://localhost:5000/app/get_profile_data', {
            username: username,
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
        Axios.post('http://localhost:5000/app/get_user_playlists', {
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
        Axios.post('http://localhost:5000/app/get_user_liked_playlists', {
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
        Axios.post('http://localhost:5000/app/get_liked_songs', {
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

    const isFriends = async() => {
        Axios.post('http://localhost:5000/app/is_friends', {
            userID_1: profile.userID,
            userID_2: localStorage.getItem("user"),
        }).then((response) => {
            if (!response.data.error) {
                setIsFriends(response.data.friends);
                console.log("GOT WHETHER USERS ARE FRIENDS");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const isFriendshipPending = async() => {
        Axios.post('http://localhost:5000/app/is_friendship_pending', {
            to_userID: profile.userID,
            from_userID: localStorage.getItem("user"),
        }).then((response) => {
            if (!response.data.error) {
                setFriendshipPending(response.data.pending_friendship);
                console.log("GOT IF FRIENDSHIP IS PENDING");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const getFriends = async() => {
        Axios.post('http://localhost:5000/app/get_friends', {
            userID: profile.userID,
        }).then((response) => {
            if (!response.data.error) {
                setFriends(response.data);
                console.log("GOT FRIENDS");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const sendFriendRequest = () => {
        Axios.post('http://localhost:5000/app/send_friend_request', {
            to_userID: profile.userID,
            from_userID: localStorage.getItem("user"),
        }).then((response) => {
            if (!response.data.error) {
                console.log("SENT FRIEND REQUEST");
                setFriendshipPending(true);
            } else {
                console.log(response.data.error);
            }
        });
    }

    const cancelFriendRequest = () => {
        Axios.post('http://localhost:5000/app/cancel_friend_request', {
            to_userID: profile.userID,
            from_userID: localStorage.getItem("user"),
        }).then((response) => {
            if (!response.data.error) {
                console.log("CANCELLED FRIEND REQUEST");
                setFriendshipPending(false);
                setIsFriends(false);
            } else {
                console.log(response.data.error);
            }
        });
    }

    const removeFriend = () => {
        Axios.post('http://localhost:5000/app/remove_friend', {
            userID_1: profile.userID,
            userID_2: localStorage.getItem("user"),
        }).then((response) => {
            if (response.data.message) {
                console.log("REMOVED FRIEND");
                setFriendshipPending(false);
                setIsFriends(false);
            }
            if (response.data.error) {
                console.log(response.data.error);
            }
        });
    }

    return (
        <div className="profile-page">
            <br /><br /><br /><br /><br /><br />
            <Box sx={{ display: 'flex', justifyContent: 'center', width: `calc(100% - 50px)`, ml: "50px", pl: "50px", pr: "50px" }}>
                <Stack spacing={2} sx={{ pl: "50px", pr: "50px" }}>
                    <Avatar color={profile.profile_color} variant="solid" sx={{ width: "300px", height: "300px" }}/>
                    <div>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: 25 }}level="h1">{profile.name}</Typography>
                            {
                                (friendshipPending) ?
                                    <Button color="neutral" variant="outlined" onClick={cancelFriendRequest}>Cancel Request</Button> :
                                    <IconButton color={isUsersFriends ? "danger" : "neutral"} variant={isUsersFriends ? "outlined" : "soft"} onClick={isUsersFriends ? removeFriend : sendFriendRequest}>
                                        {isUsersFriends ? <PersonRemoveIcon /> : <PersonAddIcon />}
                                    </IconButton>
                            }
                        </Box>
                        <Typography sx={{ fontSize: 20 }}level="body3">{profile.username}</Typography>
                    </div>
                    <Box sx={{ display: 'flex' }}>
                        <MailOutlineIcon sx={{ mr: "10px" }}/>
                        <Typography sx={{ fontSize: 20 }}level="body3">{profile.email}</Typography>
                    </Box>
                    <br />
                    <Typography sx={{ fontSize: 18, width: "300px" }}level="h4">{profile.about}</Typography>
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
