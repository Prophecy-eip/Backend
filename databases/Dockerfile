
FROM postgres:14.4-alpine

WORKDIR /databases/

COPY Prophecy_Users.sql /docker-entrypoint-initdb.d/

# CMD ["psql", "-U", "${POSTGRES_USER}", "-f", "./databases/Prophecy_Users.sql"]
