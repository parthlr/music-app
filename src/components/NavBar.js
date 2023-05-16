import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
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

const drawerWidth = 240;

function LoginButton() {
    if (localStorage.getItem("isLoggedIn")) {
        return (
            <Button href="/profile" color="inherit">Logout</Button>
        );
    }
    return (
        <div>
            <Button href="/register" color="inherit">Register</Button>
            <Button href="/login" color="inherit">Login</Button>
        </div>
    );
}

export default function NavBar() {


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Box sx={{ display: 'flex', flexDirection: 'row-reverse', }}>
                    <Toolbar>
                        <LoginButton />
                    </Toolbar>
                </Box>
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
                        <ListItemButton href="/">
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                        <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="search" disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                        <ListItemText primary="Search" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="profile" disablePadding>
                        <ListItemButton href="/profile">
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
            </Drawer>
        </Box>
    );
}
