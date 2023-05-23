import * as React from 'react';
import {useEffect, useState} from 'react';
import Axios from "axios";
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import MoreVert from '@mui/icons-material/MoreVert';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import DeleteForever from '@mui/icons-material/DeleteForever';
import Add from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';

function ActionMenu(props) {
    if (props.inPlaylist) {
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
                <MenuItem onClick={props.deleteFromPlaylist} variant="soft" color="danger">
                    <ListItemDecorator sx={{ color: 'inherit' }}>
                        <DeleteForever />
                    </ListItemDecorator>{" "}
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
                </ListItemDecorator>{" "}
                Add to Playlist
            </MenuItem>
        </Menu>
    );
}

function LikeButton(props) {
    if (props.isLiked) {
        return (<FavoriteIcon sx={{ color: pink[500] }}/>);
    }
    return (<FavoriteBorderIcon />);
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
            if (!response.data.err) {
                console.log("DELETED SONG FROM PLAYLIST");
            } else {
                console.log(response.data.err);
            }
        });
        setAnchorEl(null);
        window.location.reload(false);
    }

    const isSongLiked = async() => {
        Axios.post('http://localhost:5000/is_liked', {
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
            Axios.post('http://localhost:5000/add_like', {
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
            Axios.post('http://localhost:5000/delete_like', {
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
        <div className="song-card" display="flex">
        <br />
        <Card variant="outlined" sx={{ width: 800 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <Typography level="h2" fontSize="md"sx={{ mb: 0.5 }}>
                        {props.song.title}
                    </Typography>
                    <Typography level="body2">{props.song.artist}</Typography>
                </div>
                <Box sx={{ display: 'flex' }}>
                    <IconButton variant="plain" color="neutral" size="small" onClick={toggleLike}>
                        <LikeButton isLiked={liked}/>
                    </IconButton>
                    <IconButton variant="plain" color="neutral" size="small" onClick={handleClick}>
                        <MoreVert />
                    </IconButton>
                </Box>
                <ActionMenu inPlaylist={props.inPlaylist} anchorEl={anchorEl} open={open} handleClose={handleClose} addToPlaylist={addToPlaylist} deleteFromPlaylist={deleteFromPlaylist} />
            </Box>
        </Card>
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
