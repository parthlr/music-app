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
            "CALL create_account(?,?,?)",
            [email, name, hash],
            (err, result) => {
                console.log(err);
                //res.send({return_message: "Email and password combination not found"});
                if(!err) {
                    console.log("CREATED USER " + result[0][0].userID);
                    res.send({ user: result[0][0].userID, message: "Successfully created user"});
                } else {
                    console.log("UNABLE TO CREATE USER");
                    res.send({ error: "Error: Unable to create account" });
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
                console.log(err);
            }
        }
    );
});

app.post('/delete_playlist', (req, res) => {
    const {playlistID} = req.body;
    connection.query(
        'CALL delete_playlist(?)',
        playlistID,
        (err, row) => {
            if (!err) {
                console.log("SUCCESSFULLY DELETED PLAYLIST " + playlistID);
                res.send({ message: "Successfully deleted playlist"});
            } else {
                console.log("FAILED TO DELETE PLAYLIST " + playlistID);
                res.send({ error: "Failed to deleted playlist" });
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

app.post('/get_user_liked_playlists', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT * FROM Playlists WHERE playlistID IN (SELECT playlistID FROM creates WHERE userID != ? AND playlistID IN (SELECT playlistID FROM playlist_likes WHERE userID = ?))',
        [userID, userID],
        (err, rows) => {
            if (!err) {
                console.log("FOUND ALL USER PLAYLISTS (INCLUDING LIKED)");
                res.send(rows);
            } else {
                console.log("COULD NOT FIND ALL USER PLAYLISTS");
                console.log(err);
                res.send({ error: "Failed to get liked and user playlists"});
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

app.post('/get_playlist_creator', (req, res) => {
    const {playlistID} = req.body;
    connection.query(
        'SELECT * FROM Users WHERE userID IN (SELECT userID FROM creates WHERE playlistID = ?)',
        playlistID,
        (err, rows) => {
            if (!err) {
                console.log("FOUND USER CREATOR OF PLAYLIST");
                res.send(rows);
            } else {
                console.log("COULD NOT GET PLAYLIST CREATOR");
                res.send({ error: "Error getting playlist creator"});
            }
        }
    );
});

app.post('/get_playlist_image', (req, res) => {
    const {playlistID} = req.body;
    connection.query(
        'SELECT * FROM background_images WHERE id IN (SELECT backgroundImageID FROM Playlists WHERE playlistID = ?)',
        playlistID,
        (err, rows) => {
            if (!err) {
                console.log("GOT PLAYLIST IMAGE");
                res.send(rows);
            } else {
                console.log("COULD NOT GET PLAYLIST IMAGE");
                res.send({ error: "Error getting playlist image" });
            }
        }
    );
});

app.post('/update_playlist', (req, res) => {
    const {playlistID, name, imageID, isPrivate} = req.body;
    connection.query(
        'UPDATE Playlists SET name = ?, backgroundImageID = ?, private = ? WHERE playlistID = ?',
        [name, imageID, isPrivate, playlistID],
        (err, rows) => {
            if (!err) {
                console.log("SUCCESSFULLY UPDATED PLAYLIST");
                res.send({ message: "Successfully updated playlist" })
            } else {
                console.log("ERROR UPDATING PLAYLIST");
                res.send({ error: "Error updating playlist" });
            }
        }
    );
})

app.post('/is_playlist_liked', (req, res) => {
    const {userID, playlistID} = req.body;
    connection.query(
        'SELECT * FROM playlist_likes WHERE userID = ? AND playlistID = ?',
        [userID, playlistID],
        (err, rows) => {
            if (!err) {
                if (rows.length >= 1) {
                    console.log("FOUND LIKES FOR PLAYLIST");
                    res.send({message: "Playlist is liked"});
                } else {
                    console.log("COULD NOT FIND LIKE FOR PLAYLIST");
                    res.send({error: "Playlist is not liked"});
                }
            } else {
                console.log("ERROR FINDING IF PLAYLIST IS LIKED");
                res.send({error: "Could not find if playlist is liked"});
            }
        }
    );
});

app.post('/add_playlist_like', (req, res) => {
    const {userID, playlistID} = req.body;
    connection.query(
        'INSERT INTO playlist_likes (userID, playlistID) VALUES (?,?)',
        [userID, playlistID],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY LIKED PLAYLIST");
                res.send({message: "Added playlist to likes"});
            } else {
                console.log("COULD NOT LIKE PLAYLIST");
                res.send({error: "Error liking playlist"});
            }
        }
    );
});

app.post('/delete_playlist_like', (req, res) => {
    const {userID, playlistID} = req.body;
    connection.query(
        'DELETE FROM playlist_likes WHERE userID = ? AND playlistID = ?',
        [userID, playlistID],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY REMOVED LIKE FROM PLAYLIST");
                res.send({message: "Removed playlist from likes"});
            } else {
                console.log("COULD NOT REMOVE LIKE FROM PLAYLIST");
                res.send({error: "Error removing like from playlist"});
            }
        }
    );
});

app.post('/is_song_liked', (req, res) => {
    const {userID, songID} = req.body;
    connection.query(
        'SELECT * FROM song_likes WHERE userID = ? AND songID = ?',
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

app.post('/add_song_like', (req, res) => {
    const {userID, songID} = req.body;
    connection.query(
        'INSERT INTO song_likes (userID, songID) VALUES (?,?)',
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

app.post('/delete_song_like', (req, res) => {
    const {userID, songID} = req.body;
    connection.query(
        'DELETE FROM song_likes WHERE userID = ? AND songID = ?',
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

app.post('/get_liked_songs', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT * FROM Songs WHERE songID IN (SELECT songID FROM song_likes WHERE userID = ?)',
        userID,
        (err, rows) => {
            if (!err) {
                console.log("SUCCESSFULLY GOT LIKED SONGS");
                res.send(rows);
            } else {
                console.log("FAILED TO GET LIKED SONGS");
                console.log(err);
                res.send({error: "Error getting liked songs"});
            }
        }
    )
});

app.get('/get_background_images', (req, res) => {
    connection.query(
        'SELECT * FROM background_images',
        (err, rows) => {
            if (!err) {
                console.log("GOT ALL BACKGROUND IMAGES");
                res.send(rows);
            } else {
                console.log("FAILED TO GET BACKGROUND IMAGES");
                res.send({ error: "Failed to fetch background images" });
            }
        }
    )
});

app.post('/get_home_page_playlists', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT * FROM Playlists WHERE playlistID IN (SELECT playlistID FROM creates WHERE userID = ?) ORDER BY RAND() LIMIT 4',
        (err, rows) => {
            if (!err) {
                console.log("GOT HOME PAGE PLAYLISTS");
                res.send(rows);
            } else {
                console.log("FAILED TO GET HOME PAGE PLAYLISTS");
                res.send({ error: "Failed to get home page playlists" });
            }
        }
    );
});

app.post('/get_recommended_playlists', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT * FROM Playlists WHERE playlistID NOT IN (SELECT playlistID FROM creates WHERE userID = ?) AND playlistID NOT IN (SELECT playlistID FROM playlist_likes WHERE userID = ?) ORDER BY RAND() LIMIT 2',
        [userID, userID],
        (err, rows) => {
            if (!err) {
                console.log("FOUND HOME PAGE RECOMMENDED PLAYLISTS");
                res.send(rows);
            } else {
                console.log("COULD NOT FIND HOME PAGE RECOMMENDED PLAYLISTS");
                console.log(err);
                res.send({ error: "Failed to get home page recommended playlists"});
            }
        }
    );
});

app.post('/get_home_page_liked_playlists', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT * FROM Playlists WHERE playlistID IN (SELECT playlistID FROM creates WHERE userID != ? AND playlistID IN (SELECT playlistID FROM playlist_likes WHERE userID = ?)) ORDER BY RAND() LIMIT 4',
        [userID, userID],
        (err, rows) => {
            if (!err) {
                console.log("FOUND HOME PAGE LIKED PLAYLISTS");
                res.send(rows);
            } else {
                console.log("COULD NOT FIND HOME PAGE PLAYLISTS");
                console.log(err);
                res.send({ error: "Failed to get liked home page playlists"});
            }
        }
    );
});

app.get('/get_songs', (req, res) => {
    connection.query('SELECT * FROM Songs ORDER BY RAND() LIMIT 5',
        (err, rows) => {
            if (!err) {
                console.log("GOT RANDOM SONGS");
                res.send(rows);
            } else {
                console.log("FAILED TO GET RANDOM SONGS");
                res.send({ error: "Failed to get random songs" });
            }
        }
    );
});

app.post('/search_playlists', (req, res) => {
    const {search} = req.body;
    connection.query(
        "SELECT * FROM Playlists WHERE INSTR(name, ?) > 0 LIMIT 20",
        search,
        (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    console.log("FOUND PLAYLISTS WITH SIMILAR NAME TO SEARCH");
                    res.send(rows);
                } else {
                    console.log("NO PLAYLISTS FOUND WITH SIMILAR NAME TO SEARCH");
                    res.send({ message: "No playlists found with search term" });
                }
            } else {
                console.log("FAILED TO SEARCH FOR PLAYLISTS");
                res.send({ error: "Error while searching for playlists" });
            }
        }
    );
});

app.post('/search_songs', (req, res) => {
    const {search} = req.body;
    connection.query(
        "SELECT * FROM Songs WHERE INSTR(title, ?) > 0 OR INSTR(artist, ?) > 0 LIMIT 100",
        [search, search],
        (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    console.log("FOUND SONGS WITH SIMILAR NAME TO SEARCH");
                    res.send(rows);
                } else {
                    console.log("NO SONGS FOUND WITH SIMILAR NAME TO SEARCH");
                    res.send({ message: "No songs found with search term" });
                }
            } else {
                console.log("FAILED TO SEARCH FOR SONGS");
                res.send({ error: "Error while searching for songs" });
            }
        }
    );
});

module.exports = connection;

app.listen(port, () => console.log(`Listening on port ${port}`))
