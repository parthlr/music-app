import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';

export default function SearchPage(props) {

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            console.log(props.query);

            getPlaylistResults();
            getSongResults();
        }, 3000);

        return () => clearTimeout(delayDebounceFn);
    }, [props.query]);

    const getPlaylistResults = async() => {

    }

    const getSongResults = async() => {

    }

    return (
        <div className="search-page">
            <br /><br /><br /><br />
            <Typography sx={{ fontSize: 80, ml: "240px" }}level="h1">{props.query}</Typography>
        </div>
    );
}
