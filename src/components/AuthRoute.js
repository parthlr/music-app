import React from 'react'
import * as Auth from '../services/Auth'
import { Redirect, Route } from 'react-router-dom'

export default function AuthRoute({ component: Component, ...rest }) {

    // Add your own authentication on the below line.
    const isLoggedIn = Auth.isLoggedIn();

    return (
        <Route
            {...rest}
            render={(props) => isLoggedIn === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
        />
    );
}
