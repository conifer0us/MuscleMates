// Import NPM Libraries
import express, { Express } from 'express';
import fileupload from 'express-fileupload';
import path from 'path';
import cookieParser from 'cookie-parser'
import { Auth } from "./libs/Auth";
import { Friends } from "./libs/Friends";
import { MatchRequests } from './libs/MatchRequests';
import { ProfileInfo } from './libs/ProfileInfo';
import { exit } from 'process';
import bodyparser from 'body-parser';
const formdecoder = bodyparser.urlencoded({extended:false});

// Defines Operation Mode and Sets Mode Based on Command Line Arguments
const MODES = {
    test: 0,
    prod: 1
}

// Gets Program Command Line Arguments and Sets Mode Based on Arguments
const args : string[] = process.argv;
let mode : number = MODES.prod;
if (args[2] == "test") {
    console.log("Starting Server in Test Mode.")
    mode = MODES.test;
} else if (args[2]) {
    console.log("Unknown Mode. Stopping.");
    exit();
} else {
    console.log("Starting Server in Production Mode.");
}

// Adjust Directory to Escape Build
__dirname = __dirname + "\\.."

// Loads Configuration Options From config.json
let configjson : JSON = require(path.join(__dirname, "config.json"));
configjson['mode'] = mode; 
configjson["templatepath"] = path.join(__dirname, configjson["templatepath"]);
configjson["stylepath"] = path.join(__dirname, configjson["stylepath"]);
configjson["scriptpath"] = path.join(__dirname, configjson["scriptpath"]);
configjson["jsxpath"] = path.join(__dirname, "build/jsx");
configjson["imagepath"] = path.join(__dirname, configjson["imagepath"]);
const DBFILE : string = configjson["dbfile"];

// Defines Shared Constant Library Objects
const auth = new Auth(DBFILE);
const prof = new ProfileInfo(DBFILE);
const matchreq = new MatchRequests(DBFILE);
const friends = new Friends(DBFILE);

// Defines and Configures Express Server with a Cookie Parser and File Upload Parsing
const server : Express = express();
server.use(cookieParser());
server.use(fileupload({
    limits: {
        fileSize: 10000000,
    },
    abortOnLimit: true,
}));

// Brings in Externally Defined Routes for Posting Information to the Server
import {SubmitRoutes} from './routes/submit';
import {APIRoutes} from './routes/api';
import {RootRoutes} from './routes/root';
import {ImageRoutes} from './routes/profimage'

SubmitRoutes.configureRouter(server, '/submit', auth, prof, matchreq, friends);
APIRoutes.configureRouter(server, '/api', auth, prof, matchreq, friends);
RootRoutes.configureRouter(server, '/', auth, configjson, formdecoder);
ImageRoutes.configureRouter(server, "/profimage", auth, prof, configjson);

// Main Function that Runs when Program Starts. This Function is responsible for creating library instances and Starting the Server
async function main() {
    // Waits until DB is ready with Proper Libraries Configured before starting server
    await auth.dbready;
    await prof.dbready;
    await matchreq.dbready;
    await friends.dbready;
    console.log("Successfully configured application database.");

    // Runs Test Function if "test" option specified on Command Line after server.js
    if (mode == MODES.test) {test();}

    // Starts Server on Port Specified
    server.listen(configjson["port"]);
    console.log("Listening on port 80.");
}

// Test Function that configures the database with some predefined data for demonstration purposes
async function test() {
    auth.insertUserPassword("block", "block@block.com", "chain");
    prof.insertProfile("block", "Block Boy", "18", "I like breaking", "Block Boxing and More");

    auth.insertUserPassword("john123", "john@gmail.com", "john123");
    prof.insertProfile("john123", "John Smith", "20", "I'm just a regular John.", "Block Boxing and More");

    auth.insertUserPassword("martha5", "martha@outlook.com", "marthaiscool");
    prof.insertProfile("martha5", "Martha Jones", "40", "I like rock climbing and biking.", "Block Boxing and More");
}

// Starts Main Function
main();