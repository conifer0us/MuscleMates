// Import NPM Libraries
const express = require('express');
const path = require('path');
const filesystem = require('fs');
const reqparser = require('body-parser')
const formdecoder = reqparser.urlencoded({extended:false});
const cookieParser = require('cookie-parser');

// Import Server Libraries
const authlib = require("./libs/Auth.js");
const proflib = require("./libs/ProfileInfo");
const reqlib = require("./libs/MatchRequests");

// Loads Configuration Options From config.json
let configjson = require("./config.json");
const templatepath = path.join(__dirname, configjson["templatepath"]);
const stylepath = path.join(__dirname, configjson["stylepath"]);
const scriptpath = path.join(__dirname, configjson["scriptpath"]);
const port = configjson["port"];
const DBFILE = configjson["dbfile"];

// Defines Global Constant Library Objects
const server = express();
server.use(cookieParser());
const auth = new authlib(DBFILE);
const prof = new proflib(DBFILE);
const matchreq = new reqlib(DBFILE);

// Brings In Externally Defined Routes at Certain Base Folders
const apiroutes = require("./routes/api.js");
server.use("/api", apiroutes);

// Brings in Externally Defined Routes for Posting Information to the Server
const postroutes = require("./routes/submit.js")
server.use("/submit", postroutes)

// Send Index File for Homepage Requests
server.get("/", (req, res) => {
    res.status(200);
    res.sendFile(path.join(templatepath, "index.html"));
});

// Send Index File for Direct Index Requests
server.get("/index.html", (req, res) => {
    res.status(200);
    res.sendFile(path.join(templatepath, "index.html"));
});

// Returns CSS files from Style Path
server.get("/style(s)?/:stylename", (req, res) => {
    const stylename = req.params["stylename"];
    if (!stylename) {
        res.status(404);
        res.send(); 
    } else {
        const filepath = path.join(stylepath, stylename);
        filesystem.access(filepath, (err) => {
            if (err) {
                res.status(404);
                res.send();
            } else {
                res.status(200);
                res.sendFile(filepath);
            }
        });
    }
});

// Returns JS files from Script // Returns CSS files from Style Path
server.get("/script(s)?/:scriptname", (req, res) => {
    const scriptname = req.params["scriptname"];
    if (!scriptname) {
        res.status(404);
        res.send(); 
    } else {
        const filepath = path.join(scriptpath, scriptname);
        filesystem.access(filepath, (err) => {
            if (err) {
                res.status(404);
                res.send();
            } else {
                res.status(200);
                res.sendFile(filepath);
            }
        });
    }
});

// Send Login File for Login Requests
server.get("/login.html", (req, res) => {
    // Check Auth cookie and redirect to home if cookie is valid
    auth.checkReqCookie(req).then((cookieuser) => {
        // If User Cookie Indicates that User is Logged In, Redirect to Home Page
        if (cookieuser) {
            res.redirect("/home");
        }
        // If Cookie is Invalid, return login html page
        else {
            res.status(200);
            res.sendFile(path.join(templatepath, "login.html"));
        }
    });
});

// Processes Login Post Requests
server.post("/login.html", formdecoder, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // If Desired Form Parameters are Not Present, Return a 401 Status Code
    if (!username || !password) {
        res.status(401);
        res.send();
        return; 
    }

    auth.isLoginCorrect(username, password).then((validlogin) => {
        // Returns Redirect with 200 Status if Server Accepts Login and Sets a New Cookie for the User 
        if (validlogin) {
            auth.addCookieToUser(username).then((cookieval) => {
                res.cookie(auth.AUTH_COOKIE_NAME, cookieval);
                res.status(200);
                res.redirect("/home");
            });
        }
        
        // Returns a 401 Response if Server Denies Login
        else {
            res.status(401);
            res.send();
        }
    });
});

// Returns User Homepage If User Logged In; Otherwise Redirect to Login
server.get("/home", (req, res) => {
    auth.checkReqCookie(req).then((cookieuser) => {
        // If the Cookie User is Set to Valid Value, Render Home Page for User and Return Page Data
        if (cookieuser) {
            res.status(200);
            res.sendFile(path.join(templatepath, "homepage.html"));
        } 
        
        // Redirects the User Back to the Login Page if Cookie Not Valid
        else {
            res.redirect("/login.html");
        }
    });
});

// Send Signup File for SignUp Requests
server.get("/signup.html", (req, res) => {
    auth.checkReqCookie(req).then((cookieuser) => {
        if (cookieuser) {
            res.redirect("/home");
        }
        else {
            res.status(200);
            res.sendFile(path.join(templatepath, "signup.html"));
        }
    });
});

// Processes Signup Post Requests
server.post("/signup.html", formdecoder, (req, res) => {
    const email = req.body.email;
    const uname = req.body.username;
    const password = req.body.password;
    const repeatpassword = req.body.repeatpassword;

    // If Desired Form Parameters are Not Present, Return 400 Status Codes
    if (!email || !uname || !password || !repeatpassword) {
        res.status(400);
        res.send();
        return;
    }

    // If the User Entered Two Different Passwords, Return 400 Status Codes
    else if (password != repeatpassword) {
        res.status(400);
        res.send();
        return;
    }

    // Inserts User Into Auth DB if Account Successfully Created
    else {
        auth.insertUserPassword(uname, email, password).then((useradded) => {
            // If User is Successfully Added, Redirect to Login Page with 200 Status
            if (useradded) {
                res.status(200);
                res.redirect("/login.html");
            } 
            
            // If User Could Not Be added (Repeat Username or Email), send 400 Status Code
            else {
                res.status(400);
                res.send();
            }
        });
    }
});

// Send Recommendations File for Recommendations Requests
server.get("/recommendations", (req, res) => {
    auth.checkReqCookie(req).then((cookieuser) => {
        if (cookieuser) {
            res.status(200);
            res.sendFile(path.join(templatepath, "recommendations.html"));
        }
        else {
            res.redirect("/login.html");
        }
    });
});

// Send Friends File for Friends Requests
server.get("/friends", (req, res) => {
    auth.checkReqCookie(req).then((cookieuser) => {
        if (cookieuser) {
            res.status(200);
            res.sendFile(path.join(templatepath, "friends.html"));
        }
        else {
            res.redirect("/login.html");
        }
    });
});

// Send Matchrequests File for Matchrequests Requests
server.get("/matchrequests", (req, res) => {
    auth.checkReqCookie(req).then((cookieuser) => {
        if (cookieuser) {
            res.status(200);
            res.sendFile(path.join(templatepath, "matchrequests.html"));
        }
        else {
            res.redirect("/login.html");
        }
    });
});

// Send Profile File for Profile Requests
server.get("/profile", (req, res) => {
    auth.checkReqCookie(req).then((cookieuser) => {
        if (cookieuser) {
            res.status(200);
            res.sendFile(path.join(templatepath, "profile.html"));
        }
        else {
            res.redirect("/login.html");
        }
    });
});

// Waits until DB is ready with Proper Libraries Configured before starting server
auth.dbready.then(() => {
    console.log("Auth DB Opened with Proper Tables.")
    prof.dbready.then(() => {
        console.log("Profile DB Opened with Proper Tables");
        matchreq.dbready.then(() => {
            console.log("MatchRequests DB Opened with Proper Tables.")
            server.listen(port);
        });
    });
});
