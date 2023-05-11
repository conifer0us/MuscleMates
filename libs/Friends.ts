// Defines a Friends Class that Stores Information about the Users that are Friends (one has accepted another's request)
import { PrismaClient, Friends } from "@prisma/client";

export class FriendsInfo {
    prisma: PrismaClient

    constructor(prisma : PrismaClient){
        this.prisma = prisma; 
    }

    // Inserts a Set of Users as Friends in the Database
    // Returns a Promise Object that Resolves to True if Friends have been Inserted and False if Friends could not be Inserted.
    addFriends = async (username1 : string, username2 : string) : Promise<boolean> => {
        try {
            const friendsalr = await this.areFriends(username1, username2);
            if (friendsalr || username1 == username2) {
                return false;
            }
            else {
                await this.prisma['friends'].create({
                    data: {
                        friend: {
                            connectOrCreate : {
                                where: {
                                    username: username1,
                                },
                                create: {
                                    username: username1,
                                }
                            },
                        }, 
                        friendAdded: {
                            connectOrCreate : {
                                where : {
                                    username: username2
                                },
                                create : {
                                    username: username2
                                }
                            }
                        }
                    }
                });
                return true;
            }
        } catch(e) {
            console.log(e.message);
            return false;
        }
    }

    // Remove a Set of Friends From the Database
    // Returns a Promise Object that Revoles to True
    removeFriends = async (username1 : string, username2 : string) : Promise<boolean> => {
        try {
            this.prisma['friends'].deleteMany({
                where : {
                    "OR": [
                        {"AND" : [
                            {friendName : {equals: username1}},
                            {friendAddedName: {equals: username2}} 
                        ]},
                        {"AND" : [
                            {friendName : {equals: username2}},
                            {friendAddedName: {equals: username1}} 
                        ]}   
                    ]
                }
            });
            return true;
        } catch(e) {
            console.log(e.message);
            return false;
        }
    }

    // Returns a Promise Object that Resolves to a List of the User's Friends
    // If the User is lonely and has no frens, the Promise will resolve to empty
    friendList = async (username : string) : Promise<string[]> => {
        try {
            let frens = await this.prisma['friends'].findMany({
                where: {
                    "OR": [
                        { friendName: { equals: username } },
                        { friendAddedName: { equals: username } }
                    ]
                }
            });
            return frens.map<string>((frenobj : Friends) => {return (frenobj.friendAddedName == username) ? frenobj.friendName : frenobj.friendAddedName});
        } catch (e) {
            console.log(e.message);
            return [];
        }
    }

    // Returns a Promise Object that Resolves to True if Users are Friends or False if Users are not Friends
    areFriends = async (username1 : string, username2 : string) : Promise<boolean> => {
        return Boolean<Friends>(await this.getFriends(username1, username2));
    }

    // Returns a Promise that Resolves to a Friends Object between two users
    getFriends = async (username1 : string, username2 : string, message_num : number = 0, startindex : number = -1) : Promise<Friends> => {
        try {
            return await this.prisma['friends'].findFirst({
                where: {
                    "OR": [
                        {
                            "AND": [
                                { friendName: { equals: username1 } },
                                { friendAddedName: { equals: username2 } },
                            ]
                        },
                        {
                            "AND": [
                                { friendName: { equals: username2 } },
                                { friendAddedName: { equals: username1 } },
                            ]
                        }
                    ],
                },

                include: {
                    messages: {
                        orderBy: {conversationid: 'desc'}, 
                        where : {
                            conversationid : ((startindex < 0) ? 
                            {gte: 0} : 
                            {lte: startindex}),
                        }, 
                        take: message_num,
                        select: {
                            senderName: true,
                            receiverName: true,
                            timesent: true, 
                            data: true, 
                            conversationid: true
                        }
                    }
                }, 
            });
        } catch(e) {
            console.log(e);
            return null;
        }
    }
}