// Database Class for Retrieving Messages Sent to and From Users
import { PrismaClient, Prisma, Friends, Messages } from "@prisma/client";
import { FriendsInfo } from "./Friends";

type FriendsWithMessages = Prisma.FriendsGetPayload<{
    include: { messages: true }
  }>

export class MessageInfo {
    prisma : PrismaClient;
    friends : FriendsInfo
    
    constructor(prisma : PrismaClient, friends : FriendsInfo) {
        this.prisma = prisma;
        this.friends = friends;
    }

    // Inserts a Message Between Two Users into the Database
    async insertMessage(sender: string, receiver: string, messagestring: string): Promise<boolean> {
        const frenobj: FriendsWithMessages = <FriendsWithMessages> await this.friends.getFriends(sender, receiver, 1);

        const nextMessageID :number = (frenobj.messages[0] ? frenobj.messages[0].conversationid + 1 : 0);

        if (!frenobj) return false;

        try {            
            await this.prisma['messages'].create(
                {
                    data: {
                        friendset: {
                            connect: {
                                id: frenobj.id
                            },
                        },
                        sender: {
                            connect: {
                                username: sender,
                            }
                        },
                        receiver: {
                            connect: {
                                username: receiver, 
                            }
                        }, 
                        conversationid: nextMessageID,
                        data: messagestring,
                    }
                }
            );

            return true;
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }

    // Gets a Set of a certain number of Messages Between Two Users as a List of Messages Object
    async getMessages(sender : string, receiver: string, num : number, startindex = -1): Promise<Messages[]> {
        const frenobjWithMessages : FriendsWithMessages = <FriendsWithMessages>(await this.friends.getFriends(sender, receiver, num, startindex));

        // If Users are not Friends, return an empty list of messages
        if (!frenobjWithMessages) return []; 

        // If you are requesting an impossible number of messages, return an empty list
        if (num < 0) return [];

        return frenobjWithMessages.messages;
    }
}