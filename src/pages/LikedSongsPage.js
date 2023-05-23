import * as React from 'react';
import {useEffect, useState} from 'react';
import Axios from "axios";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Table from '@mui/joy/Table';
import IconButton from '@mui/joy/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVert from '@mui/icons-material/MoreVert';
import SongCard from '../components/SongCard';
import PlaylistsDialog from '../components/PlaylistsDialog';

export default function LikedSongsPage() {

    // https://i.pinimg.com/236x/c3/f0/56/c3f056a65b92710f3701813a151f7524.jpg

    useEffect(() => {
        getLikedSongs();
    },[]);

    const [likedSongs, setLikedSongs] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const getLikedSongs = async() => {
        Axios.post('http://localhost:5000/get_liked_songs', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.error) {
                setLikedSongs(response.data);
                console.log("GOT LIKED SONGS");
            } else {
                console.log(response.data.error);
            }
        });
    }

    return (
        <div className="liked-songs-page">
            <Card variant="plain" sx={{ minHeight: '400px', width: `calc(100% - 240px)`, ml: "240px" }}>
                <CardCover>
                    <img
                        src="https://wallpaperaccess.com/full/340434.png"
                        srcSet="https://wallpaperaccess.com/full/340434.png 2x"
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
                    <Typography sx={{ fontSize: 80 }}level="h1">Liked Songs</Typography>
                </CardContent>
            </Card>
            <br /><br />
            <Table hoverRow stickyHeader variant="plain" borderAxis="none" size="lg" sx={{ width: `calc(100% - 240px)`, ml: "240px", pl: "50px", pr: "50px" }}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Artist</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        likedSongs.map((song) => (
                            <tr>
                                <td>{song.title}</td>
                                <td>{song.artist}</td>
                                <td>
                                    <IconButton variant="plain" color="neutral" size="small">
                                        <FavoriteBorderIcon />
                                    </IconButton>
                                    <IconButton variant="plain" color="neutral" size="small">
                                        <MoreVert />
                                    </IconButton>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <Grid
                container
                spacing={0}
                direction="column"
                sx={{ width: `calc(100% - 240px)`, ml: "240px", pl: "10px" }}
            >
                <Grid item xs={3}>
                    {
                    likedSongs.map((song) => (
                        <SongCard song={song} inPlaylist={false} openList={() => setOpenDialog(true)} clickSong={() => setClickedSong(song)} />
                    ))
                    }
                </Grid>
            </Grid>
            <PlaylistsDialog open={openDialog} close={() => setOpenDialog(false)} song={clickedSong} />
        </div>
    );

}
