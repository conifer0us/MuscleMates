// Import NPM Libraries
import express, { Express } from 'express';
import fileupload from 'express-fileupload';
import path from 'path';
import cookieParser from 'cookie-parser'
import { exit } from 'process';
import bodyparser from 'body-parser';
import {PrismaClient} from "@prisma/client";

// Import Custom Libraries
import { Auth } from "./libs/Auth";
import { FriendsInfo } from "./libs/Friends";
import { MatchRequests } from './libs/MatchRequests';
import { ProfileInfo } from './libs/ProfileInfo';
import { MessageInfo } from './libs/Messages';
import {Preferences} from "./libs/PreferenceInfo"
import {RecHandler} from "./libs/RecHandler"

// Import Express Routes
import {SubmitRoutes} from './routes/submit';
import {APIRoutes} from './routes/api';
import {RootRoutes} from './routes/root';
import {ImageRoutes} from './routes/profimage'

// Main Function that Runs when Program Starts. This Function is responsible for creating library instances and Starting the Server
async function main() {
    // Defines Form Decoder for Application
    const formdecoder = bodyparser.urlencoded({extended:false});

    // Adjust Directory to Escape Build
    __dirname = __dirname + "\\.."

    // Loads Configuration Options From config.json
    let configjson: JSON = require(path.join(__dirname, "config.json"));
    configjson["templatepath"] = path.join(__dirname, configjson["templatepath"]);
    configjson["stylepath"] = path.join(__dirname, configjson["stylepath"]);
    configjson["scriptpath"] = path.join(__dirname, configjson["scriptpath"]);
    configjson["jsxpath"] = path.join(__dirname, "build/jsx");
    configjson["imagepath"] = path.join(__dirname, configjson["imagepath"]);

    // Defines Global Constant Library Objects
    const server: Express = express();

    // Defines and Configures Express Server with a Cookie Parser and File Upload Parsing
    server.use(cookieParser());
    server.use(fileupload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    }));
    
    //Judges Program Mode From Arguments and Sets Up Database Accordingly
    const args: string[] = process.argv;
    if (args[2] == "test") {
        console.log("Starting Server in Test Mode.");
    } else if (args[2]) {
        console.log("Unknown Mode. Stopping.");
        exit();
    } else {
        console.log("Starting Server in Production Mode.");
    }

    //Prisma Config
    const prisma = new PrismaClient();
    
    // Import Custom Libraryes that will be used By API Endpoints
    const preferences = new Preferences(prisma);
    const auth = new Auth(prisma, preferences);
    const prof = new ProfileInfo(prisma);
    const matchreq = new MatchRequests(prisma);
    const friends = new FriendsInfo(prisma);
    const messages = new MessageInfo(prisma, friends);
    const rechandler = new RecHandler(prof, preferences, friends, matchreq, 15);

    // Runs a Set of Statements to Prepare Database in Case of Testing Mode
    if (args[2] == "test") {
        await auth.insertUserPassword("block", "block@block.com", "chain");
        await prof.insertProfile("block", "Block Boy", "18", "I like breaking", "Block Boxing and More", "male", "he/him");
    
        await auth.insertUserPassword("john123", "john@gmail.com", "john123");
        await prof.insertProfile("john123", "John Smith", "20", "I'm just a regular John.", "Block Boxing and More", "other", "they/them");
    
        await auth.insertUserPassword("martha5", "martha@outlook.com", "marthaiscool");
        await prof.insertProfile("martha5", "Martha Jones", "40", "I like rock climbing and biking.", "Block Boxing and More", "female", "she/her");  
    
        await auth.insertUserPassword("martha9", "Martha Jane", "martha9iscool");
        await prof.insertProfile("martha9", "Evil Martha", "25", "I love TikTok.", "Block Boxing and More", "female", "she/her");

        let friendsinserted : boolean = await friends.addFriends("martha5", "martha9"); 
        if (friendsinserted) {await messages.insertMessage("martha9", "martha5", "Want to go to the gym?");}
        
        friendsinserted = await friends.addFriends("martha5", "john123");
        if (friendsinserted) {await messages.insertMessage("martha5", "john123", "Want to work out at 5 tomorrow?");}
    } 

    // Load Externally Defined Express Routes
    SubmitRoutes.configureRouter(server, '/submit', auth, prof, matchreq, friends, messages, preferences, formdecoder);
    APIRoutes.configureRouter(server, '/api', auth, prof, matchreq, friends, messages, preferences, rechandler, formdecoder);
    RootRoutes.configureRouter(server, '/', auth, prof, configjson, formdecoder);
    ImageRoutes.configureRouter(server, "/profimage", auth, prof, configjson);

    // Starts Server on Port Specified
    server.listen(configjson["port"]);
    console.log("Listening on port 80.");
}

// Starts Main Function
main();