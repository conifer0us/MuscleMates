// Class for user preferences that determine match recommendations
import { PrismaClient } from '@prisma/client';

export class Preferences {
    prisma : PrismaClient

    constructor(prisma: PrismaClient){
        this.prisma = prisma
    }

    getPrisma = async () : Promise<PrismaClient> => {
        try {
            return this.prisma
        } catch(error) {
            if (error) {
                console.log(error)
                return null
            }
        }
    }

    //retrieves schedule from the database for a given username
    //Resolves to the schedule string if it is found or an empty string if it isn't
    getSchedule = async(username : string) : Promise<string> => {
        try{
            const pref = await this.prisma['preferences'].findUnique({
                where:{
                    username: username,
                }
            })
            return pref.schedule;
        } catch (error) {
            if (error) {
                console.log(error.message)
                return "";
            }
        }
    }

    //retrieves preferred workout types from the database for a given username
    //Resolves to a list of preferred workout types if it is found or an empty list if it isn't
    getWorkoutTypes = async(username : string) : Promise<string> => {
        try{
            const pref = await this.prisma['preferences'].findUnique({
                where:{
                    username: username,
                }
            })
            return pref.workoutTypes;
        } catch (error) {
            if (error) {
                console.log(error.message)
                return '';
            }
        }
    }

    //retrieves gender filter status from the database for a given username
    //Resolves to a boolean filter stastus if it is found or a false if it isn't found
    getFilterByGender = async(username : string) : Promise<boolean> => {
        try{
            const pref = await this.prisma['preferences'].findUnique({
                where:{
                    username: username,
                }
            })
            return pref.filterByGender;
        } catch (error) {
            if (error) {
                console.log(error.message)
                return false;
            }
        }
    }

    //retrieves gym filter status from the database for a given username
    //Resolves to a boolean filter status if it is found or a false if it isn't found
    getFilterByGym = async(username : string) : Promise<boolean> => {
        try{
            const pref = await this.prisma['preferences'].findUnique({
                where:{
                    username: username,
                }
            })
            return pref.filterByGym;
        } catch (error) {
            if (error) {
                console.log(error.message);
                return false;
            }
        }
    }

    // inserts a user's recommendation preferences into the database
    // resolves to true if successful; resolves to false if an error is encountered
    insertPreferences = async(username: string, schedule: string, workoutTypes: string, filterByGender: boolean, filterByGym: boolean) : Promise<boolean> => {
        try {
                await this.prisma['preferences'].upsert({
                    where: {
                        username: username,
                    },
                    update: {
                        schedule: schedule,
                        workoutTypes: workoutTypes,
                        filterByGender: filterByGender,
                        filterByGym: filterByGym,
                    },
                    create: {
                        schedule: schedule,
                        workoutTypes: workoutTypes,
                        filterByGender: filterByGender,
                        filterByGym: filterByGym,
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
                console.log(error.message);
                return false;
            }
        }
    }

}