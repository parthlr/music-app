import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

export default function PlaylistCard(props) {

    return (
        <div className="playlist-card" display="flex">
        <br />
        <Card variant="outlined" sx={{ width: 800 }}>
            <Typography level="h2" fontSize="md"sx={{ mb: 0.5 }}>
                <Link
                    overlay
                    underline="none"
                    href={"/playlist/" + props.playlist.playlistID}
                    sx={{ color: 'text.tertiary' }}
                >
                    {props.playlist.name}
                </Link>
            </Typography>
            <Typography level="body2" sx={{ position: 'absolute', top: '1.5rem', right: '1.0rem' }}>{props.playlist.date_created}</Typography>
        </Card>
        </div>
    );
}
