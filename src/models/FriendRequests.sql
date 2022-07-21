CREATE TYPE status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE friend_requests (
    request_id BIGSERIAL NOT NULL,
    sender_username VARCHAR(32) NOT NULL,
    receiver_username VARCHAR(32) NOT NULL,
    request_status status NOT NULL DEFAULT 'pending',
    PRIMARY KEY(request_id),
    CONSTRAINT fk_sender
      FOREIGN KEY(sender_username)
        REFERENCES users(username),
    CONSTRAINT fk_receiver
      FOREIGN KEY(receiver_username)
        REFERENCES users(username)
);