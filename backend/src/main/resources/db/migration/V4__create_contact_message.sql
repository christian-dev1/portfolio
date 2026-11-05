-- ---------- MESSAGES DU FORMULAIRE DE CONTACT ----------
CREATE TABLE contact_message (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(80)   NOT NULL CHECK (char_length(name) >= 2),
    email       VARCHAR(254)  NOT NULL,
    message     VARCHAR(2000) NOT NULL CHECK (char_length(message) >= 10),
    status      VARCHAR(20)   NOT NULL DEFAULT 'received'
        CHECK (status IN ('received', 'sent', 'failed')),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Sert à la limite d'envois (par e-mail et par date) et à la purge RGPD (par date).
CREATE INDEX contact_message_created_at_idx ON contact_message (created_at);
CREATE INDEX contact_message_email_idx ON contact_message (email, created_at);
