// Import Necessary Libraries
import { Router, Express } from 'express';
import { Auth } from "../libs/Auth";
import { ProfileInfo } from '../libs/ProfileInfo';
import path from 'path';
import fs from 'fs';

export class RootRoutes {
    static configureRouter(server: Express, resname: string, auth: Auth, profile: ProfileInfo, configjson : JSON, formdecoder) {
        const templatepath :string = configjson["templatepath"];
        const stylepath :string = configjson["stylepath"];
        const scriptpath :string= configjson["scriptpath"];
        const jsxpath :string = configjson["jsxpath"];
        let router = Router();

        // Send Index File for Homepage Requests
        server.get("/", (req, res) => {
            res.status(200);
            res.sendFile(path.join(templatepath, "reactindex.html"));
        });

        // Send Index File for Direct Index Requests
        server.get("/index.html", (req, res) => {
            res.status(200);
            res.sendFile(path.join(templatepath, "reactindex.html"));
        });

        // Returns CSS files from Style Path
        server.get("/style(s)?/:stylename", (req, res) => {
            const stylename = req.params["stylename"];
            if (!stylename) {
                res.status(404);
                res.send();
            } else {
                const filepath = path.join(stylepath, stylename);
                fs.access(filepath, (err) => {
                    if (err) {
                        res.status(404);
                        res.send();
                    } else {
                        res.status(200);
                        res.sendFile(filepath);
                    }
                });
            }
        });

        // Returns JS files from Script // Returns CSS files from Style Path
        server.get("/script(s)?/:scriptname", (req, res) => {
            const scriptname = req.params["scriptname"];
            if (!scriptname) {
                res.status(404);
                res.send();
            } else {
                const filepath = path.join(scriptpath, scriptname);
                fs.access(filepath, (err) => {
                    if (err) {
                        res.status(404);
                        res.send();
                    } else {
                        res.status(200);
                        res.sendFile(filepath);
                    }
                });
            }
        });

        // Returns JSX files from jsx
        server.get("/jsx/:scriptname", (req, res) => {
            const scriptname = req.params["scriptname"];
            if (!scriptname) {
                res.status(404);
                res.send();
            } else {
                const filepath = path.join(jsxpath, scriptname);
                fs.access(filepath, (err) => {
                    if (err) {
                        res.status(404);
                        res.send();
                    } else {
                        res.status(200);
                        res.sendFile(filepath);
                    }
                });
            }
        });


        // Send Login File for Login Requests
        server.get("/login.html", (req, res) => {
            // Check Auth cookie and redirect to home if cookie is valid
            auth.checkReqCookie(req).then((cookieuser) => {
                // If User Cookie Indicates that User is Logged In, Redirect to Home Page
                if (cookieuser) {
                    res.redirect("/home");
                }
                // If Cookie is Invalid, return login html page
                else {
                    res.status(200);
                    res.sendFile(path.join(templatepath, "reactindex.html"));
                }
            });
        });

        // Processes Login Post Requests
        server.post("/login.html", formdecoder, (req, res) => {
            const username = req.body.username;
            const password = req.body.password;

            // If Desired Form Parameters are Not Present, Return a 401 Status Code
            if (!username || !password) {
                res.status(401);
                res.send();
                return;
            }

            auth.isLoginCorrect(username, password).then((validlogin) => {
                // Returns Redirect with 200 Status if Server Accepts Login and Sets a New Cookie for the User 
                if (validlogin) {
                    auth.addCookieToUser(username).then((cookieval) => {
                        res.cookie(auth.AUTH_COOKIE_NAME, cookieval);
                        res.status(200);
                        res.redirect("/home");
                    });
                }

                // Returns a 401 Response if Server Denies Login
                else {
                    res.status(401);
                    res.send();
                }
            });
        });

        // Returns User Homepage If User Logged In; Otherwise Redirect to Login
        server.get("/home", (req, res) => {
            auth.checkReqCookie(req).then((cookieuser) => {
                // If the Cookie User is Set to Valid Value, Render Home Page for User and Return Page Data
                if (cookieuser) {
                    res.status(200);
                    res.sendFile(path.join(templatepath, "reactindex.html"));
                }

                // Redirects the User Back to the Login Page if Cookie Not Valid
                else {
                    res.redirect("/login.html");
                }
            });
        });

        // Send Signup File for SignUp Requests
        server.get("/signup.html", (req, res) => {
            auth.checkReqCookie(req).then((cookieuser) => {
                if (cookieuser) {
                    res.redirect("/home");
                }
                else {
                    res.status(200);
                    res.sendFile(path.join(templatepath, "reactindex.html"));
                }
            });
        });

        // Processes Signup Post Requests
        server.post("/signup.html", formdecoder, (req, res) => {
            const email = req.body.email;
            const uname = req.body.username;
            const password = req.body.password;
            const repeatpassword = req.body.repeatpassword;

            // If Desired Form Parameters are Not Present, Return 400 Status Codes
            if (!email || !uname || !password || !repeatpassword) {
                res.status(400);
                res.send();
                return;
            }

            // If the User Entered Two Different Passwords, Return 400 Status Codes
            else if (password != repeatpassword) {
                res.status(400);
                res.send();
                return;
            }

            // Inserts User Into Auth DB if Account Successfully Created
            else {
                auth.insertUserPassword(uname, email, password).then((useradded) => {
                    // If User is Successfully Added, Redirect to Login Page with 200 Status
                    if (useradded) {
                        res.status(200);
                        res.redirect("/login.html");
                    }

                    // If User Could Not Be added (Repeat Username or Email), send 400 Status Code
                    else {
                        res.status(400);
                        res.send();
                    }
                });
            }
        });

        // Send Recommendations File for Recommendations Requests
        server.get("/recommendations", async (req, res) => {
            auth.checkReqCookie(req).then(async (cookieuser) => {
                if (! (await profile.profileExists(cookieuser))) {
                    res.redirect("/profile");
                }
                else if (cookieuser) {
                    res.status(200);
                    res.sendFile(path.join(templatepath, "reactindex.html"));
                }
                else {
                    res.redirect("/login.html");
                }
            });
        });

        // Send Friends File for Friends Requests
        server.get("/friends", async (req, res) => {
            auth.checkReqCookie(req).then(async (cookieuser) => {
                if (! (await profile.profileExists(cookieuser))) {
                    res.redirect("/profile");
                }
                else if (cookieuser) {
                    res.status(200);
                    res.sendFile(path.join(templatepath, "reactindex.html"));
                }
                else {
                    res.redirect("/login.html");
                }
            });
        });

        // Send Matchrequests File for Matchrequests Requests
        server.get("/matchrequests", (req, res) => {
            auth.checkReqCookie(req).then((cookieuser) => {
                if (cookieuser) {
                    res.status(200);
                    res.sendFile(path.join(templatepath, "reactindex.html"));
                }
                else {
                    res.redirect("/login.html");
                }
            });
        });

        // Send Profile File for Profile Requests
        server.get("/profile", (req, res) => {
            auth.checkReqCookie(req).then((cookieuser) => {
                if (cookieuser) {
                    res.status(200);
                    res.sendFile(path.join(templatepath, "reactindex.html"));
                }
                else {
                    res.redirect("/login.html");
                }
            });
        });

        // Send MessagePage File for MessagePage Requests
        server.get("/messages/*/", (req, res) => {
            auth.checkReqCookie(req).then((cookieuser) => {
                if (cookieuser) {
                    res.status(200);
                    res.sendFile(path.join(templatepath, "reactindex.html"));
                }
                else {
                    res.redirect("/login.html");
                }
            });
        });
    
        server.use(resname, router);
    }
}