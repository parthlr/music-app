import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import Axios from "axios";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import Divider from '@mui/material/Divider';

import SongCard from '../components/SongCard';
import PlaylistCard from '../components/PlaylistCard';
import PlaylistsDialog from '../components/PlaylistsDialog';
import LoadingOverlay from '../components/LoadingOverlay';

function PlaylistResults(props) {
    if (props.playlists.length > 0) {
        return (
            <div>
                <br />
                <Typography sx={{ fontSize: 30, ml: "240px", pl: "50px" }}level="h1">Playlists</Typography>
                <br />
                <Grid
                    container
                    spacing={0}
                    sx={{ width: `calc(100% - 240px)`, ml: "240px", pl: "50px", pr: "50px" }}
                >
                    {
                        props.playlists.map((playlist) => (
                            <Grid item xs={3}>
                                <PlaylistCard playlist={playlist}/>
                            </Grid>
                        ))
                    }
                </Grid>
                <br />
            </div>
        );
    }
    return null;
}

function SongResults(props) {
    if (props.songs.length > 0) {
        return (
            <div>
                <Typography sx={{ fontSize: 30, ml: "240px", pl: "50px" }}level="h1">Songs</Typography>
                <br />
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
                        props.songs.map((song) => (
                            <SongCard song={song} inPlaylist={false} openList={() => props.setOpenDialog(true)} clickSong={() => props.setClickedSong(song)} sx={{ width: `calc(100% - 240px)`, ml: "240px", pl: "10px" }}/>
                        ))
                    }
                </List>
                <br />
            </div>
        );
    }
    return null;
}

export default function SearchPage(props) {

    const [openLoading, setOpenLoading] = useState(false);

    useEffect(() => {
        setOpenLoading(true);

        const delayDebounceFn = setTimeout(() => {
            console.log(props.query);

            getPlaylistResults();
            getSongResults();

            setOpenLoading(false);
        }, 1500);

        return () => clearTimeout(delayDebounceFn);
    }, [props.query]);

    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const getPlaylistResults = async() => {
        if (props.query.length == 0) {
            setPlaylists([]);
            return;
        }
        Axios.post('http://localhost:5000/search_playlists', {
            search: props.query,
        }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            } else if (response.data.message) {
                setPlaylists([]);
                console.log(response.data.message);
            } else {
                setPlaylists(response.data);
                console.log("GOT SEARCH PLAYLISTS");
            }
        });
    }

    const getSongResults = async() => {
        if (props.query.length == 0) {
            setSongs([]);
            return;
        }
        Axios.post('http://localhost:5000/search_songs', {
            search: props.query,
        }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            } else if (response.data.message) {
                setSongs([]);
                console.log(response.data.message);
            } else {
                setSongs(response.data);
                console.log("GOT SEARCH SONGS");
            }
        });
    }

    return (
        <div className="search-page">
            <br /><br /><br /><br />
            <PlaylistResults playlists={playlists} />
            <SongResults songs={songs} setOpenDialog={setOpenDialog} setClickedSong={setClickedSong} />
            <PlaylistsDialog open={openDialog} close={() => setOpenDialog(false)} song={clickedSong} />
            <LoadingOverlay open={openLoading} close={() => setOpenLoading(false)} />
        </div>
    );
}
