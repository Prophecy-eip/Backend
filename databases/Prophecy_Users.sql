CREATE DATABASE Prophecy_Users;

CREATE TYPE USER_ACCOUNT_TYPE AS ENUM ('player', 'the 9th Age team', 'organiser');

CREATE TABLE IF NOT EXISTS profile (
    username                VARCHAR             NOT NULL UNIQUE,
    email                   VARCHAR             NOT NULL UNIQUE,
    password                CHAR(64)            NOT NULL,
    is_verified             BOOLEAN             NOT NULL DEFAULT false,
    profile_picture_path    VARCHAR,
    account_type            USER_ACCOUNT_TYPE   NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS followed (
    follower        VARCHAR     NOT NULL,
    followed        VARCHAR     NOT NULL,
    FOREIGN KEY (follower) REFERENCES profile(username),
    FOREIGN KEY (followed) REFERENCES profile(username)
);

CREATE TABLE IF NOT EXISTS blocked (
    blocker         VARCHAR     NOT NULL,
    blocked         VARCHAR     NOT NULL,
    FOREIGN KEY (blocker) REFERENCES profile(username),
    FOREIGN KEY (blocked) REFERENCES profile(username)
);

CREATE TABLE IF NOT EXISTS posts (
    id              VARCHAR     NOT NULL UNIQUE,
    owner           VARCHAR     NOT NULL,
    content         VARCHAR     NOT NULL,
    FOREIGN KEY (owner) REFERENCES profile(username),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS armies_lists (
    id      VARCHAR     NOT NULL UNIQUE,
    owner   VARCHAR     NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (owner) REFERENCES profile(username)
);

CREATE TABLE IF NOT EXISTS games (
    id              VARCHAR     NOT NULL UNIQUE,
    owner           VARCHAR     NOT NULL,
    opponent        VARCHAR     NOT NULL,
    "date"          DATE,
    owner_list      VARCHAR,
    opponent_list   VARCHAR,
    player_score    INT         NOT NULL,
    opponent_score  INT         NOT NULL,
    official        BOOLEAN     DEFAULT false,
    PRIMARY KEY (id),
    FOREIGN KEY (owner) REFERENCES profile(username),
    FOREIGN KEY (opponent) REFERENCES profile(username),
    FOREIGN KEY (owner_list) REFERENCES armies_lists(id),
    FOREIGN KEY (opponent_list) REFERENCES armies_lists(id)
);

CREATE TABLE IF NOT EXISTS prophecies (
    id              VARCHAR     NOT NULL UNIQUE,
    owner           VARCHAR     NOT NULL,
    owner_list      VARCHAR,
    opponent_list   VARCHAR,
    player_score    INT,
    opponent_score  INT,
    PRIMARY KEY (id),
    FOREIGN KEY (owner) REFERENCES profile(username),
    FOREIGN KEY (owner_list) REFERENCES armies_lists(id),
    FOREIGN KEY (opponent_list) REFERENCES armies_lists(id)
);

CREATE TABLE IF NOT EXISTS statistics (
    id      VARCHAR     NOT NULL UNIQUE,
    owner   VARCHAR     NOT NULL,
    data    VARCHAR     NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (owner) REFERENCES profile(username)
);

CREATE TABLE IF NOT EXISTS shared_armies_lists (
    owner   VARCHAR     NOT NULL,
    id      VARCHAR     NOT NULL UNIQUE,
    FOREIGN KEY (owner) REFERENCES profile(username),
    FOREIGN KEY (id) REFERENCES armies_lists(id)

);

CREATE TABLE IF NOT EXISTS shared_games (
    owner   VARCHAR     NOT NULL,
    id      VARCHAR     NOT NULL UNIQUE,
    FOREIGN KEY (owner) REFERENCES profile(username),
    FOREIGN KEY (id) REFERENCES games(id)
);
CREATE TABLE IF NOT EXISTS shared_statistics
(
    owner VARCHAR NOT NULL,
    id    VARCHAR NOT NULL UNIQUE,
    FOREIGN KEY (owner) REFERENCES profile(username),
    FOREIGN KEY (id) REFERENCES statistics(id)
);