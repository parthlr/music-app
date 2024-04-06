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
import PlaylistSettingsDialog from '../components/PlaylistSettingsDialog';
import ConfirmationDialog from '../components/ConfirmationDialog';

function PlaylistMenu(props) {
    if (props.userID == parseInt(localStorage.getItem("user"))) {
        return (
            <Menu
                id="basic-menu"
                anchorEl={props.anchorEl}
                open={props.open}
                onClose={props.close}
                aria-labelledby="basic-demo-button"
                placement="bottom-start"
            >
                <MenuItem onClick={props.share}>
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <ShareIcon />
                    </ListItemDecorator>{" "}
                    Share
                </MenuItem>
                <MenuItem variant="soft" color="danger" onClick={props.confirm}>
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <DeleteForever />
                    </ListItemDecorator>
                    Delete
                </MenuItem>
            </Menu>
        );
    }
    return (
        <Menu
            id="basic-menu"
            anchorEl={props.anchorEl}
            open={props.open}
            onClose={props.close}
            aria-labelledby="basic-demo-button"
            placement="bottom-start"
        >
            <MenuItem onClick={props.share}>
                <ListItemDecorator sx={{ color: 'inherit' }}>
                    <ShareIcon />
                </ListItemDecorator>{" "}
                Share
            </MenuItem>
        </Menu>
    );
}

function SettingsButton(props) {
    if (props.userID == parseInt(localStorage.getItem("user"))) {
        return (
            <IconButton variant="plain" color="neutral" onClick={props.settings}>
                <SettingsIcon fontSize="large"/>
            </IconButton>
        );
    }
    return null;
}

export default function PlaylistPage() {

    const {id} = useParams();

    useEffect((e) => {
        setPlaylistID(id);
        getPlaylist();
        getSongsInPlaylist();
        getPlaylistBackgroundImage();
        getPlaylistCreator();
        isPlaylistLiked();
    },[id]);

    const [pID, setPlaylistID] = useState("");
    const [playlist, setPlaylist] = useState([]);
    const [songs, setSongs] = useState([]);

    const [openPlaylistsDialog, setOpenPlaylistsDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const [openShareDialog, setOpenShareDialog] = useState(false);

    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

    const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [playlistCreator, setPlaylistCreator] = useState([]);

    const [playlistImage, setPlaylistImage] = useState("");
    const [playlistImageID, setPlaylistImageID] = useState(0);

    const [liked, setLiked] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const optionsOpen = Boolean(anchorEl);

    const navigate = useNavigate();

    const getPlaylist = async() => {
        Axios.post('http://localhost:5000/app/playlist', {
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
        Axios.post('http://localhost:5000/app/get_songs_in_playlist', {
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

    const getPlaylistBackgroundImage = async() => {
        Axios.post('http://localhost:5000/app/get_playlist_image', {
            playlistID: id,
        }).then((response) => {
            if (!response.data.error) {
                setPlaylistImage(response.data[0].link);
                setPlaylistImageID(response.data[0].id);
                console.log("--------------------------------------");
                console.log(response.data[0].link);
                console.log(response.data[0].id);
                console.log(response);
            } else {
                console.log(response);
                console.log(response.data.error);
            }
        });
    }

    const getPlaylistCreator = async() => {
        Axios.post('http://localhost:5000/app/get_playlist_creator', {
            playlistID: id,
        }).then((response) => {
            if (!response.data.error) {
                setPlaylistCreator(response.data[0]);
                console.log(response);
            } else {
                console.log(response);
                console.log(response.data.error);
            }
        });
    }

    const isPlaylistLiked = async() => {
        Axios.post('http://localhost:5000/app/is_playlist_liked', {
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
            Axios.post('http://localhost:5000/app/add_playlist_like', {
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
            Axios.post('http://localhost:5000/app/delete_playlist_like', {
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
        Axios.post('http://localhost:5000/app/delete_playlist', {
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
                        src={playlistImage}
                        srcSet={playlistImage + " 2x"}
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
                    <Typography sx={{ fontSize: 20 }}level="h1">{playlistCreator.name}</Typography>
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
                <SettingsButton userID={playlistCreator.userID} settings={() => setOpenSettingsDialog(true)}/>
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
                    <SongCard song={song} inPlaylist={true} playlistOwner={playlistCreator.userID == parseInt(localStorage.getItem("user"))} playlistID={id} openList={() => setOpenPlaylistsDialog(true)} clickSong={() => setClickedSong(song)} sx={{ width: `calc(100% - 240px)`, ml: "240px", pl: "10px" }}/>
                ))
                }
            </List>
            <PlaylistsDialog open={openPlaylistsDialog} close={() => setOpenPlaylistsDialog(false)} song={clickedSong} />
            <PlaylistMenu userID={playlistCreator.userID} open={optionsOpen} anchorEl={anchorEl} close={handleOptionsClose} share={() => setOpenShareDialog(true)} confirm={() => setOpenConfirmationDialog(true)} />
            <ShareDialog open={openShareDialog} close={() => setOpenShareDialog(false)} title="Share Playlist" link={"http://localhost:3000/playlist/" + id} />
            <PlaylistSettingsDialog playlist={playlist} open={openSettingsDialog} close={() => setOpenSettingsDialog(false)} imageID={playlistImageID} updateImage={setPlaylistImageID} />
            <ConfirmationDialog open={openConfirmationDialog} close={() => setOpenConfirmationDialog(false)} description="Are you sure you want to delete this playlist?" confirm={deletePlaylist} />
        </div>
    );
}
