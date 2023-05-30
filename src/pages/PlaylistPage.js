import * as React from 'react';
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Axios from "axios";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/joy/IconButton';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import DeleteForever from '@mui/icons-material/DeleteForever';

import LikeButton from '../components/LikeButton';
import SongCard from '../components/SongCard';
import PlaylistsDialog from '../components/PlaylistsDialog';
import ShareDialog from '../components/ShareDialog';
import ConfirmationDialog from '../components/ConfirmationDialog';

export default function PlaylistPage() {

    const {id} = useParams();

    useEffect((e) => {
        setPlaylistID(id);
        getPlaylist();
        getSongsInPlaylist();
        isPlaylistLiked();
    },[id]);

    const [pID, setPlaylistID] = useState("");
    const [playlist, setPlaylist] = useState([]);
    const [songs, setSongs] = useState([]);

    const [openPlaylistsDialog, setOpenPlaylistsDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const [openShareDialog, setOpenShareDialog] = useState(false);

    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [liked, setLiked] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const optionsOpen = Boolean(anchorEl);

    const navigate = useNavigate();

    const getPlaylist = async() => {
        Axios.post('http://localhost:5000/playlist', {
            playlistID: id,
        }).then((response) => {
            if (!response.data.error) {
                setPlaylist(response.data[0]);
                console.log(response);
            } else {
                setErrorMessage(response.data.error);
                console.log(response);
                console.log(response.data.error);
            }
        });
    }

    const getSongsInPlaylist = async() => {
        Axios.post('http://localhost:5000/get_songs_in_playlist', {
            playlistID: id,
        }).then((response) => {
            if (!response.data.error) {
                setSongs(response.data);
                console.log(response);
            } else {
                console.log(response);
                console.log(response.data.error);
            }
        });
    }

    const isPlaylistLiked = async() => {
        Axios.post('http://localhost:5000/is_playlist_liked', {
            userID: localStorage.getItem("user"),
            playlistID: id,
        }).then((response) => {
            if (response.data.message) {
                setLiked(true);
                console.log(response);
            } else {
                setLiked(false);
                console.log(response);
            }
        });
    }

    const toggleLike = () => {
        if (!liked) {
            Axios.post('http://localhost:5000/add_playlist_like', {
                userID: localStorage.getItem("user"),
                playlistID: id,
            }).then((response) => {
                if (!response.data.error) {
                    setLiked(true);
                    console.log(response);
                } else {
                    setLiked(false);
                    console.log(response);
                }
            });
        } else {
            Axios.post('http://localhost:5000/delete_playlist_like', {
                userID: localStorage.getItem("user"),
                playlistID: id,
            }).then((response) => {
                if (!response.data.error) {
                    setLiked(false);
                    console.log(response);
                } else {
                    setLiked(true);
                    console.log(response);
                }
            });
        }
    }

    const deletePlaylist = () => {
        Axios.post('http://localhost:5000/delete_playlist', {
            playlistID: id,
        }).then((response) => {
            if (response.data.message) {
                console.log(response);
                navigate('/profile');
                window.location.reload(false);
            } else if (response.data.error){
                console.log(response);
                console.log(response.data.error);
            }
        });
    }

    const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleOptionsClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="playlist-page">
            <Card variant="plain" sx={{ minHeight: '400px', width: `calc(100% - 240px)`, ml: "240px" }}>
                <CardCover>
                    <img
                        src="https://wallpapercrafter.com/desktop1/524319-pink-purple-gradient-pink-color-backgrounds-abstract.jpg"
                        srcSet="https://wallpapercrafter.com/desktop1/524319-pink-purple-gradient-pink-color-backgrounds-abstract.jpg 2x"
                        loading="lazy"
                        alt=""
                    />
                </CardCover>
                <CardCover
                    sx={{
                        background:
                        'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                    }}
                />
                <CardContent sx={{ justifyContent: 'flex-end' }}>
                    <Typography sx={{ fontSize: 80 }}level="h1">{playlist.name}</Typography>
                </CardContent>
            </Card>
            <br />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: `calc(100% - 240px)`, ml: "240px", pl: "50px", pr: "50px" }}>
                <div>
                    <IconButton variant="plain" color="neutral" onClick={toggleLike}>
                        <LikeButton isLiked={liked} fontSize="large"/>
                    </IconButton>
                    <IconButton variant="plain" color="neutral" onClick={handleOptionsClick}>
                        <MoreHoriz fontSize="large"/>
                    </IconButton>
                </div>
                <IconButton variant="plain" color="neutral">
                    <SettingsIcon fontSize="large"/>
                </IconButton>
            </Box>
            <br /><br />
            <List sx={{ pl: "50px", pr: "50px" }}>
                <ListItem>
                    <Grid
                        container
                        spacing={0}
                        sx={{ width: `calc(100% - 240px)`, ml: "240px", pl: "10px" }}
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
                <Divider sx={{ width: `calc(100% - 240px)`, ml: "240px", pl: "50px", pr: "50px" }} />
                {
                songs.map((song) => (
                    <SongCard song={song} inPlaylist={true} playlistID={id} openList={() => setOpenPlaylistsDialog(true)} clickSong={() => setClickedSong(song)} />
                ))
                }
            </List>
            <PlaylistsDialog open={openPlaylistsDialog} close={() => setOpenPlaylistsDialog(false)} song={clickedSong} />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={optionsOpen}
                onClose={handleOptionsClose}
                aria-labelledby="basic-demo-button"
                placement="bottom-start"
            >
                <MenuItem onClick={() => setOpenShareDialog(true)}>
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <ShareIcon />
                    </ListItemDecorator>{" "}
                    Share
                </MenuItem>
                <MenuItem variant="soft" color="danger" onClick={() => setOpenConfirmationDialog(true)}>
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <DeleteForever />
                    </ListItemDecorator>
                    Delete
                </MenuItem>
            </Menu>
            <ShareDialog open={openShareDialog} close={() => setOpenShareDialog(false)} title="Share Playlist" link={"http://localhost:3000/playlist/" + id} />
            <ConfirmationDialog open={openConfirmationDialog} close={() => setOpenConfirmationDialog(false)} description="Are you sure you want to delete this playlist?" confirm={deletePlaylist} />
        </div>
    );
}
