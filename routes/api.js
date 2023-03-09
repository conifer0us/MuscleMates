// Defines Separate Express Routes for Sending API Information (In JSON Format)
// Routes Referenced in this File Must Follow /api in order to be reached from server.js

// Import Necessary Libraries
const server = require("express");
const router = server.Router();
const proflib = require("../libs/ProfileInfo.js");

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
// "bio" : bio
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

module.exports = router;