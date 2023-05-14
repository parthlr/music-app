import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import axios from "axios";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SongCard from '../components/SongCard';
import PlaylistsDialog from '../components/PlaylistsDialog';

export default function HomePage() {

    useEffect(() => {
        getRandomSongs();
    },[]);

    const [songs, setSongs] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const getRandomSongs = async() => {
        try {
            const response = await axios.get('http://localhost:5000/get_songs');
            setSongs(response.data);
            console.log(response);
        } catch (err) {
            console.log("ERROR fetching data");
            console.log(err);
        }
    }

    return (
        <div className="home-page">
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item xs={3}>
                    {
                    songs.map((song) => (
                        <SongCard song={song} inPlaylist={false} openList={() => setOpenDialog(true)} clickSong={() => setClickedSong(song)} />
                    ))
                    }
                </Grid>
            </Grid>
            <PlaylistsDialog open={openDialog} close={() => setOpenDialog(false)} song={clickedSong} />
        </div>
    )
}
