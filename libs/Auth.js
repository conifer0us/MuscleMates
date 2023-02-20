// Class for Handling Authentication with Username and Password and Cookies

class Auth {
    AUTH_COOKIE_NAME = "AUTH";

    constructor(dbfile) {
        // Import sqlite3 for Working with SQLite db files
        this.sqlite3 = require("sqlite3");
        this.crypto = require("crypto");

        // Sets the dbready attribute to an Asynchronous Promise that Will Resolve with True when DB is created with Proper Tables
        this.dbready = new Promise((resolve, reject) => {
            // Creates Auth DB if it doesn't exist with table for usernames and passwords as well as cookies
            this.db = new this.sqlite3.Database(dbfile, (err) => {
                if (err) {
                    console.log("Error Creating Auth Database.");
                    reject(err);
                } else {
                    console.log("Auth opened in file " + dbfile);
                }

                // Creates a Users table for storing username, email, and password hash
                // Also Creates a Cookies table for storing User Cookies
                this.db.exec(
                    `CREATE TABLE IF NOT EXISTS users (username text, useremail text, passwordhash text);
                        CREATE TABLE IF NOT EXISTS cookies (username text references users(username) on delete set null, cookieval text) `,
                    (err) => {
                        if (err) {
                            console.log("Error Creating Tables in Auth Database");
                            reject(err);
                        } else {
                            console.log("User and Cookie tables set up.");
                            resolve(true);
                        }
                    }
                );
            });
        });
    }

    // Places a username, email, and hashed (obfuscated) password into the Auth DB
    // Returns a Promise Object that resolves to False if the Username or Email Already Exists; Resolves to True if User Inserted Without Problem
    insertUserPassword(username, email, password) {
        return new Promise( (resolve, reject) => {
            this.db.all(`SELECT username FROM users WHERE username = ? OR useremail = ?`
            , [username, email]
            , (err, rows) => {
                if (err) {
                    reject(err);
                }
                else if (rows.length != 0) {
                    resolve(false);
                }
                else {
                    // Prepares An Insertion Statement for the Users DB and Executes it with Argument Data
                    const stmt = this.db.prepare(`INSERT INTO users (username, useremail, passwordhash) values (?,?,?)`);
                    stmt.run(username, email, this.getDataHash(password));
                    stmt.finalize();
                    resolve(true);
                }
            });
        });
    }

    // Checks if a Login Attemtp is Authorized From Username (or Email) and Password
    isLoginCorrect(username, password) {
        const passhash = this.getDataHash(password) 
        // Returns an Asynchronous Promise Object that Will Resolve True when 
        return new Promise((resolve, reject) => {
            // Check if Username and Password Hash Combination Exists in DB; Returns true if so
            this.db.all(`SELECT username FROM users WHERE (username = ? AND passwordhash = ?) OR (useremail = ? AND passwordhash = ?)`
            , [username, passhash, username, passhash]  
            , (err, rows) => {
                if (err) {
                    reject(err);
                }
                else if (rows != 0) {
                    resolve(true);
                } else {
                    // If Neither Combination Exists in the DB, return False
                    resolve(false);
                }
            }); 
        }); 
    }

    // Gets the Hashed (Obfuscated) Version of Text Data
    getDataHash(textdata) {
        return this.crypto.createHash('sha256').update(textdata).digest('hex');
    }

    // Inserts a New Random Cookie Value into the Cookies Table for a Certain User
    // Returns a Promise Object that evaluates to the cookievalue if a cookie was properly set; resolves to an empty string otherwise
    addCookieToUser(userid) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT username FROM users WHERE username = ? OR useremail = ?`
            , [userid, userid]
            , (err, rows) => {
                if (err) {
                    reject(err);
                }
                else if (rows.length == 0) {
                    resolve("");
                }
                else {
                    const uname = rows[0].username;
                    const cookie = this.getCookieVal();
                    // Prepares An Insertion Statement for the Cookies DB with cookie value and username
                    const stmt = this.db.prepare(`INSERT INTO cookies (username, cookieval) values (?,?)`);
                    stmt.run(uname, cookie);
                    stmt.finalize();
                    resolve(cookie);
                }
            });
        });
    }

    // Checks A Request Object for A Valid Auth Cookie
    // Returns a Promise Object that Evaluates to the Username whose cookie it is if the cookie is valid; resolves to an empty string if cookie is invalid
    checkReqCookie(request) {
        return new Promise((resolve, reject) => {
            if (!request.cookies || !(this.AUTH_COOKIE_NAME in request.cookies)) {
                resolve("");
            }

            const cookieval = request.cookies[this.AUTH_COOKIE_NAME];

            // If no cookieval is supplied, resolve with an empty string
            if (!cookieval) {
                resolve("");
            }

            // Checks Database for Cookie Otherwise
            this.db.all(`SELECT username FROM cookies WHERE cookieval = ?`
            , [cookieval]
            , (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length == 0) {
                    resolve("");
                } else {
                    resolve(rows[0].username);
                }
            });
        });
    } 

    // Gets a new Cookie Value (64 random characters)
    getCookieVal() {
        return this.crypto.randomBytes(256).toString('hex');
    }
}

// Exports the class so that it can be used by other files
module.exports = Auth;