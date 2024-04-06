import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import Axios from "axios";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';

import SongCard from '../components/SongCard';
import PlaylistCard from '../components/PlaylistCard';
import UserCard from '../components/UserCard';
import PlaylistsDialog from '../components/PlaylistsDialog';

export default function HomePage() {

    useEffect(() => {
        getPlaylists();
        getLikedPlaylists();
        getRecommendedPlaylists();
        getRandomSongs();
        getRandomPeople();
    },[]);

    const [songs, setSongs] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const [playlists, setPlaylists] = useState([]);
    const [likedPlaylists, setLikedPlaylists] = useState([]);
    const [recommendedPlaylists, setRecommendedPlaylists] = useState([]);
    const [people, setPeople] = useState([]);

    const getPlaylists = async() => {
        Axios.post('http://localhost:5000/api/get_user_playlists', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.err) {
                setPlaylists(response.data);
                console.log("GOT HOME PAGE PLAYLISTS");
            } else {
                console.log(response.data.err);
            }
        });
    }

    const getLikedPlaylists = async() => {
        Axios.post('http://localhost:5000/api/get_user_liked_playlists', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.error) {
                setLikedPlaylists(response.data);
                console.log("GOT HOME PAGE LIKED PLAYLISTS");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const getRecommendedPlaylists = async() => {
        Axios.post('http://localhost:5000/api/get_recommended_playlists', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.error) {
                setRecommendedPlaylists(response.data);
                console.log("GOT HOME PAGE RECOMMENDED PLAYLISTS");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const getRandomSongs = async() => {
        Axios.get('http://localhost:5000/api/get_songs'
        ).then((response) => {
            if (!response.data.error) {
                setSongs(response.data);
                console.log("GOT RANDOM SONGS");
            } else {
                console.log(response.data.error);
            }
        });
    }

    const getRandomPeople = async() => {
        Axios.post('http://localhost:5000/api/get_home_page_people', {
            userID: localStorage.getItem("user")
        }).then((response) => {
            if (!response.data.error) {
                setPeople(response.data);
                console.log("GOT HOME PAGE RANDOM PEOPLE");
            } else {
                console.log(response.data.error);
            }
        });
    }

    return (
        <div className="home-page">
            <br /><br /><br /><br />
            <Typography sx={{ fontSize: 30, ml: "240px", pl: "50px" }}level="h1">For Me</Typography>
            <br />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: `calc(100% - 240px)`, ml: "240px", pl: "50px", pr: "50px" }}>
                <Grid
                    container
                    spacing={3}
                    sx={{ width: '50%' }}
                >
                    {
                        recommendedPlaylists.map((playlist) => (
                            <Grid item xs={6}>
                                <PlaylistCard playlist={playlist}/>
                            </Grid>
                        ))
                    }
                </Grid>
                <Divider orientation="vertical" />
                <List sx={{ pl: "50px", pr: "50px" }}>
                    <ListItem>
                        <Grid
                            container
                            spacing={0}
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
                    <Divider sx={{ pl: "50px", pr: "50px" }} />
                    {
                        songs.map((song) => (
                            <SongCard song={song} inPlaylist={false} openList={() => setOpenDialog(true)} clickSong={() => setClickedSong(song)} />
                        ))
                    }
                </List>
            </Box>
            <br/ ><br />
            <Typography sx={{ fontSize: 30, ml: "240px", pl: "50px" }}level="h1">My Playlists</Typography>
            <br />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: `calc(100% - 240px)`, ml: "240px", pl: "50px", pr: "50px" }}>
                <Grid
                    container
                    spacing={3}
                    sx={{ width: '50%' }}
                >
                    {
                        playlists.map((playlist) => (
                            <Grid item xs={6}>
                                <PlaylistCard playlist={playlist}/>
                            </Grid>
                        ))
                    }
                </Grid>
                <Grid
                    container
                    spacing={3}
                    sx={{ width: '50%' }}
                >
                    {
                        likedPlaylists.map((playlist) => (
                            <Grid item xs={6}>
                                <PlaylistCard playlist={playlist} liked={true}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
            <br /><br />
            <Typography sx={{ fontSize: 30, ml: "240px", pl: "50px" }}level="h1">Suggested People</Typography>
            <br />
            <Stack spacing={5} direction="row" sx={{ ml: "240px", pl: "50px", pr: "50px" }}>
                {
                    people.map((user) => (
                        <UserCard user={user} size={150} fontSize={15} />
                    ))
                }
            </Stack>
            <br /><br />
            <PlaylistsDialog open={openDialog} close={() => setOpenDialog(false)} song={clickedSong} />
        </div>
    )
}
