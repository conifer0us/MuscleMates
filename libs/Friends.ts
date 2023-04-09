// Defines a Friends Class that Stores Information about the Users that are Friends (one has accepted another's request)
import {  Database } from "sqlite3";

export class Friends {
    dbready : Promise<boolean>
    db : Database

    constructor(dbfile : string){
        // Sets the dbready attribute to an Asynchronous Promise that Will Resolve with True when DB is created with Proper Tables
        this.dbready = new Promise((resolve, reject) =>{
            // Creates MatchRequests DB if it doesn't exist with table for public user info
            this.db = new Database(dbfile, (err) =>{
                if (err){
                    console.log("Error Creating Friends Database");
                    reject(err);
                }

                // Creates friends DB with Two Columns for Pairs of Users
                this.db.exec(
                    `CREATE TABLE IF NOT EXISTS friends (connectionID INTEGER PRIMARY KEY AUTOINCREMENT, friend1 text, friend2 text);`,
                    (err) => {
                        if (err){
                            console.log("Error Creating Tables in Friends Database");
                            reject(err);
                        } else{
                            resolve(true);
                        }
                    }
                )
            });
        });
    }

    // Inserts a Set of Users as Friends in the Database
    // Returns a Promise Object that Resolves to True if Friends have been Inserted and False if Friends could not be Inserted.
    addFriends(username1 : string, username2 : string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.areFriends(username1, username2).then((areFriendsBool) => {
                if (areFriendsBool) {
                    resolve(false);
                } else {
                    const stmt = this.db.prepare(`INSERT INTO friends (friend1, friend2) VALUES (?,?)`);
                    stmt.run(username1, username2);
                    stmt.finalize();
                    resolve(true);
                }
            });
        });
    }

    // Remove a Set of Friends From the Database
    // Returns a Promise Object that Revoles to True
    removeFriends(username1 : string, username2 : string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.all(`DELETE FROM friends WHERE (friend1 = ? AND friend2 = ?) OR (friend2 = ? AND friend1 = ?)`
            , [username1, username2, username1, username2]
            , (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });
    }

    // Returns a Promise Object that Resolves to a List of the User's Friends
    // If the User is lonely and has no frens, the Promise will resolve to empty
    friendList(username : string) : Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.db.all<{friend1: string, friend2: string}>(`SELECT friend1, friend2 FROM friends WHERE friend1 = ? OR friend2 = ?`
            , [username, username]
            , (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    var friendlist : string[] = [];
                    for (let i = 0; i < rows.length; i++){
                        // If first user is the one supplied, add the second user to the list. Otherwise, add the first user to the list.
                        if (rows[i].friend1 == username){
                            friendlist.push(rows[i].friend2);
                        } else {
                            friendlist.push(rows[i].friend1);
                        }
                    }
                    resolve(friendlist);
                }
            });
        });
    }

    // Returns a Promise Object that Resolves to True if Users are Friends or False if Users are not Friends
    areFriends(username1 : string, username2 : string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.all<{friend1: string, friend2 : string}>(`SELECT friend1, friend2 FROM friends WHERE friend1 = ? OR friend2 = ?`
            , [username1, username1]
            , (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    var matchInSelection = false;
                    for (let i = 0; i < rows.length; i++){
                        //test if combination exists in the DB
                        if ((rows[i].friend1 == username1 && rows[i].friend2 == username2) || (rows[i].friend1 == username2 && rows[i].friend2 == username1)){
                            matchInSelection = true;
                        }
                    }
                    resolve(matchInSelection);
                }
            });
        });
    }
}