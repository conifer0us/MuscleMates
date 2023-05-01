//Class for library handling match requests
import { MatchRequest, PrismaClient } from "@prisma/client";

export class MatchRequests{
    prisma : PrismaClient

    constructor(prisma : PrismaClient){
        this.prisma = prisma; 
    }

    //Tests if a match between 2 users already exists in the database
    //Returns a promise that resolves to true if the match exists in the database or false if otherwise
    matchExists = async(sender : string, receiver : string) : Promise<boolean> => {
        try {
            const matchdata = await this.prisma['matchRequest'].findFirst({
                where: {
                    "OR": [
                        {
                            "AND": [
                                { senderName: { equals: receiver } },
                                { receiverName: { equals: sender } },
                            ]
                        },
                        {
                            "AND": [
                                { senderName: { equals: sender } },
                                { receiverName: { equals: receiver } },
                            ]
                        }
                    ],
                }
            });

            if (matchdata) {
                return true;
            } return false;
        }
        catch (e) { console.log(e.message); return false;}
    }

    //Inserts a match request into the table if there isn't already a request between the two users
    //Returns a promise that resolves to false if the match already exists and resolves to true if it inserts a request
    submitRequest = async(sender : string, receiver : string) : Promise<boolean> => {
        const alreadyexists = await this.matchExists(sender, receiver);

        if (alreadyexists) {
            return false;
        }

        try {
            await this.prisma['matchRequest'].create({
                data : {
                    sender: {
                        connectOrCreate : {
                            where: {
                                username: sender,
                            },
                            create: {
                                username: sender,
                            }
                        },
                    }, 
                    receiver: {
                        connectOrCreate : {
                            where : {
                                username: receiver
                            },
                            create : {
                                username: receiver
                            }
                        }
                    }
                }
            });
            return true;
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }

    //Retrieves the usernames a given user has sent match requests to
    //Returns a promise that resolves to an Array containing the usernames the user has sent requests to
    //If the user has not sent any requests, the promise resolves to an empty Array
    requestsSent = async(username : string) : Promise<string[]> => {
        try {
            const userlist = await this.prisma['matchRequest'].findMany({
                where: {
                    senderName: { equals: username }
                }
            });

            return userlist.map<string>((mrq: MatchRequest) => { return mrq.receiverName });
        } catch(e) {
            console.log(e.message);
            return [];
        }
    }

    //Retrieves the usernames a given user has received match requests from
    //Returns a promise that resolves to an Array containing the usernames the user has received requests from
    //If the user has not received any requests, the promise resolves to an empty Array
    requestsReceived = async (username: string): Promise<string[]> => {
        try {
            const userlist = await this.prisma['matchRequest'].findMany({
                where: {
                    receiverName: { equals: username }
                }
            });

            return userlist.map<string>((mrq: MatchRequest) => { return mrq.senderName });
        } catch(e) {
            console.log(e.message);
            return [];
        }
    }

    // Deletes a Match Request From the Table
    // Always Resolves to True
    deleteRequest = async(sender : string, receiver : string) : Promise<boolean> => {
        try{
            await this.prisma['matchRequest'].deleteMany({
                where: {
                    "AND" : [
                        {senderName: {equals: sender}}, 
                        {receiverName: {equals: receiver}}
                    ]
                }
            });
            return true;
        }
        catch(e) {
            console.log(e.message);
            return false;
        }
    }
}