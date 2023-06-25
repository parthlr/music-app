import * as React from 'react';
import {useEffect, useState} from 'react';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

export default function UserCard(props) {

    return (
        <Card variant="plain" color="neutral">
            <Stack spacing={2} align="center">
                <Avatar color={props.user.profile_color} variant="solid" sx={{ width: props.size + "px", height: props.size + "px" }}/>
                <div>
                    <Link
                        overlay
                        underline="none"
                        href={"/user/" + props.user.username}
                        sx={{ color: 'text.primary' }}
                    >
                        <Typography sx={{ fontSize: props.fontSize }}level="h1">{props.user.name}</Typography>
                    </Link>
                    <Typography sx={{ fontSize: props.fontSize }}level="body3">{props.user.username}</Typography>
                </div>
            </Stack>
        </Card>
    )

}
