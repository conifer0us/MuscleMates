//Class for library handling match requests
import { sqlite3, Database } from "sqlite3";

export class MatchRequests{
    sqlite : sqlite3
    dbready : Promise<boolean>
    db : Database

    constructor(dbfile){
        // Sets the dbready attribute to an Asynchronous Promise that Will Resolve with True when DB is created with Proper Tables
        this.dbready = new Promise((resolve, reject) =>{
            // Creates MatchRequests DB if it doesn't exist with table for public user info
            this.db = new Database(dbfile, (err) =>{
                if (err){
                    console.log("Error Creating MatchRequests Database");
                    reject(err);
                }

                this.db.exec(
                    `CREATE TABLE IF NOT EXISTS matchRequests (requestID INTEGER PRIMARY KEY AUTOINCREMENT, sender text, receiver text);`,
                    (err) => {
                        if (err){
                            console.log("Error Creating Tables in MatchRequests Database");
                            reject(err);
                        } else{
                            resolve(true);
                        }
                    }
                )
            })
        });
    }


    //Tests if a match between 2 users already exists in the database
    //Returns a promise that resolves to true if the match exists in the database or false if otherwise
    matchExists(sender : string, receiver : string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT sender, receiver FROM matchRequests WHERE sender = ? AND receiver = ?`
            , [sender, receiver]
            , (err, rows) => {
                if (err) {
                    reject(err);
                }
                else{
                    if (rows.length > 0) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }
            });
        });
    }

    //Inserts a match request into the table if there isn't already a request between the two users
    //Returns a promise that resolves to false if the match already exists and resolves to true if it inserts a request
    submitRequest(sender : string, receiver : string) : Promise<boolean> {
        return new Promise( (resolve, reject) => {
            this.matchExists(sender, receiver).then((matchExistsBool) => {
                if (matchExistsBool) {
                    //console.log("Match already exists")
                    resolve(false);
                }
                else {
                    const stmt = this.db.prepare(`INSERT INTO matchRequests (sender, receiver) VALUES (?,?)`);
                    //console.log('Inserting match');
                    stmt.run(sender, receiver);
                    stmt.finalize();
                    resolve(true);
                }
            });
        });
    }

    //Retrieves the usernames a given user has sent match requests to
    //Returns a promise that resolves to an Array containing the usernames the user has sent requests to
    //If the user has not sent any requests, the promise resolves to an empty Array
    requestsSent(username : string) : Promise<string[]> {
        return new Promise((resolve, reject) =>{
            this.db.all<{receiver : string}>(`SELECT receiver FROM matchRequests WHERE sender = ?`
            , [username]
            , (err, rows) => {
                if (err){
                    reject(err);
                }
                else{
                    var requests : string[] = []; 
                    for (let i = 0; i < rows.length; i++){
                        requests.push(rows[i].receiver);
                    }
                    resolve(requests);
                }
            });
        });
    }

    //Retrieves the usernames a given user has received match requests from
    //Returns a promise that resolves to an Array containing the usernames the user has received requests from
    //If the user has not received any requests, the promise resolves to an empty Array
    requestsReceived(username : string) : Promise<string[]> {
        return new Promise((resolve, reject) =>{
            this.db.all<{sender : string}>(`SELECT sender FROM matchRequests WHERE receiver = ?`
            , [username]
            , (err, rows) => {
                if (err){
                    reject(err);
                }
                else{
                    var requests : string[] = []; 
                    for (let i = 0; i < rows.length; i++){
                        requests.push(rows[i].sender);
                    }
                    resolve(requests);
                }
            });
        });
    }

    // Deletes a Match Request From the Table
    // Always Resolves to True
    deleteRequest(sender : string, receiver : string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.all(`DELETE FROM matchRequests WHERE sender = ? AND receiver = ?`
            , [sender, receiver]
            , (err) => {
                if (err){
                    reject(err);
                }
                else{
                    resolve(true);
                }
            });
        });
    }
}