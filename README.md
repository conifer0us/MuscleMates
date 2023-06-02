# README

## Setting up:

First install nodejs and npm.
Then, clone this repository to get all of the server code on whichever device will be used to host the server.
Run the command 'npm update' to install the necessary dependencies.
Run the command 'npm run reset-prisma' to set up the database using the Prisma Schema.

## Testing & Deploying:

Run the command 'npm run start' to run the program with a new database (or without modifying an existing database).
Run the command 'npm run test' to run the program with a suite of test users inserted into the database.

## Changing the Codebase:

The database's tables are handled by the Prisma object-relational mapping system. 
To change the tables, modify the models in prisma/schema.prisma.
Database manipulation is handled by the libraries in the libs folder.
The main function in server.ts creates library instances and starts the server.
Modify this function to change the library instances and to manually insert users into the database.
To view or change the data in the database manually, simply run "npx prisma studio".

## Dependencies:

This program is written in TypeScript.
The server hosting is handled by Node.js.
The database modeling is handled by Prisma.
The frontend display uses React.
The server handling is handled by Express.
We also used a number of smaller npm dependencies (process, express, sass, etc.). These are listed in package.json.