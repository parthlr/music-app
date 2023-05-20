import React from 'react'
import * as Auth from '../services/Auth'
import { Navigate, Route } from 'react-router-dom'

export default function AuthRoute({ children, redirectTo }) {

    // Add your own authentication on the below line.
    const isLoggedIn = Auth.isLoggedIn();

    return (
        isLoggedIn ? children : <Navigate to={redirectTo} />
    );
}
