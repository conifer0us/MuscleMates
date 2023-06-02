// Defines a Set of Routes for Uploading A Profile Image to the Server

import { Auth } from '../libs/Auth';
import { ProfileInfo } from '../libs/ProfileInfo';
import { Express, Router } from 'express';
import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';

export class ImageRoutes {
    static configureRouter(server: Express, resname: string, auth: Auth, configjson: JSON) {
        let router = Router();
        const imagedir: string = configjson["imagepath"];

        router.post('/upload', (req, res) => {
            auth.checkReqCookie(req).then((uname: string) => {
                const profimage : UploadedFile = <UploadedFile>req.files["profimage"];

                // If no image submitted, exit
                if (!profimage || !uname) return res.sendStatus(400);

                // If does not have image mime type prevent from uploading
                if (!/^image/.test(profimage.mimetype)) return res.sendStatus(400);

                const imagename = `${uname}.png`; 

                // Move the uploaded image to our upload folder
                profimage.mv(path.join(imagedir, imagename));

                // All good
                res.sendStatus(200);
            });
        });

        router.get("/user/:uname", (req, res) => {
            const imgname = req.params["uname"];
            if (!imgname) {
                res.status(404);
                res.send();
            } else {
                const filepath = path.join(imagedir, `${imgname}.png`);
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

        server.use(resname, router);
    }
}
