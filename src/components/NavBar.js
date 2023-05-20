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
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import * as Auth from '../services/Auth';

const drawerWidth = 240;

function LoginButton(props) {

    const goToLogin = () => {
        props.navigate('/login');
    }

    const goToRegister = () => {
        props.navigate('/register');
    }

    if (Auth.isLoggedIn()) {
        return (
            <Button href="/" color="inherit" onClick={Auth.logout}>Logout</Button>
        );
    }
    return (
        <div>
            <Button color="inherit" onClick={goToRegister}>Register</Button>
            <Button color="inherit" onClick={goToLogin}>Login</Button>
        </div>
    );
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
                    <ListItemText primary="Playlists" />
                </ListItem>
                {
                    playlists.map((playlist) => (
                        <ListItem disablePadding key={"id_" + playlist.playlistID + "_name_" + playlist.name}>
                            <ListItemButton onClick={() => viewPlaylist(playlist.playlistID)}>
                                <ListItemText primary={playlist.name}/>
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </div>
    );
}

export default function NavBar() {

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

    const searchBarTyped = () => {
        if (window.location.pathname != "/search") {
            navigate('/search');
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Input startDecorator={<SearchIcon />} onChange={searchBarTyped}/>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'row-reverse', }}>
                        <LoginButton navigate={navigate} />
                    </Box>
                </Toolbar>
            </AppBar>
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
                        <ListItemButton>
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                        <ListItemText primary="Create Playlist" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="liked-songs" disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <FavoriteIcon />
                            </ListItemIcon>
                        <ListItemText primary="Liked Songs" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <AccountPlaylists navigate={navigate}/>
            </Drawer>
        </Box>
    );
}
