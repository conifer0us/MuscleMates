// Defines a Tool for Linking the active database (in the build directory) to the actual database using symlinks

import {platform} from 'os';
import {execSync} from 'child_process';
import fs from 'fs';

export class DBLinker {
    static async linkDB(dbname : string) : Promise<string> {
        switch (platform()) {
            case "win32":
                const filecreated = await this.createFileIfNotExists(dbname);
                try {await fs.rmSync("./build/active.db");} 
                catch (e) {
                    console.log("Unable to Change Database Link; DB File in Use. Will continue using current database.");
                    return;
                };
                await execSync(`mklink /H "./build/active.db" "${dbname}"`);
                if (filecreated) {
                    await execSync(`npm run reset-prisma`);
                    console.log("New DB Created. Prisma reset.");
                }
                break;
            default:
                console.log("Unable to Link Database (Unknown OS)");
                return;
        }
        console.log(`Set active database to ${dbname}`);
    }

    static async createFileIfNotExists(filename) : Promise<boolean> {
        if (!fs.existsSync(filename)) {
            await fs.open(filename, 'w', (err, file) => {fs.close(file)});
            return true;
        }
        return false;
    }
}

