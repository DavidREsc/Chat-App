CREATE TABLE messages (
    message_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    message VARCHAR(256) NOT NULL,
    sender_username VARCHAR(32) NOT NULL,
    recipient_username VARCHAR(32) NOT NULL,
    date TIMESTAMP NOT NULL,
    PRIMARY KEY(message_id),
    CONSTRAINT fk_sender
      FOREIGN KEY(sender_username)
        REFERENCES users(username),
    CONSTRAINT fk_recipient
      FOREIGN KEY(recipient_username)
        REFERENCES users(username)
);