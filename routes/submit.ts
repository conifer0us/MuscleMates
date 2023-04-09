// Defines Separate Express Routes for Updating Information on the Server
// Routes Referenced in this File Must Follow /post in order to be reached from server.js

// Import Necessary Libraries
import { Router, Request, Response } from 'express';
import path from 'path';
const router = Router();
import { Auth } from "../libs/Auth";
import { Friends } from "../libs/Friends";
import { MatchRequests } from '../libs/MatchRequests';
import { ProfileInfo } from '../libs/ProfileInfo';

// Configure Directory for Build Step
__dirname = __dirname + "\\.."

// Configuration Object From Config JSON and Global Constants
const configjson = require(path.join(__dirname, "../config.json"));
const args = process.argv;
const dbfile : string = configjson["dbfile"];

// Defines Global Objects
const prof = new ProfileInfo(dbfile);
const auth = new Auth(dbfile);
const matchreqs = new MatchRequests(dbfile);
const friends = new Friends(dbfile);

// Allow Users to Submit Profile Information
// Should Include Form Data with name, age, bio, gym form data set
router.post("/profile", (req, res) => {
    auth.checkReqCookie(req).then((username) => {
        // If cookie does not resolve to logged in user, status 400 and send response
        if (!username) {
            res.status(400);
            res.send();
        } else {
            // If name, age, bio, or gym not set, status 400 and send response
            if (!req.body.name || !req.body.age || !req.body.bio || !req.body.gym) {
                res.status(400);
                res.send();
            } 

            else {
                const name = req.body.name;
                const age = req.body.age;
                const agenum = parseInt(age);
                const bio = req.body.bio;
                const gym = req.body.gym;

                // If Age is not an int between 0 and 100, status 400 and send response
                if (0 > agenum || agenum > 100) {
                    res.status(400);
                    res.send();
                }

                // Otherwise, set profile information in the database
                else {
                    prof.insertProfile(username, name, age, bio, gym)
                } 
            }
        }
    });
});

// Endpoint that Allows Users to Accept Friend Requets from Other Users
// No Data Must Be Supplied, but User Must have a Valid Cookie
// A Request Must have been Sent from the given username to the user making the request
router.post("/acceptreq/:username",(req, res) => {
    auth.checkReqCookie(req).then((uname) => {
        const receiver = uname;
        const sender = req.params["username"];
        
        // If ther User is not Logged In or there is no Sender Set, Return 400 and Exit
        if (!receiver || !sender) {
            res.status(400);
            res.send();
        } else {
            matchreqs.matchExists(sender, receiver).then((matchexists) => {
                if (matchexists) {
                    matchreqs.deleteRequest(sender, receiver);
                    friends.addFriends(sender, receiver);
                    res.status(200);
                    res.send(); 
                }
                else {
                    res.status(400);
                    res.send();
                }
            });
        }
    });
});

// Endpoint that Allows Users to Cancel Friend Requests Made to Other Users
// No Data Must Be Supplied, but User Must have a Valid Cookie
// A Request Must have been Sent from the user making the request to the given username
router.post("/cancelreq/:username",(req, res) => {
    auth.checkReqCookie(req).then((uname) => {
        const sender = uname;
        const receiver = req.params["username"];
        
        // If ther User is not Logged In or there is no Sender Set, Return 400 and Exit
        if (!receiver || !sender) {
            res.status(400);
            res.send();
        } else {
            matchreqs.matchExists(sender, receiver).then((matchexists) => {
                if (matchexists) {
                    matchreqs.deleteRequest(sender, receiver);
                    res.status(200);
                    res.send(); 
                }
                else {
                    res.status(400);
                    res.send();
                }
            });
        }
    });
});

router.post("/sendreq/:username", (req,res) => {
    auth.checkReqCookie(req).then((uname) => {
        const sender = uname;
        const receiver = req.params["username"];

        // If the User is Not Logged In or there is no Reciever Set, Return 400 and exit
        if (!receiver || !sender) {
            res.status(400);
            res.send();
        } else {
            // Checks if Request has already been Sent One Way
            matchreqs.matchExists(sender, receiver).then((matchexists) => {
                if (!matchexists) {    
                    
                    // Checks if Match has been Inserted Other Way
                    matchreqs.matchExists(receiver, sender).then((othermatchexists) => {
                        if (!othermatchexists) {

                            // Checks if Users are Already Friends
                            friends.areFriends(sender, receiver).then((arefriends) => {
                                // If Users Aren't Friends and No Requests Have been Sent Previously, Submit Request and send 200
                                if (!arefriends) {
                                    matchreqs.submitRequest(sender, receiver);
                                    res.status(200);
                                    res.send();
                                }
                                else {
                                    res.status(400);
                                    res.send();
                                }
                            })
                        } else {
                            res.status(400);
                            res.send();
                        }
                    });
                } else {
                    res.status(400);
                    res.send();
                }
            })
        } 
    });
});

module.exports = router;