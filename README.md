# Prophecy Backend

## Getting started

### Environment setup

In order to launch the database and the server, you need to provide the following environment variables in a `.env` file (see the [sample file](.env.sample)):
- `SERVER_PORT`: The port the server will listen to
- `POSTGRES_DB`: The name of the postgres  database
- `POSTGRES_USER`: The name of the postgres user
- `POSTGRES_PASSWORD`: The database's password
- `DATABASE_IP`: The database's ip address
- `DATABASE_PORT`: The database's port
- `JWT_SECRET`: The secret key for the server's jwt
- `TESTS_PORT`: To run the unit tests
- `MIGRATION_PORT`: The port used for database migrations
- `SES_REGION`: The region configured for the AWS SES
- `SES_ACCESS_KEY`: The access key for the AWS SES
- `SES_SECRET_ACCESS_KEY`: The secret access key for the AWS SES
- `SES_FROM_ADDRESS`: The email address that will be used to send emails 
- `API_URL`: An url pointing to the server host
- `WEBSITE_URL`: An url pointing to the website
- `MATHS_KEY`: The key for the mathematics library authentication

### Launching the database

Once you provided the required environment variables, you can launch the database by running:
```bash
docker-compose up --build database
```

### Running database migrations
To set up or update the database, you might need to run migrations
```bash
docker-compose up --build migration-run
```

You can revert the migration by running:
```bash
docker-compose up migration-revert
```

### Launching the development server

Once you provided the required environment variables and started the database, you can launch the development server by running:
```bash
docker-compose up --build server-dev
```

### Launching the production server:

Run the following command:

```shell
docker-compose up --build server-prod
```

### Filling the armies tables

Once the database and the server are launched, it is possible to fill the database with armies data.

Follow the [instructions](./scripts/armies_data/README.md), and run the following command:
```shell
docker-compose up --build script_armies-data
```

## Documentation

### API

You can find the API documentation on [swagger](https://app.swaggerhub.com/apis/Victoire-Rabeau/Prophecy/1.0.0) or in the repository's [documentation](./doc/api/).

### Database

You can find the database's documentation [here](./doc/databases/).

## Bug report / Feature request
To report a bug or request a new feature, create a new issue [here](https://github.com/Prophecy-eip/Backend/issues/new/choose) and use the correct template.

**Before submitting an issue, please check that someone did not report a similar one.**
