// class for determining what profiles to recommend to a user
import { ProfileInfo } from './ProfileInfo';
import { Preferences } from './Preferences';
import { FriendsInfo } from './Friends'

export class RecHandler {

    profileInfo : ProfileInfo
    preferences : Preferences
    friendsInfo: FriendsInfo 
    numWorkoutTypes : number 
    ageWeight : number
    scheduleWeight : number
    workoutWeight : number

    constructor(profileInfo: ProfileInfo, preferences : Preferences, friendsInfo : FriendsInfo, numWorkoutTypes : number, ageWeight : number = 1/3, scheduleWeight : number = 1/3, workoutWeight : number = 1/3 ) {
        this.profileInfo = profileInfo
        this.preferences = preferences
        this.friendsInfo = friendsInfo
        this.numWorkoutTypes = numWorkoutTypes
        this.ageWeight = ageWeight
        this.scheduleWeight = scheduleWeight
        this.workoutWeight = workoutWeight
    }

    //COMMENT HERE
    calculateAgeScore = async (username1 : string, username2: string) : Promise<number> => {
        try {
            let user1Age = Number(await this.profileInfo.getAge(username1));
            let user2Age = Number(await this.profileInfo.getAge(username2));
            let ageDiff = Math.abs(user1Age - user2Age);
            let ageScore = 1 / (1 + Math.pow(Math.E, -ageDiff)); //sigmoid curve
            return ageScore
        } catch (error) {
            if (error) {
                console.log(error.message)
                return -1
            }
        }
    }

    calculateScheduleScore = async (username1 : string, username2 : string) : Promise<number> => {
        try {
            let user1Schedule = await this.preferences.getSchedule(username1);
            let user2Schedule = await this.preferences.getSchedule(username2);
            var countSame = 0
            for (let i = 0; i < user1Schedule.length ; i++) {
                if (user1Schedule.charAt(i) == user2Schedule.charAt(i)) {
                    countSame++
                }   
            }
            let scheduleScore = countSame / 7
        } catch (error) {
            if (error) {
                console.log(error.message)
                return -1
            }
        }
    }

    calculateWorkoutScore = async ( username1 : string, username2 : string) : Promise<number> => {
        try {
            let user1Types = await this.preferences.getWorkoutTypes(username1);
            let user2Types = await this.preferences.getWorkoutTypes(username2);
            var workoutsShared = 0
            for (let i = 0; i < user1Types.length; i++) {
                if (user1Types.charAt(i) == '1' && user2Types.charAt(i) == '1') {
                    workoutsShared++
                }   
            }
            let x = workoutsShared/this.numWorkoutTypes
            let a = 0.75
            //Bézier curve for workout score
            let workoutScore = 3 * a * Math.pow((1 - Math.pow(x, 1/3)), 2) * Math.pow(x, 1/3) + 3 * (1 - Math.pow(x, 1/3)) * Math.pow(x, 2/3)
            return workoutScore
        } catch (error) {
            if (error) {
                console.log(error.message);
                return -1;
            }
        }
    }

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

    getValidUsers = async (username : string) : Promise<string[]> => {
        try { 
            
            var friendList = await this.friendsInfo.friendList(username)
            var excludeList = await [username].concat(friendList)

            var validUsers = await this.profileInfo.getAllUsers(excludeList)

            if (this.preferences.getFilterByGender(username))
                for (let [index, otherUser] of validUsers.entries()) {
                    if (this.profileInfo.getGender(username) != this.profileInfo.getGender(otherUser)) {
                        
                    }
                }

            if(this.preferences.getFilterByGym(username)){}
            
        } catch(error) {
            if (error) {
                console.log(error.message)
                return []
            }
        }
    }

}