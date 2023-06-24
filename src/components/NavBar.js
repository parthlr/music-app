import * as React from 'react';
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Input from '@mui/joy/Input';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import AspectRatio from '@mui/joy/AspectRatio';
import * as Auth from '../services/Auth';

import CreatePlaylistDialog from '../components/CreatePlaylistDialog'
import FriendRequestsDialog from '../components/FriendRequestsDialog';

const drawerWidth = 240;

function LoginButton(props) {

    useEffect((e) => {
        getNumFriendRequests();
    },[]);

    const [requests, setRequests] = useState(0);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [openFriendRequestsDialog, setOpenFriendRequestsDialog] = useState(false);

    const goToLogin = () => {
        props.navigate('/login');
    }

    const goToRegister = () => {
        props.navigate('/register');
    }

    const logout = () => {
        Auth.logout();
        props.navigate('/');
        window.location.reload(false);
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getNumFriendRequests = async() => {
        Axios.post('http://localhost:5000/get_num_friend_requests', {
            userID: localStorage.getItem("user"),
        }).then((response) => {
            if (!response.data.error) {
                setRequests(response.data[0].count);
                console.log("Count: " + response.data[0].count);
                console.log(response);
            } else {
                console.log(response);
                console.log(response.data.error);
            }
        });
    }

    if (Auth.isLoggedIn()) {
        return (
            <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleClick} sx={{ p: 0 }}>
                    <Avatar color="primary" variant="solid"/>
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="basic-demo-button"
                    placement="bottom-start"
                    sx={{ mt: '45px' }}
                >
                    <MenuItem onClick={() => setOpenFriendRequestsDialog(true)}>
                        <ListItemIcon>
                            <Chip size="sm" color="danger">{requests}</Chip>
                        </ListItemIcon>
                        Notifications
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
                <FriendRequestsDialog open={openFriendRequestsDialog} close={() => setOpenFriendRequestsDialog(false)}/>
            </Box>
        );
    }
    return (
        <div>
            <Button color="inherit" onClick={goToRegister}>Register</Button>
            <Button color="inherit" onClick={goToLogin}>Login</Button>
        </div>
    );
}

function PlaylistIcon(props) {
    useEffect((e) => {
        getPlaylistBackgroundImage();
    },[props.id]);

    const [playlistImage, setPlaylistImage] = useState("");

    const getPlaylistBackgroundImage = async() => {
        Axios.post('http://localhost:5000/get_playlist_image', {
            playlistID: props.id,
        }).then((response) => {
            if (!response.data.error) {
                setPlaylistImage(response.data[0].link);
                console.log("--------------------------------------");
                console.log(response.data[0].link);
                console.log(response);
            } else {
                console.log(response);
                console.log(response.data.error);
            }
        });
    }

    return (
        <Avatar variant="rounded" sx={{ width: 50, height: 50, borderRadius: 2 }} src={playlistImage} />
    )

}

function AccountPlaylists(props) {

    useEffect(() => {
        getPlaylists();
    },[]);

    const [playlists, setPlaylists] = useState([]);

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

    const viewPlaylist = (id) => {
        props.navigate('/playlist/' + id);
    }

    if (!Auth.isLoggedIn()) {
        return null;
    }
    return (
        <div>
            <Divider />
            <List>
                <ListItem>
                    <ListItemText primary="My Playlists" />
                </ListItem>
                {
                    playlists.map((playlist) => (
                        <ListItem disablePadding key={"id_" + playlist.playlistID + "_name_" + playlist.name}>
                            <ListItemButton onClick={() => viewPlaylist(playlist.playlistID)}>
                                <PlaylistIcon id={playlist.playlistID} />
                                <ListItemText sx={{ pl: "8px" }} primary={playlist.name}/>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </div>
    );
}

function LikedPlaylists(props) {

    useEffect(() => {
        getPlaylists();
    },[]);

    const [playlists, setPlaylists] = useState([]);

    const getPlaylists = async() => {
        Axios.post('http://localhost:5000/get_user_liked_playlists', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.error) {
                setPlaylists(response.data);
                console.log("GOT PROFILE PLAYLIST DATA");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const viewPlaylist = (id) => {
        props.navigate('/playlist/' + id);
    }

    if (!Auth.isLoggedIn()) {
        return null;
    }
    return (
        <div>
            <List>
                <ListItem>
                    <ListItemText primary="Liked Playlists" />
                </ListItem>
                {
                    playlists.map((playlist) => (
                        <ListItem disablePadding key={"id_" + playlist.playlistID + "_name_" + playlist.name}>
                            <ListItemButton onClick={() => viewPlaylist(playlist.playlistID)}>
                                <PlaylistIcon id={playlist.playlistID} />
                                <ListItemText sx={{ pl: "8px" }} primary={playlist.name}/>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </div>
    );
}

export default function NavBar(props) {

    const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);

    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    }

    const goToSearch = () => {
        navigate('/search');
    }

    const goToProfile = () => {
        navigate('/profile');
    }

    const goToLikedSongs = () => {
        navigate('/liked-songs');
    }

    const searchBarTyped = (e) => {
        props.setSearch(e.target.value);
        if (window.location.pathname != "/search") {
            navigate('/search');
        }
    }

    return (
        <div className="nav-bar">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                    <Toolbar>
                        <Input startDecorator={<SearchIcon />} onChange={(e) => searchBarTyped(e)}/>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', }}>
                            <LoginButton navigate={navigate} />
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                >
                    <Drawer
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                            },
                        }}
                        variant="permanent"
                        anchor="left"
                    >
                        <Toolbar>
                            <Typography variant="h5" noWrap component="div">
                                MUSIC
                            </Typography>
                        </Toolbar>
                        <Divider />
                        <List>
                            <ListItem key="home" disablePadding>
                                <ListItemButton onClick={goToHome}>
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                <ListItemText primary="Home" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="search" disablePadding>
                                <ListItemButton onClick={goToSearch}>
                                    <ListItemIcon>
                                        <SearchIcon />
                                    </ListItemIcon>
                                <ListItemText primary="Search" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="profile" disablePadding>
                                <ListItemButton onClick={goToProfile}>
                                    <ListItemIcon>
                                        <AccountCircleIcon />
                                    </ListItemIcon>
                                <ListItemText primary="Profile" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem key="create-playlist" disablePadding>
                                <ListItemButton onClick={() => setPlaylistDialogOpen(true)}>
                                    <ListItemIcon>
                                        <AddIcon />
                                    </ListItemIcon>
                                <ListItemText primary="Create Playlist" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem key="liked-songs" disablePadding>
                                <ListItemButton onClick={goToLikedSongs}>
                                    <ListItemIcon>
                                        <FavoriteIcon />
                                    </ListItemIcon>
                                <ListItemText primary="Liked Songs" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <AccountPlaylists navigate={navigate}/>
                        <LikedPlaylists navigate={navigate}/>
                    </Drawer>
                </Box>
            </Box>
            <CreatePlaylistDialog open={playlistDialogOpen} close={() => setPlaylistDialogOpen(false)}/>
        </div>
    );
}
