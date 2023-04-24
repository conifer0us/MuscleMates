// Class for Handling Authentication with Username and Password and Cookies
import * as crypto from 'crypto';
import {Request} from 'express';
import { PrismaClient } from '@prisma/client';

export class Auth {

    AUTH_COOKIE_NAME = "AUTH";

    constructor(private prisma: PrismaClient){
        this.prisma = prisma;
    }

    // Gets the Hashed (Obfuscated) Version of Text Data
    getDataHash(textdata : string) : string {
        return crypto.createHash('sha256').update(textdata).digest('hex');
    }

    // Gets a new Cookie Value (64 random characters)
    getCookieVal() : string {
        return crypto.randomBytes(256).toString('hex');
    }


    // Places a username, email, and hashed (obfuscated) password into the Auth DB
    // If username already exists in the db, updates the user's email & password. Otherwise, it creates a user with the specified info
    // Resolves to True if User Inserted Without Problem; Resolves to false otherwise
    insertUserPassword = async(username : string, email : string, password : string): Promise<boolean> => {       
        try {
            await this.prisma['user'].upsert({
                where: {
                    username: username,
                },
                update: {
                    passwordhash: this.getDataHash(password),
                    useremail: email,
                },
                create: {
                    username: username,
                    useremail: email,
                    passwordhash: this.getDataHash(password),
                },
            })
            return true;
        } catch (error) {
            if (error) {
                console.log(error.message)
                return false;
            }
        }
    }

    // Checks if a Login Attempt is Authorized From Username (or Email) and Password
    // Returns true if login is correct
    // Returns false if the username & password combo doesn't exist in the db or if it runs into an error
    isLoginCorrect = async(username : string, password : string) : Promise<boolean> => {
        try {
            const passhash: string = this.getDataHash(password);
            const userQueried = await this.prisma['user'].findUnique({
                where: {
                    username: username,
                },
                select: {
                    passwordhash: true,
                }
            })
            const correctPasshash = userQueried.passwordhash;
            return passhash == correctPasshash;

        } catch (error) {
            if (error) {
                console.log(error.message);
                return false;
            }
        }     
    }


    // Inserts a New Random Cookie Value into the Cookies Table for a Certain User
    // Returns a Promise Object that evaluates to the cookievalue if a cookie was properly set; resolves to an empty string otherwise
    addCookieToUser = async (username : string) : Promise<string> => {
        try{
            const cookie: string = this.getCookieVal();
            await this.prisma['cookie'].update({
                where: {
                    username: username,
                },
                data:{
                    cookieval: cookie,
                },
            })
            return cookie;
        } catch (error) {
            if (error) {
                console.log(error.message)
                return "";
            }
        }
    }

    // Checks A Request Object for A Valid Auth Cookie
    // Resolves to the Username whose cookie it is if the cookie is valid; resolves to an empty string if cookie is invalid
    checkReqCookie = async(request : Request ) : Promise<string> => {
        try{
            
            if (!request.cookies || !(this.AUTH_COOKIE_NAME in request.cookies)) {
                return "";
            }

            const cookieval : string= request.cookies[this.AUTH_COOKIE_NAME];

            // If no cookieval is supplied, resolve with an empty string
            if (!cookieval) {
                return "";
            }
            
            // Checks Database for Cookie Otherwise
            const CookieObj = await this.prisma['cookie'].findUnique({
                where: {
                    cookieval: cookieval,
                },
            });

            const cookieUsername = CookieObj.username
            return cookieUsername

        } catch (error) {
            if (error) {
                console.log(error.message)
                return "";
            }
        }
    }
}  