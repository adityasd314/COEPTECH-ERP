## To run server
`cd ./server`
`nodemon ./index.js`

## Updating schemas automatically if any tables are changed
run this command
`drizzle-kit introspect:pg`
copy drizzle/schema.ts => db/schema.js

#### Beware the lines below can delete total DATABASE
## dont execute if you dont know what you are doing

## for making changes in schemas
## make subsequent changes in ./drizzle/schema.ts


for generating a migration sql run
`npm run db:generate`
for applying changes to database run
`npm run db:migrate`

## if table is added into a database for getting schema run
`drizzle-kit introspect:pg`