CREATE TABLE messages (
    message_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    message VARCHAR(256) NOT NULL,
    sender_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    date TIMESTAMP NOT NULL,
    PRIMARY KEY(message_id),
    CONSTRAINT fk_sender
      FOREIGN KEY(sender_id)
        REFERENCES users(user_id),
    CONSTRAINT fk_recipient
      FOREIGN KEY(recipient_id)
        REFERENCES users(user_id)
);