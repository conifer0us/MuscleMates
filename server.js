// Import NPM Libraries
const http = require('node:http');
const express = require('express');
const path = require('path');

// Import Server Libraries
const authlib = require("./libs/Auth.js");

// Defines Configuration Options

const templatepath = __dirname + "/templates";
const port = 80;
const authdbfile = "auth.db";

// Defines Global Constant Library Objects
const server = express();
const auth = new authlib(authdbfile);

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
    res.status(200);
    res.sendFile(path.join(templatepath, "login.html"));
});

// Send Signup File for SignUp Requests
server.get("/signup.html", (req, res) => {
    res.status(200);
    res.sendFile(path.join(templatepath, "signup.html"));
});

// Waits until Auth DB is ready before starting server
auth.dbready.then(() => {
    server.listen(port);
    console.log("Server Started on Port "+port);
})