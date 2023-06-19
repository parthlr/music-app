import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


export default function LoadingOverlay(props) {

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter:"blur(5px)", width: `calc(100% - 240px)`, ml: "240px", mt: "65px" }}
            open={props.open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
