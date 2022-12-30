# Armies Data Setup

## Getting started

### Required setup
- `node v18.12` or later
- `yarn v1.22` or later

### Installing packages
Run the following command:
```shell
yarn
```

### Environment
You must provide a `.env` file in the [current directory](.), following the [sample file](.env.sample), with the variables:
- `POSTGRES_DB` the name of the database
- `POSTGRES_USER` the database user
- `POSTGRES_PASSWORD` the database password
- `DATABASE_IP` the database ip address

*tip: you should use the same values as the [server's .env](../../.env) file.*

## Running the script
Once your setup is ready, you should run the following command:
```shell
yarn stard
```

---
[Back to README](../../README.md#filling-the-armies-tables)
