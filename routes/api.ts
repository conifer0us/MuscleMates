// Defines Separate Express Routes for Sending API Information (In JSON Format)
// Routes Referenced in this File Must Follow /api in order to be reached from server.js

// Import Necessary Libraries
import { Router, Express } from 'express';
import { Auth } from "../libs/Auth";
import { FriendsInfo } from "../libs/Friends";
import { MatchRequests } from '../libs/MatchRequests';
import { ProfileInfo } from '../libs/ProfileInfo';
import { MessageInfo } from '../libs/Messages';
import { Messages } from '@prisma/client';

export class APIRoutes {
    static configureRouter(server: Express, resname: string, auth: Auth, prof: ProfileInfo, 
        matchrequests: MatchRequests, friends: FriendsInfo, messages: MessageInfo, formdecoder) {
        let router = Router();
        // Sends Basic API Welcome Message with 200 Status Code For Simple /api request
        router.get("/", (req, res) => {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.json({ "msg": "Welcome to the Public API!" });
        });

        // Sends A Set of Messages Between Two Users With a Specified Length From a Start Index
        // Authenticated Endpoint: User must be logged in and friends with the other specified user
        // Returns JSON Data in the Following Format:
        /*{
            "messages": [ 
                1: {
                    "sender" : uname,
                    "receiver": uname,
                    "timesent": timestring,
                    "data": messagedata
                }
                2: ...
            ]
          } */
        // Expects form elements: num, startindex (-1 to start at the end)
        router.get("/message/:username/*", async (req, res) => {
            const otheruser = req.params["username"];
            auth.checkReqCookie(req).then(async (user) => {
                if (!user || !req.query || !req.query.num || !req.query.startindex || !otheruser || !(await friends.areFriends(user, otheruser))) {
                    res.status(400).json(null);
                    return;   
                }
                try {
                    let returnmessages = {};
                    let messageset = await messages.getMessages(user, otheruser, parseInt(<string>req.query.num), parseInt(<string>req.query.startindex));
                    messageset.forEach((message : Messages) => {
                        returnmessages[message.conversationid] = {
                            "sender": message.senderName, 
                            "receiver": message.receiverName,
                            "date": message.timesent.toUTCString(), 
                            "data": message.data,
                        };
                    });

                    res.status(200).json(returnmessages);
                    return; 
                } catch(e) {
                    res.status(400).json(null);
                }
            });
        });

        // Returns Profile Information In JSON Format for a Supplied Username
        // Returns Blank Response with 404 Status Code if User Not Found
        // Returns JSON Data In Following Format (As it is Returned by Profile Library):
        // {
        // "name" : name,
        // "age" : age,
        // "bio" : bio,
        // "gym" : gym
        //}
        router.get("/profile/:username", (req, res) => {
            // Gets Username From Request Parameters
            const uname = req.params["username"];

            // Gets Profile Information Dictionary From Profile Library for Supplied Username
            prof.getProfInfo(uname).then((profinfo) => {
                // If Dictionary has elements, set status to 200 and send profile info as JSON
                if (Object.keys(profinfo).length) {
                    res.status(200);
                    res.json(profinfo);
                }

                // Otherwise, Send Empty Response with Status 404
                else {
                    res.status(404);
                    res.send();
                }
            });
        });

        // Returns JSON Data with a List of the Current User's Friends
        // THIS IS AN AUTHENTICATED ENDPOINT; VALID COOKIE MUST BE SET
        // If Valid Cookie is not set, 400 status and send
        // If Valid Cookie is set, send JSON data with friend list as so:
        // {
        //  "friends": ["friend1", "friend2", ...]   
        // }
        router.get("/friends", (req, res) => {
            auth.checkReqCookie(req).then((uname) => {
                // If User is Not Logged In
                if (!uname) {
                    res.status(400);
                    res.send();
                }
                // If User Logged In, Send Their Friend List
                else {
                    friends.friendList(uname).then((friendlist) => {
                        res.status(200);
                        res.json({ "friends": friendlist });
                    });
                }
            });
        });

        // Returns JSON Data with a List of Recommended Matches
        // THIS IS AN AUTHENTICATED ENDPOINT; VALID COOKIE MUST BE SET
        // If Valid Cookie is not set, 400 status and send
        // If Valid Cookie is set but user has not created a profile, return 400 status (client should redirect to profile page)
        // If Valid Cookie is set and user has a profile, send JSON data with list of recommended matches as so:
        // {
        //   "matchrecs": ["matchrec1", "matchrec2", ...]   
        // }
        router.get("/matchrecs", async (req, res) => {
            const uname = await auth.checkReqCookie(req); 

            // If User not Logged In or does not have a profile set up yet, send 400 status.
            if (!(uname) || !(await prof.profileExists(uname))) {
                res.status(400);
                res.send();
                return;
            }

            // Gets the Friend List From the User to Exclude them From Match Recommendations
            friends.friendList(uname).then((excludelist) => {
                return [uname].concat(excludelist);
            }).then(async (excludelist) => {
                return excludelist.concat(await matchrequests.requestsReceived(uname));
            }).then(async (excludelist) => {
                return await (prof.getAllUsers(excludelist.concat(await matchrequests.requestsSent(uname))));
            }).then((reclist) => {
                res.status(200);
                res.json({"matchrecs": reclist});
            });  
        });

        // Returns JSON Data with a List of the User's Received Match Requests
        // THIS IS AN AUTHENTICATED ENDPOINT; VALID COOKIE MUST BE SET
        // If Valid Cookie is not set, 400 status and send
        // If Valid Cookie is set, send JSON data with friend list as so:
        // {
        //  "received": ["received1", "received2", ...]   
        // }
        router.get("/received", (req, res) => {
            auth.checkReqCookie(req).then((uname) => {
                // If User is Not Logged In status 400 and send
                if (!uname) {
                    res.status(400);
                    res.send();
                }
                // If User Logged In, Send The Requests They've Received
                else {
                    matchrequests.requestsReceived(uname).then((receivedlist) => {
                        res.status(200);
                        res.json({ "received": receivedlist });
                    });
                }
            });
        });

        // Returns JSON Data with a List of the User's Sent Match Requests
        // THIS IS AN AUTHENTICATED ENDPOINT; VALID COOKIE MUST BE SET
        // If Valid Cookie is not set, 400 status and send
        // If Valid Cookie is set, send JSON data with friend list as so:
        // {
        //  "sent": ["sent1", "sent2", ...]   
        // }
        router.get("/sent", (req, res) => {
            auth.checkReqCookie(req).then((uname) => {
                // If User is Not Logged In, status 400 and send
                if (!uname) {
                    res.status(400);
                    res.send();
                }
                // If User Logged In, Send The Requests They've Sent
                else {
                    matchrequests.requestsSent(uname).then((sentlist) => {
                        res.status(200);
                        res.json({ "send": sentlist });
                    });
                }
            });
        });

        server.use(resname, router);
    }
}