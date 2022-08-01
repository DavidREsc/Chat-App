CREATE TYPE status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE friend_requests (
    request_id BIGSERIAL NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    request_status status NOT NULL DEFAULT 'pending',
    PRIMARY KEY(request_id),
    CONSTRAINT fk_sender
      FOREIGN KEY(sender_id)
        REFERENCES users(user_id),
    CONSTRAINT fk_receiver
      FOREIGN KEY(receiver_id)
        REFERENCES users(user_id)
);