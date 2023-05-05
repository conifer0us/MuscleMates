// class for determining what profiles to recommend to a user
import { ProfileInfo } from './ProfileInfo';
import { Preferences } from './Preferences';

export class Recommendation {
    static ageWeight = 1/3
    static scheduleWeight = 1/3
    static workoutWeight = 1/3


    //COMMENT HERE
    static calculateAgeScore = async (username1 : string, username2: string, profileInfo: ProfileInfo) : Promise<Number> => {
        try {
            var user1Age = Number(await profileInfo.getAge(username1));
            var user2Age = Number(await profileInfo.getAge(username2));
            var ageDiff = Math.abs(user1Age - user2Age);
            var ageScore = 1 / (1 + Math.pow(Math.E, -ageDiff)); //sigmoid curve
            return ageScore
        } catch (error) {
            if (error) {
                console.log(error.message)
                return -1
            }
        }
    }

    static calculateScheduleScore = async (username1 : string, username2 : string, preferences : Preferences) : Promise<Number> => {
        try {
            var user1Schedule = await preferences.getSchedule(username1);
            var user2Schedule = await preferences.getSchedule(username2);
        } catch (error) {
            if (error) {
                console.log(error.message)
                return -1
            }
        }
    }

}