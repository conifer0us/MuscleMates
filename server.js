// Import NPM Libraries
const express = require('express');
const path = require('path');
const reqparser = require('body-parser')
const formdecoder = reqparser.urlencoded({extended:false});
const cookieParser = require('cookie-parser');

// Import Server Libraries
const authlib = require("./libs/Auth.js");
const proflib = require("./libs/ProfileInfo"); 

// Defines Configuration Options
const templatepath = __dirname + "/templates";
const port = 80;
const authdbfile = "auth.db";

// Defines Global Constant Library Objects
const server = express();
server.use(cookieParser());
const auth = new authlib(authdbfile);

// Defines Global Cookie Config Options
const AUTH_COOKIE_NAME = "AUTH";

// Send Index File for Homepage Requests
server.get("/", (req, res) => {
    res.status(200);
    res.sendFile(path.join(templatepath, "index.html"));
});

server.get("/index.html", (req, res) => {
    res.status(200);
    res.sendFile(path.join(templatepath, "index.html"));
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
        // Returns 200 Request if Server Accepts Login and Sets a New Cookie for the User 
        if (validlogin) {
            auth.addCookieToUser(username).then((cookieval) => {
                res.cookie(auth.AUTH_COOKIE_NAME, cookieval);
                res.redirect("/home");
            });
        }
        
        // Returns a 401 Request if Server Denies Login
        else {
            res.status(401);
            res.send();
        }
    });
});

server.get("/home", (req, res) => {
    auth.checkReqCookie(req).then((cookieuser) => {
        // If the Cookie User is Set to Valid Value, Render Home Page for User and Return Page Data
        if (cookieuser) {
            res.status(200);
            res.send("Welcome to your homepage, " + cookieuser + "!");
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

    else {
        auth.insertUserPassword(uname, email, password).then((useradded) => {
            // If User is Successfully Added, Redirect to Login Page
            if (useradded) {
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

// Waits until Auth DB is ready before starting server
auth.dbready.then(() => {
    server.listen(port);
    console.log("Server Started on Port "+port);
});