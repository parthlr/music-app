import * as React from 'react';
import { useState } from 'react';
import Axios from "axios";
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';

export default function ShareDialog(props) {

    const copyLink = () => {
        navigator.clipboard.writeText(props.link);
    }

    return (
        <Modal open={props.open} onClose={props.close}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                sx={{ minWidth: 360 }}
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    {props.title}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                    <Input autoFocus readOnly fullWidth color="neutral" value={props.link} onFocus={(e) => e.target.select()}
                        endDecorator={<Button onClick={copyLink}>Copy</Button>}
                    />
                </Box>
            </ModalDialog>
        </Modal>
    );
}
