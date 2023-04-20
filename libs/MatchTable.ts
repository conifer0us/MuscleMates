// Class for Handling Authentication with Username and Password and Cookies
const { Database } = require ("sqlite3");
import * as crypto from 'crypto';
import {Request} from 'express';

const { PrismaClient} = require ('@prisma/client');

export class MatchTable{
    constructor(private prisma: typeof PrismaClient['user']){
        this.prisma = prisma
    }

    /*
    //Inserts a match request into the table if there isn't already a request between the two users
    //Resolves to false if the match already exists and resolves to true if it inserts a request
    matchExists = async(sender : string, receiver : string) : Promise<boolean> => {
        try{
            const senderUser = await this.prisma.User.findUnique({
                where: {
                        username: sender
                },
            })
            const reqsSent = senderUser.requestsSent
            /*for (var user of reqsSent){
                if (user.username == receiver){
                    return true
                }
            }

            console.log("" + reqsSent)
            return false
            
        } catch (error) {
            if (error) {
                console.log(error.message)
                return false;
            }
        }
    }*/


    //Inserts a match request into the table if there isn't already a request between the two users
    //Resolves to true if a request is submitted successfully or if one already exists
    //Resolves to false it an error occurs
     submitRequest = async(sender : string, receiver : string) : Promise<boolean> => {
        try{
            const senderUser = await this.prisma.MatchRequest.upsert({
                where: {
                    "AND": [
                        {senderName: sender,},
                        {receiverName: receiver,},
                    ],
                },            
                update: {},
                create: {
                    sender: {
                        connect: {
                            where: {
                                username: sender
                            },
                            /*create: {
                                
                            }*/
                        }                
                    },
                    receiver: {
                        connect: {
                            where: {
                                username: receiver
                            },
                            /*create: {
                                
                            }*/
                        }                
                    },
                },
            })
            return true
            
        } catch (error) {
            if (error) {
                console.log(error.message)
                return false;
            }
        }
    }

}