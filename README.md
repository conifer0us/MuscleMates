# README

## Setting up:

run the command 'npm update' to install the necessary depedencies
run the command 'npm run reset-prisma' to set up the database using the Prisma schema

## Testing & Deploying:

run the command 'npm run start' to run the program with a new blank db
run the command 'npm run test' to run the program with the test db

## Changing the Codebase:

The database's tables are handled by the Prisma object-relational mapping system. 
To change the tables, modify the models in prisma/schema.prisma.
Database manipulation is handled by the libraries in the libs folder.
The main function in server.ts creates library instances and starts the server.
Modify this function to change the library instances and to manually insert users into the database.

## Dependencies:

This program is written in TypeScript.
The server hosting is handled by Node.js.
The database modeling is handled by Prisma.
The frontend display uses React.
The server handling is handled by Express.
We also used a number of smaller npm dependencies (process, express, sass, etc.). These are listed in package.json.