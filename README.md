# Prophecy Backend

## Getting started

### Environment setup

In order to launch the database and the server, you need to provide the following environment variables in a `.env` file:
- `SERVER_PORT`: The port the server will listen to
- `POSTGRES_DB`: The name of the postgres  database
- `POSTGRES_USER`: The name of the postgres user
- `POSTGRES_PASSWORD`: The database's password
- `DATABASE_IP`: The database's ip address
- `DATABASE_PORT`: The database's port
- `JWT_SECRET`: The secret key for the server's jwt
- `TESTS_PORT` To run the unit tests

### Launching the database

Once you provided the required environment variables, you can launch the database by running:
```bash
docker-compose up --build db
```

### Launching the server

Once you provided the required environment variables and started the database, you can launch the server by running:
```bash
docker-compose up --build server
```

### Filling the armies tables

Once the database and the server are launched, it is possible to fill the database by following [the instructions](./scripts/armies_database/FillTheDatabase.md)


## Documentation

### API

You can find the API documentation on [swagger](https://app.swaggerhub.com/apis/Victoire-Rabeau/Prophecy/1.0.0) or in the repository's [documentation](./doc/api/).

### Database

You can find the database's documentation [here](./doc/databases/).

## Bug report / Feature request
To report a bug or request a new feature, create a new issue [here](https://github.com/Prophecy-eip/Backend/issues/new/choose) and use the correct template.

**Before submitting an issue, please check that someone did not report a similar one.**
