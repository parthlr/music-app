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
    const {username, email, name, password} = req.body;

    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            console.log(err);
        }

        connection.query(
            "CALL create_account(?,?,?,?)",
            [username, email, name, hash],
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

app.post('/check_account_exists', (req, res) => {
    const {username, email} = req.body;
    connection.query(
        'SELECT userID FROM Users WHERE username = ? OR email = ?',
        [username, email],
        (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    console.log("ACCOUNT ALREADY EXISTS");
                    res.send({ exists: 1 });
                } else {
                    console.log("ACCOUNT DOES NOT EXIST");
                    res.send({ exists: 0 });
                }
            } else {
                console.log("ERROR CHECKING IF ACCOUNT EXISTS");
                res.send({ error: "Error creating account" });
            }
        }
    );
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    connection.query(
        "SELECT userID, hashed_password FROM Users WHERE username = ?",
        username,
        (err, pass_rows) => {
            if (err) {
                console.log("-----------ERROR LOGGING IN-----------");
                res.send({error: err});
            }
            if (pass_rows.length > 0) {
                bcrypt.compare(password, pass_rows[0].hashed_password, (error, response) => {
                    if (response) {
                        console.log("-----------LOGIN SUCCESS-----------");
                        res.send({message: "Login successful!", user: pass_rows[0].userID});
                    } else {
                        console.log(error);
                        console.log("-----------LOGIN FAILED-----------");
                        res.send({message: "Login failed"});
                    }
                });
            } else {
                console.log("-----------USER DOESN'T EXIST-----------");
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
    const {name, email, about, profile_color, userID} = req.body;

    connection.query(
        "UPDATE Users SET name = ?, email = ?, about = ?, profile_color = ? WHERE userID = ?",
        [name, email, about, profile_color, userID],
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
    const {userID, username} = req.body;
    connection.query(
        'SELECT userID, username, name, email, about, profile_color FROM Users WHERE userID = ? OR username = ?',
        [userID, username],
        (err, row) => {
            if (!err) {
                if (row.length > 0) {
                    console.log("FOUND PROFILE DATA");
                    res.send(row);
                } else {
                    console.log("NO ACCOUNTS FOUND WITH THAT USERNAME");
                    res.send({error: "Failed to find account with username"});
                }
            } else {
                console.log("COULD NOT FIND PROFILE DATA");
                console.log(err);
                res.send({error: "PROFILE ERROR"});
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

app.post('/get_home_page_people', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT * FROM Users WHERE userID != ? ORDER BY RAND() LIMIT 3',
        userID,
        (err, rows) => {
            if (!err) {
                console.log("GOT RANDOM USERS");
                res.send(rows);
            } else {
                console.log("FAILED TO GET RANDOM USERS");
                res.send({ error: "Error getting random people" });
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
        "SELECT * FROM Songs WHERE INSTR(title, ?) > 0 OR INSTR(artist, ?) > 0 LIMIT 30",
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

app.post('/search_users', (req, res) => {
    const {search} = req.body;
    connection.query(
        "SELECT * FROM Users WHERE INSTR(username, ?) > 0 OR INSTR(name, ?) > 0 OR INSTR(email, ?) > 0 LIMIT 30",
        [search, search, search],
        (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    console.log("FOUND USERS WITH SIMILAR NAME TO SEARCH");
                    res.send(rows);
                } else {
                    console.log("NO USERS FOUND WITH SIMILAR NAME TO SEARCH");
                    res.send({ message: "No users found with search term" });
                }
            } else {
                console.log("FAILED TO SEARCH FOR USERS");
                res.send({ error: "Error while searching for users" });
            }
        }
    );
});

app.post('/is_friends', (req, res) => {
    const {userID_1, userID_2} = req.body;
    connection.query(
        'SELECT * FROM friends WHERE userID_1 = ? AND userID_2 = ?',
        [userID_1, userID_2],
        (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    console.log("USER IS FRIENDS WITH THIS PERSON");
                    res.send({ friends: true });
                } else {
                    console.log("USER IS NOT FRIENDS WITH THIS PERSON");
                    res.send({ friends: false });
                }
            } else {
                console.log("FAILED TO DETERMINE IF USERS ARE FRIENDS");
                res.send({ error: "Error getting if users are friends" });
            }
        }
    )
});

app.post('/is_friendship_pending', (req, res) => {
    const {to_userID, from_userID} = req.body;
    connection.query(
        'SELECT * FROM friend_requests WHERE to_userID = ? AND from_userID = ?',
        [to_userID, from_userID],
        (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    console.log("FRIENDSHIP IS PENDING");
                    res.send({ pending_friendship: true });
                } else {
                    console.log("FRIENDSHIP IS NOT PENDING");
                    res.send({ pending_friendship: false });
                }
            } else {
                console.log("FAILED TO GET IF FRIENDSHIP IS PENDING OR NOT");
                res.send({ error: "Error getting if friendship is pending" });
            }
        }
    );
});

app.post('/get_friends', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT userID, username, name, email, about, profile_color FROM Users WHERE userID IN (SELECT userID_2 FROM friends WHERE userID_1 = ?) LIMIT 5',
        userID,
        (err, rows) => {
            if (!err) {
                console.log("FOUND ALL USERS FRIENDS");
                res.send(rows);
            } else {
                console.log("COULD NOT GET FRIENDS");
                res.send({ error: "Error getting friends" });
            }
        }
    )
});

app.post('/send_friend_request', (req, res) => {
    const {to_userID, from_userID} = req.body;
    connection.query(
        'INSERT INTO friend_requests (to_userID , from_userID) VALUES (?,?)',
        [to_userID, from_userID],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY SENT FRIEND REQUEST");
                res.send({message: "Sent friend request"});
            } else {
                console.log("FAILED TO SEND FRIEND REQUEST");
                res.send({error: "Error sending friend request"});
            }
        }
    );
});

app.post('/cancel_friend_request', (req, res) => {
    const {to_userID, from_userID} = req.body;
    connection.query(
        'DELETE FROM friend_requests WHERE to_userID = ? AND from_userID = ?',
        [to_userID, from_userID],
        (err, result) => {
            if (!err) {
                console.log("FRIEND REQUEST DELETED");
            } else {
                console.log("FAILED TO DELETE FRIEND REQUEST");
                res.send({ error: "Error cancelling friend request" });
            }
        }
    )
});

app.post('/get_num_friend_requests', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT COUNT(to_userID) AS count FROM friend_requests WHERE to_userID = ?',
        userID,
        (err, row) => {
            if (!err) {
                console.log("GOT NUMBER OF FRIEND REQUESTS FOR USER");
                res.send(row);
            } else {
                console.log("FAILED TO GET NUMBER OF FRIEND REQUESTS FOR USER");
                res.send({ error: "Error getting number of user friend requests" });
            }
        }
    );
});

app.post('/get_friend_requests', (req, res) => {
    const {userID} = req.body;
    connection.query(
        'SELECT userID, username, name, email, about, profile_color FROM Users WHERE userID IN (SELECT from_userID FROM friend_requests WHERE to_userID = ?)',
        userID,
        (err, rows) => {
            if (!err) {
                console.log("GOT ALL FRIEND REQUESTS");
                res.send(rows);
            } else {
                console.log("FAILED TO GET FRIEND REQUESTS");
                res.send({ error: "Error getting friend requests" });
            }
        }
    );
});

app.post('/accept_friend_request', (req, res) => {
    const {to_userID, from_userID} = req.body;
    connection.query(
        'CALL accept_friend_request(?,?)',
        [to_userID, from_userID],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY ACCEPTED FRIEND REQUEST");
            } else {
                console.log("FAILED TO ACCEPT FRIEND REQUEST");
                res.send({ error: "Error accepting friend request" });
            }
        }
    );
});

app.post('/reject_friend_request', (req, res) => {
    const {to_userID, from_userID} = req.body;
    connection.query(
        'DELETE FROM friend_requests WHERE to_userID = ? AND from_userID = ?',
        [to_userID, from_userID],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY REJECTED FRIEND REQUEST");
            } else {
                console.log("FAILED TO REJECT FRIEND REQUEST");
                res.send({ error: "Error rejecting friend request" });
            }
        }
    )
});

app.post('/remove_friend', (req, res) => {
    const {userID_1, userID_2} = req.body;
    connection.query(
        'CALL remove_friend(?,?)',
        [userID_1, userID_2],
        (err, result) => {
            if (!err) {
                console.log("SUCCESSFULLY REMOVED FRIEND");
                res.send({ message: "Removed friend" });
            } else {
                console.log("FAILED TO REMOVE FRIEND");
                res.send({ error: "Error removing friend" });
            }
        }
    );
});

module.exports = connection;

app.listen(port, () => console.log(`Listening on port ${port}`))
