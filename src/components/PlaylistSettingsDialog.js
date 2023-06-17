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

    useEffect(() => {
        getBackgroundImages();
    },[]);

    const [name, setName] = useState("");

    const [p_private, setPrivate] = useState(false);

    const [images, setImages] = useState([]);

    const [selectedList, setSelectedList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const getBackgroundImages = async() => {
        Axios.get('http://localhost:5000/get_background_images')
        .then((response) => {
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
                console.log("GOT BACKGROUND IMAGES");
                console.log(initialSelectedList);
            } else {
                console.log(response.data.error);
            }
        });
    }

    const updatePlaylistBackgroundImage = () => {
        Axios.post('http://localhost:5000/update_playlist_image', {
            playlistID: props.id,
            imageID: selectedIndex + 1,
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
        updatePlaylistBackgroundImage();
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

                    <Button onClick={updateSettings}>Save</Button>
                </Stack>
            </ModalDialog>
        </Modal>
    );
}
