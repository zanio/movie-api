# Movie app

## Reference Documentation
This is a project to demonstrate RESTful API with Node js . The task is to build a  small set of rest API endpoints using
NodeJS that can be used for listing 
the names of Star Wars movies along with their opening crawls and comment counts, 
adding and listing anonymous comments for a movie, and getting the character list for a movie.
you can find the hosted documentation @ [MovieApi](https://documenter.getpostman.com/view/7638519/UVC9hkPJ)

## Setup

#### ENVIRONMENT VARIABLE.
The required environment variables can be gotten from the env.example file. Please note that all properties in
the env.example file must be set. Simply create a new file called .env and copy past the content of `env.example` into the `.env` file. 
If you are not runing the app with docker then use OPTION 1 below to set up your database, then run migration with 
 `npm run migrate up` and start the app using `npm run dev`. If you are using OPTION 2 then you only need to run the docker-compose up 
command followed by `npm run migrate up` within the docker container. 
you can enter the docker container by runing `docker-compose run app bash`

### OPTION 1

### Database setup

TO CREATE A DATABASE, USER AND GRANT ALL PRIVILEGE TO THAT USER ON THE CREATED DATABASE RUN THE FOLLOWING CODE:

If you are just setting up your environment then Run The below code on the project root directory of the application--

 ```sql
export PGPASSWORD='<root-postgres-db-password>'; psql -h localhost -p 5432 -U <root-user> -f initializer.sql -d <root-database>
```
for example you can type this:
```sql
export PGPASSWORD='emma2000'; psql -h localhost -p 5432 -U postgres -f initializer.sql -d postgres
```

Where `<root-postgres-db-password>` is the root password of postgres You should set multiple database, i.e for test and
dev. The test environment would handle integration testing All you have to id to edit the initialize.sql with your own
database name, database password and database  username.

### OPTION 2

Pre-requisites:

- Docker for Desktop

Run `docker-compose up` in the root of the project.

It will bring up Postgres and the Express application server in development mode.

It binds the application server to `localhost:3000`, this can be re-mapped this by changing the first 3000 in `3000:3000` of [./docker-compose.yaml](./docker-compose.yaml)).

Postgres is exposed on port `35432`. The connection string is `postgres://user:pass@localhost:35432/db` (username, password and database name are defined in [./docker-compose.yaml](./docker-compose.yaml)).

You can connect to Postgres using the psql client:

```sh
psql postgres://user:pass@localhost:35432/db
```

The default Docker `CMD` is `npm start`, [./docker-compose.yaml](./docker-compose.yaml) overrides this to `npm run dev` which runs the application using nodemon (auto-restart on file change).


## Express API setup

The Express API is located in [./src/api](./src/api).

Applications routes for resources are defined in [./src/api/index.js](./src/api/index.js).

Global concerns like security, cookie parsing, body parsing and request logging are handled in [./server.js](./server.js).

This application loosely follows the [Presentation Domain Data Layering](https://www.martinfowler.com/bliki/PresentationDomainDataLayering.html):

- Presentation is dealt with in the `./src/api` folder
- Domain is dealt with in the `./src/modules` folder. It's currently non-existent since we've only got generic user and session resources.
- Data is dealt with in the `./src/persistence` folder

## Database setup + management

`npm run migrate up` will run the migrations.

`npm run migrate down` will roll back the migrations.

`npm run migrate:create <migration-name>`  will create a new migration file in [./src/migrations](./src/migrations).

To run the migrations inside of docker-compose. Which will run a bash instance inside the `app` container.
```sh
docker-compose run app bash
```

Followed by:
```sh
npm run migrate up
```

