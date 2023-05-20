import * as React from 'react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Axios from "axios";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import Grid from '@mui/material/Grid';

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

    return (
        <div className="playlist-page">
            <br /><br /><br /><br />
            <Grid container direction="column" alignItems="center" justify="center">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 1,
                        m: 1,
                        width: 800,
                    }}
                >
                    <Typography level="h2">{playlist.name}</Typography>

                </Box>
            </Grid>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={3}>
                    {
                    songs.map((song) => (
                        <SongCard song={song} inPlaylist={true} playlistID={id} openList={() => setOpenDialog(true)} clickSong={() => setClickedSong(song)} />
                    ))
                    }
                </Grid>
            </Grid>
            <PlaylistsDialog open={openDialog} close={() => setOpenDialog(false)} song={clickedSong} />
        </div>
    );
}
