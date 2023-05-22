const express = require('express');
const mysql = require('mysql');

const app = express();

const cors = require("cors");

const bcrypt = require("bcrypt");
const salt = 10;

const port = 5000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'music-app-db'
});

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Database is not connected" + err);
    }
}
);

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/create_account', (req, res) => {
    const {email, name, password} = req.body;

    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            console.log(err);
        }

        connection.query(
            "INSERT INTO Users (email, name, hashed_password) VALUES (?,?,?)",
            [email, name, hash],
            (err, result) => {
                console.log(err);
                //res.send({return_message: "Email and password combination not found"});
                if(!err) {
                    console.log("CREATED USER");
                    res.send({message: "Successfully created user"});
                }
            }
        )
    });
});

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    connection.query(
        "SELECT userID, hashed_password FROM Users WHERE email = ?",
        email,
        (err, pass_rows) => {
            if (err) {
                res.send({error: err});
            }
            if (pass_rows.length > 0) {
                bcrypt.compare(password, pass_rows[0].hashed_password, (error, response) => {
                    if (response) {
                        res.send({message: "Login successful!", user: pass_rows[0].userID});
                    } else {
                        console.log(error);
                        res.send({message: "Login failed"});
                    }
                });
            } else {
                res.send({message: "User not found"});
            }
        }
    );
})

app.post('/create_playlist', (req, res) => {
    const {name, userID} = req.body;

    connection.query(
        "CALL create_playlist(?,?)",
        [name, userID],
        (err, row) => {
            if (!err) {
                console.log("CREATED PLAYLIST " + name);
            } else {
                console.log("FAILED TO CREATE PLAYLIST " + name);
            }
        }
    );
});

app.post('/edit_profile', (req, res) => {
    const {name, email, userID} = req.body;

    connection.query(
        "UPDATE Users SET name = ?, email = ? WHERE userID = ?",
        [name, email, userID],
        (err, row) => {
            if (!err) {
                console.log("UPDATED USER " + userID);
            } else {
                console.log("FAILED TO UPDATE USER " + userID);
            }
        }
    );
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM Users',
      (err,rows) => {
        if(!err) {
            console.log("HERE ARE THE ROWS");
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err)
        }
    });
});

app.post('/playlist', (req, res) => {
    const {playlistID} = req.body;
    connection.query(
        'SELECT * FROM Playlists WHERE playlistID = ?',
        playlistID,
        (err, row) => {
            if (!err) {
                if (row.length == 1) {
                    console.log("GOT PLAYLIST DATA");
                    res.send(row);
                } else {
                    console.log("COULD NOT FIND UNIQUE PLAYLIST");
                    res.send({error: "Playlist not found"});
                }
            } else {
                console.log("ERROR GETTING PLAYLIST DATA");
                console.log(err);
                res.send({error: "Playlist not found"});
            }
        }
    );
})

app.post('/get_profile_data', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT name, email FROM Users WHERE userID = ?',
        userID,
        (err, row) => {
            if (!err) {
                console.log("FOUND PROFILE DATA");
                res.send(row);
            } else {
                console.log("COULD NOT FIND PROFILE DATA");
                console.log(err);
                res.send({err: "PROFILE ERROR"});
            }
        }
    );
});

app.post('/get_user_playlists', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT * FROM Playlists WHERE playlistID IN (SELECT playlistID FROM creates WHERE userID = ?)',
        userID,
        (err, rows) => {
            if (!err) {
                console.log("FOUND USER PLAYLISTS");
                res.send(rows);
            } else {
                console.log("COULD NOT GET USER PLAYLISTS");
                console.log(err);
                res.send({err: "PROFILE PLAYLIST ERROR"});
            }
        }
    );
});

app.post('/add_to_playlist', (req, res) => {
    const {songID, playlistID} = req.body;
    connection.query(
        'INSERT INTO songPlaylist (songID, playlistID) VALUES (?,?)',
        [songID, playlistID],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY ADDED SONG TO PLAYLIST");
                res.send({message: "Add to playlist"});
            } else {
                console.log("COULD NOT ADD SONG TO PLAYLIST");
                res.send({error: "Error adding to playlist"});
            }
        }
    );
});

app.post('/delete_from_playlist', (req, res) => {
    const {songID, playlistID} = req.body;
    connection.query(
        'DELETE FROM songPlaylist WHERE songID = ? AND playlistID = ?',
        [songID, playlistID],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY DELETED SONG FROM PLAYLIST");
                res.send({message: "Deleted from playlist"});
            } else {
                console.log("COULD NOT DELETE SONG FROM PLAYLIST");
                res.send({error: "Error deleting song from playlist"});
            }
        }
    );
});

app.post('/get_songs_in_playlist', (req, res) => {
    const {playlistID} = req.body;
    connection.query(
        'SELECT * FROM Songs WHERE songID IN (SELECT songID FROM songPlaylist WHERE playlistID = ?)',
        playlistID,
        (err, rows) => {
            if (!err) {
                console.log("FOUND SONGS IN PLAYLIST");
                res.send(rows);
            } else {
                console.log("COULD NOT GET SONGS IN PLAYLIST");
                res.send({error: "Error getting songs in playlist"});
            }
        }
    );
});

app.post('/is_liked', (req, res) => {
    const {userID, songID} = req.body;
    connection.query(
        'SELECT * FROM user_likes WHERE userID = ? AND songID = ?',
        [userID, songID],
        (err, rows) => {
            if (!err) {
                if (rows.length >= 1) {
                    console.log("FOUND LIKES FOR SONG");
                    res.send({message: "Song is liked"});
                } else {
                    console.log("COULD NOT FIND LIKE FOR SONG");
                    res.send({error: "Song is not liked"});
                }
            } else {
                console.log("ERROR FINDING IF SONG IS LIKED");
                res.send({error: "Could not find if song is liked"});
            }
        }
    );
});

app.post('/add_like', (req, res) => {
    const {userID, songID} = req.body;
    connection.query(
        'INSERT INTO user_likes (userID, songID) VALUES (?,?)',
        [userID, songID],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY LIKED SONG");
                res.send({message: "Added song to likes"});
            } else {
                console.log("COULD NOT LIKE SONG");
                res.send({error: "Error liking song"});
            }
        }
    );
});

app.post('/delete_like', (req, res) => {
    const {userID, songID} = req.body;
    connection.query(
        'DELETE FROM user_likes WHERE userID = ? AND songID = ?',
        [userID, songID],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY REMOVED LIKE FROM SONG");
                res.send({message: "Removed song from likes"});
            } else {
                console.log("COULD NOT REMOVE LIKE FROM SONG");
                res.send({error: "Error removing like from song"});
            }
        }
    );
});

app.get('/get_songs', (req, res) => {
    connection.query('SELECT * FROM Songs ORDER BY RAND() LIMIT 10',
        (err, rows) => {
            if (!err) {
                console.log("GOT RANDOM SONGS");
                res.send(rows);
            } else {
                console.log(err);
            }
        }
    );
})

module.exports = connection;

app.listen(port, () => console.log(`Listening on port ${port}`))
