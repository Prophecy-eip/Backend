# Filling the armies tables

## Requirements

### Privide a database.ini file

You must provide a `database.ini` file, formatted as follows:
```ini
[postgresql]
host=HOST
database=DATABASE
user=USER
password=PASSWORD
```
With:
- `HOST` as the database's host
- `DATABASE` as the database's name
- `USER` as the database's user
- `PASSWORD` as the database's password

### Install python packages

Run the following command:
```sh
pip install -r ./requirements.txt
```

## Fill the tables

Run the script:
```sh
./setup_armies_database.py
```

---
[Back to README](../../README.md)