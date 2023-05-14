import * as React from 'react';
import {useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import MoreVert from '@mui/icons-material/MoreVert';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';

export default function SongCard(props) {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const addToPlaylist = () => {
        props.openList();
        props.clickSong();
        setAnchorEl(null);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="song-card" display="flex">
        <br />
        <Card variant="outlined" sx={{ width: 800 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <Typography level="h2" fontSize="md"sx={{ mb: 0.5 }}>
                        {props.song.title}
                    </Typography>
                    <Typography level="body2">{props.song.artist}</Typography>
                </div>
                <IconButton variant="outlined" color="neutral" size="small" onClick={handleClick}>
                    <MoreVert />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="basic-demo-button"
                >
                    <MenuItem onClick={addToPlaylist}>Add to Playlist</MenuItem>
                </Menu>
            </Box>
        </Card>
        </div>
    );

    /*
    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography>{props.song.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>
                Artist: {props.song.artist}
            </Typography>
            <Typography>
                Released: {props.song.release_year}
            </Typography>
            <Typography>
                Views: {props.song.song_views}
            </Typography>
        </AccordionDetails>
    </Accordion>
    */

}
