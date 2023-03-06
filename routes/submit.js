// Defines Separate Express Routes for Updating Information on the Server
// Routes Referenced in this File Must Follow /post in order to be reached from server.js

// Import Necessary Libraries
const server = require("express");
const router = server.Router();
const proflib = require("../libs/ProfileInfo.js");
const authlib = require("../libs/Auth.js");

// Configuration Object From Config JSON and Global Constants
const configjson = require("../config.json");
const dbfile = configjson["dbfile"];

// Defines Global Objects
const prof = new proflib(dbfile);
const auth = new authlib(dbfile);

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
            if (!req.body.name || !req.body.age || !req.body.bio || !req.bio.gym) {
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

module.exports = router;