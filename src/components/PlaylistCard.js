import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import AspectRatio from '@mui/joy/AspectRatio';

export default function PlaylistCard(props) {

    return (
        <div className="playlist-card" display="flex">
            <Card variant="outlined" sx={{ width: 250 }}>
                <AspectRatio ratio="1" sx={{ maxWidth: 250, my: 2 }}>
                    <img
                        src="https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg?w=1380&t=st=1684630316~exp=1684630916~hmac=0e441d6880fb900e383a404ce82e110ebef60888b70c8b12c55a46c2e47dd274"
                        srcSet="https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg?w=1380&t=st=1684630316~exp=1684630916~hmac=0e441d6880fb900e383a404ce82e110ebef60888b70c8b12c55a46c2e47dd274 2x"
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
                <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
                    <Link
                        overlay
                        underline="none"
                        href={"/playlist/" + props.playlist.playlistID}
                        sx={{ color: 'text.primary' }}
                    >
                        {props.playlist.name}
                    </Link>
                </Typography>
                <Typography level="body3">Test description that is supposed to be long so that it can fill up space</Typography>
            </Card>
        </div>
    );
}
