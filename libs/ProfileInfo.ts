// Class for Handling User Info displayed on a Profile
import { PrismaClient } from '@prisma/client';

export class ProfileInfo {
    prisma : PrismaClient

    constructor(prisma: PrismaClient){
        this.prisma = prisma;
    }

    //Determines if a profile with a given username already exists in the database
    //Resolves to true if the profile exists and false if it doesn't
    profileExists = async(username : string) : Promise<boolean> => {
        try {
            const profdata = await this.prisma['profile'].findFirst({
                where: {
                    username: username,
                },
            })
            if (profdata) {
                return true;
            } return false;

        } catch (error) {
            if (error){
                return false;
            }
        }
    }
    

    //inserts a user profile including username, name, age, bio, and gym
    //if the username exists in the database already, the function updates the name, age, bio, and gym for this profile
    //if the username doesn't exist already, the function inserts a new profile with the username and other info
    //updated to include gender and pronouns
    insertProfile = async(username : string, newName : string, newAge : string, newBio : string, newGym : string, newGender : string = '', newPronouns : string = '') : Promise<boolean> => {
        try{
            await this.prisma['profile'].upsert({
                where: {
                    username: username,
                },
                update: {
                    name: newName,
                    age: newAge,
                    bio: newBio,
                    gym: newGym,
                    gender: newGender,
                    pronouns: newPronouns,
                },
                create: {
                    name: newName,
                    age: newAge,
                    bio: newBio,
                    gym: newGym,
                    gender: newGender,
                    pronouns: newPronouns,
                    user: {
                        connectOrCreate: {
                            where: {
                                username: username,
                            },
                            create: {
                                username: username,
                            }
                        }                
                    },
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

    //retrieves name from the database for a given username
    //Resolves to the name if it is found or an empty string if it isn't
    getName = async(username : string) : Promise<string> => {
        try{
            const prof = await this.prisma['profile'].findUnique({
                where:{
                    username: username,
                }
            })
            return prof.name;
        } catch (error) {
            if (error) {
                return "";
            }
        }
    }

    //retrieves age from the database for a given username
    //Resolves to the age if it is found or an empty string if it isn't
    getAge = async(username : string) : Promise<string> => {
        try{
            const prof = await this.prisma['profile'].findUnique({
                where:{
                    username: username
                }
            })
            return prof.age;
        } catch (error) {
            if (error) {
                return ""
            }
        }
    }

    //retrieves bio from the database for a given username
    //Resolves to the bio if it is found or an empty string if it isn't
    getBio = async(username : string) : Promise<string> => {
        try{
            const prof = await this.prisma['profile'].findUnique({
                where:{
                    username: username
                }
            })
            return prof.bio
        } catch (error) {
            if (error) {
                return ""
            }
        }
    }

    //retrieves gym from the database for a given username
    //Resolves to the gym if it is found or an empty string if it isn't
    getGym = async(username : string) : Promise<string> => {
        try{
            const prof = await this.prisma['profile'].findUnique({
                where:{
                    username: username,
                }
            })
            return prof.gym
        } catch (error) {
            if (error) {
                return ""
            }
        }
    }

    //retrieves gender from the database for a given username
    //Resolves to the gender if it is found or an empty string if it isn't
    getGender = async(username : string) : Promise<string> => {
        try{
            const prof = await this.prisma['profile'].findUnique({
                where:{
                    username: username,
                }
            })
            return prof.gender
        } catch (error) {
            if (error) {
                console.log(error.message)
                return ""
            }
        }
    }

    //retrieves pronouns from the database for a given username
    //Resolves to the pronouns if it is found or an empty string if it isn't
    getPronouns = async(username : string) : Promise<string> => {
        try{
            const prof = await this.prisma['profile'].findUnique({
                where:{
                    username: username,
                }
            })
            return prof.pronouns
        } catch (error) {
            if (error) {
                console.log(error.message)
                return ""
            }
        }
    }

    //Resolves to Dictionary Representation of Profile Information
    getProfInfo = async(username : string) : Promise<{}> =>{
        try{
            const prof = await this.prisma['profile'].findUnique({
                where:{
                    username: username,
                }
            });
            return {"name": prof.name, "age": prof.age, "bio": prof.bio, "gym": prof.gym, "gender": prof.gender, "pronouns": prof.pronouns}
        } catch (error) {
            if (error) {
                return {}
            }
        }
    }
    
    // Returns a Promise Object that Resolves to a List of Users who have Created a Profile
    // If the exclude list is set, it will remove all usernames in the list from the returned set
    getAllUsers = async(exclude : string[] = []) : Promise<string[]> =>{
        try{
            let profList: string[] = [];
            const profsFound = await this.prisma['profile'].findMany({});
            for (var prof of profsFound) {
                if (! exclude.includes(prof.username)) {
                    profList.push(prof.username)
                }
            }
            return profList;
        }   catch (error) {
            if (error) {
                return [];
            }
        }
    }
}