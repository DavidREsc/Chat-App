CREATE TABLE JwtBlacklist (
    token_id BIGSERIAL NOT NULL,
    token VARCHAR NOT NULL,
    PRIMARY KEY(token_id)
);
