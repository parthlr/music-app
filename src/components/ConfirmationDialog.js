import * as React from 'react';
import { useState } from 'react';
import Axios from "axios";
import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

export default function ConfirmationDialog(props) {

    return (
        <Modal open={props.open} onClose={props.close}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
            >
                <Typography id="alert-dialog-modal-title" component="h2" startDecorator={<WarningRoundedIcon />} sx={{ pb: 2 }}>
                    Confirmation
                </Typography>
                <Divider />
                <Typography id="alert-dialog-modal-description" textColor="text.tertiary" sx={{ pt: 2 }}>
                    {props.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2}}>
                    <Button variant="plain" color="neutral" onClick={props.close}>Cancel</Button>
                    <Button color="danger" onClick={props.confirm}>Confirm</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
