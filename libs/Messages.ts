// Database Class for Retrieving Messages Sent to and From Users
import { PrismaClient} from "@prisma/client";

export class Messages {
    prisma : PrismaClient;
    
    constructor(prisma : PrismaClient) {
        this.prisma = prisma;
    }
}