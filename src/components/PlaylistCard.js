import * as React from 'react';
import {useEffect, useState} from 'react';
import Axios from "axios";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import AspectRatio from '@mui/joy/AspectRatio';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';

import config from '../services/config';

function LikedIcon(props) {
    if (props.liked) {
        return (
            <IconButton disabled
                aria-label="Like minimal photography"
                size="lg"
                variant="plain"
                color="neutral"
                sx={{
                    position: 'absolute',
                    zIndex: 2,
                    borderRadius: '50%',
                    right: '1rem',
                    bottom: 0,
                    transform: 'translateY(50%)',
                }}
            >
                <FavoriteIcon fontSize="large" sx={{ color: pink[500] }} />
            </IconButton>
        );
    }
    return null;
}

export default function PlaylistCard(props) {

    useEffect((e) => {
        getPlaylistBackgroundImage();
        isPlaylistLiked();
        getPlaylistCreator();
    },[props.playlist.playlistID]);

    const [playlistImage, setPlaylistImage] = useState("");

    const [liked, setLiked] = useState(false);

    const [creator, setCreator] = useState([]);

    const getPlaylistBackgroundImage = async() => {
        Axios.post(config.api + '/get_playlist_image', {
            playlistID: props.playlist.playlistID,
        }).then((response) => {
            if (!response.data.error) {
                setPlaylistImage(response.data[0].link);
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

    const isPlaylistLiked = async() => {
        Axios.post(config.api + '/is_playlist_liked', {
            userID: localStorage.getItem("user"),
            playlistID: props.playlist.playlistID,
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

    const getPlaylistCreator = async() => {
        Axios.post(config.api + '/get_playlist_creator', {
            playlistID: props.playlist.playlistID,
        }).then((response) => {
            if (!response.data.error) {
                setCreator(response.data[0]);
                console.log(response);
            } else {
                console.log(response.data.error);
            }
        });
    }

    return (
        <div className="playlist-card">
            <Card variant="plain" sx={{ width: 250 }}>
                <CardOverflow>
                    <AspectRatio ratio="1" sx={{ maxWidth: 250 }}>
                        <img
                            src={playlistImage}
                            srcSet={playlistImage + " 2x"}
                            loading="lazy"
                            alt=""
                        />
                    </AspectRatio>
                    <LikedIcon liked={liked} />
                </CardOverflow>
                <Typography level="h2" fontSize="md" sx={{ mb: 0.5, mt: "10px" }}>
                    <Link
                        overlay
                        underline="none"
                        href={"/playlist/" + props.playlist.playlistID}
                        sx={{ color: 'text.primary' }}
                    >
                        {props.playlist.name}
                    </Link>
                </Typography>
                <Typography level="body3" sx={{ fontSize: 15 }}>{creator.name}</Typography>
            </Card>
        </div>
    );
}
