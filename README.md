# Prophecy Backend

## Run

Provide a `PORT` variable in a `.env` file.

Run:

```bash
docker-compose up
```

## Documentation

### API

You can find the API documentation on [swagger](https://app.swaggerhub.com/apis/Victoire-Rabeau/Prophecy/1.0.0) or in the repository's [documentation](./doc/api/)

### Databases

To build and access the databases documentation, run the following commands:
```bash
npm install
dbdocs login
dbdocs password
dbdocs build ./doc/databases/<filename>
```
