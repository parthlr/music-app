import React from 'react'
import * as Auth from '../services/Auth'
import { Navigate, Route } from 'react-router-dom'

export default function AuthRoute({ children, redirectTo, auth }) {

    // Add your own authentication on the below line.
    const isLoggedIn = Auth.isLoggedIn();

    return (
        (isLoggedIn == auth) ? children : <Navigate to={redirectTo} />
    );
}
