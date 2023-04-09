//Class for handling public user info displayed on profile
import { Database } from "sqlite3";

export class ProfileInfo{
    dbready : Promise<boolean>
    db : Database

    constructor(dbfile : string) {
         // Sets the dbready attribute to an Asynchronous Promise that Will Resolve with True when DB is created with Proper Tables
         this.dbready = new Promise((resolve, reject) => {               
            // Creates ProfileInfo DB if it doesn't exist with table for public user info
            this.db = new Database(dbfile, (err) => {
                if (err) {
                    console.log("Error Creating Profile Info Database.");
                    reject(err);
                }

                this.db.exec(
                    `CREATE TABLE IF NOT EXISTS profiles (profileID INTEGER PRIMARY KEY AUTOINCREMENT, username text references users(username) on delete set null, name text, age text, bio text, gym text);`,
                    (err) => {
                        if (err) {
                            console.log("Error Creating Tables in Profile Info Database");
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    }
                );
            });
        });
    }
    
    //Determines if a profile with a given username already exists in the database
    //Returns a promise that resolves to true if the profile exists and false if it doesn't
    profileExists(username : string) : Promise<boolean> {
        return new Promise( (resolve, reject) => {
            this.db.all(`SELECT username FROM profiles WHERE username = ?`
            , [username]
            , (err, rows) => {
                if (err) {
                    reject(err);
                }
                else if (rows.length != 0){
                        //console.log(username + ' exists')
                        resolve(true);
                    }
                else{
                    //console.log(username + ' doesnt exist')
                    resolve(false);
                }
            });
        });
    }


    //inserts a user profile including username, name, age, bio, and gym
    //tests if there is already a profile with the given username in the database
    //if the username exists already, the function updates the name, age, bio, and gym for this profile
    //if the username doesn't exist already, the function inserts a new profile with the username and other info
    insertProfile(username : string, newName : string, newAge : string, newBio : string, newGym : string) : Promise<boolean> {
        return new Promise( (resolve, reject) => {
            this.profileExists(username).then((aBool) => {
                if (aBool) {
                    //console.log('profile already exists, updating')
                    const stmt = this.db.prepare(`UPDATE profiles SET name = ?, age = ?, bio = ?, gym = ? WHERE username = ?`);
                    stmt.run(newName, newAge, newBio, newGym, username);
                    stmt.finalize();
                    resolve(true);
                }
                else {
                    const stmt = this.db.prepare(`INSERT INTO profiles (username, name, age, bio, gym) VALUES (?,?,?,?,?)`);
                    //console.log('profile doesnt exist, inserting')
                    stmt.run(username, newName, newAge, newBio, newGym);
                    stmt.finalize();
                    resolve(true);
                }
            });
        });
    }


    //retrieves name from the database for a given username
    //returns a promise object that resolves to the name if it is found or an empty string if it isn't
    getName(username : string) : Promise<string> {
        return new Promise( (resolve, reject) => {
            this.db.all<{name:string}>(`SELECT name FROM profiles WHERE username = ?`
            , [username]
            , (err, rows) => {
                if (err){
                    reject(err);
                }
                else if (rows.length <= 0){
                    resolve("")
                }
                else{
                    resolve(rows[0].name)
                }
            });
        })
    }

    //retrieves age from the database for a given username
    //returns a promise object that resolves to the age if it is found or an empty string if it isn't
    getAge(username : string) : Promise<string> {
        return new Promise( (resolve, reject) => {
            this.db.all<{age:string}>(`SELECT age FROM profiles WHERE username = ?`
            , [username]
            , (err, rows) => {
                if (err){
                    reject(err);
                }
                else if (rows.length <= 0){
                    resolve("")
                }
                else{
                    resolve(rows[0].age)
                }
            });
        })
    }

    //retrieves bio from the database for a given username
    //returns a promise object that resolves to the bio if it is found or an empty string if it isn't
    getBio(username : string) : Promise<string> {
        return new Promise( (resolve, reject) => {
            this.db.all<{bio:string}>(`SELECT bio FROM profiles WHERE username = ?`
            , [username]
            , (err, rows) => {
                if (err){
                    reject(err);
                }
                else if (rows.length <= 0){
                    resolve("");
                }
                else{
                    resolve(rows[0].bio)
                }
            });
        })
    }

    //retrieves gym from the database for a given username
    //returns a promise object that resolves to the gym if it is found or an empty string if it isn't
    getGym(username : string) : Promise<string> {
        return new Promise( (resolve, reject) => {
            this.db.all<{gym: string}>(`SELECT gym FROM profiles WHERE username = ?`
            , [username]
            , (err, rows) => {
                if (err){
                    reject(err);
                }
                else if (rows.length <= 0){
                    resolve("")
                }
                else{
                    resolve(rows[0].gym)
                }
            });
        })
    }

    // Returns A Promise that Resolves to Dictionary Representation of Profile Information
    getProfInfo(username : string) : Promise<{}> {
        return new Promise((resolve, reject) => {
            this.profileExists(username).then((profexistsbool) => {
                if (!profexistsbool) {
                    resolve({});
                }
                else {
                    this.getName(username).then((name)=>{
                        this.getAge(username).then((age) => {
                            this.getBio(username).then((bio) => {
                                this.getGym(username).then((gym) => {
                                    resolve({"name": name, "age": age, "bio": bio, "gym": gym});
                                }); 
                            }); 
                        });
                    });
                }
            });
        });
    }

    // Returns a Promise Object that Resolves to a List of Users who have Created a Profile
    // If the exclude list is set, it will remove all usernames in the list from the returned set
    getAllUsers(exclude : string[] = []) : Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.db.all<{username: string}>(`SELECT username FROM profiles`
            , []
            , (err, rows) => {
                if (err) {
                    reject(err);
                }
                else{
                    var userlist = [];
                    for (let i = 0; i < rows.length; i++){
                        // Add User From this Row to User List if it is not in the excluded set
                        let uname = rows[i].username;
                        if (!exclude.includes(uname)) {
                            userlist.push(uname);
                        }
                    }
                    resolve(userlist);
                }
            });
        });
    }
}