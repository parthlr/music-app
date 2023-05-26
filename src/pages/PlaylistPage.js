import * as React from 'react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
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

export default function PlaylistPage() {

    const {id} = useParams();

    useEffect((e) => {
        setPlaylistID(id);
        getPlaylist();
        getSongsInPlaylist();
    },[id]);

    const [pID, setPlaylistID] = useState("");
    const [playlist, setPlaylist] = useState([]);
    const [songs, setSongs] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");

    const [liked, setLiked] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const optionsOpen = Boolean(anchorEl);

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

    const toggleLike = () => {
        if (!liked) {
            setLiked(true);
        } else {
            setLiked(false);
        }
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
                    <SongCard song={song} inPlaylist={true} openList={() => setOpenDialog(true)} clickSong={() => setClickedSong(song)} />
                ))
                }
            </List>
            <PlaylistsDialog open={openDialog} close={() => setOpenDialog(false)} song={clickedSong} />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={optionsOpen}
                onClose={handleOptionsClose}
                aria-labelledby="basic-demo-button"
                placement="bottom-start"
            >
                <MenuItem>
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <ShareIcon />
                    </ListItemDecorator>{" "}
                    Share
                </MenuItem>
                <MenuItem variant="soft" color="danger">
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <DeleteForever />
                    </ListItemDecorator>
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
}
