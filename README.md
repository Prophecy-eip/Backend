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
- `JWT_SECRET`: The secret kew for the server's jwt

*optional*: 
- `TESTS_PORT` if you want to run the unit tests

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

## Documentation

### API

You can find the API documentation on [swagger](https://app.swaggerhub.com/apis/Victoire-Rabeau/Prophecy/1.0.0) or in the repository's [documentation](./doc/api/).

### Database

You can find the database's documentation [here](./doc/databases/).
