// class for determining what profiles to recommend to a user
import { ProfileInfo } from './libs/ProfileInfo.ts';

export class Recommendation {
    static ageWeight = 1/3
    static scheduleWeight = 1/3
    static workoutWeight = 1/3

    static calculateAgeScore = async (username1 : string, username2: string, ProfileInfo: ProfileInfo) : Promise<> => {

        var profile1Age = ProfileInfo.getAge(username1);
        var profile2Age = ProfileInfo.getAge(username2);
        var ageDiff = Math.abs(profile1Age - profile2Age);
        var ageScore = 1 / (1 + Math.pow(Math.E, -ageDiff)); //sigmoid curve
        return ageScore
    }

}