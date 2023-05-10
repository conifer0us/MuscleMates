// Import NPM Libraries
import express, { Express } from 'express';
import fileupload from 'express-fileupload';
import path from 'path';
import cookieParser from 'cookie-parser'
import { Auth } from "./libs/Auth";
import { FriendsInfo } from "./libs/Friends";
import { MatchRequests } from './libs/MatchRequests';
import { ProfileInfo } from './libs/ProfileInfo';
import { exit } from 'process';
import bodyparser from 'body-parser';
const formdecoder = bodyparser.urlencoded({extended:false});
import {PrismaClient} from "@prisma/client";
import {Preferences} from "./libs/Preferences"
import {RecHandler} from "./libs/RecHandler"
import {DBLinker} from './libs/DBLinker';
import {SubmitRoutes} from './routes/submit';
import {APIRoutes} from './routes/api';
import {RootRoutes} from './routes/root';
import {ImageRoutes} from './routes/profimage'

// Adjust Directory to Escape Build
__dirname = __dirname + "\\.."

// Loads Configuration Options From config.json
let configjson : JSON = require(path.join(__dirname, "config.json"));
configjson["templatepath"] = path.join(__dirname, configjson["templatepath"]);
configjson["stylepath"] = path.join(__dirname, configjson["stylepath"]);
configjson["scriptpath"] = path.join(__dirname, configjson["scriptpath"]);
configjson["jsxpath"] = path.join(__dirname, "build/jsx");
configjson["imagepath"] = path.join(__dirname, configjson["imagepath"]);

// Defines Global Constant Library Objects
const server : Express = express();

let auth : Auth
let prof : ProfileInfo
let matchreq : MatchRequests
let friends : FriendsInfo
let preferences : Preferences
let rechandler : RecHandler

// Defines and Configures Express Server with a Cookie Parser and File Upload Parsing
server.use(cookieParser());
server.use(fileupload({
    limits: {
        fileSize: 10000000,
    },
    abortOnLimit: true,
}));

// Main Function that Runs when Program Starts. This Function is responsible for creating library instances and Starting the Server
async function main() {
    
    //Judges Program Mode From Arguments and Sets Up Database Accordingly
    const args: string[] = process.argv;
    if (args[2] == "test") {
        console.log("Starting Server in Test Mode.");
        await DBLinker.linkDB('./test.db');
    } else if (args[2]) {
        console.log("Unknown Mode. Stopping.");
        exit();
    } else {
        await DBLinker.linkDB('./main.db');
        console.log("Starting Server in Production Mode.");
    }

    //Prisma Config
    const prisma = new PrismaClient()
    
    auth = new Auth(prisma);
    prof = new ProfileInfo(prisma);
    matchreq = new MatchRequests(prisma);
    friends = new FriendsInfo(prisma);
    preferences = new Preferences(prisma);
    rechandler = new RecHandler(prof, preferences, friends, 20);

    // Runs a Set of Statements to Prepare Database in Case of Testing Mode
    if (args[2] == "test") {await test();} 

    // Brings in Externally Defined Routes for Posting Information to the Server
    SubmitRoutes.configureRouter(server, '/submit', auth, prof, matchreq, friends);
    APIRoutes.configureRouter(server, '/api', auth, prof, matchreq, friends);
    RootRoutes.configureRouter(server, '/', auth, configjson, formdecoder);
    ImageRoutes.configureRouter(server, "/profimage", auth, prof, configjson);

    // Starts Server on Port Specified
    server.listen(configjson["port"]);
    console.log("Listening on port 80.");
}

async function test() {
    await auth.insertUserPassword("block", "block@block.com", "chain");
    await prof.insertProfile("block", "Block Boy", "18", "I like breaking", "Block Boxing and More");
    
    await auth.insertUserPassword("john123", "john@gmail.com", "john123");
    await prof.insertProfile("john123", "John Smith", "20", "I'm just a regular John.", "Block Boxing and More");
    
    await auth.insertUserPassword("martha5", "martha@outlook.com", "marthaiscool");
    await prof.insertProfile("martha5", "Martha Jones", "40", "I like rock climbing and biking.", "Block Boxing and More");  
    
    await auth.insertUserPassword("martha9", "Martha Jane", "martha9iscool");
    await prof.insertProfile("martha9", "Evil Martha", "25", "I love TikTok.", "Block Boxing and More");
}

// Starts Main Function
main();