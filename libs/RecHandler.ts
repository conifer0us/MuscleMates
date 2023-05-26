// class for determining what profiles to recommend to a user based on their profile and preferences
import { ProfileInfo } from './ProfileInfo';
import { Preferences } from './PreferenceInfo';
import { FriendsInfo } from './Friends';
import {MatchRequests} from './MatchRequests';

export class RecHandler {

    profileInfo : ProfileInfo
    preferences : Preferences
    friendsInfo: FriendsInfo
    matchRequests : MatchRequests 
    numWorkoutTypes : number 
    ageWeight : number
    scheduleWeight : number
    workoutWeight : number

    constructor(profileInfo: ProfileInfo, preferences : Preferences, friendsInfo : FriendsInfo, matchRequests : MatchRequests, numWorkoutTypes : number, ageWeight : number = 1/3, scheduleWeight : number = 1/3, workoutWeight : number = 1/3 ) {
        this.profileInfo = profileInfo
        this.preferences = preferences
        this.friendsInfo = friendsInfo
        this.matchRequests = matchRequests
        this.numWorkoutTypes = numWorkoutTypes
        //weights should add up to 1
        this.ageWeight = ageWeight
        this.scheduleWeight = scheduleWeight
        this.workoutWeight = workoutWeight
    }

    //calculates the age compatibility subscore between 2 users for use in the calculateCompatibility method
    //returned score will range from 0 (not compatible) to 1 (perfectly compatible)
    calculateAgeScore = async (username1 : string, username2: string) : Promise<number> => {
        try {
            let user1Age = Number(await this.profileInfo.getAge(username1));
            let user2Age = Number(await this.profileInfo.getAge(username2));
            let ageDiff = Math.abs(user1Age - user2Age);
            //ageScore determined by sigmoid curve based on absolute value of difference between the 2 user's ages
            //The closer the 2 ages are, the higher the ageScore will be
            let ageScore = -1 / (1 + Math.exp(3 - ageDiff / 2)) + 1;
            return ageScore
        } catch (error) {
            if (error) {
                console.log(error.message)
                return -1
            }
        }
    }

    //calculates the schedule compatibility subscore between 2 users for use in the calculateCompatibility method
    //returned score will range from 0 (not compatible) to 1 (perfectly compatible)
    calculateScheduleScore = async (username1 : string, username2 : string) : Promise<number> => {
        try {
            let user1Schedule = await this.preferences.getSchedule(username1);
            let user2Schedule = await this.preferences.getSchedule(username2);
            var sharedDays = 0
            //assumes schedules are represented as a series of 1s and 0s in a string
            //only days that both users indicate as workout days will contribute
            for (let i = 0; i < user1Schedule.length ; i++) {
                if (user1Schedule.charAt(i) == '1' && user2Schedule.charAt(i) == '1') {
                    sharedDays++
                }   
            }
            //score is determined by days in common / total days of the week
            let scheduleScore = sharedDays / 7 
        } catch (error) {
            if (error) {
                console.log(error.message)
                return -1
            }
        }
    }

    //calculates the workout type compatibility subscore between 2 users for use in the calculateCompatibility method
    //returned score will range from 0 (not compatible) to 1 (perfectly compatible)
    //depends on the total number of workout types, which is stored as an attribute in this class
    calculateWorkoutScore = async ( username1 : string, username2 : string) : Promise<number> => {
        try {
            let user1Types = await this.preferences.getWorkoutTypes(username1);
            let user2Types = await this.preferences.getWorkoutTypes(username2);
            var workoutsShared = 0
            //assumes workouts are represented as a series of 1s and 0s in a string
            for (let i = 0; i < user1Types.length; i++) {
                if (user1Types.charAt(i) == '1' && user2Types.charAt(i) == '1') {
                    workoutsShared++
                }   
            }
            let x = workoutsShared/this.numWorkoutTypes
            //arbitrary adjustable factor for use in the Bézier curve
            let a = 0.75
            //Bézier curve for workout score - steep increase with the first few types in common, then curve levels off
            let workoutScore = 3 * a * Math.pow((1 - Math.pow(x, 1/3)), 2) * Math.pow(x, 1/3) + 3 * (1 - Math.pow(x, 1/3)) * Math.pow(x, 2/3)

            return workoutScore
        } catch (error) {
            if (error) {
                console.log(error.message);
                return -1;
            }
        }
    } 

    //calculates the compatibilty score between 2 users based on age, schedule, and preferred workout types
    //score will range from 0 (not compatible) to 1 (perfectly compatible)
    //depends each subscore is multiplied by a weight determined by the weight attributes of the RecHandler class
    calculateCompatibility = async (username1 : string, username2 : string) : Promise<Number> => {
        try {
            let ageScore = await this.calculateAgeScore(username1, username2)
            let scheduleScore = await this.calculateScheduleScore(username1, username2)
            let workoutScore = await this.calculateWorkoutScore(username1, username2)
            let compatibility = await ageScore * this.ageWeight + scheduleScore * this.scheduleWeight + workoutScore * this.workoutWeight
            return compatibility
        } catch (error) {
            if (error) {
                console.log(error.message)
                return -1
            }
        }
    }

    //retrieves all usernames that are valid to display as recommendations to a given user
    //valid users does not include the user in question or the user's friends
    //if the user has the gender and/or gym filter enabled, profiles that don't match
    //the user's gender/gym are excluded
    getValidUsers = async (username : string) : Promise<string[]> => {
        try { 
            
            var friendList = await this.friendsInfo.friendList(username)
            var reqsSent = await this.matchRequests.requestsSent(username)
            var reqsReceived = await this.matchRequests.requestsReceived(username)
            var excludeList = [username].concat(friendList).concat(reqsSent).concat(reqsReceived)
            
            var validUsers = await this.profileInfo.getAllUsers(excludeList)

            if (this.preferences.getFilterByGender(username)) {
                for (var i = validUsers.length - 1; i >= 0; i--) {
                    if (this.profileInfo.getGender(username) != this.profileInfo.getGender(validUsers[i])) {
                        validUsers.splice(i,1)
                    }
                }
            }

            if (this.preferences.getFilterByGym(username)) {
                for (var i = validUsers.length - 1; i >= 0; i--) {
                    if (this.profileInfo.getGym(username) != this.profileInfo.getGym(validUsers[i])) {
                        validUsers.splice(i,1)
                    }
                }
            }

            return validUsers

        } catch(error) {
            if (error) {
                console.log(error.message)
                return []
            }
        }
    }

    //retrieves a list of recommended usernames for a given user
    //recommendations are sorted by compatibility with the user
    //contains parameter numRecs that determines the number of recommendations to return
    //numRecs has a default value of -1. If nothing is passed to this parameter, all valid users are returned
    getRecommendations = async (username : string, numRecs : number = -1) : Promise<string[]> => {
        try {
            var validUsers : string[] = await this.getValidUsers(username)
            var userScoreArray = [] //array in form [[username, compatibility], [username2, compatibility2], etc.]
            for (let otherUser of validUsers) {
                const compatScore = this.calculateCompatibility(username, otherUser)
                userScoreArray.push([username, compatScore])
            }
            
            //sort users based on compatibility score in descending order
            userScoreArray.sort(
                (array1, array2) => { return array2[1] - array1[1]}
            )
            
            //new array that only contains names
            //could be simplified using map?
            var recNames : string[] = [] //array in form [name1, name2, name3, etc.]
            for (let userScorePair of userScoreArray) {
                recNames.push(userScorePair[0])
            }

            //return all valid users if no number of recommendations specified
            if (numRecs < 0) {
                return recNames
            } 
            //otherwise, return specified number of users
            else {
                return recNames.slice(0, numRecs)
            }
        } catch(error) {
            if (error) {
                return []
                console.log(error.message)
            }
        }
    }

}