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
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Card from '@mui/joy/Card';
import Link from '@mui/joy/Link';
import Checkbox from '@mui/joy/Checkbox';
import Done from '@mui/icons-material/Done';

import SongCard from '../components/SongCard';
import PlaylistCard from '../components/PlaylistCard';
import UserCard from '../components/UserCard';
import PlaylistsDialog from '../components/PlaylistsDialog';
import LoadingOverlay from '../components/LoadingOverlay';

function PlaylistResults(props) {
    if (props.playlists.length > 0 && props.filter) {
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
    if (props.songs.length > 0 && props.filter) {
        return (
            <div>
                <br />
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

function UserResults(props) {
    if (props.users.length > 0 && props.filter) {
        return (
            <div>
                <br />
                <Typography sx={{ fontSize: 30, ml: "240px", pl: "50px" }}level="h1">People</Typography>
                <br />
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        py: 3,
                        overflow: 'auto',
                        width: `calc(100% - 240px)`,
                        ml: "240px",
                        pl: "50px",
                        scrollSnapType: 'x mandatory',
                        '& > *': {
                          scrollSnapAlign: 'center',
                        },
                        '::-webkit-scrollbar': { display: 'none' },
                    }}
                >
                    {
                        props.users.map((user) => (
                            <UserCard user={user} size={150} fontSize={15} />
                        ))
                    }
                </Box>
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
            getUserResults();

            setOpenLoading(false);
        }, 1500);

        return () => clearTimeout(delayDebounceFn);
    }, [props.query]);

    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [users, setUsers] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [clickedSong, setClickedSong] = useState(null);

    const [selectedValues, setValue] = useState(["Playlists", "Songs", "Users"]);

    const getPlaylistResults = async() => {
        if (props.query.length == 0) {
            setPlaylists([]);
            return;
        }
        Axios.post('http://localhost:5000/app/search_playlists', {
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
        Axios.post('http://localhost:5000/app/search_songs', {
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

    const getUserResults = async() => {
        if (props.query.length == 0) {
            setUsers([]);
            return;
        }
        Axios.post('http://localhost:5000/app/search_users', {
            search: props.query,
        }).then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            } else if (response.data.message) {
                setUsers([]);
                console.log(response.data.message);
            } else {
                setUsers(response.data);
                console.log("GOT SEARCH USERS");
            }
        });
    }

    const handleFilter = (e, item) => {
        if (e.target.checked) {
            setValue((val) => [...val, item]);
        } else {
            setValue((val) => val.filter((text) => text !== item));
        }
        console.log(selectedValues);
    }

    return (
        <div className="search-page">
            <br /><br /><br /><br />
            <List
                orientation="horizontal"
                wrap
                sx={{
                    '--List-gap': '8px',
                    '--ListItem-radius': '20px',
                    '--ListItem-minHeight': '32px',
                     ml: "240px", pl: "50px"
                }}
            >
                {
                    ["Playlists", "Songs", "Users"].map(
                        (item, index) => (
                            <ListItem key={item}>
                                {selectedValues.includes(item) && (
                                    <Done
                                        fontSize="md"
                                        color="primary"
                                        sx={{ ml: -0.5, mr: 0.5, zIndex: 2, pointerEvents: 'none' }}
                                    />
                                )}
                                <Checkbox
                                    size="sm"
                                    disableIcon
                                    overlay
                                    label={item}
                                    checked={selectedValues.includes(item)}
                                    variant={'outlined'}
                                    onChange={(e) => { handleFilter(e, item)}}
                                    slotProps={{
                                        action: ({ checked }) => ({
                                            sx: checked
                                                ? {
                                                    border: '1px solid',
                                                    borderColor: 'primary.500',
                                                  }
                                                : {},
                                        }),
                                    }}
                                />
                            </ListItem>
                        )
                    )
                }
            </List>
            <PlaylistResults playlists={playlists} filter={selectedValues.includes("Playlists")}/>
            <SongResults songs={songs} setOpenDialog={setOpenDialog} setClickedSong={setClickedSong} filter={selectedValues.includes("Songs")}/>
            <UserResults users={users} filter={selectedValues.includes("Users")}/>
            <PlaylistsDialog open={openDialog} close={() => setOpenDialog(false)} song={clickedSong} />
            <LoadingOverlay open={openLoading} close={() => setOpenLoading(false)} />
        </div>
    );
}
