import * as React from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';

export default function LikeButton(props) {
    if (props.isLiked) {
        return (<FavoriteIcon fontSize={props.fontSize} sx={{ color: pink[500] }}/>);
    }
    return (<FavoriteBorderIcon fontSize={props.fontSize}/>);
}
