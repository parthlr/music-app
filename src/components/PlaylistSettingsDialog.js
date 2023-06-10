import * as React from 'react';
import {useEffect, useState} from 'react';
import Axios from "axios";
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Switch from '@mui/joy/Switch';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import FormLabel from '@mui/joy/FormLabel';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import Typography from '@mui/joy/Typography';
import Box from '@mui/material/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Grid from '@mui/joy/Grid';

export default function PlaylistSettingsDialog(props) {

    useEffect(() => {

    },[]);

    const [name, setName] = useState("");

    const [p_private, setPrivate] = useState(false);

    return (
        <Modal open={props.open} onClose={props.close}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                size="lg"
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Playlist Settings
                </Typography>
                <Stack spacing={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                        <FormLabel>Private</FormLabel>
                        <Switch checked={p_private}
                            onChange={(e) => setPrivate(e.target.checked)}
                        />
                    </Box>
                    <div>
                        <FormLabel>Name</FormLabel>
                        <Input autoFocus required placeholder="Playlist Name"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <FormLabel>Decoration</FormLabel>
                        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                            <Grid
                              container
                              spacing={0}
                              sx={{ width: '100%' }}
                            >
                                <Grid item xs={4}>
                                    <Button color="primary" variant="plain" sx={{ p: 0.5}}>
                                        <Avatar color="primary" sx={{ width: 50, height: 50, borderRadius: 2 }} src="https://wallpapercrafter.com/desktop1/524319-pink-purple-gradient-pink-color-backgrounds-abstract.jpg" />
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button color="primary" variant="plain" sx={{ p: 0.5}}>
                                        <Avatar color="primary" sx={{ width: 50, height: 50, borderRadius: 2 }} src="https://wallpapercrafter.com/desktop1/524319-pink-purple-gradient-pink-color-backgrounds-abstract.jpg" />
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button color="primary" variant="plain" sx={{ p: 0.5}}>
                                        <Avatar color="primary" sx={{ width: 50, height: 50, borderRadius: 2 }} src="https://wallpapercrafter.com/desktop1/524319-pink-purple-gradient-pink-color-backgrounds-abstract.jpg" />
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button color="primary" variant="plain" sx={{ p: 0.5}}>
                                        <Avatar color="primary" sx={{ width: 50, height: 50, borderRadius: 2 }} src="https://wallpapercrafter.com/desktop1/524319-pink-purple-gradient-pink-color-backgrounds-abstract.jpg" />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </div>
                    <Button>Save</Button>
                </Stack>
            </ModalDialog>
        </Modal>
    );
}
