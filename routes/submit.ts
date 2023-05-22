// Defines Separate Express Routes for Updating Information on the Server
// Routes Referenced in this File Must Follow /post in order to be reached from server.js

// Import Necessary Libraries
import { Router, Express } from 'express';
import { Auth } from "../libs/Auth";
import { FriendsInfo } from "../libs/Friends";
import { MatchRequests } from '../libs/MatchRequests';
import { ProfileInfo } from '../libs/ProfileInfo';
import { MessageInfo } from '../libs/Messages';
import { Preferences } from '../libs/PreferenceInfo';

export class SubmitRoutes {
    static configureRouter(server : Express, resname : string, auth : Auth, prof : ProfileInfo, matchreqs : MatchRequests, 
        friends : FriendsInfo, messages: MessageInfo, preferences : Preferences, formdecoder) {
        let router = Router(); 
        
        // Allow Users to Submit a Message to Another User
        // Should Include Form Data with user, message set
        router.post("/message/:user", formdecoder, async (req, res) => {
            const user = req.params['user'];
            auth.checkReqCookie(req).then(async (username) => {
                // Checks if Cookie is Invalid, No User or Message Set, or Users are Not Friends
                if (!username || !req.body || !user || !req.body.message || !(await friends.areFriends(username, req.body.user))) {
                    res.status(400);
                    res.send();
                    return;
                }

                messages.insertMessage(username, user, req.body.message);
                res.status(200);
                res.send();
                return;
            })
        });

        // Allow Users to Submit Profile Information
        // Should Include Form Data with name, age, bio, gym form data set
        router.post("/profile", (req, res) => {
            auth.checkReqCookie(req).then((username) => {
                // If name, age, bio, or gym not set, status 400 and send response
                if (!username || !req.body || !req.body.name || !req.body.age || !req.body.bio || !req.body.gym) {
                    res.status(400);
                    res.send();
                    return;
                }

                const name = req.body.name;
                const age = req.body.age;
                const agenum = parseInt(age);
                const bio = req.body.bio;
                const gym = req.body.gym;

                // If Age is not an int between 0 and 100, status 400 and send response
                if (0 > agenum || agenum > 100) {
                    res.status(400);
                    res.send();
                    return;
                }

                // Otherwise, set profile information in the database
                prof.insertProfile(username, name, age, bio, gym)
            });
        });

        // Allow Users to Submit Preferences Information
        // Should Include Form Data with 'schedule' set to a string of 7 0s and 1s
        // Should Include Form Data with 'workout' data set to a string of 0s and 1s for all workout types
        // Should Include Form Data with 'filterByGym' and 'filterByGender' (string with 0 or 1)
        router.post("/preferences", (req, res) => {
            auth.checkReqCookie(req).then((username) => {
                // If name, age, bio, or gym not set, status 400 and send response
                if (!username || !req.body || !req.body.schedule || !req.body.workout || !req.body.filterByGym || !req.body.filterByGender) {
                    res.status(400);
                    res.send();
                    return;
                }

                const tfregex = /^[01]{1}$/;

                // Checks for Properly Formatted Preference Data
                if (!/^[01]{7}$/.test(req.body.schedule) || !/^[01]*$/.test(req.body.workout) || !tfregex.test(req.body.filterByGender) || !tfregex.test(req.body.filterByGym)) {
                    res.status(400);
                    res.send();
                    return;
                }

                preferences.insertPreferences(username, req.body.schedule, req.body.workout, req.body.filterByGender == '1', req.body.filterByGender == '1');
            });
        });        

        // Endpoint that Allows Users to Accept Friend Requets from Other Users
        // No Data Must Be Supplied, but User Must have a Valid Cookie
        // A Request Must have been Sent from the given username to the user making the request
        router.post("/acceptreq/:username", async (req, res) => {
            auth.checkReqCookie(req).then(async (uname) => {
                const receiver = uname;
                const sender = req.params["username"];

                // If ther User is not Logged In or there is no Sender Set, Return 400 and Exit
                if (!receiver || !sender) {
                    res.status(400);
                    res.send();
                    return;
                } 

                matchreqs.matchExists(sender, receiver).then(async (matchexists) => {
                    if (matchexists) {
                        await matchreqs.deleteRequest(sender, receiver);
                        friends.addFriends(sender, receiver);
                        res.status(200);
                        res.send();
                    }
                    else {
                        res.status(400);
                        res.send();
                    }
                });
            });
        });

        // Endpoint that Allows Users to Cancel Friend Requests Made to Other Users
        // No Data Must Be Supplied, but User Must have a Valid Cookie
        // A Request Must have been Sent from the user making the request to the given username
        router.post("/cancelreq/:username", (req, res) => {
            auth.checkReqCookie(req).then((uname) => {
                const sender = uname;
                const receiver = req.params["username"];

                // If ther User is not Logged In or there is no Sender Set, Return 400 and Exit
                if (!receiver || !sender) {
                    res.status(400);
                    res.send();
                    return;
                } 
                    
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
            });
        });

        // Sends a friend request from one user to another if they are not already friends and neither has received a request from the other already
        router.post("/sendreq/:username", (req, res) => {
            auth.checkReqCookie(req).then((uname) => {
                const sender = uname;
                const receiver = req.params["username"];

                // If the User is Not Logged In or there is no Reciever Set, Return 400 and exit
                if (!receiver || !sender) {
                    res.status(400);
                    res.send();
                } else {
                    // Checks if Request has already been Sent between Two Users
                    matchreqs.matchExists(sender, receiver).then(async (illegalreq) : Promise<boolean> => {
                        return illegalreq ? true : (await friends.areFriends(sender, receiver)); 
                    }).then((illegalreq) => {
                        if (illegalreq) {
                            res.status(400);
                            res.send();
                        } else {
                            matchreqs.submitRequest(sender, receiver);
                            res.status(200);
                            res.send();
                        }
                    });
                }
            });
        });

        server.use(resname, router);
    }
}