//Class for handling public user info displayed on profile

//import Auth from "./Auth";

class ProfileInfo{
    constructor(dbfile) {
        // Import sqlite3 for Working with SQLite db files
        this.sqlite3 = require("sqlite3");

         // Sets the dbready attribute to an Asynchronous Promise that Will Resolve with True when DB is created with Proper Tables
         this.dbready = new Promise((resolve, reject) => {               
            // Creates ProfileInfo DB if it doesn't exist with table for public user info
            this.db = new this.sqlite3.Database(dbfile, (err) => {
                if (err) {
                    console.log("Error Creating Profile Info Database.");
                    reject(err);
                } else {
                    console.log("Profile Info opened in file " + dbfile);
                }

                this.db.exec(
                    `CREATE TABLE IF NOT EXISTS profiles (username text references users(username) on delete set null, name text, age text, bio text);`,
                    (err) => {
                        if (err) {
                            console.log("Error Creating Tables in Profile Info Database");
                            reject(err);
                        } else {
                            console.log("Profile tables set up");
                            resolve(true);
                        }
                    }
                );
            });
        });
    }
    
    //Determines if a profile with a given username already exists in the database
    //Returns a promise that resolves to true if the profile exists and false if it doesn't
    profileExists(username){
        return new Promise( (resolve, reject) => {
            this.db.all(`SELECT username FROM profiles WHERE username = ?`
            , [username]
            , (err, rows) => {
                if (err) {
                    reject(err);
                }
                else if (rows.length != 0){
                        console.log(username + ' exists')
                        resolve(true);
                    }
                else{
                    console.log(username + ' doesnt exist')
                    resolve(false);
                }
            });
        });
    }


    //inserts a user profile including username, name, age, and bio
    //tests if there is already a profile with the given username in the database
    //if the username exists already, the function updates the name, age, and bio for this profile
    //if the username doesn't exist already, the function inserts a new profile with the username and other info
    insertProfile(username, newName, newAge, newBio){
        return new Promise( (resolve, reject) => {
            this.db.all(`SELECT username FROM profiles WHERE username = ?`
            , [username]
            , (err) => {
                if (err) {
                    reject(err);
                }
                else{
                    this.profileExists(username).then((aBool) => {
                        if (aBool){
                            //console.log('profile already exists, updating')
                            const stmt = this.db.prepare(`UPDATE profiles SET name = ?, age = ?, bio = ? WHERE username = ?`);
                            stmt.run(newName, newAge, newBio, username);
                            stmt.finalize();
                            resolve(true);
                        }
                        else{
                            const stmt = this.db.prepare(`INSERT INTO profiles (username, name, age, bio) VALUES (?,?,?,?)`);
                            //console.log('profile doesnt exist, inserting')
                            stmt.run(username, newName, newAge, newBio);
                            stmt.finalize();
                            resolve(true);
                        }
                    });
                }
            });            
        });
    }


    //retrieves name from the database for a given username
    //returns a promise object that resolves to the name if it is found or an empty string if it isn't
    getName(username){
        return new Promise( (resolve, reject) => {
            this.db.all(`SELECT name FROM profiles WHERE username = ?`
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
    getAge(username){
        return new Promise( (resolve, reject) => {
            this.db.all(`SELECT age FROM profiles WHERE username = ?`
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
    getBio(username){
        return new Promise( (resolve, reject) => {
            this.db.all(`SELECT bio FROM profiles WHERE username = ?`
            , [username]
            , (err, rows) => {
                if (err){
                    reject(err);
                }
                else if (rows.length <= 0){
                    resolve("")
                }
                else{
                    resolve(rows[0].bio)
                }
            });
        })
    }


}

module.exports = ProfileInfo;