import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import axios from "axios";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import ProfilePage from "./pages/ProfilePage";
import PlaylistPage from "./pages/PlaylistPage";
import LikedSongsPage from "./pages/LikedSongsPage";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID,
} from '@mui/material/styles';
import colors from '@mui/joy/colors';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';

import { useColorScheme as useJoyColorScheme } from '@mui/joy/styles';
import { useColorScheme as useMaterialColorScheme } from '@mui/material/styles';

const materialTheme = materialExtendTheme();

function User(props) {
    return (
        <div>
            <p>{props.user.userID}</p>
            <p>{props.user.name}</p>
            <p>{props.user.email}</p>
        </div>
    )
};

/*export default function UserPage() {
    useEffect(() => {
        getUsers();
    },[]);

    const [users, setUsers] = useState([]);

    const getUsers = async() => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
            console.log(response);
        } catch (err) {
            console.log("ERROR fetching data");
            console.log(err);
        }
    }

    return (
        <div className="user-page">
            {
            users.map((user) => (
                <User user={user} />
            ))
            }
        </div>
    )
}*/

const DarkMode = () => {
  const { mode, setMode } = useMaterialColorScheme();
  const { setMode: setJoyMode } = useJoyColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    setMode("dark");
    setJoyMode("dark");
  }, []);
  if (!mounted) {
    return null;
  }
  return null;
};

function Base() {
    return (
        <BrowserRouter>
            <div>
                <MaterialCssVarsProvider defaultMode="dark" theme={{ [THEME_ID]: materialTheme }}>
                    <JoyCssVarsProvider defaultMode="dark">
                        <CssBaseline enableColorScheme />
                        <DarkMode />
                        <NavBar />
                        <Routes>
                            <Route exact path='/' element={<HomePage />} />
                            <Route exact path='/search' element={<SearchPage />} />
                            <Route exact path='/login' element={<LoginPage />} />
                            <Route exact path='/register' element={<CreateAccountPage />} />
                            <Route exact path='/profile' element={
                                <AuthRoute redirectTo="/login"><ProfilePage /></AuthRoute>
                            } />
                            <Route exact path='/liked-songs' element={
                                <AuthRoute redirectTo="/login"><LikedSongsPage /></AuthRoute>
                            } />
                            <Route exact path='/playlist/:id' element={<PlaylistPage />} />
                        </Routes>
                    </JoyCssVarsProvider>
                </MaterialCssVarsProvider>
            </div>
        </BrowserRouter>
    );
}


class App extends React.Component {
    render() {


        return (
            <div className="app">
                <Base />
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
