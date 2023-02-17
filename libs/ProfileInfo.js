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
                    `CREATE TABLE IF NOT EXISTS profiles (username text references users(username) on delete set null, name text, age text, gym text, bio text);`,
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
/*
    insertProfile(username, name, age, gym, bio){
        return new Promise( (resolve, reject) => {
            
        });
    }*/

}

module.exports = ProfileInfo;