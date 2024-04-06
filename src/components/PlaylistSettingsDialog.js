import * as React from 'react';
import {useEffect, useState} from 'react';
import Axios from "axios";
import axios from "axios";
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

    const [p_private, setPrivate] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        getBackgroundImages();
        setPrivate(props.playlist.private);
        setName(props.playlist.name);
    },[props.imageID, props.playlist.private]);

    const [images, setImages] = useState([]);

    const [selectedList, setSelectedList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const getBackgroundImages = async() => {
        Axios.get('http://localhost:5000/app/get_background_images'
        ).then((response) => {
            if (!response.data.error) {
                setImages(response.data);
                let initialSelectedList = [];
                console.log("Image ID: ");
                for (let i = 0; i < response.data.length; i++) {
                    if (i == props.imageID - 1) {
                        initialSelectedList.push("solid");
                    } else {
                        initialSelectedList.push("plain");
                    }
                }
                setSelectedList(initialSelectedList);
                setSelectedIndex(props.imageID - 1);
                console.log("GOT BACKGROUND IMAGES");
                console.log(initialSelectedList);
            } else {
                console.log(response.data.error);
            }
        });
    }

    const updatePlaylist = () => {
        Axios.post('http://localhost:5000/app/update_playlist', {
            playlistID: props.playlist.playlistID,
            name: name,
            imageID: selectedIndex + 1,
            isPrivate: p_private,
        }).then((response) => {
            if (response.data.message) {
                console.log(response.data.message);
                console.log(response);
            } else {
                console.log(response);
                console.log(response.data.error);
            }
        });
    }

    const selectBackground = (index) => {
        let updatedList = [...images];
        for (let i = 0; i < images.length; i++) {
            updatedList[i] = "plain";
        }
        updatedList[index] = "solid";

        setSelectedList(updatedList);
        setSelectedIndex(index);
    }

    const updateSettings = () => {
        updatePlaylist();
        props.close();
        window.location.reload(false);
    }

    return (
        <Modal open={props.open} onClose={props.close}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                size="lg"
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography id="basic-modal-dialog-title" component="h2">
                        Playlist Settings
                    </Typography>
                    <Box sx={{ display: 'flex', mt: "0px", pt: "0px" }}>
                        <FormLabel sx={{ mr: "10px" }}>Private</FormLabel>
                        <Switch checked={p_private}
                            onChange={(e) => setPrivate(e.target.checked)}
                        />
                    </Box>
                </Box>
                <Stack spacing={3}>
                    <div>
                        <FormLabel>Name</FormLabel>
                        <Input autoFocus required placeholder="Playlist Name" defaultValue={props.playlist.name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </div>
                    <FormLabel>Decoration</FormLabel>
                    <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                        <Grid
                          container
                          spacing={0}
                          sx={{ width: '100%' }}
                        >
                            {
                                images.map((image, index) => (
                                    <Grid item xs={4} align="center">
                                        <Button color="primary" variant={selectedList[index]} sx={{ p: 0.5}} onClick={() => selectBackground(index)}>
                                            <Avatar color="primary" sx={{ width: 100, height: 100, borderRadius: 2 }} src={image.link} />
                                        </Button>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
                        <Button color="danger" onClick={props.close}>Cancel</Button>
                        <Button onClick={updateSettings}>Save</Button>
                    </Box>
                </Stack>
            </ModalDialog>
        </Modal>
    );
}
