CREATE TABLE users (
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(user_id)
);
