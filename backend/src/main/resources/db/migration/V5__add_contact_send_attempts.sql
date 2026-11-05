ALTER TABLE contact_message
    ADD COLUMN send_attempts SMALLINT NOT NULL DEFAULT 0 CHECK (send_attempts >= 0);

-- Le domaine d'une adresse e-mail est insensible à la casse.
UPDATE contact_message
SET email = split_part(email, '@', 1) || '@' || lower(split_part(email, '@', 2));
