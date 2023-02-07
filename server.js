const http = require('node:http');
const express = require('express');
const path = require('path');

const server = express();

const templatepath = __dirname + "/templates"

const port = 80;

// Send Index File for Homepage Requests
server.get("/", (req, res) => {
    res.status(200);
    res.sendFile(path.join(templatepath, "index.html"));
})
server.get("/index.html", (req, res) => {
    res.status(200);
    res.sendFile(path.join(templatepath, "index.html"));
})

// Send Login File for Login Requests
server.get("/login.html", (req, res) => {
    res.status(200);
    res.sendFile(path.join(templatepath, "login.html"));
})

// Send Signup File for SignUp Requests
server.get("/signup.html", (req, res) => {
    res.status(200);
    res.sendFile(path.join(templatepath, "signup.html"));
})

// Start Web Server on Specified port
server.listen(port);
console.log("Server Started on Port "+port);