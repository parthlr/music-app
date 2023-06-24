import * as React from 'react';
import {useEffect, useState} from 'react';
import Axios from "axios";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import MoreVert from '@mui/icons-material/MoreVert';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import DeleteForever from '@mui/icons-material/DeleteForever';
import Add from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';

import LikeButton from '../components/LikeButton';

function ActionMenu(props) {
    if (props.inPlaylist && props.playlistOwner) {
        return (
            <Menu
                id="basic-menu"
                anchorEl={props.anchorEl}
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="basic-demo-button"
                placement="bottom-start"
            >
                <MenuItem onClick={props.addToPlaylist}>
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <Add />
                    </ListItemDecorator>{" "}
                    Add to Playlist
                </MenuItem>
                <MenuItem>
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <ShareIcon />
                    </ListItemDecorator>{" "}
                    Share
                </MenuItem>
                <MenuItem onClick={props.deleteFromPlaylist} variant="soft" color="danger">
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <DeleteForever />
                    </ListItemDecorator>
                    Remove
                </MenuItem>
            </Menu>
        );
    }
    return (
        <Menu
            id="basic-menu"
            anchorEl={props.anchorEl}
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="basic-demo-button"
            placement="bottom-start"
        >
            <MenuItem onClick={props.addToPlaylist}>
                <ListItemDecorator sx={{ color: 'inherit' }}>
                    <Add />
                </ListItemDecorator>
                Add to Playlist
            </MenuItem>
            <MenuItem>
                <ListItemDecorator sx={{ color: 'inherit' }}>
                    <ShareIcon />
                </ListItemDecorator>{" "}
                Share
            </MenuItem>
        </Menu>
    );
}

export default function SongCard(props) {
    useEffect((e) => {
        isSongLiked();
    },[props.song.songID]);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [liked, setLiked] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const addToPlaylist = () => {
        props.openList();
        props.clickSong();
        setAnchorEl(null);
    }

    const deleteFromPlaylist = () => {
        Axios.post('http://localhost:5000/delete_from_playlist', {
            songID: props.song.songID,
            playlistID: props.playlistID,
        }).then((response) => {
            if (!response.data.error) {
                console.log("DELETED SONG FROM PLAYLIST");
            } else {
                console.log(response.data.err);
            }
        });
        setAnchorEl(null);
        window.location.reload(false);
    }

    const isSongLiked = async() => {
        Axios.post('http://localhost:5000/is_song_liked', {
            userID: localStorage.getItem("user"),
            songID: props.song.songID,
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
            Axios.post('http://localhost:5000/add_song_like', {
                userID: localStorage.getItem("user"),
                songID: props.song.songID,
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
            Axios.post('http://localhost:5000/delete_song_like', {
                userID: localStorage.getItem("user"),
                songID: props.song.songID,
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

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="song-card">
            <ListItem>
                <Grid
                    container
                    spacing={0}
                    sx={props.sx}
                >
                    <ListItemButton>
                            <Grid item xs={3}>
                                <ListItemContent>{props.song.title}</ListItemContent>
                            </Grid>
                            <Grid item xs={3}>
                                <ListItemContent>{props.song.artist}</ListItemContent>
                            </Grid>
                            <Grid item xs={3}>
                                <ListItemContent>{props.song.release_year}</ListItemContent>
                            </Grid>
                            <Grid item xs={3}>
                                <IconButton variant="plain" color="neutral" onClick={toggleLike}>
                                    <LikeButton isLiked={liked}/>
                                </IconButton>
                                <IconButton variant="plain" color="neutral" onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                                <ActionMenu inPlaylist={props.inPlaylist} playlistOwner={props.playlistOwner} anchorEl={anchorEl} open={open} handleClose={handleClose} addToPlaylist={addToPlaylist} deleteFromPlaylist={deleteFromPlaylist} />
                            </Grid>
                    </ListItemButton>
                </Grid>
            </ListItem>
        </div>
    );

    /*
    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography>{props.song.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>
                Artist: {props.song.artist}
            </Typography>
            <Typography>
                Released: {props.song.release_year}
            </Typography>
            <Typography>
                Views: {props.song.song_views}
            </Typography>
        </AccordionDetails>
    </Accordion>
    */

}
