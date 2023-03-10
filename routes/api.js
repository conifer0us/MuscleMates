// Defines Separate Express Routes for Sending API Information (In JSON Format)
// Routes Referenced in this File Must Follow /api in order to be reached from server.js

// Import Necessary Libraries
const server = require("express");
const router = server.Router();
const proflib = require("../libs/ProfileInfo.js");
const authlib = require("../libs/Auth.js");
const friendlib = require("../libs/Friends.js");
const reqlib = require("../libs/MatchRequests.js");

// Configuration Object From Config JSON and Global Constants
const configjson = require("../config.json");
const arguments = process.argv;
let dbfile = "";
if (arguments[2] == "test") {
    dbfile = configjson["testdb"];
} else {
    dbfile = configjson["dbfile"];
}

// Create Global Objects
const prof = new proflib(dbfile);
const auth = new authlib(dbfile);
const friends = new friendlib(dbfile);
const matchrequests = new reqlib(dbfile);

// Sends Basic API Welcome Message with 200 Status Code For Simple /api request
router.get("/", (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.json({"msg": "Welcome to the Public API!"});
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
                res.json({"friends": friendlist});
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
router.get("/matchrecs", (req, res) => {
    auth.checkReqCookie(req).then((uname) => {
        // If User not Logged In,
        if (!uname) {
            res.status(400);
            res.send();
        } 

        // If User Logged In, Send Match Recommendation List
        else {
            prof.profileExists(uname).then((profexists) => {
                if (!profexists) {
                    res.status(400);
                    res.send();
                } else {
                    exclude = [uname];

                    // Gets the Friend List From the User to Exclude them From Match Recommendations
                    friends.friendList(uname).then((friendlist) => {
                        exclude = exclude.concat(friendlist);

                        // Gets Current Received Requests to Exclude them From Match Recommendations
                        matchrequests.requestsReceived(uname).then((receivedreqs) => {
                            exclude = exclude.concat(receivedreqs);

                            // Gets Current Received Requests to Exclude them From Match Recommendations
                            matchrequests.requestsSent(uname).then((sentreqs) => {
                                exclude = exclude.concat(sentreqs);
                                prof.getAllUsers(exclude).then((reclist) => {
                                    res.status(200);
                                    res.json({"matchrecs": reclist});
                                });
                            });
                        });
                    });
                }
            })
        }
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
                res.json({"received": receivedlist});
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
                res.json({"send": sentlist});
            });
        }
    });
});

module.exports = router;